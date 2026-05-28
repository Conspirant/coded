-- ╔══════════════════════════════════════════════════════════════╗
-- ║  KCET Coded — Tables Only (enums already exist)            ║
-- ║  Paste into Supabase SQL Editor → Run                      ║
-- ╚══════════════════════════════════════════════════════════════╝

-- ━━━ TABLES (IF NOT EXISTS) ━━━

CREATE TABLE IF NOT EXISTS public.users (
    id             UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email          TEXT NOT NULL,
    full_name      TEXT,
    phone          TEXT,
    category       category_type,
    expected_rank  INTEGER,
    marks          INTEGER,
    subject_marks  JSONB,
    preferences    TEXT[],
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.colleges (
    id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code             TEXT UNIQUE NOT NULL,
    name             TEXT NOT NULL,
    location         TEXT,
    district         TEXT,
    type             TEXT,
    established_year INTEGER,
    website          TEXT,
    fees_structure   JSONB,
    facilities       JSONB,
    placement_stats  JSONB,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.branches (
    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code       TEXT UNIQUE NOT NULL,
    name       TEXT NOT NULL,
    category   TEXT,
    duration   INTEGER DEFAULT 4,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cutoffs (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    college_id      UUID REFERENCES public.colleges(id) NOT NULL,
    branch_id       UUID REFERENCES public.branches(id) NOT NULL,
    year            INTEGER NOT NULL,
    round           INTEGER DEFAULT 1,
    category        category_type NOT NULL,
    seat_type       seat_type NOT NULL,
    quota_type      quota_type DEFAULT 'general',
    opening_rank    INTEGER,
    closing_rank    INTEGER NOT NULL,
    seats_available INTEGER,
    source_url      TEXT,
    verified        BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(college_id, branch_id, year, round, category, seat_type, quota_type)
);

CREATE TABLE IF NOT EXISTS public.college_reviews (
    id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    college_id            UUID REFERENCES public.colleges(id) NOT NULL,
    user_id               UUID REFERENCES public.users(id),
    session_id            TEXT,
    rating                INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text           TEXT,
    faculty_rating        INTEGER CHECK (faculty_rating >= 1 AND faculty_rating <= 5),
    infrastructure_rating INTEGER CHECK (infrastructure_rating >= 1 AND infrastructure_rating <= 5),
    placements_rating     INTEGER CHECK (placements_rating >= 1 AND placements_rating <= 5),
    verified              BOOLEAN DEFAULT FALSE,
    helpful_votes         INTEGER DEFAULT 0,
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.college_comments (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    college_id  UUID REFERENCES public.colleges(id) NOT NULL,
    user_id     TEXT NOT NULL,
    content     TEXT NOT NULL,
    parent_id   UUID REFERENCES public.college_comments(id),
    upvotes     INTEGER DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.rank_predictions (
    id                 UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id            UUID REFERENCES public.users(id),
    marks              INTEGER NOT NULL,
    subject_marks      JSONB,
    category           category_type NOT NULL,
    predicted_rank_min INTEGER NOT NULL,
    predicted_rank_max INTEGER NOT NULL,
    confidence_score   DECIMAL(3,2),
    year               INTEGER NOT NULL,
    created_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mock_simulations (
    id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id           UUID REFERENCES public.users(id),
    rank              INTEGER NOT NULL,
    category          category_type NOT NULL,
    preferences       JSONB NOT NULL,
    simulation_result JSONB,
    round_results     JSONB,
    created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.seat_matrix (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    college_id      UUID REFERENCES public.colleges(id) NOT NULL,
    branch_id       UUID REFERENCES public.branches(id) NOT NULL,
    year            INTEGER NOT NULL,
    category        category_type NOT NULL,
    quota_type      quota_type DEFAULT 'general',
    seats_total     INTEGER NOT NULL,
    seats_filled    INTEGER DEFAULT 0,
    seats_remaining INTEGER GENERATED ALWAYS AS (seats_total - seats_filled) STORED,
    last_updated    TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(college_id, branch_id, year, category, quota_type)
);

CREATE TABLE IF NOT EXISTS public.notification_subscriptions (
    id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id           UUID REFERENCES public.users(id) NOT NULL,
    subscription_type TEXT NOT NULL,
    filters           JSONB,
    email_enabled     BOOLEAN DEFAULT TRUE,
    push_enabled      BOOLEAN DEFAULT TRUE,
    created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admin_activities (
    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id   UUID REFERENCES public.users(id) NOT NULL,
    action     TEXT NOT NULL,
    table_name TEXT,
    record_id  UUID,
    changes    JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ━━━ ROW LEVEL SECURITY ━━━

ALTER TABLE public.users                      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cutoffs                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_reviews            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_comments           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rank_predictions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_simulations           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_matrix                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activities           ENABLE ROW LEVEL SECURITY;

-- ━━━ RLS POLICIES ━━━

DROP POLICY IF EXISTS "Anyone can view colleges"   ON public.colleges;
DROP POLICY IF EXISTS "Anyone can insert colleges"  ON public.colleges;
CREATE POLICY "Anyone can view colleges"   ON public.colleges  FOR SELECT USING (true);
CREATE POLICY "Anyone can insert colleges" ON public.colleges  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view branches"   ON public.branches;
CREATE POLICY "Anyone can view branches"   ON public.branches  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view cutoffs"    ON public.cutoffs;
CREATE POLICY "Anyone can view cutoffs"    ON public.cutoffs   FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view seat_matrix" ON public.seat_matrix;
CREATE POLICY "Anyone can view seat_matrix" ON public.seat_matrix FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view reviews"    ON public.college_reviews;
DROP POLICY IF EXISTS "Anyone can insert reviews"  ON public.college_reviews;
DROP POLICY IF EXISTS "Anyone can delete reviews"  ON public.college_reviews;
CREATE POLICY "Anyone can view reviews"    ON public.college_reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reviews"  ON public.college_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete reviews"  ON public.college_reviews FOR DELETE USING (true);

DROP POLICY IF EXISTS "Anyone can view comments"   ON public.college_comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON public.college_comments;
CREATE POLICY "Anyone can view comments"   ON public.college_comments FOR SELECT USING (true);
CREATE POLICY "Anyone can insert comments" ON public.college_comments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can insert users"    ON public.users;
DROP POLICY IF EXISTS "Anyone can view users"      ON public.users;
CREATE POLICY "Anyone can insert users"    ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view users"      ON public.users FOR SELECT USING (true);

-- ━━━ INDEXES ━━━

CREATE INDEX IF NOT EXISTS idx_cutoffs_college_branch ON public.cutoffs(college_id, branch_id);
CREATE INDEX IF NOT EXISTS idx_cutoffs_year_category  ON public.cutoffs(year, category);
CREATE INDEX IF NOT EXISTS idx_cutoffs_closing_rank   ON public.cutoffs(closing_rank);
CREATE INDEX IF NOT EXISTS idx_seat_matrix_college    ON public.seat_matrix(college_id, branch_id);
CREATE INDEX IF NOT EXISTS idx_reviews_college        ON public.college_reviews(college_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created        ON public.college_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_colleges_code          ON public.colleges(code);

-- ━━━ PYQ QUESTIONS ━━━

CREATE TABLE IF NOT EXISTS public.pyq_questions (
    id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject        TEXT DEFAULT 'Physics',
    chapter        TEXT NOT NULL,
    chapter_number INTEGER NOT NULL,
    question       TEXT NOT NULL,
    options        JSONB NOT NULL,
    correct_answer INTEGER NOT NULL,
    year           INTEGER NOT NULL,
    explanation    TEXT,
    image_url      TEXT,
    needs_image    BOOLEAN DEFAULT FALSE,
    option_images  JSONB DEFAULT '["", "", "", ""]'::jsonb,
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pyq_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view pyq_questions" ON public.pyq_questions;
DROP POLICY IF EXISTS "Anyone can insert pyq_questions" ON public.pyq_questions;
DROP POLICY IF EXISTS "Anyone can update pyq_questions" ON public.pyq_questions;
DROP POLICY IF EXISTS "Anyone can delete pyq_questions" ON public.pyq_questions;

CREATE POLICY "Anyone can view pyq_questions" ON public.pyq_questions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert pyq_questions" ON public.pyq_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update pyq_questions" ON public.pyq_questions FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete pyq_questions" ON public.pyq_questions FOR DELETE USING (true);

CREATE INDEX IF NOT EXISTS idx_pyq_chapter ON public.pyq_questions(chapter_number);
CREATE INDEX IF NOT EXISTS idx_pyq_year    ON public.pyq_questions(year);
CREATE INDEX IF NOT EXISTS idx_pyq_subject ON public.pyq_questions(subject);

-- ━━━ USER SUGGESTIONS ━━━

CREATE TABLE IF NOT EXISTS public.user_suggestions (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    suggestion  TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_suggestions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert suggestions" ON public.user_suggestions;
CREATE POLICY "Anyone can insert suggestions" ON public.user_suggestions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can view suggestions" ON public.user_suggestions;
CREATE POLICY "Anyone can view suggestions" ON public.user_suggestions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can delete suggestions" ON public.user_suggestions;
CREATE POLICY "Anyone can delete suggestions" ON public.user_suggestions FOR DELETE USING (true);

