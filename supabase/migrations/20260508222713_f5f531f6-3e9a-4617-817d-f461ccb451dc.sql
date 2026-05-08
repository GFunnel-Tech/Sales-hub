
-- ORGANIZATIONS
CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  logo_url text,
  brand_primary_color text,
  brand_secondary_color text,
  industry text,
  website text,
  auth_mode text NOT NULL DEFAULT 'member_id',
  setup_completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage organizations" ON public.organizations
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view organizations" ON public.organizations
  FOR SELECT USING (true);

CREATE TRIGGER update_organizations_updated_at
BEFORE UPDATE ON public.organizations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- DIVISIONS
CREATE TABLE public.divisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'sales',
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.divisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage divisions" ON public.divisions
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view divisions" ON public.divisions
  FOR SELECT USING (true);

CREATE TRIGGER update_divisions_updated_at
BEFORE UPDATE ON public.divisions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- TRAININGS
CREATE TABLE public.trainings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  division_id uuid REFERENCES public.divisions(id) ON DELETE SET NULL,
  title text NOT NULL,
  content text,
  video_url text,
  attachments jsonb DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage trainings" ON public.trainings
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view active trainings" ON public.trainings
  FOR SELECT USING (is_active = true);

CREATE TRIGGER update_trainings_updated_at
BEFORE UPDATE ON public.trainings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- DISPOSITIONS
CREATE TABLE public.dispositions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  division_id uuid REFERENCES public.divisions(id) ON DELETE SET NULL,
  label text NOT NULL,
  outcome_type text NOT NULL DEFAULT 'neutral',
  follow_up_days integer,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.dispositions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage dispositions" ON public.dispositions
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Anyone can view active dispositions" ON public.dispositions
  FOR SELECT USING (is_active = true);

CREATE TRIGGER update_dispositions_updated_at
BEFORE UPDATE ON public.dispositions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SETUP INVITES
CREATE TABLE public.setup_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE,
  label text,
  org_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  created_by uuid,
  expires_at timestamptz,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.setup_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage invites" ON public.setup_invites
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Augment scripts with org/division
ALTER TABLE public.scripts
  ADD COLUMN IF NOT EXISTS org_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS division_id uuid REFERENCES public.divisions(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_scripts_org ON public.scripts(org_id);
CREATE INDEX IF NOT EXISTS idx_divisions_org ON public.divisions(org_id);
CREATE INDEX IF NOT EXISTS idx_trainings_org ON public.trainings(org_id);
CREATE INDEX IF NOT EXISTS idx_dispositions_org ON public.dispositions(org_id);
