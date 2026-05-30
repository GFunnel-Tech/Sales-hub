-- Link profiles to organizations and ensure user_id uniqueness for upserts
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS org_id uuid,
  ADD COLUMN IF NOT EXISTS gfunnel_user_profile_id text;

-- One profile per auth user
CREATE UNIQUE INDEX IF NOT EXISTS profiles_user_id_unique ON public.profiles(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS profiles_gfunnel_user_profile_id_unique
  ON public.profiles(gfunnel_user_profile_id)
  WHERE gfunnel_user_profile_id IS NOT NULL;

-- Allow self-read of org_id (already covered by "Users can view own profile")
-- Ensure user_roles unique per (user_id, role) for upsert
CREATE UNIQUE INDEX IF NOT EXISTS user_roles_user_role_unique ON public.user_roles(user_id, role);