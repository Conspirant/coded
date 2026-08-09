-- ━━━ SITE VISITS TABLE FOR REALTIME VISITOR COUNTER ━━━

CREATE TABLE IF NOT EXISTS public.site_visits (
    id         TEXT PRIMARY KEY DEFAULT 'total_visits',
    count      BIGINT NOT NULL DEFAULT 51783,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial baseline row if missing
INSERT INTO public.site_visits (id, count)
VALUES ('total_visits', 51783)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to site_visits" 
ON public.site_visits FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow public update access
CREATE POLICY "Allow public update access to site_visits" 
ON public.site_visits FOR UPDATE 
TO anon, authenticated 
USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access to site_visits" 
ON public.site_visits FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Atomic increment stored function
CREATE OR REPLACE FUNCTION public.increment_site_visits()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_count BIGINT;
BEGIN
    INSERT INTO public.site_visits (id, count, updated_at)
    VALUES ('total_visits', 51784, NOW())
    ON CONFLICT (id) DO UPDATE 
    SET count = public.site_visits.count + 1,
        updated_at = NOW()
    RETURNING count INTO new_count;

    RETURN new_count;
END;
$$;

-- Enable publication for Supabase Realtime
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.site_visits;
    END IF;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;
