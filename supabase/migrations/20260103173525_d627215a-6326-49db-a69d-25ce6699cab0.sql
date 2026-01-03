-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'salesperson');

-- Create enum for dispositions
CREATE TYPE public.disposition_type AS ENUM (
  'sold',
  'no_sale',
  'callback',
  'no_answer',
  'not_interested',
  'needs_followup',
  'sent_info',
  'scheduled_demo',
  'left_voicemail'
);

-- Create enum for sales stages
CREATE TYPE public.sales_stage AS ENUM (
  'handshake_authority',
  'dream_pain_bridge',
  'discovery',
  'presentation',
  'ask_objections',
  'ask_order',
  'handoff'
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'salesperson',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create scripts table
CREATE TABLE public.scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  content JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create script_requests table
CREATE TABLE public.script_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  product_description TEXT,
  target_audience TEXT,
  key_benefits TEXT,
  common_objections TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sales table (CRM-style)
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Customer info
  customer_first_name TEXT NOT NULL,
  customer_last_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  customer_city TEXT,
  customer_state TEXT,
  customer_zip TEXT,
  customer_country TEXT DEFAULT 'USA',
  
  -- Sale info
  product_service TEXT NOT NULL,
  sale_amount DECIMAL(10,2),
  disposition disposition_type NOT NULL,
  closed_at_stage sales_stage,
  
  -- Call info
  call_type TEXT, -- phone, webinar, live_meeting
  call_duration_minutes INTEGER,
  meeting_link TEXT,
  
  -- Notes & follow-up
  notes TEXT,
  objections_handled TEXT,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  follow_up_notes TEXT,
  
  -- Metadata
  script_used UUID REFERENCES public.scripts(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.script_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Scripts policies (everyone can read active scripts)
CREATE POLICY "Anyone can view active scripts"
  ON public.scripts FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage scripts"
  ON public.scripts FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Script requests policies
CREATE POLICY "Users can view their own requests"
  ON public.script_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create requests"
  ON public.script_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all requests"
  ON public.script_requests FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Sales policies
CREATE POLICY "Users can view their own sales"
  ON public.sales FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sales"
  ON public.sales FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sales"
  ON public.sales FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sales"
  ON public.sales FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sales"
  ON public.sales FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email
  );
  
  -- Assign default salesperson role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'salesperson');
  
  RETURN new;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scripts_updated_at
  BEFORE UPDATE ON public.scripts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_script_requests_updated_at
  BEFORE UPDATE ON public.script_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sales_updated_at
  BEFORE UPDATE ON public.sales
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert a default sales script
INSERT INTO public.scripts (title, description, category, content) VALUES (
  'Universal Sales Script',
  'A comprehensive 7-step sales process script that works for any product or service',
  'General',
  '[
    {
      "stage": "handshake_authority",
      "title": "Handshake & Authority",
      "prompts": [
        "Introduce yourself and your company",
        "Establish credibility - mention experience, results, or credentials",
        "Build rapport - find common ground",
        "Set the agenda for the call"
      ],
      "tips": "Be confident but warm. People buy from people they trust."
    },
    {
      "stage": "dream_pain_bridge",
      "title": "Dream / Pain / Bridge",
      "prompts": [
        "Ask about their ideal outcome - What would success look like?",
        "Uncover their pain points - What''s not working currently?",
        "Bridge the gap - Show how you can help them get from pain to dream"
      ],
      "tips": "Let them talk 80% of the time. Listen actively and take notes."
    },
    {
      "stage": "discovery",
      "title": "Discovery",
      "prompts": [
        "What have they tried before?",
        "What''s their timeline for making a decision?",
        "Who else is involved in the decision?",
        "What''s their budget range?",
        "What would happen if they don''t solve this problem?"
      ],
      "tips": "Use open-ended questions. Dig deeper with ''Tell me more about that...''"
    },
    {
      "stage": "presentation",
      "title": "Presentation",
      "prompts": [
        "Present your solution tailored to their specific pain points",
        "Show relevant case studies or testimonials",
        "Explain the process and what they can expect",
        "Highlight the transformation and outcomes"
      ],
      "tips": "Focus on benefits, not features. Paint a picture of their future with your solution."
    },
    {
      "stage": "ask_objections",
      "title": "Ask for Objections",
      "prompts": [
        "Before we move forward, do you have any questions about what we covered?",
        "What concerns, if any, do you have?",
        "Is there anything that would prevent you from moving forward today?"
      ],
      "tips": "Welcome objections - they show engagement. Address each one fully before moving on."
    },
    {
      "stage": "ask_order",
      "title": "Ask for the Order",
      "prompts": [
        "Based on everything we discussed, are you ready to get started?",
        "Which package/option works best for you?",
        "Let''s get you set up - I just need a few details..."
      ],
      "tips": "Be direct but not pushy. Assume the sale. Silence after asking is okay."
    },
    {
      "stage": "handoff",
      "title": "Handoff",
      "prompts": [
        "Review what they purchased and next steps",
        "Provide necessary disclosures",
        "Schedule onboarding/setup call",
        "Introduce them to their point of contact",
        "Thank them and confirm contact information"
      ],
      "tips": "Make them feel confident about their decision. Set clear expectations."
    }
  ]'::jsonb
);