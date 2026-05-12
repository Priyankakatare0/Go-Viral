-- Virality Analyses Table
CREATE TABLE IF NOT EXISTS public.virality_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'image')),
  file_url TEXT NOT NULL,
  caption TEXT,
  virality_score INTEGER NOT NULL CHECK (virality_score >= 0 AND virality_score <= 100),
  
  -- Analysis breakdown (0-25 each)
  hook_score INTEGER DEFAULT 0 CHECK (hook_score >= 0 AND hook_score <= 25),
  pacing_score INTEGER DEFAULT 0 CHECK (pacing_score >= 0 AND pacing_score <= 25),
  thumbnail_score INTEGER DEFAULT 0 CHECK (thumbnail_score >= 0 AND thumbnail_score <= 25),
  caption_score INTEGER DEFAULT 0 CHECK (caption_score >= 0 AND caption_score <= 25),
  
  -- Detailed analysis (JSON)
  hook_analysis JSONB DEFAULT '{}',
  caption_suggestions JSONB DEFAULT '{}',
  trending_recommendations JSONB DEFAULT '{}',
  competitor_comparison JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.virality_analyses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own analyses
CREATE POLICY "Users can view their own analyses"
  ON public.virality_analyses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own analyses
CREATE POLICY "Users can insert their own analyses"
  ON public.virality_analyses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own analyses
CREATE POLICY "Users can delete their own analyses"
  ON public.virality_analyses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for fast queries
CREATE INDEX idx_virality_analyses_user_id ON public.virality_analyses(user_id);
CREATE INDEX idx_virality_analyses_created_at ON public.virality_analyses(created_at DESC);
CREATE INDEX idx_virality_analyses_score ON public.virality_analyses(virality_score DESC);