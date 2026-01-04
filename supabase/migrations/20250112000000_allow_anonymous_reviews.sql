-- Allow anonymous reviews by updating RLS policies
-- This allows anyone to insert reviews without authentication

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can manage their own reviews" ON public.college_reviews;

-- Create new policies that allow anonymous reviews
CREATE POLICY "Anyone can insert reviews" 
ON public.college_reviews FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view reviews" 
ON public.college_reviews FOR SELECT 
USING (true);

-- Allow anyone to insert users (for anonymous reviews)
DROP POLICY IF EXISTS "Users can view and update their own profile" ON public.users;

CREATE POLICY "Anyone can insert users" 
ON public.users FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view users" 
ON public.users FOR SELECT 
USING (true);

-- Allow anyone to insert colleges (if they don't exist)
CREATE POLICY "Anyone can insert colleges" 
ON public.colleges FOR INSERT 
WITH CHECK (true);
