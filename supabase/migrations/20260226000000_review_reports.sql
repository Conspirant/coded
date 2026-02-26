-- ╔══════════════════════════════════════════════════════════════╗
-- ║  Review Reports & Moderation Support                       ║
-- ╚══════════════════════════════════════════════════════════════╝

-- Add moderation status to college_reviews
ALTER TABLE public.college_reviews
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'visible'
  CHECK (status IN ('visible', 'hidden', 'flagged'));

-- Create review_reports table
CREATE TABLE IF NOT EXISTS public.review_reports (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id   UUID REFERENCES public.college_reviews(id) ON DELETE CASCADE NOT NULL,
  session_id  TEXT NOT NULL,
  reason      TEXT NOT NULL CHECK (reason IN ('spam', 'offensive', 'fake', 'other')),
  description TEXT,
  status      TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.review_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view reports"   ON public.review_reports;
DROP POLICY IF EXISTS "Anyone can insert reports"  ON public.review_reports;
DROP POLICY IF EXISTS "Anyone can update reports"  ON public.review_reports;

CREATE POLICY "Anyone can view reports"   ON public.review_reports FOR SELECT USING (true);
CREATE POLICY "Anyone can insert reports" ON public.review_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update reports" ON public.review_reports FOR UPDATE USING (true);

-- Allow update on college_reviews for moderation
DROP POLICY IF EXISTS "Anyone can update reviews" ON public.college_reviews;
CREATE POLICY "Anyone can update reviews" ON public.college_reviews FOR UPDATE USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reports_review    ON public.review_reports(review_id);
CREATE INDEX IF NOT EXISTS idx_reports_status    ON public.review_reports(status);
CREATE INDEX IF NOT EXISTS idx_reviews_status    ON public.college_reviews(status);
