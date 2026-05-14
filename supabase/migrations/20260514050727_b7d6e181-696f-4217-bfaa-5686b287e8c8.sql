CREATE TABLE public.sales_phases (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid NULL,
  phase_key text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  title text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  script_blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  hints jsonb NOT NULL DEFAULT '{}'::jsonb,
  objections jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT sales_phases_org_phase_unique UNIQUE (org_id, phase_key)
);

ALTER TABLE public.sales_phases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active sales phases"
  ON public.sales_phases FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins manage sales phases"
  ON public.sales_phases FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_sales_phases_updated_at
  BEFORE UPDATE ON public.sales_phases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_sales_phases_sort ON public.sales_phases (org_id, sort_order);