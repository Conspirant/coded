-- Migration: Create college_suggestions table for collecting structured user suggestions
CREATE TABLE IF NOT EXISTS public.college_suggestions (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    college_code    TEXT NOT NULL,
    suggested_data  JSONB NOT NULL,
    current_data    JSONB NOT NULL,
    status          TEXT NOT NULL DEFAULT 'pending',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.college_suggestions ENABLE ROW LEVEL SECURITY;

-- Allow insert by public (anyone can suggest edits)
DROP POLICY IF EXISTS "Anyone can insert college suggestions" ON public.college_suggestions;
CREATE POLICY "Anyone can insert college suggestions" ON public.college_suggestions 
    FOR INSERT 
    WITH CHECK (true);

-- Allow select by anyone (to display or review suggestions)
DROP POLICY IF EXISTS "Anyone can view college suggestions" ON public.college_suggestions;
CREATE POLICY "Anyone can view college suggestions" ON public.college_suggestions 
    FOR SELECT 
    USING (true);

-- Allow admin update (to approve/reject suggestions)
DROP POLICY IF EXISTS "Anyone can update college suggestions" ON public.college_suggestions;
CREATE POLICY "Anyone can update college suggestions" ON public.college_suggestions 
    FOR UPDATE 
    USING (true)
    WITH CHECK (true);
