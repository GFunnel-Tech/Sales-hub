-- Banner slides table for role/division-adaptive banners
CREATE TABLE public.banner_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID,
  division_id UUID,
  audience TEXT NOT NULL DEFAULT 'all', -- 'all' | 'admin' | 'setter' | 'closer' | 'salesperson'
  placement TEXT NOT NULL DEFAULT 'home', -- 'home' | 'sales_hub' | 'marketing'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cta_label TEXT NOT NULL DEFAULT 'Learn More',
  cta_href TEXT NOT NULL DEFAULT '/',
  icon TEXT NOT NULL DEFAULT 'Sparkles', -- lucide icon name
  gradient TEXT NOT NULL DEFAULT 'from-violet-600 via-purple-500 to-fuchsia-500',
  accent_gradient TEXT NOT NULL DEFAULT 'from-pink-400 via-orange-300 to-yellow-400',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.banner_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active banner slides"
ON public.banner_slides FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins manage banner slides"
ON public.banner_slides FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_banner_slides_updated_at
BEFORE UPDATE ON public.banner_slides
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_banner_slides_lookup ON public.banner_slides (placement, audience, is_active, sort_order);