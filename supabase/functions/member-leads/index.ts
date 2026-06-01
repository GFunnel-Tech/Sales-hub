// Member-scoped leads API. Allows listing, updating, and audit-logging changes.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-member-id",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const EDITABLE_FIELDS = [
  "agent",
  "date_contacted",
  "outcome",
  "notes",
  "lead_name",
  "last_point_of_contact",
  "interested",
  "appointment_booked",
  "time_zone",
  "ghl_link",
];

async function resolveMember(memberId: string | null) {
  if (!memberId) return null;
  const { data } = await supabase
    .from("profiles")
    .select("id, member_id, full_name, org_id, is_active")
    .eq("member_id", memberId.toUpperCase().trim())
    .eq("is_active", true)
    .maybeSingle();
  return data;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const member = await resolveMember(req.headers.get("x-member-id"));
    if (!member) return json({ error: "Invalid or inactive member" }, 401);

    const url = new URL(req.url);
    const action = url.searchParams.get("action") ?? "list";

    if (req.method === "GET" && action === "list") {
      const query = supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (member.org_id) query.eq("org_id", member.org_id);
      const { data, error } = await query;
      if (error) throw error;
      return json({ leads: data ?? [] });
    }

    if (req.method === "GET" && action === "history") {
      const leadId = url.searchParams.get("lead_id");
      if (!leadId) return json({ error: "lead_id required" }, 400);
      const { data, error } = await supabase
        .from("lead_edits")
        .select("*")
        .eq("lead_id", leadId)
        .order("edited_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return json({ edits: data ?? [] });
    }

    if (req.method === "PATCH" && action === "update") {
      const id = url.searchParams.get("id");
      if (!id) return json({ error: "id required" }, 400);
      const body = await req.json();

      const { data: existing, error: fetchErr } = await supabase
        .from("leads").select("*").eq("id", id).maybeSingle();
      if (fetchErr) throw fetchErr;
      if (!existing) return json({ error: "Lead not found" }, 404);

      const update: Record<string, unknown> = {};
      const edits: Array<Record<string, unknown>> = [];

      for (const field of EDITABLE_FIELDS) {
        if (!(field in body)) continue;
        const newVal = body[field];
        const oldVal = existing[field];
        if (String(newVal ?? "") === String(oldVal ?? "")) continue;
        update[field] = newVal;
        edits.push({
          lead_id: id,
          field,
          old_value: oldVal === null || oldVal === undefined ? null : String(oldVal),
          new_value: newVal === null || newVal === undefined ? null : String(newVal),
          edited_by_profile_id: member.id,
          edited_by_label: member.full_name || member.member_id,
        });
      }

      if (Object.keys(update).length === 0) {
        return json({ lead: existing, edits: [] });
      }

      const { data: updated, error: updErr } = await supabase
        .from("leads").update(update).eq("id", id).select().single();
      if (updErr) throw updErr;

      if (edits.length) {
        const { error: logErr } = await supabase.from("lead_edits").insert(edits);
        if (logErr) console.error("audit log failed", logErr);
      }

      return json({ lead: updated, edits });
    }

    if (req.method === "POST" && action === "create") {
      const body = await req.json();
      const insert: Record<string, unknown> = { org_id: member.org_id };
      for (const f of EDITABLE_FIELDS) if (f in body) insert[f] = body[f];
      const { data, error } = await supabase.from("leads").insert(insert).select().single();
      if (error) throw error;
      return json({ lead: data });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    console.error(e);
    return json({ error: (e as Error).message }, 500);
  }
});
