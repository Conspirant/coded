-- 🌟 Supabase Migration for KCET Coded Forum & Community Hub

-- 1. Create forum_posts table
CREATE TABLE IF NOT EXISTS public.forum_posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    author_name TEXT NOT NULL,
    author_rank TEXT,
    author_badge TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    upvotes INTEGER DEFAULT 1,
    reply_count INTEGER DEFAULT 0,
    is_solved BOOLEAN DEFAULT FALSE,
    pinned BOOLEAN DEFAULT FALSE
);

-- 2. Create forum_replies table
CREATE TABLE IF NOT EXISTS public.forum_replies (
    id TEXT PRIMARY KEY,
    post_id TEXT REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    parent_id TEXT,
    author_name TEXT NOT NULL,
    author_rank TEXT,
    author_badge TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    upvotes INTEGER DEFAULT 1,
    is_solution BOOLEAN DEFAULT FALSE
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

-- 4. Create Public Policies (allows reading, posting, upvoting, and replying)
DROP POLICY IF EXISTS "Allow public read forum_posts" ON public.forum_posts;
CREATE POLICY "Allow public read forum_posts" ON public.forum_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert forum_posts" ON public.forum_posts;
CREATE POLICY "Allow public insert forum_posts" ON public.forum_posts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update forum_posts" ON public.forum_posts;
CREATE POLICY "Allow public update forum_posts" ON public.forum_posts FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete forum_posts" ON public.forum_posts;
CREATE POLICY "Allow public delete forum_posts" ON public.forum_posts FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public read forum_replies" ON public.forum_replies;
CREATE POLICY "Allow public read forum_replies" ON public.forum_replies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert forum_replies" ON public.forum_replies;
CREATE POLICY "Allow public insert forum_replies" ON public.forum_replies FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update forum_replies" ON public.forum_replies;
CREATE POLICY "Allow public update forum_replies" ON public.forum_replies FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete forum_replies" ON public.forum_replies;
CREATE POLICY "Allow public delete forum_replies" ON public.forum_replies FOR DELETE USING (true);
