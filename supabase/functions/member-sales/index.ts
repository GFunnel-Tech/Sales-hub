// Secure member-scoped sales API. Validates member_id server-side using service role.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-member-id",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function resolveMember(memberId: string | null) {
  if (!memberId) return null;
  const { data } = await supabase
    .from("profiles")
    .select("id, member_id, full_name, audience, is_active")
    .eq("member_id", memberId.toUpperCase().trim())
    .eq("is_active", true)
    .maybeSingle();
  return data;
}

async function getCommissionRate(role: string | null) {
  const lookup = role || "salesperson";
  const { data } = await supabase
    .from("commission_rules")
    .select("rate_percent, flat_bonus")
    .eq("role", lookup)
    .eq("is_active", true)
    .maybeSingle();
  return data ?? { rate_percent: 10, flat_bonus: 0 };
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
      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .eq("profile_id", member.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return json({ sales: data ?? [] });
    }

    if (req.method === "GET" && action === "stats") {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);

      const [todayRes, weekSoldRes, totalWeekRes, followupRes] = await Promise.all([
        supabase.from("sales").select("*", { count: "exact", head: true })
          .eq("profile_id", member.id).gte("created_at", today.toISOString()),
        supabase.from("sales").select("*", { count: "exact", head: true })
          .eq("profile_id", member.id).eq("disposition", "sold").gte("created_at", weekAgo.toISOString()),
        supabase.from("sales").select("*", { count: "exact", head: true })
          .eq("profile_id", member.id).gte("created_at", weekAgo.toISOString()),
        supabase.from("sales")
          .select("id, customer_first_name, customer_last_name, follow_up_date, follow_up_notes, product_service", { count: "exact" })
          .eq("profile_id", member.id)
          .not("follow_up_date", "is", null)
          .gte("follow_up_date", new Date().toISOString())
          .order("follow_up_date", { ascending: true })
          .limit(5),
      ]);

      const totalCalls = totalWeekRes.count ?? 0;
      const weekSales = weekSoldRes.count ?? 0;
      return json({
        stats: {
          todayCalls: todayRes.count ?? 0,
          weekSales,
          pendingFollowups: followupRes.count ?? 0,
          conversionRate: totalCalls && weekSales ? Math.round((weekSales / totalCalls) * 100) : 0,
        },
        followups: followupRes.data ?? [],
      });
    }

    if (req.method === "POST" && action === "create") {
      const body = await req.json();
      if (!body.customer_first_name || !body.product_service || !body.disposition) {
        return json({ error: "Missing required fields" }, 400);
      }
      const insertPayload = {
        ...body,
        profile_id: member.id,
        user_id: member.id, // legacy
      };
      const { data, error } = await supabase.from("sales").insert(insertPayload).select().maybeSingle();
      if (error) throw error;
      return json({ sale: data });
    }

    if (req.method === "GET" && action === "search-leads") {
      const q = (url.searchParams.get("q") ?? "").trim();
      const limit = Number(url.searchParams.get("limit") ?? "10");
      let query = supabase.from("sales")
        .select("id, customer_first_name, customer_last_name, customer_email, customer_phone, created_at, disposition")
        .eq("profile_id", member.id)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (q) {
        const safe = q.replace(/[%,]/g, "");
        query = query.or(
          `customer_first_name.ilike.%${safe}%,customer_last_name.ilike.%${safe}%,customer_email.ilike.%${safe}%,customer_phone.ilike.%${safe}%`,
        );
      }
      const { data, error } = await query;
      if (error) throw error;
      return json({ leads: data ?? [] });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (err) {
    console.error("member-sales error", err);
    return json({ error: (err as Error).message }, 500);
  }
});
