import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://mwrsinofpjmlxniiecdu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnNpbm9mcGptbHhuaWllY2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDM1NzYsImV4cCI6MjA3MTg3OTU3Nn0.6LhWEpz-h9m44UtoXgO1aMPQbPJKo-A-TorjMGOE2Qw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Simulate the frontend saveReviewToSupabase function
async function simulateFrontendSave() {
  try {
    console.log('🧪 Simulating frontend review save process...\n');
    
    // Simulate the review data that would come from the frontend
    const reviewData = {
      collegeCode: 'E002', // Real college code
      rating: 4,
      review_text: 'This is a test review from the frontend simulation',
      faculty_rating: 4,
      infrastructure_rating: 3,
      placements_rating: 5,
    };
    
    console.log('📝 Review data to save:', reviewData);
    
    // Step 1: Check if the college exists in the database
    console.log('\n🏫 Step 1: Checking if college exists...');
    let { data: collegeData, error: collegeError } = await supabase
      .from('colleges')
      .select('id')
      .eq('code', reviewData.collegeCode)
      .single();

    if (collegeError || !collegeData) {
      console.log('❌ College not found, creating new college...');
      // Create the college if it doesn't exist
      const { data: newCollege, error: createCollegeError } = await supabase
        .from('colleges')
        .insert({
          code: reviewData.collegeCode,
          name: `College ${reviewData.collegeCode}` // We'll get the real name from our JSON
        })
        .select()
        .single();

      if (createCollegeError || !newCollege) {
        console.log('❌ Error creating college:', createCollegeError?.message);
        console.log('   This would cause the review to fall back to localStorage!');
        return;
      }
      collegeData = newCollege;
      console.log('✅ Created college:', collegeData);
    } else {
      console.log('✅ College found:', collegeData);
    }

    // Step 2: Generate a session ID (like the frontend does)
    const userSessionId = crypto.randomUUID();
    console.log('\n🆔 Step 2: Generated session ID:', userSessionId);

    // Step 3: Insert the review
    console.log('\n💾 Step 3: Inserting review...');
    const { data, error } = await supabase
      .from('college_reviews')
      .insert({
        college_id: collegeData.id,
        session_id: userSessionId, // Use session_id for anonymous users
        rating: reviewData.rating,
        review_text: reviewData.review_text,
        faculty_rating: reviewData.faculty_rating,
        infrastructure_rating: reviewData.infrastructure_rating,
        placements_rating: reviewData.placements_rating,
        helpful_votes: 0,
        verified: false
      })
      .select()
      .single();

    if (error) {
      console.log('❌ Error saving review to Supabase:', error.message);
      console.log('   This would cause the review to fall back to localStorage!');
      console.log('   Error details:', error);
      return;
    }

    console.log('✅ Review saved successfully to Supabase!');
    console.log('   Review ID:', data.id);
    console.log('   Session ID:', data.session_id);
    console.log('   College ID:', data.college_id);
    
    // Step 4: Verify the review can be read back
    console.log('\n🔍 Step 4: Verifying review can be read back...');
    const { data: readReview, error: readError } = await supabase
      .from('college_reviews')
      .select('*')
      .eq('id', data.id)
      .single();
    
    if (readError) {
      console.log('❌ Error reading back review:', readError.message);
    } else {
      console.log('✅ Review can be read back successfully!');
      console.log('   This means the review is properly stored in Supabase');
    }
    
    // Step 5: Clean up
    console.log('\n🧹 Step 5: Cleaning up test review...');
    const { error: deleteError } = await supabase
      .from('college_reviews')
      .delete()
      .eq('id', data.id);
    
    if (deleteError) {
      console.log('❌ Error deleting test review:', deleteError.message);
    } else {
      console.log('✅ Test review deleted successfully');
    }
    
    console.log('\n🎉 Frontend save simulation completed successfully!');
    console.log('   If this works, the issue might be in the frontend code logic.');
    console.log('   Check the browser console for errors when adding reviews.');
    
  } catch (error) {
    console.error('❌ Error during simulation:', error);
  }
}

simulateFrontendSave();
