-- 🌟 Supabase Migration: Forum User Profiles & Auth Integration

-- 1. Create profiles table linked to Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    kcet_rank INTEGER,
    kcet_category TEXT DEFAULT 'GM',
    comedk_rank INTEGER,
    badge TEXT DEFAULT 'KCET Aspirant',
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add user_id to forum_posts if not present
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forum_posts' AND column_name = 'user_id') THEN
        ALTER TABLE public.forum_posts ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 3. Add user_id to forum_replies if not present
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forum_replies' AND column_name = 'user_id') THEN
        ALTER TABLE public.forum_replies ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 4. Enable Row Level Security (RLS) on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 6. Trigger to automatically create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1), 'Student Aspirant'),
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
