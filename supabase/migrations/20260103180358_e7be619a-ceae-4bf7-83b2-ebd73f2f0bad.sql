-- Add member_id and is_active columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS member_id text UNIQUE,
ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

-- Create index for fast member_id lookups
CREATE INDEX IF NOT EXISTS idx_profiles_member_id ON public.profiles(member_id);

-- Drop existing RLS policies on profiles that we'll replace
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create new policies for open access by member_id (public read for lookup)
CREATE POLICY "Anyone can lookup member by member_id" 
ON public.profiles 
FOR SELECT 
USING (member_id IS NOT NULL AND is_active = true);

-- Keep admin policy for full access
-- (Admins can view all profiles policy already exists)

-- Admins can insert profiles (for adding new members)
CREATE POLICY "Admins can insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update any profile
CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete profiles
CREATE POLICY "Admins can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update sales table RLS to allow access based on profile lookup
-- First, add profile_id column to sales for member-based access
ALTER TABLE public.sales 
ADD COLUMN IF NOT EXISTS profile_id uuid REFERENCES public.profiles(id);

-- Create index for profile_id lookups
CREATE INDEX IF NOT EXISTS idx_sales_profile_id ON public.sales(profile_id);

-- Add policy for members to view their own sales by profile_id
CREATE POLICY "Members can view their own sales by profile" 
ON public.sales 
FOR SELECT 
USING (profile_id IS NOT NULL);

-- Add policy for members to insert their own sales
CREATE POLICY "Anyone can insert sales with profile_id" 
ON public.sales 
FOR INSERT 
WITH CHECK (profile_id IS NOT NULL);

-- Add policy for members to update their own sales by profile_id
CREATE POLICY "Anyone can update sales with matching profile_id" 
ON public.sales 
FOR UPDATE 
USING (profile_id IS NOT NULL);

-- Add policy for members to delete their own sales by profile_id  
CREATE POLICY "Anyone can delete sales with matching profile_id" 
ON public.sales 
FOR DELETE 
USING (profile_id IS NOT NULL);