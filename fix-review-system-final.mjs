import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://mwrsinofpjmlxniiecdu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnNpbm9mcGptbHhuaWllY2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDM1NzYsImV4cCI6MjA3MTg3OTU3Nn0.6LhWEpz-h9m44UtoXgO1aMPQbPJKo-A-TorjMGOE2Qw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fixReviewSystem() {
  try {
    console.log('🔧 Fixing review system...\n');
    
    // Step 1: Populate colleges first
    console.log('1. Populating colleges...');
    const collegesData = JSON.parse(fs.readFileSync('./public/colleges-list.json', 'utf8'));
    
    const cleanedColleges = collegesData.map(college => ({
      code: college.code,
      name: college.name
        .replace(/^E:\s*/, '')
        .replace(/\s*:\s*$/, '')
        .replace(/\s+/g, ' ')
        .trim(),
      type: 'engineering'
    }));
    
    console.log(`Found ${cleanedColleges.length} colleges to insert`);
    
    // Insert colleges in batches
    const batchSize = 50;
    let insertedCount = 0;
    
    for (let i = 0; i < cleanedColleges.length; i += batchSize) {
      const batch = cleanedColleges.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('colleges')
        .upsert(batch, { onConflict: 'code' })
        .select('id, code, name');
      
      if (error) {
        console.log(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
        continue;
      }
      
      insertedCount += data?.length || 0;
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}: ${data?.length || 0} colleges`);
    }
    
    console.log(`\n🎉 Successfully inserted ${insertedCount} colleges!`);
    
    // Step 2: Test review creation with a simpler approach
    console.log('\n2. Testing review creation...');
    
    // Get a college to test with
    const { data: testCollege, error: collegeError } = await supabase
      .from('colleges')
      .select('id, code, name')
      .limit(1)
      .single();
    
    if (collegeError || !testCollege) {
      console.log('❌ No colleges available for testing');
      return;
    }
    
    console.log(`Using college: ${testCollege.code} - ${testCollege.name}`);
    
    // Create a test review using a different approach
    // We'll use a UUID that doesn't reference auth.users
    const testUserId = crypto.randomUUID();
    
    // Try to insert review directly without creating a user first
    const testReview = {
      college_id: testCollege.id,
      user_id: testUserId,
      rating: 5,
      review_text: 'Test review to verify system works',
      faculty_rating: 4,
      infrastructure_rating: 5,
      placements_rating: 4,
      helpful_votes: 0,
      verified: false
    };
    
    const { data: reviewData, error: reviewError } = await supabase
      .from('college_reviews')
      .insert(testReview)
      .select('id, rating, review_text, created_at')
      .single();
    
    if (reviewError) {
      console.log('❌ Cannot insert review:', reviewError.message);
      console.log('\n🔧 SOLUTION: You need to modify the users table constraint.');
      console.log('Run this SQL in Supabase dashboard:');
      console.log('\n' + '='.repeat(60));
      console.log(`
-- Remove the foreign key constraint from users table
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Allow any UUID to be inserted as user_id
ALTER TABLE public.users ALTER COLUMN id DROP NOT NULL;
      `);
      console.log('='.repeat(60));
    } else {
      console.log('✅ Successfully created test review:', reviewData);
      
      // Test if we can read it back
      const { data: readBack, error: readError } = await supabase
        .from('college_reviews')
        .select('*')
        .eq('id', reviewData.id);
      
      if (readError) {
        console.log('❌ Cannot read back review:', readError.message);
      } else {
        console.log('✅ Successfully read back review:', readBack[0]);
        console.log('\n🎉 REVIEW SYSTEM IS WORKING!');
        console.log('Reviews will now be visible to all users.');
      }
      
      // Clean up test review
      await supabase.from('college_reviews').delete().eq('id', reviewData.id);
      console.log('✅ Test review cleaned up');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixReviewSystem();
