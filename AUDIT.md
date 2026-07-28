# SalesHub — Phase A Audit

**Repo:** `gfunnel-tech/secure-lead-spark`
**Date:** 2026-07-28
**Author:** Claude Code (automated audit)
**Scope of this document:** Establish what SalesHub *is today*. No application code, schema, or migrations were changed. This is a read-only audit per §0 of the working brief.

> **Headline finding.** SalesHub is **not** a GoHighLevel-sync sales-operations reporting tool and does not contain the fact/dimension model, GHL integration, or metric layer that Phase B assumes. It is a **generic, Lovable-generated multi-tenant sales-enablement / call-script "teleprompter" web app** with a manual sales log, a manual leads spreadsheet, a guided "blueprint" pitch flow, commissions/payouts, and admin content editors. Roughly **90% of the Phase B data platform is greenfield.** Details below; effort signal in §A7.

---

## A1. Repository and stack

| Item | Finding |
|---|---|
| Repo | `gfunnel-tech/secure-lead-spark` |
| Default branch | `main` |
| Audit branch | `claude/mvp-audit-3v257q` |
| Last commit | `b4c2d68` — "Added phase dropdown popover", **2026-06-01** |
| Total commits | 239 (first commit 2026-01-09) |
| Commit cadence (last 90d of activity) | Bursty, Lovable-style. Active days: 04-30 → 06-01. Heaviest: 2026-06-01 (68 commits), 05-08 (38), 05-27 (33). No commits after 2026-06-01 — repo has been idle ~8 weeks. |
| Language / framework | TypeScript + React 18.3 + Vite 5.4 (SWC). SPA. |
| UI | shadcn/ui (Radix) + Tailwind 3.4 + lucide-react + recharts. `react-router-dom` 6.30, `@tanstack/react-query` 5.83, `react-hook-form` + `zod`. |
| Backend | Supabase (Postgres + Auth + Storage + Edge Functions/Deno). |
| Package manager | Both `bun.lockb` and `package-lock.json` are committed (ambiguous — pick one). |
| Build / deploy | **Lovable-managed** (`README.md`, `.lovable/`, `lovable-tagger` dev dep, `src/integrations/lovable`). No `.github/workflows`, no `vercel.json`/`netlify.toml`, no Dockerfile in repo. Deploy is "Publish" from Lovable; changes made in Lovable auto-commit here. Trigger/target of any production deploy: **NOT FOUND in repo.** |
| Test suite | **None.** No `*.test.*`/`*.spec.*` files; no vitest/jest/playwright/testing-library in `package.json`. Nothing to run on a clean checkout. |
| Lint | ESLint 9 flat config present (`eslint.config.js`). Notable: `@typescript-eslint/no-unused-vars` is turned **off**. `npm run lint` exists; not run here (deps not installed — see below). |
| Typecheck | `strict: false`, `strictNullChecks: false`, `noImplicitAny: false` in `tsconfig.app.json`. Type safety is effectively opt-out across the codebase. No `typecheck` script. |
| Dependencies installed? | `node_modules/` absent in this checkout. Lint/build/typecheck were therefore **not executed**; findings above are from static inspection of config, not a run. |

### Directory map (2 levels)

```
src/
  App.tsx            Route table (all routing lives here)
  main.tsx           Entry
  pages/             40 top-level page components (many unrouted — see A3)
    blueprint/       10-page guided pitch flow
  components/        Feature + layout components
    sales/           Script-runner sub-components (ScriptDisplay, ObjectionTracker, …)
    blueprint/       Blueprint layout/progress
    ui/              shadcn primitives (~50 files)
  hooks/             useAuth, useMember, useGFunnel, useBlueprintSession, useSalesPhases, …
  integrations/
    supabase/        client.ts (auto-gen), types.ts (generated DB types)
    lovable/         Lovable OAuth wrapper (auto-gen)
  lib/               Hardcoded content + config (scripts, FAQs, learning, calculators, …)
  assets/            Static images
supabase/
  config.toml        3 functions set verify_jwt=false
  functions/         5 Deno edge functions
  migrations/        15 SQL migrations (2026-01-03 → 2026-06-01)
public/
```

---

## A2. Data layer

**Database: Supabase.** Project ref **`upunppktlbgeuqloofuw`** (from `.env` `VITE_SUPABASE_PROJECT_ID` / `VITE_SUPABASE_URL`, and `supabase/config.toml`).

