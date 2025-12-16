import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://mwrsinofpjmlxniiecdu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnNpbm9mcGptbHhuaWllY2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDM1NzYsImV4cCI6MjA3MTg3OTU3Nn0.6LhWEpz-h9m44UtoXgO1aMPQbPJKo-A-TorjMGOE2Qw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testDeleteFunctionality() {
  try {
    console.log('🧪 Testing delete functionality...\n');
    
    // Test 1: Create a test review
    console.log('1. Creating test review...');
    
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
    
    // Create a test review
    const testReview = {
      college_id: college.id,
      user_id: crypto.randomUUID(),
      rating: 4,
      review_text: 'This is a test review for delete functionality',
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
    
    // Test 2: Verify review exists
    console.log('\n2. Verifying review exists...');
    const { data: reviews, error: readError } = await supabase
      .from('college_reviews')
      .select('*')
      .eq('id', newReview.id);
    
    if (readError) {
      console.log('❌ Cannot read review:', readError.message);
    } else {
      console.log(`✅ Found ${reviews.length} review(s) with ID ${newReview.id}`);
    }
    
    // Test 3: Delete the review
    console.log('\n3. Testing delete functionality...');
    const { error: deleteError } = await supabase
      .from('college_reviews')
      .delete()
      .eq('id', newReview.id);
    
    if (deleteError) {
      console.log('❌ Cannot delete review:', deleteError.message);
    } else {
      console.log('✅ Successfully deleted review');
    }
    
    // Test 4: Verify review is deleted
    console.log('\n4. Verifying review is deleted...');
    const { data: deletedReviews, error: verifyError } = await supabase
      .from('college_reviews')
      .select('*')
      .eq('id', newReview.id);
    
    if (verifyError) {
      console.log('❌ Error verifying deletion:', verifyError.message);
    } else {
      console.log(`✅ Verification: Found ${deletedReviews.length} review(s) with ID ${newReview.id} (should be 0)`);
      if (deletedReviews.length === 0) {
        console.log('🎉 DELETE FUNCTIONALITY WORKS!');
      } else {
        console.log('❌ Review was not deleted properly');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testDeleteFunctionality();
