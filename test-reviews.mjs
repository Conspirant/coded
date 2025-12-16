import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://mwrsinofpjmlxniiecdu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnNpbm9mcGptbHhuaWllY2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDM1NzYsImV4cCI6MjA3MTg3OTU3Nn0.6LhWEpz-h9m44UtoXgO1aMPQbPJKo-A-TorjMGOE2Qw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testReviews() {
  try {
    console.log('🔍 Testing review loading...\n');
    
    // Test 1: Simple review query without joins
    console.log('1. Testing simple review query...');
    const { data: simpleReviews, error: simpleError } = await supabase
      .from('college_reviews')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (simpleError) {
      console.log('❌ Simple query failed:', simpleError.message);
    } else {
      console.log(`✅ Simple query: Found ${simpleReviews?.length || 0} reviews`);
      if (simpleReviews && simpleReviews.length > 0) {
        console.log('Sample review:', {
          id: simpleReviews[0].id,
          college_id: simpleReviews[0].college_id,
          rating: simpleReviews[0].rating,
          review_text: simpleReviews[0].review_text?.substring(0, 50) + '...'
        });
      }
    }
    
    // Test 2: Query with college join
    console.log('\n2. Testing review query with college join...');
    const { data: joinedReviews, error: joinedError } = await supabase
      .from('college_reviews')
      .select(`
        *,
        colleges!college_reviews_college_id_fkey (
          code,
          name
        )
      `)
      .order('created_at', { ascending: false });
    
    if (joinedError) {
      console.log('❌ Joined query failed:', joinedError.message);
    } else {
      console.log(`✅ Joined query: Found ${joinedReviews?.length || 0} reviews`);
      if (joinedReviews && joinedReviews.length > 0) {
        console.log('Sample joined review:', {
          id: joinedReviews[0].id,
          college_id: joinedReviews[0].college_id,
          rating: joinedReviews[0].rating,
          college_code: joinedReviews[0].colleges?.code,
          college_name: joinedReviews[0].colleges?.name
        });
      }
    }
    
    // Test 3: Create a test review to verify it works
    console.log('\n3. Creating test review...');
    
    // Get a college first
    const { data: colleges, error: collegeError } = await supabase
      .from('colleges')
      .select('id, code, name')
      .limit(1)
      .single();
    
    if (collegeError || !colleges) {
      console.log('❌ No colleges available for testing');
      return;
    }
    
    console.log(`Using college: ${colleges.code} - ${colleges.name}`);
    
    // Create a test user
    const testUserId = crypto.randomUUID();
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: testUserId,
        email: `test_${Date.now()}@example.com`,
        full_name: 'Test User'
      })
      .select('id')
      .single();
    
    if (userError) {
      console.log('❌ Cannot create user:', userError.message);
      return;
    }
    
    // Create a test review
    const testReview = {
      college_id: colleges.id,
      user_id: testUserId,
      rating: 5,
      review_text: 'This is a test review to verify visibility',
      faculty_rating: 4,
      infrastructure_rating: 5,
      placements_rating: 4,
      helpful_votes: 0,
      verified: false
    };
    
    const { data: reviewData, error: reviewError } = await supabase
      .from('college_reviews')
      .insert(testReview)
      .select('*')
      .single();
    
    if (reviewError) {
      console.log('❌ Cannot create review:', reviewError.message);
    } else {
      console.log('✅ Created test review:', reviewData.id);
      
      // Test if we can read it back immediately
      const { data: readBack, error: readError } = await supabase
        .from('college_reviews')
        .select('*')
        .eq('id', reviewData.id);
      
      if (readError) {
        console.log('❌ Cannot read back review:', readError.message);
      } else {
        console.log('✅ Successfully read back review:', readBack[0]);
        console.log('\n🎉 REVIEW SYSTEM IS WORKING!');
        console.log('The review should now be visible to all users.');
      }
      
      // Clean up
      await supabase.from('college_reviews').delete().eq('id', reviewData.id);
      await supabase.from('users').delete().eq('id', testUserId);
      console.log('✅ Test data cleaned up');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testReviews();
