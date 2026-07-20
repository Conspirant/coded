-- Migration: Create donors table for the supporters wall
CREATE TABLE IF NOT EXISTS public.donors (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    display_name    TEXT NOT NULL DEFAULT 'Anonymous',
    amount_inr      NUMERIC(10, 2) NOT NULL DEFAULT 0,
    is_anonymous    BOOLEAN NOT NULL DEFAULT true,
    payment_id      TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (from the payment flow)
DROP POLICY IF EXISTS "Anyone can insert donors" ON public.donors;
CREATE POLICY "Anyone can insert donors" ON public.donors 
    FOR INSERT 
    WITH CHECK (true);

-- Allow anyone to view donors (public supporters wall)
DROP POLICY IF EXISTS "Anyone can view donors" ON public.donors;
CREATE POLICY "Anyone can view donors" ON public.donors 
    FOR SELECT 
    USING (true);
