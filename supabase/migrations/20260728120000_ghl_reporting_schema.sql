-- =====================================================================
-- Phase B — GHL reporting: fact/dimension schema + metric views + alerting
-- Every fact row carries BOTH an account key and a setter key — the join
-- whose absence is the entire reason current reporting cannot analyse setter
-- and account performance together (brief §B3). Currency is per-account and
-- MUST NOT be blended; views never aggregate across accounts.
-- All timestamps stored UTC; rendered in the account's local timezone.
-- =====================================================================

-- ---------- enums ----------
DO $$ BEGIN
  CREATE TYPE public.appointment_outcome AS ENUM
    ('scheduled','confirmed','showed','no_show','cancelled','rescheduled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.account_health_status AS ENUM
    ('complete','no_leads_delivered','leads_not_worked','worked_no_appointments');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- dimensions ----------
CREATE TABLE IF NOT EXISTS public.dim_account (
  account_id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ghl_location_id text UNIQUE NOT NULL,
  client_name     text,
  company         text,
  status          text NOT NULL DEFAULT 'active',
  timezone        text NOT NULL DEFAULT 'America/New_York',
  currency        text NOT NULL DEFAULT 'USD',   -- never blend across accounts
  active_from     date,
  active_to       date,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.dim_setter (
  setter_id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ghl_user_id     text UNIQUE,
  name            text NOT NULL,
  lane            text,                            -- 'client' | 'agency'
  timezone        text,
  scheduled_hours numeric,
  active          boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ---------- facts ----------
-- call_id / contact_id / appointment_id are the GHL native ids => upserts are
-- idempotent and backfill is safely re-runnable (brief §7).
CREATE TABLE IF NOT EXISTS public.fact_call (
  call_id          text PRIMARY KEY,
  account_id       uuid REFERENCES public.dim_account(account_id) ON DELETE CASCADE,
  setter_id        uuid REFERENCES public.dim_setter(setter_id) ON DELETE SET NULL,
  contact_id       text,
  direction        text NOT NULL,                  -- 'outbound' | 'inbound'
  initiated_at     timestamptz NOT NULL,
  duration_seconds integer,                         -- NULL = missing ('-'), != 0
  status           text,                            -- carrier status; NOT answer rate
  disposition      text,                            -- NULL/blank preserved
  recording_url    text,
  workflow_name    text,
  is_first_time    boolean,
  from_number      text,
  to_number        text,
  created_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_fact_call_account_time ON public.fact_call(account_id, initiated_at);
CREATE INDEX IF NOT EXISTS idx_fact_call_setter_time  ON public.fact_call(setter_id, initiated_at);
CREATE INDEX IF NOT EXISTS idx_fact_call_contact      ON public.fact_call(account_id, contact_id, initiated_at);

CREATE TABLE IF NOT EXISTS public.fact_lead (
  contact_id     text PRIMARY KEY,
  account_id     uuid REFERENCES public.dim_account(account_id) ON DELETE CASCADE,
  created_at     timestamptz NOT NULL,
  source         text,
  campaign       text,
  first_dial_at  timestamptz,
  current_stage  text,
  stage_history  jsonb NOT NULL DEFAULT '[]'::jsonb,
  synced_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_fact_lead_account_created ON public.fact_lead(account_id, created_at);

CREATE TABLE IF NOT EXISTS public.fact_appointment (
  appointment_id text PRIMARY KEY,
  account_id     uuid REFERENCES public.dim_account(account_id) ON DELETE CASCADE,
  setter_id      uuid REFERENCES public.dim_setter(setter_id) ON DELETE SET NULL,
  contact_id     text,
  closer_id      text,
  created_at     timestamptz,
  scheduled_at   timestamptz,
  confirmed_at   timestamptz,
  outcome        public.appointment_outcome NOT NULL DEFAULT 'scheduled',
  synced_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_fact_appt_account_created ON public.fact_appointment(account_id, created_at);
CREATE INDEX IF NOT EXISTS idx_fact_appt_setter ON public.fact_appointment(setter_id, created_at);

-- ---------- ingestion bookkeeping ----------
-- Per (location, object) high-water mark for incremental sync.
CREATE TABLE IF NOT EXISTS public.sync_state (
  ghl_location_id text NOT NULL,
  object_type     text NOT NULL,     -- calls | contacts | opportunities | appointments | users
  watermark       timestamptz,
  updated_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (ghl_location_id, object_type)
);

-- One row per sync run — makes silent failure impossible (the core defect).
CREATE TABLE IF NOT EXISTS public.sync_runs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ghl_location_id text,
  object_type     text,
  window_start    timestamptz,
  window_end      timestamptz,
  records_in      integer NOT NULL DEFAULT 0,
  records_written integer NOT NULL DEFAULT 0,
  status          text NOT NULL DEFAULT 'running',  -- running | success | error
  error           text,
  started_at      timestamptz NOT NULL DEFAULT now(),
  finished_at     timestamptz
);
CREATE INDEX IF NOT EXISTS idx_sync_runs_started ON public.sync_runs(started_at DESC);

-- Account-completion + exception notifications (mirrors src/lib/metrics/alerts.ts).
CREATE TABLE IF NOT EXISTS public.account_alerts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id   uuid REFERENCES public.dim_account(account_id) ON DELETE CASCADE,
  day          date NOT NULL,
  type         text NOT NULL,       -- account_completion | blank_disposition_rate | ...
  status       public.account_health_status,
  severity     text NOT NULL DEFAULT 'warning',
  owner        text,                -- media | setter | manager | backend
  message      text NOT NULL,
  value        numeric,
  resolved     boolean NOT NULL DEFAULT false,
  notified_at  timestamptz,         -- set once pushed to Slack/n8n
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (account_id, day, type)    -- idempotent: one alert per account/day/type
);
CREATE INDEX IF NOT EXISTS idx_account_alerts_open ON public.account_alerts(resolved, created_at DESC);

-- ---------- updated_at triggers ----------
CREATE TRIGGER dim_account_updated_at BEFORE UPDATE ON public.dim_account
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER dim_setter_updated_at BEFORE UPDATE ON public.dim_setter
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================================
-- Metric layer — VIEWS (brief §4). These are the canonical server-side
-- reporting definitions and mirror src/lib/metrics/callMetrics.ts exactly.
-- 🔴 Contact is derived from duration + disposition, never from `status`.
-- =====================================================================

-- Enrich each call with account-local day + the boolean metric flags.
CREATE OR REPLACE VIEW public.v_fact_call_enriched AS
SELECT
  c.*,
  a.timezone AS account_timezone,
  a.currency AS account_currency,
  a.client_name,
  (lower(c.direction) = 'outbound') AS is_outbound,
  (c.initiated_at AT TIME ZONE a.timezone)::date AS local_day,
  (lower(c.direction) = 'outbound' AND c.duration_seconds >= 20) AS is_connect,
  (lower(c.direction) = 'outbound' AND (
      c.duration_seconds >= 60
      OR (c.disposition IS NOT NULL
          AND lower(btrim(c.disposition)) NOT IN ('no answer','voicemail'))
  )) AS is_conversation,
  (lower(c.direction) = 'outbound' AND c.duration_seconds IS NOT NULL
      AND c.duration_seconds <= 15) AS is_le15
FROM public.fact_call c
JOIN public.dim_account a ON a.account_id = c.account_id;

-- Setter daily summary (B5 #1) — scoped by account AND setter AND local day.
CREATE OR REPLACE VIEW public.v_setter_daily AS
SELECT
  e.account_id,
  e.client_name,
  e.account_currency,
  e.setter_id,
  s.name AS setter_name,
  e.local_day,
  count(*) FILTER (WHERE e.is_outbound) AS dials,
  count(*) FILTER (WHERE e.is_connect) AS connects,
  count(*) FILTER (WHERE e.is_conversation) AS conversations,
  round(
    count(*) FILTER (WHERE e.is_conversation)::numeric
    / NULLIF(count(*) FILTER (WHERE e.is_outbound), 0), 4
  ) AS contact_rate,
  count(DISTINCT e.contact_id) FILTER (WHERE e.is_outbound) AS working_set,
  count(*) FILTER (WHERE e.is_le15) AS calls_le15s
FROM public.v_fact_call_enriched e
LEFT JOIN public.dim_setter s ON s.setter_id = e.setter_id
GROUP BY e.account_id, e.client_name, e.account_currency, e.setter_id, s.name, e.local_day;

-- Per-account per-day working data (leads delivered vs contacts worked vs appts).
CREATE OR REPLACE VIEW public.v_account_daily AS
WITH dials AS (
  SELECT account_id, local_day,
         count(*) FILTER (WHERE is_outbound) AS dials,
         count(DISTINCT contact_id) FILTER (WHERE is_outbound) AS contacts_dialed
  FROM public.v_fact_call_enriched
  GROUP BY account_id, local_day
),
delivered AS (
  SELECT l.account_id,
         (l.created_at AT TIME ZONE a.timezone)::date AS local_day,
         count(*) AS delivered_leads
  FROM public.fact_lead l JOIN public.dim_account a ON a.account_id = l.account_id
  GROUP BY l.account_id, (l.created_at AT TIME ZONE a.timezone)::date
),
appts AS (
  SELECT ap.account_id,
         (ap.created_at AT TIME ZONE a.timezone)::date AS local_day,
         count(*) AS appointments_set
  FROM public.fact_appointment ap JOIN public.dim_account a ON a.account_id = ap.account_id
  GROUP BY ap.account_id, (ap.created_at AT TIME ZONE a.timezone)::date
)
SELECT
  a.account_id, a.client_name, a.currency,
  d.local_day,
  COALESCE(dl.delivered_leads, 0) AS delivered_leads,
  COALESCE(d.contacts_dialed, 0)  AS contacts_dialed,
  COALESCE(d.dials, 0)            AS dials,
  COALESCE(ap.appointments_set,0) AS appointments_set
FROM public.dim_account a
LEFT JOIN dials d      ON d.account_id  = a.account_id
LEFT JOIN delivered dl ON dl.account_id = a.account_id AND dl.local_day = d.local_day
LEFT JOIN appts ap     ON ap.account_id = a.account_id AND ap.local_day = d.local_day
WHERE d.local_day IS NOT NULL;

-- Account health / completion (B5 #2) — the three-way failure distinction.
CREATE OR REPLACE VIEW public.v_account_health AS
SELECT
  x.*,
  CASE
    WHEN delivered_leads = 0 THEN 'no_leads_delivered'::public.account_health_status
    WHEN dials = 0 OR contacts_dialed < delivered_leads THEN 'leads_not_worked'::public.account_health_status
    WHEN appointments_set = 0 THEN 'worked_no_appointments'::public.account_health_status
    ELSE 'complete'::public.account_health_status
  END AS status,
  (delivered_leads > 0 AND contacts_dialed >= delivered_leads) AS complete,
  CASE WHEN delivered_leads > 0
       THEN least(1.0, contacts_dialed::numeric / delivered_leads) ELSE 0 END AS completion_rate
FROM public.v_account_daily x;

-- Speed-to-lead (§4/§6). staffed-hours refinement is applied in the app layer;
-- this exposes raw minutes + the >5 min breach flag.
CREATE OR REPLACE VIEW public.v_speed_to_lead AS
SELECT
  l.contact_id, l.account_id, a.client_name,
  l.created_at, l.first_dial_at,
  CASE WHEN l.first_dial_at IS NOT NULL
       THEN round(extract(epoch FROM (l.first_dial_at - l.created_at)) / 60.0)
       END AS minutes_to_first_dial,
  (l.first_dial_at IS NOT NULL
     AND extract(epoch FROM (l.first_dial_at - l.created_at)) / 60.0 > 5) AS is_breach
FROM public.fact_lead l JOIN public.dim_account a ON a.account_id = l.account_id;

-- =====================================================================
-- RLS — admins manage; authenticated users read (internal tool). NO anon
-- grants (unlike the legacy `leads` table). Sync uses the service role.
-- =====================================================================
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'dim_account','dim_setter','fact_call','fact_lead','fact_appointment',
    'sync_state','sync_runs','account_alerts'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (true);',
      t||'_read', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL USING (has_role(auth.uid(),''admin''::app_role)) WITH CHECK (has_role(auth.uid(),''admin''::app_role));',
      t||'_admin', t);
  END LOOP;
END $$;
