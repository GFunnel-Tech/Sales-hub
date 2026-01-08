-- Create blueprint_sessions table for the 9-page sales flow
CREATE TABLE public.blueprint_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  agent_profile_id UUID REFERENCES public.profiles(id),
  
  -- Page 1: Prospect Info (Handshake)
  prospect_name TEXT NOT NULL,
  prospect_email TEXT,
  prospect_company TEXT,
  prospect_industry TEXT,
  
  -- Page 2: Dream State Responses
  dream_state_responses JSONB DEFAULT '[]'::jsonb,
  
  -- Page 3: Pain Point Responses
  pain_point_responses JSONB DEFAULT '[]'::jsonb,
  
  -- Page 4: Bridge Understanding
  bridge_understanding TEXT,
  
  -- Page 5: Qualification
  qualification_answers JSONB DEFAULT '[]'::jsonb,
  qualification_score INTEGER DEFAULT 0,
  is_qualified BOOLEAN DEFAULT false,
  
  -- Page 6: Discovery Canvas
  canvas_image_url TEXT,
  canvas_json JSONB,
  canvas_notes TEXT,
  
  -- Page 7: Presentation
  generated_scope TEXT,
  scope_url TEXT,
  prototype_url TEXT,
  
  -- Page 8: Pricing Selection
  selected_plan TEXT,
  custom_request TEXT,
  
  -- Page 9: Completion
  recording_url TEXT,
  agent_notes TEXT,
  disposition TEXT,
  follow_up_date DATE,
  
  -- Metadata
  current_page INTEGER DEFAULT 1,
  status TEXT DEFAULT 'in_progress',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.blueprint_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view sessions linked to their profile
CREATE POLICY "Users can view their own sessions"
ON public.blueprint_sessions
FOR SELECT
USING (agent_profile_id IS NOT NULL);

-- Policy: Users can create sessions
CREATE POLICY "Users can create sessions"
ON public.blueprint_sessions
FOR INSERT
WITH CHECK (agent_profile_id IS NOT NULL);

-- Policy: Users can update their own sessions
CREATE POLICY "Users can update their own sessions"
ON public.blueprint_sessions
FOR UPDATE
USING (agent_profile_id IS NOT NULL);

-- Policy: Admins can view all sessions
CREATE POLICY "Admins can view all sessions"
ON public.blueprint_sessions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Policy: Admins can manage all sessions
CREATE POLICY "Admins can manage all sessions"
ON public.blueprint_sessions
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at trigger
CREATE TRIGGER update_blueprint_sessions_updated_at
BEFORE UPDATE ON public.blueprint_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();