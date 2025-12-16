import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://mwrsinofpjmlxniiecdu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnNpbm9mcGptbHhuaWllY2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDM1NzYsImV4cCI6MjA3MTg3OTU3Nn0.6LhWEpz-h9m44UtoXgO1aMPQbPJKo-A-TorjMGOE2Qw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkExistingReviews() {
  try {
    console.log('🔍 Checking existing reviews in database...\n');
    
    // Get all reviews
    const { data: reviews, error } = await supabase
      .from('college_reviews')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.log('❌ Error loading reviews:', error.message);
      return;
    }
    
    console.log(`Found ${reviews?.length || 0} reviews in database`);
    
    if (reviews && reviews.length > 0) {
      console.log('\n📋 Review details:');
      reviews.forEach((review, index) => {
        console.log(`${index + 1}. ID: ${review.id}`);
        console.log(`   User ID: ${review.user_id}`);
        console.log(`   Rating: ${review.rating}/5`);
        console.log(`   Text: ${review.review_text?.substring(0, 50)}...`);
        console.log(`   Created: ${review.created_at}`);
        console.log('');
      });
      
      // Test with the first review
      const firstReview = reviews[0];
      console.log('🧪 Testing with first review:');
      console.log(`Review user_id: ${firstReview.user_id}`);
      
      // Simulate what would happen in the browser
      console.log('\n💡 To see delete button in browser:');
      console.log('1. Open browser console');
      console.log('2. Run: localStorage.setItem("user_session_id", "' + firstReview.user_id + '")');
      console.log('3. Refresh the page');
      console.log('4. The delete button should now be visible for this review');
      
    } else {
      console.log('No reviews found. Create a review first to test the delete functionality.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkExistingReviews();
