// Secure member-scoped blueprint sessions API. Validates member_id server-side.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-member-id",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function resolveMember(memberId: string | null) {
  if (!memberId) return null;
  const { data } = await supabase
    .from("profiles")
    .select("id, member_id, is_active")
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
    const action = url.searchParams.get("action") ?? "";
    const sessionId = url.searchParams.get("session_id");

    // Helper: ensure session belongs to this member
    async function ownsSession(sid: string) {
      const { data } = await supabase
        .from("blueprint_sessions")
        .select("id, agent_profile_id")
        .eq("session_id", sid)
        .maybeSingle();
      return data && data.agent_profile_id === member.id ? data : null;
    }

    if (req.method === "POST" && action === "create") {
      const body = await req.json();
      const { error } = await supabase.from("blueprint_sessions").insert({
        session_id: body.session_id,
        agent_profile_id: member.id,
        prospect_name: body.prospect_name,
        prospect_email: body.prospect_email ?? null,
        prospect_company: body.prospect_company ?? null,
        prospect_industry: body.prospect_industry ?? null,
        current_page: body.current_page ?? 2,
        status: "in_progress",
      });
      if (error) throw error;
      return json({ ok: true });
    }

    if (req.method === "PATCH" && action === "update" && sessionId) {
      const owned = await ownsSession(sessionId);
      if (!owned) return json({ error: "Not found" }, 404);
      const body = await req.json();
      // Whitelist fields
      const allowed = [
        "prospect_name","prospect_email","prospect_company","prospect_industry",
        "dream_state_responses","pain_point_responses","bridge_understanding",
        "qualification_answers","qualification_score","is_qualified",
        "canvas_image_url","canvas_json","canvas_notes",
        "generated_scope","scope_url","prototype_url",
        "selected_plan","custom_request","recording_url","agent_notes",
        "disposition","follow_up_date","current_page","status",
      ];
      const update: Record<string, unknown> = {};
      for (const k of allowed) if (k in body) update[k] = body[k];
      const { error } = await supabase.from("blueprint_sessions").update(update).eq("session_id", sessionId);
      if (error) throw error;
      return json({ ok: true });
    }

    if (req.method === "PATCH" && action === "complete" && sessionId) {
      const owned = await ownsSession(sessionId);
      if (!owned) return json({ error: "Not found" }, 404);
      const body = await req.json();
      const { error } = await supabase.from("blueprint_sessions").update({
        status: "completed",
        completed_at: new Date().toISOString(),
        disposition: body.disposition ?? null,
        agent_notes: body.agent_notes ?? null,
        recording_url: body.recording_url ?? null,
        follow_up_date: body.follow_up_date || null,
      }).eq("session_id", sessionId);
      if (error) throw error;
      return json({ ok: true });
    }

    if (req.method === "GET" && action === "search-leads") {
      const q = (url.searchParams.get("q") ?? "").trim();
      const limit = Number(url.searchParams.get("limit") ?? "10");
      let query = supabase.from("blueprint_sessions")
        .select("id, prospect_name, prospect_company, prospect_email, created_at, status")
        .eq("agent_profile_id", member.id)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (q) {
        const safe = q.replace(/[%,]/g, "");
        query = query.or(
          `prospect_name.ilike.%${safe}%,prospect_email.ilike.%${safe}%,prospect_company.ilike.%${safe}%`,
        );
      }
      const { data, error } = await query;
      if (error) throw error;
      return json({ leads: data ?? [] });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (err) {
    console.error("member-blueprint error", err);
    return json({ error: (err as Error).message }, 500);
  }
});
