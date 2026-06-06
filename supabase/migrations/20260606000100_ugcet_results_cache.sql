-- Migration: Create ugcet_results_cache table for caching live KEA results
CREATE TABLE IF NOT EXISTS public.ugcet_results_cache (
    appl_no        TEXT PRIMARY KEY,
    dob            TEXT NOT NULL,
    name           TEXT NOT NULL,
    results_json   JSONB NOT NULL,
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.ugcet_results_cache ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (anyone saving a fetched result)
DROP POLICY IF EXISTS "Anyone can insert results cache" ON public.ugcet_results_cache;
CREATE POLICY "Anyone can insert results cache" ON public.ugcet_results_cache 
    FOR INSERT 
    WITH CHECK (true);

-- Allow everyone to view cached results
DROP POLICY IF EXISTS "Anyone can view cached results" ON public.ugcet_results_cache;
CREATE POLICY "Anyone can view cached results" ON public.ugcet_results_cache 
    FOR SELECT 
    USING (true);

-- Allow anonymous updates (for upsert/cache refresh)
DROP POLICY IF EXISTS "Anyone can update results cache" ON public.ugcet_results_cache;
CREATE POLICY "Anyone can update results cache" ON public.ugcet_results_cache 
    FOR UPDATE 
    USING (true)
    WITH CHECK (true);

-- Allow anonymous deletes (for cache cleanup of invalid entries)
DROP POLICY IF EXISTS "Anyone can delete results cache" ON public.ugcet_results_cache;
CREATE POLICY "Anyone can delete results cache" ON public.ugcet_results_cache 
    FOR DELETE 
    USING (true);
