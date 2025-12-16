import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://mwrsinofpjmlxniiecdu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnNpbm9mcGptbHhuaWllY2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDM1NzYsImV4cCI6MjA3MTg3OTU3Nn0.6LhWEpz-h9m44UtoXgO1aMPQbPJKo-A-TorjMGOE2Qw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function applyRLSMigration() {
  try {
    console.log('Applying RLS migration to allow anonymous reviews...');
    
    // Test if we can insert a review
    const testReview = {
      college_id: 'test-college-id',
      user_id: 'test-user-id',
      rating: 5,
      review_text: 'Test review',
      faculty_rating: 4,
      infrastructure_rating: 5,
      placements_rating: 4,
      helpful_votes: 0,
      verified: false
    };
    
    const { data, error } = await supabase
      .from('college_reviews')
      .insert(testReview)
      .select();
    
    if (error) {
      console.error('RLS migration needed. Error:', error.message);
      console.log('Please apply the RLS migration manually in your Supabase dashboard:');
      console.log(`
-- Allow anonymous reviews by updating RLS policies
DROP POLICY IF EXISTS "Users can manage their own reviews" ON public.college_reviews;

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
      `);
    } else {
      console.log('RLS migration already applied! Reviews can be saved to Supabase.');
      // Clean up test review
      await supabase.from('college_reviews').delete().eq('id', data[0].id);
    }
    
  } catch (error) {
    console.error('Error applying RLS migration:', error);
  }
}

applyRLSMigration();
