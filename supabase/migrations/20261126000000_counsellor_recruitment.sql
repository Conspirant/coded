-- Migration: Level-by-level 1-on-1 counselling member recruitment & verification
CREATE TABLE IF NOT EXISTS public.counsellor_applications (
    id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name           TEXT NOT NULL,
    email               TEXT NOT NULL,
    phone_number        TEXT,
    contact_handle      TEXT NOT NULL,
    college_name        TEXT NOT NULL,
    branch              TEXT NOT NULL,
    current_status      TEXT NOT NULL,
    exam_quota          TEXT NOT NULL DEFAULT 'KCET',
    entrance_rank       INTEGER,
    admission_year      INTEGER,
    bio                 TEXT,
    topics              TEXT[] NOT NULL DEFAULT '{}',
    languages           TEXT[] NOT NULL DEFAULT '{"English"}',
    highlight_badge     TEXT,
    weekly_availability TEXT NOT NULL,
    expected_earning    TEXT,
    session_modes       TEXT[] NOT NULL DEFAULT '{}',
    booking_url         TEXT,
    linkedin_url        TEXT,
    motivation          TEXT,
    wants_one_on_one    BOOLEAN NOT NULL DEFAULT TRUE,

    -- Level-by-level verification state:
    -- 0 = Applied (Pending), 1 = L1 Identity & College Verified,
    -- 2 = L2 Counselling & Rules Verified (1-on-1 eligible), 3 = L3 Lead Counsellor
    verification_level  INTEGER NOT NULL DEFAULT 0 CHECK (verification_level BETWEEN 0 AND 3),
    status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
    l1_proof_url        TEXT,
    l1_verified_at      TIMESTAMPTZ,
    l2_quiz_answers     JSONB,
    l2_quiz_score       INTEGER,
    l2_quiz_total       INTEGER,
    l2_verified_at      TIMESTAMPTZ,
    l3_promoted_at      TIMESTAMPTZ,
    sessions_completed  INTEGER NOT NULL DEFAULT 0,
    admin_notes         TEXT,
    agreed_to_guidelines BOOLEAN NOT NULL DEFAULT FALSE,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_counsellor_status_level
    ON public.counsellor_applications (status, verification_level DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_counsellor_college
    ON public.counsellor_applications (college_name);

ALTER TABLE public.counsellor_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit counsellor application" ON public.counsellor_applications;
CREATE POLICY "Anyone can submit counsellor application" ON public.counsellor_applications
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view counsellor applications" ON public.counsellor_applications;
CREATE POLICY "Anyone can view counsellor applications" ON public.counsellor_applications
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Anyone can update counsellor applications" ON public.counsellor_applications;
CREATE POLICY "Anyone can update counsellor applications" ON public.counsellor_applications
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can delete counsellor applications" ON public.counsellor_applications;
CREATE POLICY "Anyone can delete counsellor applications" ON public.counsellor_applications
    FOR DELETE
    USING (true);

-- Ensure phone_number and expected_earning columns exist if table was created before this update
ALTER TABLE public.counsellor_applications
    ADD COLUMN IF NOT EXISTS phone_number TEXT,
    ADD COLUMN IF NOT EXISTS expected_earning TEXT;

-- Storage bucket for L1 ID / allotment proof uploads (images & PDFs)
INSERT INTO storage.buckets (id, name, public)
VALUES ('counsellor-proofs', 'counsellor-proofs', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Anyone can upload counsellor proofs" ON storage.objects;
CREATE POLICY "Anyone can upload counsellor proofs" ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'counsellor-proofs');

DROP POLICY IF EXISTS "Anyone can view counsellor proofs" ON storage.objects;
CREATE POLICY "Anyone can view counsellor proofs" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'counsellor-proofs');
