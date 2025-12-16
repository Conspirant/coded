import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://mwrsinofpjmlxniiecdu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnNpbm9mcGptbHhuaWllY2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDM1NzYsImV4cCI6MjA3MTg3OTU3Nn0.6LhWEpz-h9m44UtoXgO1aMPQbPJKo-A-TorjMGOE2Qw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fixTestReviewCollege() {
  try {
    console.log('🔧 Fixing test review to use a real college...\n');
    
    // Step 1: Get the test review
    const { data: reviews, error: reviewsError } = await supabase
      .from('college_reviews')
      .select('*')
      .limit(1);
    
    if (reviewsError || !reviews || reviews.length === 0) {
      console.log('❌ No reviews found to fix');
      return;
    }
    
    const review = reviews[0];
    console.log('Current review:', {
      id: review.id,
      college_id: review.college_id,
      rating: review.rating,
      text: review.review_text?.substring(0, 50) + '...'
    });
    
    // Step 2: Get a real college from the colleges list
    console.log('\n📋 Getting real college data...');
    const response = await fetch('https://kcet-coded.vercel.app/colleges-list.json');
    if (!response.ok) {
      console.log('❌ Could not fetch colleges list');
      return;
    }
    
    const colleges = await response.json();
    const firstCollege = colleges[0];
    console.log('Using college:', {
      code: firstCollege.code,
      name: firstCollege.name
    });
    
    // Step 3: Check if this college exists in database
    let { data: existingCollege, error: collegeError } = await supabase
      .from('colleges')
      .select('id, code, name')
      .eq('code', firstCollege.code)
      .single();
    
    if (collegeError || !existingCollege) {
      console.log('College not in database, creating it...');
      const { data: newCollege, error: createError } = await supabase
        .from('colleges')
        .insert({
          code: firstCollege.code,
          name: firstCollege.name
        })
        .select()
        .single();
      
      if (createError || !newCollege) {
        console.log('❌ Error creating college:', createError?.message);
        return;
      }
      
      existingCollege = newCollege;
      console.log('✅ Created college:', existingCollege);
    } else {
      console.log('✅ College exists:', existingCollege);
    }
    
    // Step 4: Update the review to use the real college
    console.log('\n🔄 Updating review to use real college...');
    const { error: updateError } = await supabase
      .from('college_reviews')
      .update({ 
        college_id: existingCollege.id,
        review_text: `This is a test review for ${firstCollege.name}. The review system is now working properly and visible to all users!`
      })
      .eq('id', review.id);
    
    if (updateError) {
      console.log('❌ Error updating review:', updateError.message);
    } else {
      console.log('✅ Review updated successfully!');
      console.log(`   Review now belongs to: ${firstCollege.code} - ${firstCollege.name}`);
      console.log('   The review should now be visible on the website');
    }
    
    // Step 5: Verify the fix
    console.log('\n🧪 Verifying the fix...');
    const { data: updatedReview, error: verifyError } = await supabase
      .from('college_reviews')
      .select(`
        *,
        colleges!inner(code, name)
      `)
      .eq('id', review.id)
      .single();
    
    if (verifyError) {
      console.log('❌ Error verifying:', verifyError.message);
    } else {
      console.log('✅ Verification successful:');
      console.log(`   Review ID: ${updatedReview.id}`);
      console.log(`   College: ${updatedReview.colleges.code} - ${updatedReview.colleges.name}`);
      console.log(`   Rating: ${updatedReview.rating}/5`);
      console.log(`   Text: ${updatedReview.review_text?.substring(0, 100)}...`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixTestReviewCollege();
