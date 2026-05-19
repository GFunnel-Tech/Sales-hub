ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS manager_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_manager_id ON public.profiles(manager_id);

-- Allow a manager (matched via their auth user_id -> profile.id) to view reps assigned to them
CREATE POLICY "Managers can view their reps"
  ON public.profiles
  FOR SELECT
  USING (
    manager_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );