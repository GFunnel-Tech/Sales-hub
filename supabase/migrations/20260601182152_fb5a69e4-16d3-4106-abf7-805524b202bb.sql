
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid,
  agent text,
  date_contacted date,
  outcome text,
  notes text,
  lead_name text,
  last_point_of_contact text,
  interested text,
  appointment_booked boolean DEFAULT false,
  time_zone text,
  ghl_link text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT SELECT ON public.leads TO anon;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view leads"
  ON public.leads FOR SELECT
  USING (true);

CREATE POLICY "Admins manage leads"
  ON public.leads FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.lead_edits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  field text NOT NULL,
  old_value text,
  new_value text,
  edited_by_profile_id uuid,
  edited_by_label text,
  edited_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.lead_edits TO authenticated;
GRANT SELECT ON public.lead_edits TO anon;
GRANT ALL ON public.lead_edits TO service_role;

ALTER TABLE public.lead_edits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lead edits"
  ON public.lead_edits FOR SELECT
  USING (true);

CREATE POLICY "Admins manage lead edits"
  ON public.lead_edits FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_lead_edits_lead_id ON public.lead_edits(lead_id);
CREATE INDEX idx_lead_edits_edited_at ON public.lead_edits(edited_at DESC);
