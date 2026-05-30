// GFunnel SSO: trusted by parent-window origin check on the client.
// Provisions org + auth user + profile + role from the posted payload
// and returns a one-time magic-link token-hash the client uses to sign in.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Payload = {
  workspace_id: string;
  workspace_slug?: string;
  workspace_name?: string;
  user_id?: string;
  user_profile_id: string;
  user_email: string;
  user_display_name?: string;
  user_avatar_url?: string | null;
  user_role?: string;
};

const ROLE_MAP: Record<string, "admin" | "manager" | "salesperson"> = {
  admin: "admin",
  owner: "admin",
  superadmin: "admin",
  manager: "manager",
  lead: "manager",
  member: "salesperson",
  user: "salesperson",
  salesperson: "salesperson",
  rep: "salesperson",
};

function mapRole(r?: string): "admin" | "manager" | "salesperson" {
  if (!r) return "salesperson";
  return ROLE_MAP[r.toLowerCase()] ?? "salesperson";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = (await req.json()) as Payload;
    if (!body?.user_profile_id || !body?.user_email || !body?.workspace_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    // 1) Upsert organization keyed by workspace_id
    const { error: orgErr } = await supabase
      .from("organizations")
      .upsert(
        {
          id: body.workspace_id,
          name: body.workspace_name || body.workspace_slug || "GFunnel Workspace",
          slug: body.workspace_slug ?? null,
          auth_mode: "sso",
        },
        { onConflict: "id" },
      );
    if (orgErr) console.error("org upsert", orgErr);

    // 2) Find or create the auth user (by email)
    let authUserId: string | null = null;

    // Look up profile by gfunnel_user_profile_id first
    const { data: existingByGf } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("gfunnel_user_profile_id", body.user_profile_id)
      .maybeSingle();
    if (existingByGf?.user_id) authUserId = existingByGf.user_id;

    if (!authUserId) {
      // Try listUsers email filter
      const { data: list } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1,
      });
      // listUsers doesn't filter; fall back to email search via admin API:
      const { data: byEmail } = await supabase.auth.admin
        // @ts-ignore — getUserByEmail is supported on admin
        .getUserByEmail?.(body.user_email)
        ?.catch(() => ({ data: null }));
      if (byEmail?.user?.id) authUserId = byEmail.user.id;
      void list;
    }

    if (!authUserId) {
      const { data: created, error: createErr } =
        await supabase.auth.admin.createUser({
          email: body.user_email,
          email_confirm: true,
          user_metadata: {
            full_name: body.user_display_name,
            avatar_url: body.user_avatar_url,
            gfunnel_user_profile_id: body.user_profile_id,
          },
        });
      if (createErr || !created?.user) {
        console.error("createUser", createErr);
        return new Response(
          JSON.stringify({ error: "Could not provision user", detail: createErr?.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      authUserId = created.user.id;
    }

    // 3) Upsert profile (handle_new_user trigger may have created a stub)
    const { error: profileErr } = await supabase
      .from("profiles")
      .upsert(
        {
          user_id: authUserId,
          email: body.user_email,
          full_name: body.user_display_name ?? null,
          avatar_url: body.user_avatar_url ?? null,
          org_id: body.workspace_id,
          gfunnel_user_profile_id: body.user_profile_id,
          is_active: true,
          must_change_password: false,
        },
        { onConflict: "user_id" },
      );
    if (profileErr) console.error("profile upsert", profileErr);

    // 4) Upsert role
    const appRole = mapRole(body.user_role);
    const { error: roleErr } = await supabase
      .from("user_roles")
      .upsert(
        { user_id: authUserId, role: appRole },
        { onConflict: "user_id,role" },
      );
    if (roleErr) console.error("role upsert", roleErr);

    // 5) Issue a magic-link token-hash for the client to verify
    const { data: link, error: linkErr } =
      await supabase.auth.admin.generateLink({
        type: "magiclink",
        email: body.user_email,
      });
    if (linkErr || !link?.properties) {
      console.error("generateLink", linkErr);
      return new Response(
        JSON.stringify({ error: "Could not issue session", detail: linkErr?.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        user_id: authUserId,
        org_id: body.workspace_id,
        role: appRole,
        token_hash: link.properties.hashed_token,
        email: body.user_email,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("gfunnel-sso fatal", e);
    return new Response(
      JSON.stringify({ error: "Internal error", detail: String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
