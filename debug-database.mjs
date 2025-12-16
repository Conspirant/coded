import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://mwrsinofpjmlxniiecdu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnNpbm9mcGptbHhuaWllY2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDM1NzYsImV4cCI6MjA3MTg3OTU3Nn0.6LhWEpz-h9m44UtoXgO1aMPQbPJKo-A-TorjMGOE2Qw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function debugDatabase() {
  try {
    console.log('🔍 Debugging database access...\n');
    
    // Test 1: Check if we can read colleges
    console.log('1. Testing college read access...');
    const { data: colleges, error: collegeError } = await supabase
      .from('colleges')
      .select('id, code, name')
      .limit(3);
    
    if (collegeError) {
      console.log('❌ Cannot read colleges:', collegeError.message);
    } else {
      console.log(`✅ Can read colleges: ${colleges?.length || 0} found`);
      if (colleges && colleges.length > 0) {
        console.log('Sample college:', colleges[0]);
      }
    }
    
    // Test 2: Check if we can insert a college
    console.log('\n2. Testing college insert access...');
    const testCollege = {
      code: `TEST_${Date.now()}`,
      name: 'Test College for Debug',
      type: 'engineering'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('colleges')
      .insert(testCollege)
      .select('id, code, name')
      .single();
    
    if (insertError) {
      console.log('❌ Cannot insert college:', insertError.message);
      console.log('Error details:', insertError);
    } else {
      console.log('✅ Successfully inserted college:', insertData);
      
      // Clean up test college
      await supabase.from('colleges').delete().eq('id', insertData.id);
      console.log('✅ Test college cleaned up');
    }
    
    // Test 3: Check if we can read reviews
    console.log('\n3. Testing review read access...');
    const { data: reviews, error: reviewError } = await supabase
      .from('college_reviews')
      .select('id, rating, review_text, created_at')
      .limit(3);
    
    if (reviewError) {
      console.log('❌ Cannot read reviews:', reviewError.message);
    } else {
      console.log(`✅ Can read reviews: ${reviews?.length || 0} found`);
      if (reviews && reviews.length > 0) {
        console.log('Sample review:', reviews[0]);
      }
    }
    
    // Test 4: Check if we can insert a review (if we have colleges)
    if (colleges && colleges.length > 0) {
      console.log('\n4. Testing review insert access...');
      const testUserId = crypto.randomUUID();
      const testUserEmail = `test_${Date.now()}@example.com`;
      
      // First create a test user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: testUserId,
          email: testUserEmail,
          full_name: 'Test User'
        })
        .select('id')
        .single();
      
      if (userError) {
        console.log('❌ Cannot create user:', userError.message);
      } else {
        console.log('✅ Created test user:', userData.id);
        
        // Now try to create a review
        const testReview = {
          college_id: colleges[0].id,
          user_id: testUserId,
          rating: 5,
          review_text: 'Test review for debugging',
          faculty_rating: 4,
          infrastructure_rating: 5,
          placements_rating: 4,
          helpful_votes: 0,
          verified: false
        };
        
        const { data: reviewData, error: reviewInsertError } = await supabase
          .from('college_reviews')
          .insert(testReview)
          .select('id, rating, review_text')
          .single();
        
        if (reviewInsertError) {
          console.log('❌ Cannot insert review:', reviewInsertError.message);
          console.log('Error details:', reviewInsertError);
        } else {
          console.log('✅ Successfully inserted review:', reviewData);
          
          // Clean up test data
          await supabase.from('college_reviews').delete().eq('id', reviewData.id);
          await supabase.from('users').delete().eq('id', testUserId);
          console.log('✅ Test data cleaned up');
        }
      }
    }
    
    console.log('\n📋 SUMMARY:');
    console.log('If any tests failed, you need to run the RLS policies SQL in Supabase dashboard.');
    console.log('The exact SQL needed will be shown below if there are errors.');
    
  } catch (error) {
    console.error('❌ Error during debugging:', error);
  }
}

debugDatabase();
