-- Migration: Create access_codes table for sharing premium access once across devices
CREATE TABLE IF NOT EXISTS public.access_codes (
    code          TEXT PRIMARY KEY,
    is_used       BOOLEAN NOT NULL DEFAULT false,
    payment_id    TEXT,
    used_at       TIMESTAMPTZ,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

-- Allow insert from public (when payment succeeds on frontend)
DROP POLICY IF EXISTS "Anyone can insert access codes" ON public.access_codes;
CREATE POLICY "Anyone can insert access codes" ON public.access_codes 
    FOR INSERT 
    WITH CHECK (true);

-- Allow select/read by anyone (to validate if a code exists and is unused)
DROP POLICY IF EXISTS "Anyone can view access codes" ON public.access_codes;
CREATE POLICY "Anyone can view access codes" ON public.access_codes 
    FOR SELECT 
    USING (true);

-- Allow updates (to mark a code as used)
DROP POLICY IF EXISTS "Anyone can update access codes" ON public.access_codes;
CREATE POLICY "Anyone can update access codes" ON public.access_codes 
    FOR UPDATE 
    USING (true)
    WITH CHECK (true);

-- Allow delete (to remove access codes from admin panel)
DROP POLICY IF EXISTS "Anyone can delete access codes" ON public.access_codes;
CREATE POLICY "Anyone can delete access codes" ON public.access_codes 
    FOR DELETE 
    USING (true);
