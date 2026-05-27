
-- 1. Add must_change_password flag
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS must_change_password boolean NOT NULL DEFAULT false;

-- 2. Allow users to update their own profile (so they can clear the flag)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- 3. Create the admin auth user (idempotent)
DO $$
DECLARE
  new_user_id uuid;
  existing_user_id uuid;
BEGIN
  SELECT id INTO existing_user_id FROM auth.users WHERE email = 'admin@gfunnel.com';

  IF existing_user_id IS NULL THEN
    new_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change,
      email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      'admin@gfunnel.com',
      crypt('Admin123$', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Super Admin"}'::jsonb,
      now(), now(), '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, identity_data, provider, provider_id,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(),
      new_user_id,
      jsonb_build_object('sub', new_user_id::text, 'email', 'admin@gfunnel.com', 'email_verified', true),
      'email',
      new_user_id::text,
      now(), now(), now()
    );

    existing_user_id := new_user_id;
  END IF;

  -- Ensure profile exists with must_change_password = true
  INSERT INTO public.profiles (user_id, full_name, email, must_change_password)
  VALUES (existing_user_id, 'Super Admin', 'admin@gfunnel.com', true)
  ON CONFLICT (user_id) DO UPDATE
    SET must_change_password = true,
        full_name = COALESCE(public.profiles.full_name, 'Super Admin');

  -- Ensure admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (existing_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;
