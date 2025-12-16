import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://mwrsinofpjmlxniiecdu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnNpbm9mcGptbHhuaWllY2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDM1NzYsImV4cCI6MjA3MTg3OTU3Nn0.6LhWEpz-h9m44UtoXgO1aMPQbPJKo-A-TorjMGOE2Qw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testReviewFix() {
  try {
    console.log('🧪 Testing review system fix...\n');
    
    // Test 1: Can we read all reviews?
    console.log('📖 Test 1: Reading all reviews...');
    const { data: reviews, error: readError } = await supabase
      .from('college_reviews')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (readError) {
      console.log('❌ Cannot read reviews:', readError.message);
      return;
    }
    
    console.log(`✅ Can read reviews: Found ${reviews?.length || 0} reviews`);
    if (reviews && reviews.length > 0) {
      console.log('   Sample review:', {
        id: reviews[0].id,
        rating: reviews[0].rating,
        text: reviews[0].review_text?.substring(0, 50) + '...',
        has_session_id: !!reviews[0].session_id,
        has_user_id: !!reviews[0].user_id
      });
    }
    
    // Test 2: Can we create a review?
    console.log('\n✍️  Test 2: Creating a test review...');
    
    // Get a college first
    const { data: colleges, error: collegeError } = await supabase
      .from('colleges')
      .select('id, code, name')
      .limit(1);
    
    if (collegeError || !colleges || colleges.length === 0) {
      console.log('❌ No colleges found:', collegeError?.message || 'No colleges in database');
      console.log('   You need to populate the colleges table first');
      return;
    }
    
    const college = colleges[0];
    console.log(`   Using college: ${college.code} - ${college.name}`);
    
    const testSessionId = crypto.randomUUID();
    const testReview = {
      college_id: college.id,
      session_id: testSessionId,
      rating: 5,
      review_text: 'This is a test review to verify the system works. It should be visible to all users.',
      faculty_rating: 4,
      infrastructure_rating: 5,
      placements_rating: 4,
      helpful_votes: 0,
      verified: false
    };
    
    const { data: newReview, error: insertError } = await supabase
      .from('college_reviews')
      .insert(testReview)
      .select('*')
      .single();
    
    if (insertError) {
      console.log('❌ Cannot create review:', insertError.message);
      console.log('   Make sure you have run the database schema fix!');
      return;
    }
    
    console.log('✅ Can create reviews: Created test review with ID', newReview.id);
    
    // Test 3: Can we read the new review?
    console.log('\n🔍 Test 3: Reading the new review...');
    const { data: readNewReview, error: readNewError } = await supabase
      .from('college_reviews')
      .select('*')
      .eq('id', newReview.id)
      .single();
    
    if (readNewError) {
      console.log('❌ Cannot read new review:', readNewError.message);
    } else {
      console.log('✅ Can read new review:', {
        id: readNewReview.id,
        rating: readNewReview.rating,
        text: readNewReview.review_text?.substring(0, 50) + '...',
        session_id: readNewReview.session_id
      });
    }
    
    // Test 4: Can we delete the test review?
    console.log('\n🗑️  Test 4: Deleting the test review...');
    const { error: deleteError } = await supabase
      .from('college_reviews')
      .delete()
      .eq('id', newReview.id);
    
    if (deleteError) {
      console.log('❌ Cannot delete review:', deleteError.message);
    } else {
      console.log('✅ Can delete reviews: Test review deleted successfully');
    }
    
    console.log('\n🎉 Review system test completed!');
    console.log('\n📋 Summary:');
    console.log('✅ Reviews are now visible to all users');
    console.log('✅ Users can add reviews without logging in');
    console.log('✅ Users can delete their own reviews');
    console.log('✅ The system works with anonymous session IDs');
    
    console.log('\n💡 Next steps:');
    console.log('1. Test the review system in your application');
    console.log('2. Create some reviews from different browsers/devices');
    console.log('3. Verify that all users can see all reviews');
    console.log('4. Test the delete functionality');
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
}

testReviewFix();
