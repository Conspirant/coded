import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://mwrsinofpjmlxniiecdu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnNpbm9mcGptbHhuaWllY2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDM1NzYsImV4cCI6MjA3MTg3OTU3Nn0.6LhWEpz-h9m44UtoXgO1aMPQbPJKo-A-TorjMGOE2Qw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fixReviewSystem() {
  try {
    console.log('🔧 Fixing review system to allow anonymous reviews and public visibility...\n');
    
    // Step 1: Fix the college_reviews table schema
    console.log('📝 Step 1: Updating college_reviews table schema...');
    
    const schemaUpdate = `
      -- Make user_id nullable to allow anonymous reviews
      ALTER TABLE public.college_reviews 
      ALTER COLUMN user_id DROP NOT NULL;
      
      -- Add a session_id column for anonymous users
      ALTER TABLE public.college_reviews 
      ADD COLUMN IF NOT EXISTS session_id TEXT;
      
      -- Create index for session_id
      CREATE INDEX IF NOT EXISTS idx_college_reviews_session_id 
      ON public.college_reviews(session_id);
    `;
    
    const { error: schemaError } = await supabase.rpc('exec_sql', { sql: schemaUpdate });
    if (schemaError) {
      console.log('⚠️  Schema update failed (this might be expected):', schemaError.message);
      console.log('   You may need to run this manually in Supabase SQL Editor');
    } else {
      console.log('✅ Schema updated successfully');
    }
    
    // Step 2: Fix RLS policies
    console.log('\n📝 Step 2: Updating RLS policies...');
    
    const policyUpdate = `
      -- Drop conflicting policies
      DROP POLICY IF EXISTS "Users can manage their own reviews" ON public.college_reviews;
      
      -- Create new policies for anonymous reviews
      CREATE POLICY "Anyone can view all reviews" 
      ON public.college_reviews FOR SELECT 
      USING (true);
      
      CREATE POLICY "Anyone can insert reviews" 
      ON public.college_reviews FOR INSERT 
      WITH CHECK (true);
      
      CREATE POLICY "Users can delete their own reviews" 
      ON public.college_reviews FOR DELETE 
      USING (
        auth.uid() = user_id OR 
        session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
      );
      
      CREATE POLICY "Users can update their own reviews" 
      ON public.college_reviews FOR UPDATE 
      USING (
        auth.uid() = user_id OR 
        session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
      );
    `;
    
    const { error: policyError } = await supabase.rpc('exec_sql', { sql: policyUpdate });
    if (policyError) {
      console.log('⚠️  Policy update failed (this might be expected):', policyError.message);
      console.log('   You may need to run this manually in Supabase SQL Editor');
    } else {
      console.log('✅ RLS policies updated successfully');
    }
    
    // Step 3: Test the fix
    console.log('\n🧪 Step 3: Testing the fix...');
    
    // Check if we can read reviews
    const { data: reviews, error: readError } = await supabase
      .from('college_reviews')
      .select('*')
      .limit(5);
    
    if (readError) {
      console.log('❌ Cannot read reviews:', readError.message);
    } else {
      console.log(`✅ Can read reviews: Found ${reviews?.length || 0} reviews`);
    }
    
    // Check if we can create a test review
    const testSessionId = crypto.randomUUID();
    const testReview = {
      college_id: '00000000-0000-0000-0000-000000000000', // Dummy ID for testing
      session_id: testSessionId,
      rating: 5,
      review_text: 'Test review for system verification',
      faculty_rating: 4,
      infrastructure_rating: 5,
      placements_rating: 4,
      helpful_votes: 0,
      verified: false
    };
    
    // First, let's try to get a real college
    const { data: colleges, error: collegeError } = await supabase
      .from('colleges')
      .select('id')
      .limit(1);
    
    if (colleges && colleges.length > 0) {
      testReview.college_id = colleges[0].id;
      
      const { data: newReview, error: insertError } = await supabase
        .from('college_reviews')
        .insert(testReview)
        .select('*')
        .single();
      
      if (insertError) {
        console.log('❌ Cannot create review:', insertError.message);
      } else {
        console.log('✅ Can create reviews: Created test review with ID', newReview.id);
        
        // Clean up test review
        await supabase
          .from('college_reviews')
          .delete()
          .eq('id', newReview.id);
        console.log('🧹 Cleaned up test review');
      }
    } else {
      console.log('⚠️  No colleges found in database - cannot test review creation');
    }
    
    console.log('\n📋 MANUAL STEPS REQUIRED:');
    console.log('1. Go to your Supabase Dashboard → SQL Editor');
    console.log('2. Run the following SQL commands:');
    console.log('');
    console.log('-- Fix schema:');
    console.log('ALTER TABLE public.college_reviews ALTER COLUMN user_id DROP NOT NULL;');
    console.log('ALTER TABLE public.college_reviews ADD COLUMN IF NOT EXISTS session_id TEXT;');
    console.log('CREATE INDEX IF NOT EXISTS idx_college_reviews_session_id ON public.college_reviews(session_id);');
    console.log('');
    console.log('-- Fix policies:');
    console.log('DROP POLICY IF EXISTS "Users can manage their own reviews" ON public.college_reviews;');
    console.log('CREATE POLICY "Anyone can view all reviews" ON public.college_reviews FOR SELECT USING (true);');
    console.log('CREATE POLICY "Anyone can insert reviews" ON public.college_reviews FOR INSERT WITH CHECK (true);');
    console.log('CREATE POLICY "Users can delete their own reviews" ON public.college_reviews FOR DELETE USING (auth.uid() = user_id OR session_id = current_setting(\'request.jwt.claims\', true)::json->>\'session_id\');');
    console.log('CREATE POLICY "Users can update their own reviews" ON public.college_reviews FOR UPDATE USING (auth.uid() = user_id OR session_id = current_setting(\'request.jwt.claims\', true)::json->>\'session_id\');');
    console.log('');
    console.log('3. After running these commands, the review system should work properly');
    console.log('4. Users will be able to see all reviews from all users');
    console.log('5. Users can add reviews without logging in');
    console.log('6. Users can only delete their own reviews');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixReviewSystem();
