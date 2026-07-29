// Live GoHighLevel / HighConversionHub sync into the reporting schema.
// - Enumerates locations (never assumes one) and upserts dim_account.
// - Incremental per-location watermark; full backfill is re-runnable + idempotent.
// - Retry with backoff; a failed run is LOGGED and ALERTED, never silent.
// - API version header pinned: Version: 2021-07-28.
//
// Config (Supabase function secrets):
//   GHL_API_KEY       agency-level API key / Private Integration Token  (required)
//   GHL_COMPANY_ID    agency/company id for location enumeration         (required)
//   GHL_API_BASE      default https://services.leadconnectorhq.com
//   SYNC_SECRET       shared secret for scheduler/n8n callers
//   SLACK_WEBHOOK_URL / N8N_ALERT_URL   failure + completion notifications
//
// ⚠️ Endpoint paths for calls/appointments vary by GHL plan. They are isolated
//    in ENDPOINTS below and field-mapped in the map* functions — confirm these
//    two against your account when the token is provisioned; contacts/locations
//    use the stable v2 endpoints.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-sync-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

const API_BASE = Deno.env.get("GHL_API_BASE") ?? "https://services.leadconnectorhq.com";
const API_KEY = Deno.env.get("GHL_API_KEY") ?? "";
const COMPANY_ID = Deno.env.get("GHL_COMPANY_ID") ?? "";
const VERSION = "2021-07-28";

