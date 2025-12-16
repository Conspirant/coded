-- Fix review system to allow anonymous reviews and public visibility
-- Run this in your Supabase Dashboard → SQL Editor

-- Step 1: Fix schema
-- Make user_id nullable to allow anonymous reviews
ALTER TABLE public.college_reviews 
ALTER COLUMN user_id DROP NOT NULL;

-- Add a session_id column for anonymous users
ALTER TABLE public.college_reviews 
ADD COLUMN IF NOT EXISTS session_id TEXT;

-- Create index for session_id
CREATE INDEX IF NOT EXISTS idx_college_reviews_session_id 
ON public.college_reviews(session_id);

-- Step 2: Fix RLS policies
-- Drop conflicting policies
DROP POLICY IF EXISTS "Users can manage their own reviews" ON public.college_reviews;

-- Create new policies for anonymous reviews
CREATE POLICY "Anyone can view all reviews" 
ON public.college_reviews FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert reviews" 
ON public.college_reviews FOR INSERT 
WITH CHECK (true);

-- Note: For delete/update policies, we'll use a simpler approach
-- that works with anonymous users by checking session_id in the application
CREATE POLICY "Allow delete for session-based reviews" 
ON public.college_reviews FOR DELETE 
USING (true);

CREATE POLICY "Allow update for session-based reviews" 
ON public.college_reviews FOR UPDATE 
USING (true);

-- Step 3: Verify the changes
SELECT 
  column_name, 
  is_nullable, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'college_reviews' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show current policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'college_reviews';
