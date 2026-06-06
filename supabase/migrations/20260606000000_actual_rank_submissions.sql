-- Migration: Create actual_rank_submissions table for crowd-sourcing marks vs rank vs aggregate percentage
CREATE TABLE IF NOT EXISTS public.actual_rank_submissions (
    id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    kcet_marks     DECIMAL(5,2) NOT NULL,
    puc_aggregate  DECIMAL(5,2) NOT NULL,
    puc_board      TEXT NOT NULL, -- e.g. 'State Board', 'CBSE', 'ISC', 'Other'
    actual_rank    INTEGER NOT NULL,
    category       TEXT,
    year           INTEGER NOT NULL DEFAULT 2026,
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.actual_rank_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (anyone submitting their rank card)
DROP POLICY IF EXISTS "Anyone can insert rank submissions" ON public.actual_rank_submissions;
CREATE POLICY "Anyone can insert rank submissions" ON public.actual_rank_submissions 
    FOR INSERT 
    WITH CHECK (true);

-- Allow everyone to view submissions (for visual graphs/predictors)
DROP POLICY IF EXISTS "Anyone can view rank submissions" ON public.actual_rank_submissions;
CREATE POLICY "Anyone can view rank submissions" ON public.actual_rank_submissions 
    FOR SELECT 
    USING (true);

-- Allow deletions/modifications (broadly enabled for simplicity, or we can restrict it if needed)
DROP POLICY IF EXISTS "Anyone can delete rank submissions" ON public.actual_rank_submissions;
CREATE POLICY "Anyone can delete rank submissions" ON public.actual_rank_submissions 
    FOR DELETE 
    USING (true);