> ⚠️ **This is a THIRD, distinct Supabase project** — it is **not** the platform GFunnel project `yjneucgsaayyzoyxrlnb`, and not metahub's Lovable instance. See §8.2.
>
> **Live introspection was not possible.** The Supabase tooling available to this session is authenticated only to the org containing `yjneucgsaayyzoyxrlnb` (the platform project); it returns *"You do not have permission"* for `upunppktlbgeuqloofuw`. This empirically confirms the brief's §3 warning that credentials for one project do not reach the other. **Therefore: row counts, live RLS state, and any drift between repo migrations and the live schema are `NOT FOUND` (no access).** The schema below is reconstructed from the 15 committed migrations and the generated `src/integrations/supabase/types.ts`, which agree with each other.

### Table inventory (from migrations; types.ts corroborates)

| Table | Purpose | Written by | Key columns |
|---|---|---|---|
| `profiles` | User/member identity | signup trigger, admin, GFunnel SSO edge fn | `user_id`(FK auth.users, unique), `member_id`(unique), `email`, `audience`, `org_id`, `manager_id`(self-FK), `gfunnel_user_profile_id`(unique), `is_active`, `must_change_password` |
| `user_roles` | RBAC | signup trigger, admin, SSO fn | `user_id`, `role` (`app_role` enum) — unique(user_id, role) |
| `scripts` | Sales scripts (JSONB phases) | admin, setup-generate fn | `content` jsonb, `org_id`, `division_id`, `is_active` |
| `script_requests` | Member requests for a script | member | `user_id`, `status` |
| `sales` | Manual sales/call log (CRM-style) | member (via edge fn) | `user_id`, `profile_id`, `disposition`(enum), `closed_at_stage`(enum), `sale_amount`, `call_type`, customer_* |
| `blueprint_sessions` | 9-step guided pitch flow state | member (via edge fn) | `session_id`(unique), `agent_profile_id`, prospect_*, per-page JSONB, `status`, `disposition` |
| `organizations` | Tenant | admin, SSO fn, setup fn | `id`, `slug`, brand colors, `auth_mode` |
| `divisions` | Sub-team within org | admin, setup fn | `org_id`, `category` |
| `trainings` | Training docs | admin, setup fn | `org_id`, `division_id`, `is_active` |
| `dispositions` | Configurable disposition taxonomy | admin, setup fn | `org_id`, `label`, `outcome_type`, `follow_up_days` |
| `setup_invites` | One-time org-setup tokens | admin | `token`(unique), `used_at`, `expires_at` |
| `banner_slides` | Adaptive home banners | admin | `audience`, `placement`, `is_active`, `sort_order` |
| `commission_rules` | Commission rate per role | admin (seeded closer/setter/salesperson) | `role`(unique), `rate_percent`, `flat_bonus` |
| `payout_requests` | Payout workflow | member (request), admin (review) | `profile_id`, `amount`, `status` |
| `sales_phases` | Editable 7-phase script definitions | admin (seeded from static file) | `phase_key`, `sort_order`, `script_blocks`/`fields`/`hints`/`objections` jsonb |
| `documents` | File library | admin | `file_path`, `category`, `requires_signature` |
| `document_signatures` | E-sign records | member | `document_id`, `profile_id`, ip/ua |
| `leads` | **Manual** leads spreadsheet | member (via edge fn, hand-typed) | `org_id`, `agent`(free text), `outcome`, `lead_name`, `appointment_booked`, `time_zone`, **`ghl_link`** (a plain text URL, **not** an integration) |
| `lead_edits` | Audit log for `leads` | member (via edge fn) | `lead_id`, `field`, old/new value, editor |

