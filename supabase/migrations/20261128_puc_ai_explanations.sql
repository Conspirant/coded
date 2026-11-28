-- Cache table for PUC Question Bank AI explanations
CREATE TABLE IF NOT EXISTS public.puc_ai_explanations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question_id TEXT NOT NULL UNIQUE,
    subject TEXT NOT NULL,
    chapter_number INTEGER,
    explanation TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_puc_ai_explanations_question_id
    ON public.puc_ai_explanations (question_id);

ALTER TABLE public.puc_ai_explanations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cached AI explanations"
    ON public.puc_ai_explanations FOR SELECT
    USING (true);

CREATE POLICY "Anyone can insert cached AI explanations"
    ON public.puc_ai_explanations FOR INSERT
    WITH CHECK (true);