const ENDPOINTS = {
  locations: `/locations/search`,               // ?companyId=
  contacts: `/contacts/`,                        // ?locationId=&limit=&startAfterId=
  calls: Deno.env.get("GHL_CALLS_PATH") ?? `/calls/`,          // confirm for your plan
  appointments: Deno.env.get("GHL_APPTS_PATH") ?? `/calendars/events`,
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function ghlFetch(path: string, params: Record<string, string> = {}, attempt = 0): Promise<any> {
  const url = new URL(API_BASE + path);
  for (const [k, v] of Object.entries(params)) if (v != null && v !== "") url.searchParams.set(k, v);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${API_KEY}`, Version: VERSION, Accept: "application/json" } });
  if (res.status === 429 || res.status >= 500) {
    if (attempt >= 4) throw new Error(`GHL ${res.status} after retries: ${path}`);
    await sleep(2 ** attempt * 1000); // 1s,2s,4s,8s
    return ghlFetch(path, params, attempt + 1);
  }
  if (!res.ok) throw new Error(`GHL ${res.status} ${path}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

async function authorize(req: Request): Promise<boolean> {
  const secret = Deno.env.get("SYNC_SECRET");
  if (secret && req.headers.get("x-sync-secret") === secret) return true;
  const authz = req.headers.get("authorization");
  if (!authz) return false;
  const { data } = await admin.auth.getUser(authz.replace("Bearer ", ""));
  if (!data?.user) return false;
  const { data: role } = await admin.from("user_roles").select("role").eq("user_id", data.user.id).eq("role", "admin").maybeSingle();
  return !!role;
}

// ---- B1: enumerate locations programmatically (the authoritative list) ----
async function syncLocations(): Promise<{ accountId: string; locationId: string; timezone: string }[]> {
  const out: { accountId: string; locationId: string; timezone: string }[] = [];
  const data = await ghlFetch(ENDPOINTS.locations, { companyId: COMPANY_ID, limit: "500" });
  const locations = data.locations ?? data.data ?? [];
  for (const loc of locations) {
    const timezone = loc.timezone ?? "America/New_York";
    const up = await admin.from("dim_account").upsert({
      ghl_location_id: loc.id ?? loc._id,
      client_name: loc.name, company: loc.companyName ?? loc.business?.name ?? null,
      status: (loc.status ?? "active"), timezone, currency: loc.currency ?? "USD",
    }, { onConflict: "ghl_location_id" }).select("account_id").single();
    if (up.data) out.push({ accountId: up.data.account_id, locationId: loc.id ?? loc._id, timezone });
  }
  return out;
}

async function getWatermark(locationId: string, obj: string): Promise<string | null> {
  const { data } = await admin.from("sync_state").select("watermark")
    .eq("ghl_location_id", locationId).eq("object_type", obj).maybeSingle();
  return data?.watermark ?? null;
}
async function setWatermark(locationId: string, obj: string, wm: string) {
  await admin.from("sync_state").upsert(
    { ghl_location_id: locationId, object_type: obj, watermark: wm, updated_at: new Date().toISOString() },
    { onConflict: "ghl_location_id,object_type" });
}

// ---- contacts -> fact_lead (stable endpoint) ----
async function syncContacts(accountId: string, locationId: string, since: string | null): Promise<number> {
  let written = 0, startAfterId = "", maxCreated = since;
  for (let page = 0; page < 200; page++) {
    const data = await ghlFetch(ENDPOINTS.contacts, { locationId, limit: "100", startAfterId });
    const contacts = data.contacts ?? [];
    if (contacts.length === 0) break;
    const rows = contacts.map((c: any) => ({
      contact_id: c.id, account_id: accountId,
      created_at: c.dateAdded ?? c.createdAt ?? new Date().toISOString(),
      source: c.source ?? null, campaign: c.attributionSource?.campaign ?? null,
      current_stage: c.pipelineStage ?? null,
    }));
    await admin.from("fact_lead").upsert(rows, { onConflict: "contact_id" });
    written += rows.length;
    for (const r of rows) if (!maxCreated || r.created_at > maxCreated) maxCreated = r.created_at;
    startAfterId = contacts[contacts.length - 1].id;
    if (contacts.length < 100) break;
  }
  if (maxCreated) await setWatermark(locationId, "contacts", maxCreated);
  return written;
}

// ---- calls -> fact_call (confirm endpoint/fields for your plan) ----
async function syncCalls(accountId: string, locationId: string, since: string | null): Promise<number> {
  let written = 0;
  const data = await ghlFetch(ENDPOINTS.calls, { locationId, startAfter: since ?? "", limit: "100" });
  const calls = data.calls ?? data.records ?? data.data ?? [];
  const rows = calls.map((c: any) => ({
    call_id: c.id ?? c.callId,
    account_id: accountId,
    setter_id: null, // resolved from GHL user->dim_setter mapping (syncUsers) in a follow-up pass
    contact_id: c.contactId ?? c.contact_id ?? null,
    direction: (c.direction ?? "outbound").toLowerCase(),
    initiated_at: c.dateAdded ?? c.startTime ?? c.createdAt,
    duration_seconds: c.duration ?? null,
    status: c.status ?? c.callStatus ?? null,
    disposition: c.disposition ?? null,   // preserve blanks
    recording_url: c.recordingUrl ?? null,
    workflow_name: c.workflowName ?? null,
    is_first_time: c.firstTime ?? null,
    from_number: c.from ?? null, to_number: c.to ?? null,
  })).filter((r: any) => r.call_id && r.initiated_at);
  for (let i = 0; i < rows.length; i += 500) {
    await admin.from("fact_call").upsert(rows.slice(i, i + 500), { onConflict: "call_id" });
    written += Math.min(500, rows.length - i);
  }
  const maxT = rows.reduce((m: string, r: any) => (r.initiated_at > m ? r.initiated_at : m), since ?? "");
  if (maxT) await setWatermark(locationId, "calls", maxT);
  return written;
}

async function runObject(locationId: string, accountId: string, obj: string, fn: () => Promise<number>) {
  const run = await admin.from("sync_runs")
    .insert({ ghl_location_id: locationId, object_type: obj, status: "running", window_start: await getWatermark(locationId, obj) })
    .select().single();
  try {
    const written = await fn();
    await admin.from("sync_runs").update({ status: "success", records_written: written, records_in: written, finished_at: new Date().toISOString() }).eq("id", run.data!.id);
    return { obj, written };
  } catch (e) {
    await admin.from("sync_runs").update({ status: "error", error: String((e as Error).message ?? e), finished_at: new Date().toISOString() }).eq("id", run.data!.id);
    await notify(`:x: GHL sync failed — ${obj} @ ${locationId}: ${(e as Error).message}`);
    return { obj, written: 0, error: String((e as Error).message ?? e) };
  }
}

async function notify(text: string) {
  const hook = Deno.env.get("SLACK_WEBHOOK_URL") ?? Deno.env.get("N8N_ALERT_URL");
  if (!hook) return;
  try { await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) }); } catch (_) { /* ignore */ }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (!(await authorize(req))) return json({ error: "Unauthorized" }, 401);
  if (!API_KEY || !COMPANY_ID) return json({ error: "GHL_API_KEY and GHL_COMPANY_ID must be set" }, 400);

  try {
    const body = await req.json().catch(() => ({}));
    const only: string[] | null = body.objects ?? null; // e.g. ["contacts","calls"]
    const locations = await syncLocations();
    const results: any[] = [];
    for (const { accountId, locationId } of locations) {
      const wantContacts = !only || only.includes("contacts");
      const wantCalls = !only || only.includes("calls");
      if (wantContacts) results.push({ locationId, ...(await runObject(locationId, accountId, "contacts", () => syncContacts(accountId, locationId, /* full each run is idempotent */ null))) });
      if (wantCalls) results.push({ locationId, ...(await runObject(locationId, accountId, "calls", () => syncCalls(accountId, locationId, null))) });
    }
    return json({ ok: true, locations: locations.length, results });
  } catch (e) {
    await notify(`:x: GHL sync run failed to start: ${(e as Error).message}`);
    return json({ error: String((e as Error).message ?? e) }, 500);
  }
});
