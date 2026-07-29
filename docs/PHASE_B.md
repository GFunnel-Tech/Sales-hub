# Phase B — GHL Reporting Pipeline

Automated setter/account reporting from CRM activity, replacing the manual
multi-tab workbook. Built in SalesHub (Supabase project `upunppktlbgeuqloofuw`).

## What's in this repo

| Layer | Location | Status |
|---|---|---|
| Metric layer (binding §4 definitions) | `src/lib/metrics/` | ✅ built + unit-tested |
| Ground-truth fixture | `fixtures/rich_investor_capital_2026-07-22_28.csv` | ✅ reproduces §5 |
| Fact/dim schema + metric views + alerts | `supabase/migrations/20260728120000_ghl_reporting_schema.sql` | ✅ written (apply to DB) |
| CSV ingestion (runs today) | `supabase/functions/ingest-call-export/` | ✅ deployable |
| Live GHL API sync | `supabase/functions/ghl-sync/` | ⚠️ deployable; confirm calls/appts endpoints |
| Reporting UI (`/reporting`) | `src/pages/Reporting.tsx`, `src/hooks/useReporting.ts` | ✅ built |

The metric layer is the single source of truth for definitions; the SQL views in
the migration mirror it exactly (both are validated against the §5 numbers). A
call's "contact" is **always** derived from duration + disposition, never from
GHL `Call status` (which counts carrier connection to voicemail as "Answered").

## Data model (every fact carries account + setter keys)

`dim_account` · `dim_setter` · `fact_call` · `fact_lead` · `fact_appointment`
plus `sync_state` (watermarks), `sync_runs` (every run logged — no silent
failure), `account_alerts` (completion + defect notifications). Views:
`v_setter_daily`, `v_account_health`, `v_speed_to_lead`, `v_fact_call_enriched`.

## Account completion & notifications

`v_account_health` classifies each account/day into one of four states, routed to
the owner implied by the failure:

| Status | Meaning | Owner |
|---|---|---|
| `complete` | all delivered leads worked | — |
| `leads_not_worked` | leads delivered, not all dialed (or zero dials) | setter / manager |
| `no_leads_delivered` | account got no leads | media (supply) |
| `worked_no_appointments` | fully worked but 0 appts | setter / coach |

The ingestion/sync functions write a row to `account_alerts` for anything not
completed and POST criticals to Slack/n8n (`SLACK_WEBHOOK_URL` / `N8N_ALERT_URL`).
The `/reporting` page shows completion status and the open-notification feed.

## Go-live checklist

1. **Apply the migration** to `upunppktlbgeuqloofuw`
   (`supabase db push`, or via the Supabase SQL editor / MCP once access is granted).
2. **Set function secrets**: `GHL_API_KEY`, `GHL_COMPANY_ID`, optional
   `GHL_API_BASE`, `SYNC_SECRET`, `SLACK_WEBHOOK_URL` (or `N8N_ALERT_URL`).
3. **Deploy functions**: `ingest-call-export`, `ghl-sync`.
4. **Prove it end-to-end today** without waiting on the API — POST a GHL call
   export:
   ```
   curl -X POST "$SUPABASE_URL/functions/v1/ingest-call-export" \
     -H "x-sync-secret: $SYNC_SECRET" -H "content-type: application/json" \
     -d '{"csv":"<raw export text>","timezone":"America/New_York","currency":"USD"}'
   ```
   Then open `/reporting`.
5. **Confirm the two live endpoints** in `ghl-sync/index.ts` (`ENDPOINTS.calls`,
   `ENDPOINTS.appointments`) against your GHL plan; contacts/locations use the
   stable v2 endpoints. Then schedule `ghl-sync` (n8n at `apihub.gfunnel.com` or
   Supabase cron) incrementally per location.
6. **Two-week parallel run** against the manual workbook; resolve discrepancies
   before retiring the spreadsheets (scope §6). Historical workbook data is
   preserved read-only — not migrated (future-dated rows, 3 incompatible schemas).

## Tests

`npm test` runs the metric layer against the §5 fixture (conversations = 6,
contact rate = 3.7%, calls ≤15s = 131, coverage = 6/7 days, working set = 42,
attempts collapse). Swap the fixture for the real CRM export; assertions hold.

## Known follow-ons (not yet built)

- Setter attribution in `ghl-sync` (Users → `dim_setter`, then backfill
  `fact_call.setter_id`). CSV exports have no setter column, so CSV-ingested
  calls are unattributed until the API pass runs.
- Remaining B5 surfaces: speed-to-lead exception feed, coverage report,
  setter performance comparison (data + views already exist; UI pending).
- Staffed-hours refinement for speed-to-lead (helper stubbed in `callMetrics.ts`).
