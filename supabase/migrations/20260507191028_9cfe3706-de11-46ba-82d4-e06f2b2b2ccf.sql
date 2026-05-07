
-- Drop loose policies on sales
DROP POLICY IF EXISTS "Members can view their own sales by profile" ON public.sales;
DROP POLICY IF EXISTS "Anyone can insert sales with profile_id" ON public.sales;
DROP POLICY IF EXISTS "Anyone can update sales with matching profile_id" ON public.sales;
DROP POLICY IF EXISTS "Anyone can delete sales with matching profile_id" ON public.sales;

-- Drop loose policies on blueprint_sessions
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.blueprint_sessions;
DROP POLICY IF EXISTS "Users can create sessions" ON public.blueprint_sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON public.blueprint_sessions;

-- Note: existing strict policies remain:
--   sales: "Users can view/create/update/delete their own sales" (auth.uid() = user_id)
--          "Admins can view all sales"
--   blueprint_sessions: "Admins can manage all sessions" / "Admins can view all sessions"
-- Service role bypasses RLS for edge function access.
