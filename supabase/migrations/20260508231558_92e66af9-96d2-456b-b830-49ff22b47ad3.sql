
CREATE TABLE public.commission_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID,
  role TEXT NOT NULL UNIQUE,
  rate_percent NUMERIC NOT NULL DEFAULT 10,
  flat_bonus NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.commission_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active commission rules"
  ON public.commission_rules FOR SELECT USING (is_active = true);

CREATE POLICY "Admins manage commission rules"
  ON public.commission_rules FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER commission_rules_updated_at
  BEFORE UPDATE ON public.commission_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.commission_rules (role, rate_percent, notes) VALUES
  ('closer', 20, 'Default closer commission'),
  ('setter', 10, 'Default setter commission for booked appointments'),
  ('salesperson', 15, 'Default rate for general salespeople');

CREATE TABLE public.payout_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_details TEXT,
  notes TEXT,
  admin_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage payout requests"
  ON public.payout_requests FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER payout_requests_updated_at
  BEFORE UPDATE ON public.payout_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_payout_requests_profile ON public.payout_requests(profile_id);
CREATE INDEX idx_payout_requests_status ON public.payout_requests(status);
