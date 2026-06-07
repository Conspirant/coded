-- Migration: Create coping_hugs table for real-time virtual hugs and copium
CREATE TABLE IF NOT EXISTS public.coping_hugs (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.coping_hugs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (anyone sending a hug)
DROP POLICY IF EXISTS "Anyone can insert coping hugs" ON public.coping_hugs;
CREATE POLICY "Anyone can insert coping hugs" ON public.coping_hugs 
    FOR INSERT 
    WITH CHECK (true);

-- Allow everyone to view hugs (to fetch the count)
DROP POLICY IF EXISTS "Anyone can view coping hugs" ON public.coping_hugs;
CREATE POLICY "Anyone can view coping hugs" ON public.coping_hugs 
    FOR SELECT 
    USING (true);

-- Enable realtime for the coping_hugs table
BEGIN;
    DROP PUBLICATION IF EXISTS supabase_realtime;
    CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE public.coping_hugs;
