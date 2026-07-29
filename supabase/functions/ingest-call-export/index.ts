// Ingest a GHL / HighConversionHub call-export CSV into the reporting schema.
// Idempotent: re-ingesting the same export upserts the same rows. Runs TODAY
// without live API access — the fastest path to a working pipeline. Every run is
// logged to sync_runs (silent failure is the exact defect this project fixes).
//
// Auth: admin JWT OR x-sync-secret == SYNC_SECRET (for n8n/automation callers).
// Limitations of CSV-only ingest (resolved by the live ghl-sync path):
//   - the export has no call id  -> a deterministic id is synthesized
//   - the export has no setter    -> setter_id is left NULL (attribution needs Users)
//   - the export has no lead-delivery data -> account "completion" needs fact_lead
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-sync-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

// ---- CSV parsing (mirrors src/lib/metrics/parseGhlCallExport.ts) ----
function parseCsv(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = []; let f = ""; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(f); f = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(f); f = ""; rows.push(row); row = []; }
    else f += c;
  }
  if (f !== "" || row.length) { row.push(f); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}
const dash = (v: string) => { const s = (v ?? "").trim(); return s === "" || s === "-" ? null : s; };
function parseDuration(raw: string | null): number | null {
  if (raw == null) return null; const s = String(raw).trim();
  if (s === "" || s === "-") return null;
  const m = s.match(/^(\d+):([0-5]?\d)$/); if (m) return +m[1] * 60 + +m[2];
  if (/^\d+$/.test(s)) return +s; return null;
}
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);
async function synthId(parts: (string | null)[]) {
  const data = new TextEncoder().encode(parts.map((p) => p ?? "").join("|"));
  const buf = await crypto.subtle.digest("SHA-1", data);
  return "csv_" + [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

async function authorize(req: Request): Promise<boolean> {
  const secret = Deno.env.get("SYNC_SECRET");
  if (secret && req.headers.get("x-sync-secret") === secret) return true;
  const authz = req.headers.get("authorization");
  if (!authz) return false;
  const { data } = await admin.auth.getUser(authz.replace("Bearer ", ""));
  if (!data?.user) return false;
  const { data: role } = await admin.from("user_roles")
    .select("role").eq("user_id", data.user.id).eq("role", "admin").maybeSingle();
  return !!role;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (!(await authorize(req))) return json({ error: "Unauthorized" }, 401);

  const run = await admin.from("sync_runs")
    .insert({ object_type: "calls", status: "running" }).select().single();
  const runId = run.data?.id;
  try {
    const body = await req.json();
    const csv: string = body.csv ?? "";
    const defaultTz: string = body.timezone ?? "America/New_York";
    const currency: string = body.currency ?? "USD";
    if (!csv) return json({ error: "Provide { csv } (raw export text)" }, 400);

    const rows = parseCsv(csv);
    if (rows.length < 2) return json({ error: "Empty CSV" }, 400);
    const h = rows[0].map((x) => x.trim());
    const ci = (n: string) => h.indexOf(n);
    const col = {
      dt: ci("Date & time"), phone: ci("Contact phone"), acct: ci("Number name"),
      dir: ci("Direction"), status: ci("Call status"), disp: ci("Disposition"),
      first: ci("First time"), dur: ci("Duration"), from: ci("From"), to: ci("To"),
    };
    const g = (r: string[], i: number) => (i >= 0 && i < r.length ? r[i] : "");

    // Upsert accounts referenced in the export (keyed by synthetic csv location id).
    const accountNames = [...new Set(rows.slice(1).map((r) => (g(r, col.acct) || "Unknown").trim()))];
    const accountId = new Map<string, string>();
    for (const name of accountNames) {
      const locId = "csv:" + slug(name);
      const up = await admin.from("dim_account").upsert(
        { ghl_location_id: locId, client_name: name, timezone: defaultTz, currency },
        { onConflict: "ghl_location_id" },
      ).select("account_id").single();
      if (up.data) accountId.set(name, up.data.account_id);
    }

    // Build fact_call rows.
    const facts = [];
    for (const r of rows.slice(1)) {
      const name = (g(r, col.acct) || "Unknown").trim();
      const dt = g(r, col.dt).trim();
      const from = dash(g(r, col.from)); const to = dash(g(r, col.to));
      const dur = parseDuration(g(r, col.dur));
      const call_id = await synthId([name, dt, from, to, String(dur), g(r, col.phone)]);
      facts.push({
        call_id,
        account_id: accountId.get(name) ?? null,
        setter_id: null,
        contact_id: dash(g(r, col.phone)),
        direction: g(r, col.dir).trim().toLowerCase() === "inbound" ? "inbound" : "outbound",
        initiated_at: new Date(dt).toISOString(),
        duration_seconds: dur,
        status: dash(g(r, col.status)),
        disposition: dash(g(r, col.disp)),
        is_first_time: g(r, col.first).trim().toLowerCase() === "yes",
        from_number: from, to_number: to,
      });
    }
    // Idempotent upsert in chunks.
    let written = 0;
    for (let i = 0; i < facts.length; i += 500) {
      const chunk = facts.slice(i, i + 500);
      const { error } = await admin.from("fact_call").upsert(chunk, { onConflict: "call_id" });
      if (error) throw error;
      written += chunk.length;
    }

    // Compute + persist account-completion + defect alerts, then notify criticals.
    const alertsCreated = await computeAndStoreAlerts(admin, [...accountId.values()]);
    await pushNotifications(admin);

    await admin.from("sync_runs").update({
      status: "success", records_in: facts.length, records_written: written,
      finished_at: new Date().toISOString(),
    }).eq("id", runId);

    return json({ ok: true, accounts: accountNames.length, records_in: facts.length, records_written: written, alerts_created: alertsCreated });
  } catch (e) {
    await admin.from("sync_runs").update({
      status: "error", error: String((e as Error).message ?? e), finished_at: new Date().toISOString(),
    }).eq("id", runId);
    return json({ error: String((e as Error).message ?? e) }, 500);
  }
});

// Read v_account_health for the given accounts and upsert alerts for anything
// not cleanly complete (only where delivered-lead data exists), plus blank-disp.
async function computeAndStoreAlerts(db: any, accountIds: string[]): Promise<number> {
  if (accountIds.length === 0) return 0;
  const { data: health } = await db.from("v_account_health")
    .select("account_id, client_name, local_day, delivered_leads, contacts_dialed, appointments_set, dials, status, complete, completion_rate")
    .in("account_id", accountIds);
  const alerts = (health ?? [])
    .filter((h: any) => h.delivered_leads > 0 && (h.status === "leads_not_worked" || h.status === "no_leads_delivered"))
    .map((h: any) => ({
      account_id: h.account_id, day: h.local_day, type: "account_completion",
      status: h.status, severity: h.status === "leads_not_worked" && h.contacts_dialed === 0 ? "critical" : "warning",
      owner: h.status === "no_leads_delivered" ? "media" : (h.contacts_dialed === 0 ? "manager" : "setter"),
      message: `${h.client_name} not completed on ${h.local_day}: ${h.contacts_dialed}/${h.delivered_leads} leads worked.`,
      value: h.completion_rate,
    }));
  if (alerts.length) {
    await db.from("account_alerts").upsert(alerts, { onConflict: "account_id,day,type" });
  }
  return alerts.length;
}

// Fire unresolved, un-notified critical/warning alerts to Slack/n8n if configured.
async function pushNotifications(db: any) {
  const hook = Deno.env.get("SLACK_WEBHOOK_URL") ?? Deno.env.get("N8N_ALERT_URL");
  if (!hook) return;
  const { data: open } = await db.from("account_alerts")
    .select("id, message, severity").eq("resolved", false).is("notified_at", null)
    .in("severity", ["warning", "critical"]).limit(25);
  for (const a of open ?? []) {
    try {
      await fetch(hook, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: `:rotating_light: [${a.severity}] ${a.message}` }),
      });
      await db.from("account_alerts").update({ notified_at: new Date().toISOString() }).eq("id", a.id);
    } catch (_) { /* leave un-notified for the next run */ }
  }
}
