import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://mwrsinofpjmlxniiecdu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnNpbm9mcGptbHhuaWllY2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDM1NzYsImV4cCI6MjA3MTg3OTU3Nn0.6LhWEpz-h9m44UtoXgO1aMPQbPJKo-A-TorjMGOE2Qw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkDatabaseSchema() {
  try {
    console.log('🔍 Checking database schema for college_reviews table...\n');
    
    // Try to create a test review with session_id to see if the column exists
    console.log('🧪 Testing if session_id column exists...');
    
    // Get a college first
    const { data: colleges, error: collegeError } = await supabase
      .from('colleges')
      .select('id, code, name')
      .limit(1);
    
    if (collegeError || !colleges || colleges.length === 0) {
      console.log('❌ No colleges found:', collegeError?.message);
      return;
    }
    
    const college = colleges[0];
    console.log(`Using college: ${college.code} - ${college.name}`);
    
    const testSessionId = crypto.randomUUID();
    const testReview = {
      college_id: college.id,
      session_id: testSessionId,
      rating: 5,
      review_text: 'Test review to check if session_id column exists',
      faculty_rating: 4,
      infrastructure_rating: 5,
      placements_rating: 4,
      helpful_votes: 0,
      verified: false
    };
    
    console.log('Attempting to insert test review with session_id...');
    const { data: newReview, error: insertError } = await supabase
      .from('college_reviews')
      .insert(testReview)
      .select('*')
      .single();
    
    if (insertError) {
      console.log('❌ Error inserting review with session_id:', insertError.message);
      
      if (insertError.message.includes('session_id')) {
        console.log('\n🚨 PROBLEM FOUND: session_id column does not exist in database!');
        console.log('   This is why new reviews are falling back to localStorage.');
        console.log('\n📋 SOLUTION: You need to run the database migration:');
        console.log('   1. Go to your Supabase Dashboard → SQL Editor');
        console.log('   2. Run the commands from fix-database-schema.sql');
        console.log('   3. Or run these commands:');
        console.log('');
        console.log('   ALTER TABLE public.college_reviews ALTER COLUMN user_id DROP NOT NULL;');
        console.log('   ALTER TABLE public.college_reviews ADD COLUMN IF NOT EXISTS session_id TEXT;');
        console.log('   CREATE INDEX IF NOT EXISTS idx_college_reviews_session_id ON public.college_reviews(session_id);');
        console.log('');
        console.log('   DROP POLICY IF EXISTS "Users can manage their own reviews" ON public.college_reviews;');
        console.log('   CREATE POLICY "Anyone can view all reviews" ON public.college_reviews FOR SELECT USING (true);');
        console.log('   CREATE POLICY "Anyone can insert reviews" ON public.college_reviews FOR INSERT WITH CHECK (true);');
        console.log('   CREATE POLICY "Allow delete for session-based reviews" ON public.college_reviews FOR DELETE USING (true);');
        console.log('   CREATE POLICY "Allow update for session-based reviews" ON public.college_reviews FOR UPDATE USING (true);');
      }
    } else {
      console.log('✅ Successfully inserted review with session_id!');
      console.log('   Review ID:', newReview.id);
      console.log('   Session ID:', newReview.session_id);
      
      // Clean up the test review
      await supabase
        .from('college_reviews')
        .delete()
        .eq('id', newReview.id);
      console.log('🧹 Cleaned up test review');
      
      console.log('\n✅ Database schema is correct!');
      console.log('   The issue might be in the frontend code or RLS policies.');
    }
    
  } catch (error) {
    console.error('❌ Error checking schema:', error);
  }
}

checkDatabaseSchema();
