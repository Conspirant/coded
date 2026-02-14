-- Create comments table
CREATE TABLE IF NOT EXISTS public.college_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES public.college_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    upvotes INTEGER DEFAULT 0
);

-- Use a view to join with user profile data if needed, or simple RLS
ALTER TABLE public.college_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone" 
ON public.college_comments FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own comments" 
ON public.college_comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.college_comments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.college_comments FOR DELETE 
USING (auth.uid() = user_id);


-- Create mentors table
CREATE TABLE IF NOT EXISTS public.mentors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id),
    linkedin_url TEXT,
    bio TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, college_id)
);

ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors are viewable by everyone" 
ON public.mentors FOR SELECT 
USING (true);

CREATE POLICY "Users can register as mentors" 
ON public.mentors FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Mentors can update their own profile" 
ON public.mentors FOR UPDATE 
USING (auth.uid() = user_id);