**Enums:** `app_role` = `{admin, salesperson}` (⚠️ **no `manager`** — see A6 defect #3); `disposition_type` = `{sold, no_sale, callback, no_answer, not_interested, needs_followup, sent_info, scheduled_demo, left_voicemail}`; `sales_stage` = 7 pitch stages.

**Functions / triggers:** `has_role(uuid, app_role)` (SECURITY DEFINER, used by all admin RLS); `handle_new_user()` trigger on `auth.users` (creates profile + default `salesperson` role); `update_updated_at_column()` on most tables. **No views, no scheduled/cron jobs, no pg_cron** referenced anywhere in the repo (`NOT FOUND`).

**Storage:** one private bucket `documents` with admin-write / anyone-read policies.

**Migrations:** tracked in `supabase/migrations/` (15 files, timestamped). Whether they match the *live* schema: **NOT VERIFIABLE** (no live access). No later migration alters the `app_role` enum, so the `manager` role referenced by the SSO function is unsupported at the DB level.

### Data origin per table (human / integration / app-logic)

Every populated table is **human-entered** (via UI/edge functions) or **app/AI-generated at setup**. **No table is populated by any external CRM/telephony integration.**
- Human: `sales`, `leads`, `lead_edits`, `blueprint_sessions`, `payout_requests`, `document_signatures`, `script_requests`, most `profiles`.
- App/AI at org-setup: `organizations`, `divisions`, `scripts`, `trainings`, `dispositions` (generated by `setup-generate` via Lovable AI).
- Seeded: `commission_rules`, the default `scripts` row, `sales_phases`.

### Row-Level Security (from migration DDL)

RLS is **enabled on every public table.** Policy shape is consistent: *admins manage everything* via `has_role(auth.uid(),'admin')`; members read "active" rows. Two policies are **notably permissive and are data-exposure risks** (see A6 / Blockers):

- `leads`: `CREATE POLICY "Anyone can view leads" ... USING (true)` **plus** `GRANT SELECT ON public.leads TO anon`. → Any holder of the public anon key can read **all** leads across **all** orgs directly, bypassing the org scoping that only the edge function applies.
- `document_signatures`: `"Anyone can view signatures by profile" USING (true)` and `"Anyone can record signatures" WITH CHECK (true)` — world-readable/writable signature records.
- `sales` member-path integrity: the `member-sales` edge function writes `user_id = member.id` (a *profile* id) with a `// legacy` comment, while the strict `sales` RLS compares `auth.uid() = user_id` (an *auth* id). These never match, so member-created sales are invisible to the client-side RLS path and are only ever read back through the service-role edge function. Works, but the column semantics are inconsistent.

---

## A3. Feature inventory

Routing is entirely in `src/App.tsx`. Access tiers: **public**, **member** (`MemberRoute` = Supabase-authenticated), **admin** (`AdminRoute` = authenticated + `admin` role).

### Routed surfaces

| Path | File | Access | Class | Backing |
|---|---|---|---|---|
| `/login` | `pages/Login.tsx` | public | **LIVE** | Supabase auth + `member_id` lookup |
| `/admin-login` | `pages/AdminLogin.tsx` | public | **LIVE** | Supabase auth |
| `/reset-password` | `pages/ResetPassword.tsx` | public | **LIVE** | Supabase auth |
| `/setup/:token` | `pages/SetupWizard.tsx` | public (token) | **LIVE** | `setup-generate` edge fn + Lovable AI (needs `LOVABLE_API_KEY`) |
| `/member-entry` | → redirect to `/login` | public | **DEAD** | (`pages/MemberEntry.tsx` is orphaned) |
| `/` | `pages/SalesHub.tsx` | member | **PARTIAL** | Landing/hub; nav to real tools, static hero/marketing content |
| `/sales-process` | `pages/SalesProcess.tsx` | member | **LIVE** | `sales_phases` via `useSalesPhases`, static fallback |
| `/log-sale` | `pages/LogSale.tsx` | member | **LIVE** | `member-sales?action=create` |
| `/my-sales` | `pages/MySales.tsx` | member | **LIVE** | `member-sales?action=list` |
| `/dashboard` | `pages/Dashboard.tsx` | member | **LIVE** | `member-sales?action=stats/list` + `LeadsManager` |
| `/scripts` | `pages/Scripts.tsx` | member | **LIVE** | `scripts` table (admin-editable) |
| `/objection-playbook` | `pages/ObjectionPlaybook.tsx` | member | **MOCK** | Hardcoded arrays in the page (no backend) |
| `/sales-training` | `pages/SalesTraining.tsx` | member | **MOCK** | Hardcoded framework/modules (no backend; `trainings` table is unused here) |
| `/payouts` | `pages/Payouts.tsx` | member | **LIVE** | `member-sales?action=commissions/payouts/request-payout` |
| `/documents` | `pages/Documents.tsx` | member | **LIVE** | `documents` table + storage + `document_signatures` |
| `/competitor-lookup` | `pages/CompetitorLookupPage.tsx` → `components/CompetitorLookup.tsx` | member | **LIVE ⚠️** (see below) | Direct browser call to `api.anthropic.com` with `VITE_ANTHROPIC_API_KEY` |
| `/call-analyzer` | `pages/CallAnalyzerPage.tsx` → `components/CallAnalyzer.tsx` | member | **LIVE ⚠️** (see below) | Direct browser call to `api.anthropic.com` with `VITE_ANTHROPIC_API_KEY` |
| `/blueprint` … `/blueprint/success` (10) | `pages/blueprint/*` | member | **LIVE** | `blueprint_sessions` via `member-blueprint`; `useBlueprintSession` |
| `/admin` | `pages/AdminPanel.tsx` | admin | **LIVE** | profiles / user_roles |
| `/admin/documents` | `pages/DocumentsAdmin.tsx` | admin | **LIVE** | documents + storage |
| `/admin/payouts` | `pages/AdminPayouts.tsx` | admin | **LIVE** | payout_requests |
| `/admin/setup-invites` | `pages/SetupInvites.tsx` | admin | **LIVE** | setup_invites |
| `/admin/banners` | `pages/BannerManager.tsx` | admin | **LIVE** | banner_slides |
| `/admin/scripts`, `/admin/scripts/:id` | `pages/ScriptEditor.tsx` | admin | **LIVE** | scripts |
| `/admin/sales-phases` | `pages/SalesPhasesAdmin.tsx` | admin | **LIVE** | sales_phases |

### DEAD — page files present but **not routed** in `App.tsx`

`ActionHub`, `AllServices`, `CommissionStructure`, `DepartmentPage`, `ExplorePage`, `IncomeCalculator`, `Index`, `Leaderboard`, `LearningResources`, `MemberEntry`, `PartnerHome`, `PartnerRanks`, `PrizesIncentives`, `ServiceConfirmation`, `ServicePage`, `VisionIntake`, `VisionProcessing`. These are leftovers from the original Lovable template (a marketing/partner/services site) and ship in the bundle but are unreachable. `Leaderboard.tsx` additionally renders **hardcoded placeholder names** and fetches an operator-pasted Google-Sheets CSV that is never set — pure MOCK/DEAD.

### AI features — real endpoint, but client-side and fragile

`CallAnalyzer` (`claude-sonnet-4`) and `CompetitorLookup` (both routed and member-reachable) call a **real** endpoint — `https://api.anthropic.com/v1/messages` **directly from the browser** — using `import.meta.env.VITE_ANTHROPIC_API_KEY` with header `anthropic-dangerous-direct-browser-access: true`. Classified **LIVE** because they do hit a working API, but with two serious caveats:
- The key is **not** in the committed `.env` (only three `VITE_SUPABASE_*` vars are). If it is unset at build time → both features **fail** (effectively non-functional).
- If it *is* set as a `VITE_` var → it is **bundled into client JS and exposed to every visitor** (secret leak). Either way this must move to a server-side edge function. See A6/Blockers.

`components/AIFeatures.tsx` renders an **empty `<section>`** (dead); `ContextualAdvice.tsx` is static advice strings reached only from unrouted pages — neither calls a backend.

---

## A4. Existing integrations

| Integration | Present? | Detail |
|---|---|---|
| **GoHighLevel / HighConversionHub** | **NO** | No GHL API calls, no `Version: 2021-07-28` header, no location iteration, no OAuth/token refresh — nothing. The only trace of "GHL" is `leads.ghl_link`, a free-text URL column a human pastes, rendered as an "Open" link in `LeadsManager.tsx`. |
| **Supabase** | Yes | Client (`src/integrations/supabase/client.ts`) with anon key; 5 edge functions with service-role key. |
| **Lovable AI gateway** | Yes | `setup-generate` edge fn → `https://ai.gateway.lovable.dev/v1/chat/completions` (model `google/gemini-2.5-flash`), auth `LOVABLE_API_KEY` (server env). Used only during org setup. |
| **Anthropic API** | Yes (client-side) | `CallAnalyzer` + `CompetitorLookup` → `api.anthropic.com` from the browser (see A3). |
| **Lovable OAuth** | Yes | `src/integrations/lovable` Google/Apple/Microsoft SSO wrapper. |
| **GFunnel shell SSO** | Yes | `gfunnel-sso` edge fn + `postMessage` bridge (`lib/gfunnel-bridge.ts`, `useGFunnel.ts`): when embedded as an iframe under `*.gfunnel.com`, the parent posts a context payload; the fn provisions org/user/profile/role and returns a magic-link token-hash for sign-in. |
| **n8n** | **Partial / outbound only** | Three components POST form payloads to **`https://apihub.gfunnel.com/webhook-test/…`**: `components/ActionFormModal.tsx` (2 webhooks), `components/ServiceIntakeForm.tsx`, `pages/VisionIntake.tsx`. ⚠️ These are n8n **test** URLs (`/webhook-test/`), which only fire while a workflow is open in the n8n editor — they will **not** work in production. `ServiceIntakeForm` and `VisionIntake` sit on **DEAD** (unrouted) pages; `ActionFormModal` is a modal whose only entry points (`CoreActions`/`QuickActions`) also live on unrouted pages, so its live reachability is effectively nil today. All are fire-and-forget `mode:"no-cors"` POSTs. **No inbound n8n ingestion exists.** |
| **VideoSuite** | Yes (embed) | `videosuite-player.vercel.app` iframes on several **DEAD** pages. |
| Webhooks (inbound) | **None** | No inbound webhook handlers in any edge function. |
| Scheduled jobs | **None** | `NOT FOUND`. |

**Credential handling:** client uses `VITE_SUPABASE_*` (public by design). Edge functions read `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`, `LOVABLE_API_KEY` from Deno env (correct). The one clear violation is the client-side `VITE_ANTHROPIC_API_KEY` (A3/A6).

---

## A5. Auth, tenancy, and access

**There are two parallel, largely disconnected auth systems.** This is the single most important structural fact for Phase B.

1. **Supabase Auth** (`useAuth`) — email/password, Lovable OAuth (Google/etc.), and GFunnel SSO magic-link. Governs **route gating** (`MemberRoute`/`AdminRoute`) and admin detection (`user_roles.role='admin'`). A seed migration creates `admin@gfunnel.com` / `Admin123$` with `must_change_password=true` (default admin credential — rotate).

2. **`member_id` lookup** (`useMember`) — a member types a `member_id`; the app does a **public** `profiles` SELECT (allowed by RLS `"Anyone can lookup member by member_id"` where `is_active`), stores the raw id in **`sessionStorage`**, and every data-bearing edge function (`member-sales`, `member-leads`, `member-blueprint`) trusts the **`x-member-id` request header** to scope reads/writes — **with no password or token**.

   → **Broken access control:** anyone who knows or guesses a `member_id` can list that member's sales, commissions, and payouts, submit payout requests, and read/write blueprint sessions and org leads, without authenticating. `member_id`s are also enumerable via the public profile-lookup policy. This is a hard security blocker (see A7).

**Roles:** DB enum is `{admin, salesperson}`. RLS treats everything as admin-vs-everyone. The GFunnel SSO function maps external roles to `admin | manager | salesperson`, but **`manager` is not a valid `app_role`** (A6 #3), and migration `20260519` adds a `manager_id` + "Managers can view their reps" policy with no enforced manager role. So a real manager/hierarchy tier is **half-built**.

**Multi-tenancy (hard Phase-B blocker):** `org_id` exists on many tables and on `profiles`, giving a coarse **per-organization** tenant boundary. But:
- Scoping is **inconsistently enforced** — `member-leads` filters by `org_id`, yet the `leads` RLS + anon GRANT expose all rows directly; `member-sales` scopes by `profile_id` only.
- **There is no per-client-account model and no per-setter fact model.** Phase B requires every fact row to carry *both* an account key and a setter key (`dim_account` / `dim_setter`). Today "account" does not exist as an entity (the closest is free-text `leads.agent` and `sales.product_service`), and "setter" is just a `profile`. Reporting **cannot** currently be scoped to a client account or a setter. This must be built.

**Client-facing surface:** none today. Everything behind `/login` is internal (setter/admin). A "Client-facing activity summary via metahub" is named in the business scope but **does not exist** in this repo. This keeps current PII exposure internal, but see the RLS/anon issues above.

---

## A6. Known defects to verify

The brief lists two *metahub* bugs and asks whether SalesHub exhibits them and whether it shares metahub's code.

**Does SalesHub share metahub's code?** **No.** SalesHub is a separate Lovable project (`README` project id `a380eb32-…`), a separate repo (`secure-lead-spark`), and a **separate Supabase project** (`upunppktlbgeuqloofuw`) from both metahub and the platform GFunnel project. There is no shared package, submodule, or imported schema. So any shared defect would be a *replicated pattern*, not shared source.

1. **Leads tile rendering `0` despite activity** — **Not reproduced in SalesHub.** The nearest analogue is the `LeadsManager` "Leads" count badge, which renders `filtered.length` from `member-leads?action=list` (`components/LeadsManager.tsx:149`). It reflects returned rows correctly. A `0` here would be a *data/scoping* effect (org filter, or the anon/member auth mismatch returning nothing), **not** a rendering bug. Root cause of a metahub-style tile bug: **N/A — that surface/code is not present here.**

2. **Form conversion-rate rendering an impossibly high %** — **Not reproduced in SalesHub.** Both conversion computations are correctly bounded to 0–100%:
   - `pages/Dashboard.tsx:122` — `conversion = totalCalls ? round(sold/totalCalls*100) : 0`, and `sold ⊆ scopedSales`, so ≤ 100%.
   - `supabase/functions/member-sales/index.ts:410` — `conversionRate = totalCalls && weekSales ? round(weekSales/totalCalls*100) : 0`; `weekSales` (disposition=sold) ⊆ week total, so ≤ 100%.
   No `x/y`-style form metric that could overshoot exists here. Root cause: **N/A — not present.**

**Additional defects found during the audit (flagged, not fixed):**

3. **`manager` role is not a valid enum value.** `gfunnel-sso` (`ROLE_MAP`, `mapRole`) can produce `role:'manager'` and upserts it into `user_roles`; `app_role` only allows `{admin, salesperson}`. The insert violates the enum, the error is caught-and-logged (`console.error("role upsert", roleErr)`) and swallowed, so **SSO users mapped to "manager" silently get no role row** and fall through as non-admin. `supabase/functions/gfunnel-sso/index.ts:26-43,139-145`.

4. **Client-side Anthropic API key exposure / broken feature.** `components/CallAnalyzer.tsx:135-139` and `components/CompetitorLookup.tsx:82-87` — see A3/A4. Either a leaked key (if set) or dead features (if unset).

5. **`leads` world-readable via anon key + permissive RLS.** `supabase/migrations/20260601182152_*.sql` — `GRANT SELECT … TO anon` + `USING (true)`. Cross-org lead exposure.

6. **Unauthenticated `x-member-id` data access** across `member-sales` / `member-leads` / `member-blueprint` (see A5). The most serious issue.

7. **n8n `/webhook-test/` URLs** hardcoded (A4) — non-functional in production even where reachable.

---

## A7. Audit summary

### Reusable (Phase B can build on as-is)
- Supabase project, Auth, Storage, and the migration/RLS scaffolding pattern (`has_role`, `updated_at` triggers).
- **Presentation shell**: routing, shadcn/Tailwind design system, admin content editors (scripts, sales-phases, banners, documents), commissions/payouts flow, blueprint pitch flow, manual sales log & dashboard charts (recharts).
- The **manual `leads` spreadsheet + `lead_edits` audit trail** is a reasonable *stopgap UI*, and a plausible place to later render synced GHL data.
- **GFunnel SSO + org model** if SalesHub stays embedded in the GFunnel shell.

### Rework (exists but must be replaced/hardened before Phase B)
- **Auth/tenancy**: replace the `x-member-id` header trust with real authenticated, per-user sessions; fix the anon `leads` exposure; reconcile the two auth systems; add a real `manager` role.
- **Metric computations**: the ad-hoc `conversion`/`todayCalls` logic in `Dashboard`/`member-sales` must be superseded by the binding metric definitions in the brief §4 (dials/connects/conversations/attempts/speed-to-lead) — none of which exist today.
- **Move AI calls server-side** (edge functions) and remove `VITE_ANTHROPIC_API_KEY`.
- Decide `bun` vs `npm`; enable TS strictness incrementally.

### Greenfield (does not exist at all — the bulk of Phase B)
- **The entire GHL data-sync pipeline**: location enumeration, calls/contacts/opportunities/calendar/users/workflows ingestion, incremental watermarks, idempotent backfill, run logging, retry/alerting.
- **The fact/dim schema**: `dim_account`, `dim_setter`, `fact_call`, `fact_lead`, `fact_appointment` — with the account-key + setter-key join that is the whole point of the project. **0% present.**
- **The metric layer** (views/module) implementing brief §4 definitions, and validation against the §5 fixtures (fixtures not in repo — must be added).
- **The five B5 surfaces**: setter daily summary, account health board (with the 3-way failure distinction), speed-to-lead alerts, coverage report, setter comparison. None exist.
- **Defect-detection/alerting** for the §6 upstream failures.
- **n8n ingestion** on `apihub.gfunnel.com` (only broken outbound test-webhooks exist).

### Blockers (must resolve before Phase B can start)
1. **No access to SalesHub's live Supabase** (`upunppktlbgeuqloofuw`) from this tooling — required for backfill, schema work, and to verify live-vs-migration drift. Provision credentials/MCP access scoped to this project.
2. **Unauthenticated `x-member-id` data access** and **anon-readable `leads`** — security must be fixed before more data (esp. lead PII) flows in.
3. **No account or setter dimension** — the core Phase B join has nowhere to live yet; must be designed first.
4. **No GHL credentials/integration of any kind** present; no location list verified.
5. **Product identity ambiguity** — is SalesHub the intended reporting home, or is metahub? (§8.1). Phase B target surface is undecided.
6. Business decisions in §8 (authoritative account list, setter mapping, backfill policy) are unresolved.

### Effort signal
**Phase B is a multi-month build, not days or weeks.** What exists is a sales-*enablement* app; what Phase B specifies is a sales-*operations data platform* (ETL + warehouse-style fact/dim model + metric layer + alerting + 5 reporting surfaces + 2-week parallel run). The overlap is ~the UI shell and Supabase plumbing only — call it **~10% reusable, ~90% greenfield**. Rough shape, assuming credentials and decisions are unblocked: **~2–4 months** for one experienced full-stack + data engineer to reach the §9 "Phase B done" bar (GHL sync live for all active locations, fixtures validated, alerting live, parallel run complete). Precise sizing depends on the §10/Phase-0 diagnostic (is the automation failure one account or platform-wide) and on GHL API access, neither of which can be determined from this repo.

---

## §8 — Surface these (business decisions, not for me to resolve)

1. **Is SalesHub a distinct product from metahub, a rename, or a fork?** → **Distinct.** Separate repo, separate Lovable project, separate Supabase project (`upunppktlbgeuqloofuw` vs metahub's own vs platform `yjneucgsaayyzoyxrlnb`). They share **no code or schema**. Decision needed: does Phase B reporting live *here* (SalesHub) or in metahub (which the business scope names as the presentation layer)? This changes everything downstream.
2. **Which Supabase project does SalesHub use?** → **`upunppktlbgeuqloofuw`**, confirmed from `.env` + `config.toml`. It is neither the platform project nor metahub's. Grant this session/tooling access to it.
3. **Client-facing or internal-only?** → **Internal-only today.** No client surface exists. A client activity summary is scoped in the business doc but unbuilt — decide before Phase B, as it drives RLS/PII design.
4. **Authoritative account list?** → **Does not exist in this system.** No `dim_account`, no client-account entity — only free-text `leads.agent`/`sales.product_service`. The brief's two conflicting spreadsheet lists remain the only source. Must be established.
5. **Setter identity mapping (GHL user → setter)?** → **Must be constructed.** `profiles` has no `ghl_user_id`; there is no GHL linkage at all. `dim_setter.ghl_user_id` is greenfield.
6. **Historical backfill?** → **Recommend preserve read-only, do not migrate**, consistent with the brief (49 impossible/future-dated rows, 3 schemas). There is no backfill machinery here to reuse. Confirm before building any.

### Additional items requiring a decision
- Rotate the seeded `admin@gfunnel.com / Admin123$` credential.
- `bun.lockb` **and** `package-lock.json` both committed — pick one package manager.
- Repo has been idle since 2026-06-01 — confirm it is the current/authoritative SalesHub codebase before investing.

---

*Phase A ends here. No Phase B work has begun. Per §0.1 of the brief, Phase B is gated on written sign-off of this audit.*
