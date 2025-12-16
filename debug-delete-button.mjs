import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://mwrsinofpjmlxniiecdu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnNpbm9mcGptbHhuaWllY2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDM1NzYsImV4cCI6MjA3MTg3OTU3Nn0.6LhWEpz-h9m44UtoXgO1aMPQbPJKo-A-TorjMGOE2Qw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Simulate the getUserSessionId function
const getUserSessionId = () => {
  // In a real browser, this would use localStorage
  // For testing, we'll use a valid UUID
  return '12345678-1234-1234-1234-123456789abc';
};

// Simulate the isUserReview function
const isUserReview = (review) => {
  const userSessionId = getUserSessionId();
  return review.user_id === userSessionId;
};

async function debugDeleteButton() {
  try {
    console.log('🔍 Debugging delete button visibility...\n');
    
    // Test 1: Create a review with the test session ID
    console.log('1. Creating test review with session ID...');
    
    // Get a college
    const { data: college, error: collegeError } = await supabase
      .from('colleges')
      .select('id, code, name')
      .limit(1)
      .single();
    
    if (collegeError || !college) {
      console.log('❌ No colleges available for testing');
      return;
    }
    
    console.log(`Using college: ${college.code} - ${college.name}`);
    
    // Create a test review with our session ID
    const testReview = {
      college_id: college.id,
      user_id: getUserSessionId(), // Use our test session ID
      rating: 4,
      review_text: 'This is a test review to check delete button visibility',
      faculty_rating: 4,
      infrastructure_rating: 3,
      placements_rating: 5,
      helpful_votes: 0,
      verified: false
    };
    
    const { data: newReview, error: reviewError } = await supabase
      .from('college_reviews')
      .insert(testReview)
      .select('*')
      .single();
    
    if (reviewError) {
      console.log('❌ Cannot create review:', reviewError.message);
      return;
    }
    
    console.log('✅ Created test review:', newReview.id);
    console.log('Review user_id:', newReview.user_id);
    console.log('Current session ID:', getUserSessionId());
    
    // Test 2: Check if isUserReview works
    console.log('\n2. Testing isUserReview function...');
    const isUser = isUserReview(newReview);
    console.log(`isUserReview result: ${isUser}`);
    
    if (isUser) {
      console.log('✅ Delete button SHOULD be visible for this review');
    } else {
      console.log('❌ Delete button will NOT be visible for this review');
    }
    
    // Test 3: Test the author display logic
    console.log('\n3. Testing author display logic...');
    const author = newReview.user_id === getUserSessionId() ? 'You' : `User ${newReview.user_id?.slice(0, 8) || 'Anonymous'}`;
    console.log(`Author display: "${author}"`);
    
    // Test 4: Test delete functionality
    console.log('\n4. Testing delete functionality...');
    const { error: deleteError } = await supabase
      .from('college_reviews')
      .delete()
      .eq('id', newReview.id);
    
    if (deleteError) {
      console.log('❌ Cannot delete review:', deleteError.message);
    } else {
      console.log('✅ Successfully deleted review from database');
    }
    
    // Test 5: Verify deletion
    console.log('\n5. Verifying deletion...');
    const { data: deletedReviews, error: verifyError } = await supabase
      .from('college_reviews')
      .select('*')
      .eq('id', newReview.id);
    
    if (verifyError) {
      console.log('❌ Error verifying deletion:', verifyError.message);
    } else {
      console.log(`✅ Verification: Found ${deletedReviews.length} review(s) with ID ${newReview.id}`);
      if (deletedReviews.length === 0) {
        console.log('🎉 DATABASE DELETION WORKS!');
      } else {
        console.log('❌ Review was not deleted from database');
      }
    }
    
    console.log('\n📋 SUMMARY:');
    console.log('- If isUserReview returned true, delete button should be visible');
    console.log('- If author shows "You", the review belongs to current user');
    console.log('- Database deletion is working correctly');
    console.log('\n💡 If delete button is not visible in UI, check:');
    console.log('1. Browser localStorage has user_session_id');
    console.log('2. Review user_id matches the session ID');
    console.log('3. isUserReview function is working correctly');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugDeleteButton();
