// Public setup wizard backend: validates an invite token, calls Lovable AI to
// generate scripts/trainings/dispositions, and writes everything to the org.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

type Brief = {
  companyName: string;
  industry?: string;
  website?: string;
  whatYouSell?: string;
  targetCustomer?: string;
  valueProps?: string;
  painPoints?: string;
  objections?: string;
  tone?: string;
  callType?: string;
  existingScript?: string;
  divisions: { name: string; category: string }[];
  brandPrimary?: string;
  brandSecondary?: string;
};

async function callAI(systemPrompt: string, userPrompt: string, schema: any) {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      tools: [{ type: "function", function: schema }],
      tool_choice: { type: "function", function: { name: schema.name } },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI ${res.status}: ${text}`);
  }
  const data = await res.json();
  const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  return JSON.parse(args);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, token, brief, org } = await req.json();

    // Validate the invite
    const { data: invite, error: invErr } = await admin
      .from("setup_invites")
      .select("*")
      .eq("token", token)
      .maybeSingle();
    if (invErr || !invite) {
      return new Response(JSON.stringify({ error: "Invalid invite link" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (invite.used_at) {
      return new Response(JSON.stringify({ error: "This invite has already been used" }), {
        status: 410,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: "This invite has expired" }), {
        status: 410,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "validate") {
      return new Response(JSON.stringify({ ok: true, label: invite.label }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "generate") {
      const b = brief as Brief;

      // 1) Create the organization
      const slug = (b.companyName || "org")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 40) + "-" + Math.random().toString(36).slice(2, 6);

      const { data: orgRow, error: orgErr } = await admin
        .from("organizations")
        .insert({
          name: b.companyName,
          slug,
          industry: b.industry,
          website: b.website,
          brand_primary_color: b.brandPrimary,
          brand_secondary_color: b.brandSecondary,
          auth_mode: org?.authMode || "member_id",
          setup_completed_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (orgErr) throw orgErr;

      // 2) Divisions
      const divisionsPayload = (b.divisions?.length ? b.divisions : [
        { name: "Sales", category: "sales" },
      ]).map((d) => ({ org_id: orgRow.id, name: d.name, category: d.category }));
      const { data: divisionsRows, error: divErr } = await admin
        .from("divisions")
        .insert(divisionsPayload)
        .select();
      if (divErr) throw divErr;

      const briefSummary = `
Company: ${b.companyName}
Industry: ${b.industry || "N/A"}
Sells: ${b.whatYouSell || "N/A"}
Target customer: ${b.targetCustomer || "N/A"}
Value props: ${b.valueProps || "N/A"}
Pain points: ${b.painPoints || "N/A"}
Common objections: ${b.objections || "N/A"}
Tone: ${b.tone || "consultative"}
Call type: ${b.callType || "warm"}
Existing script (refine if useful):
${b.existingScript || "(none provided)"}
      `.trim();

      // 3) Generate scripts (one per division)
      const scriptsToInsert: any[] = [];
      const trainingsToInsert: any[] = [];
      for (const division of divisionsRows) {
        const scriptOut = await callAI(
          "You are an expert sales/CS conversation designer. Build phased scripts with embedded data-capture fields and objection responses. Output strictly via the function call.",
          `Generate a teleprompter-style script for the "${division.name}" division (${division.category}).\n\n${briefSummary}`,
          {
            name: "build_script",
            description: "Build a multi-phase script.",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                phases: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      goal: { type: "string" },
                      lines: { type: "array", items: { type: "string" } },
                      fields: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            label: { type: "string" },
                            key: { type: "string" },
                            type: { type: "string", enum: ["text", "number", "select", "boolean"] },
                          },
                          required: ["label", "key", "type"],
                        },
                      },
                      objections: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            objection: { type: "string" },
                            response: { type: "string" },
                          },
                          required: ["objection", "response"],
                        },
                      },
                    },
                    required: ["name", "goal", "lines"],
                  },
                },
              },
              required: ["title", "phases"],
            },
          }
        );
        scriptsToInsert.push({
          org_id: orgRow.id,
          division_id: division.id,
          title: scriptOut.title,
          description: scriptOut.description,
          category: division.category,
          content: scriptOut.phases,
          is_active: true,
        });

        // Trainings per division
        const trainOut = await callAI(
          "You are a training content writer. Output via function call.",
          `Create 3 short training docs (markdown) for "${division.name}" team members.\n\n${briefSummary}`,
          {
            name: "build_trainings",
            description: "Create trainings.",
            parameters: {
              type: "object",
              properties: {
                trainings: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      content: { type: "string" },
                    },
                    required: ["title", "content"],
                  },
                },
              },
              required: ["trainings"],
            },
          }
        );
        for (const t of trainOut.trainings) {
          trainingsToInsert.push({
            org_id: orgRow.id,
            division_id: division.id,
            title: t.title,
            content: t.content,
          });
        }
      }

      // 4) Dispositions (org-wide)
      const dispOut = await callAI(
        "You are designing call dispositions. Output via function call.",
        `Create 6-8 call dispositions with follow-up rules.\n\n${briefSummary}`,
        {
          name: "build_dispositions",
          description: "Create dispositions.",
          parameters: {
            type: "object",
            properties: {
              dispositions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    label: { type: "string" },
                    outcome_type: { type: "string", enum: ["won", "lost", "follow_up", "neutral"] },
                    follow_up_days: { type: "number" },
                    description: { type: "string" },
                  },
                  required: ["label", "outcome_type"],
                },
              },
            },
            required: ["dispositions"],
          },
        }
      );

      const { data: scriptRows, error: scErr } = await admin
        .from("scripts")
        .insert(scriptsToInsert)
        .select();
      if (scErr) throw scErr;

      if (trainingsToInsert.length) {
        await admin.from("trainings").insert(trainingsToInsert);
      }

      const dispPayload = dispOut.dispositions.map((d: any) => ({
        org_id: orgRow.id,
        label: d.label,
        outcome_type: d.outcome_type,
        follow_up_days: d.follow_up_days ?? null,
        description: d.description ?? null,
      }));
      if (dispPayload.length) {
        await admin.from("dispositions").insert(dispPayload);
      }

      // Mark invite used + link org
      await admin
        .from("setup_invites")
        .update({ used_at: new Date().toISOString(), org_id: orgRow.id })
        .eq("id", invite.id);

      return new Response(
        JSON.stringify({
          ok: true,
          org: orgRow,
          scripts: scriptRows,
          divisions: divisionsRows,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("setup-generate error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
