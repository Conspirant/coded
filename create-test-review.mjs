import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://mwrsinofpjmlxniiecdu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnNpbm9mcGptbHhuaWllY2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDM1NzYsImV4cCI6MjA3MTg3OTU3Nn0.6LhWEpz-h9m44UtoXgO1aMPQbPJKo-A-TorjMGOE2Qw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function createTestReview() {
  try {
    console.log('🧪 Creating test review for delete button testing...\n');
    
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
      rating: 5,
      review_text: 'This is a test review to verify delete button functionality. Please delete this review to test the feature.',
      faculty_rating: 4,
      infrastructure_rating: 5,
      placements_rating: 4,
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
    
    console.log('✅ Created test review successfully!');
    console.log(`Review ID: ${newReview.id}`);
    console.log(`User ID: ${newReview.user_id}`);
    console.log(`College: ${college.code} - ${college.name}`);
    console.log(`Rating: ${newReview.rating}/5`);
    console.log(`Text: ${newReview.review_text}`);
    
    console.log('\n📋 TO TEST DELETE BUTTON:');
    console.log('1. Open your application in a browser');
    console.log('2. Go to the Reviews section');
    console.log('3. Find the college:', college.name);
    console.log('4. Open the review modal');
    console.log('5. Open browser console (F12)');
    console.log('6. Run this command:');
    console.log(`   localStorage.setItem('user_session_id', '${newReview.user_id}')`);
    console.log('7. Refresh the page');
    console.log('8. The delete button (trash icon) should now be visible on your review');
    console.log('9. Click the delete button to test deletion');
    
    console.log('\n🔍 DEBUGGING INFO:');
    console.log('- The review should show "You" as the author');
    console.log('- A red trash icon should appear next to the helpful votes');
    console.log('- Clicking it should show a confirmation dialog');
    console.log('- Confirming should delete the review from the database');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createTestReview();
