-- Migration: Create user_suggestions table for collecting user doubts and feedback
CREATE TABLE IF NOT EXISTS public.user_suggestions (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    suggestion  TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_suggestions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (anyone visiting the resource limit page)
DROP POLICY IF EXISTS "Anyone can insert suggestions" ON public.user_suggestions;
CREATE POLICY "Anyone can insert suggestions" ON public.user_suggestions 
    FOR INSERT 
    WITH CHECK (true);

-- Allow admins/users to view suggestions
DROP POLICY IF EXISTS "Anyone can view suggestions" ON public.user_suggestions;
CREATE POLICY "Anyone can view suggestions" ON public.user_suggestions 
    FOR SELECT 
    USING (true);

-- Allow admins/users to delete suggestions
DROP POLICY IF EXISTS "Anyone can delete suggestions" ON public.user_suggestions;
CREATE POLICY "Anyone can delete suggestions" ON public.user_suggestions 
    FOR DELETE 
    USING (true);
