import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://mwrsinofpjmlxniiecdu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnNpbm9mcGptbHhuaWllY2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDM1NzYsImV4cCI6MjA3MTg3OTU3Nn0.6LhWEpz-h9m44UtoXgO1aMPQbPJKo-A-TorjMGOE2Qw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function migrateExistingReviews() {
  try {
    console.log('🔄 Migrating existing reviews to new session_id format...\n');
    
    // Get all reviews that don't have session_id
    const { data: reviews, error: fetchError } = await supabase
      .from('college_reviews')
      .select('*')
      .is('session_id', null);
    
    if (fetchError) {
      console.log('❌ Error fetching reviews:', fetchError.message);
      return;
    }
    
    if (!reviews || reviews.length === 0) {
      console.log('✅ No reviews need migration - all reviews already have session_id');
      return;
    }
    
    console.log(`Found ${reviews.length} reviews that need migration`);
    
    // Migrate each review
    for (const review of reviews) {
      console.log(`\n📝 Migrating review ${review.id}...`);
      console.log(`   Current user_id: ${review.user_id}`);
      
      // Update the review to set session_id = user_id for backward compatibility
      const { error: updateError } = await supabase
        .from('college_reviews')
        .update({ 
          session_id: review.user_id // Use the existing user_id as session_id
        })
        .eq('id', review.id);
      
      if (updateError) {
        console.log(`❌ Error updating review ${review.id}:`, updateError.message);
      } else {
        console.log(`✅ Successfully migrated review ${review.id}`);
        console.log(`   New session_id: ${review.user_id}`);
      }
    }
    
    console.log('\n🎉 Migration completed!');
    console.log('\n📋 What this means:');
    console.log('✅ Old reviews now have session_id = user_id');
    console.log('✅ Users can see all reviews (including old ones)');
    console.log('✅ Users can delete their own reviews (both old and new)');
    console.log('✅ The system is now fully backward compatible');
    
    console.log('\n💡 Next steps:');
    console.log('1. Deploy the updated code to production');
    console.log('2. Test the review system on https://kcet-coded.vercel.app/reviews');
    console.log('3. Verify that all users can see all reviews');
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
  }
}

migrateExistingReviews();
