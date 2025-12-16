import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://mwrsinofpjmlxniiecdu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnNpbm9mcGptbHhuaWllY2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDM1NzYsImV4cCI6MjA3MTg3OTU3Nn0.6LhWEpz-h9m44UtoXgO1aMPQbPJKo-A-TorjMGOE2Qw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fixDatabaseComplete() {
  try {
    console.log('🔧 Fixing database for review visibility...\n');
    
    // Step 1: Test current state
    console.log('1. Testing current database state...');
    
    // Test reading reviews
    const { data: reviews, error: reviewError } = await supabase
      .from('college_reviews')
      .select('*')
      .limit(1);
    
    if (reviewError) {
      console.log('❌ Cannot read reviews:', reviewError.message);
    } else {
      console.log(`✅ Can read reviews: ${reviews?.length || 0} found`);
    }
    
    // Test reading colleges
    const { data: colleges, error: collegeError } = await supabase
      .from('colleges')
      .select('*')
      .limit(1);
    
    if (collegeError) {
      console.log('❌ Cannot read colleges:', collegeError.message);
    } else {
      console.log(`✅ Can read colleges: ${colleges?.length || 0} found`);
    }
    
    // Step 2: Apply RLS fixes
    console.log('\n2. Applying RLS policy fixes...');
    console.log('⚠️  RLS policies need to be updated in Supabase dashboard.');
    console.log('Please run the following SQL in your Supabase SQL Editor:');
    console.log('\n' + '='.repeat(80));
    console.log(`
-- Fix RLS policies to allow public access to reviews and colleges

-- Drop restrictive policies
DROP POLICY IF EXISTS "Users can manage their own reviews" ON public.college_reviews;
DROP POLICY IF EXISTS "Users can view and update their own profile" ON public.users;

-- Allow public access to reviews
CREATE POLICY "Anyone can view reviews" 
ON public.college_reviews FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert reviews" 
ON public.college_reviews FOR INSERT 
WITH CHECK (true);

-- Allow public access to users (for anonymous reviews)
CREATE POLICY "Anyone can view users" 
ON public.users FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert users" 
ON public.users FOR INSERT 
WITH CHECK (true);

-- Allow public access to colleges
CREATE POLICY "Anyone can insert colleges" 
ON public.colleges FOR INSERT 
WITH CHECK (true);
    `);
    console.log('='.repeat(80));
    
    // Step 3: Wait for user to apply RLS policies
    console.log('\n3. After applying the RLS policies above, press Enter to continue...');
    console.log('   (Or run this script again after applying the policies)');
    
    // For now, let's try to populate colleges anyway
    console.log('\n4. Attempting to populate colleges...');
    
    // Read colleges data
    const collegesData = JSON.parse(fs.readFileSync('./public/colleges-list.json', 'utf8'));
    console.log(`Found ${collegesData.length} colleges to insert`);
    
    // Clean up college names
    const cleanedColleges = collegesData.map(college => ({
      code: college.code,
      name: college.name
        .replace(/^E:\s*/, '')
        .replace(/\s*:\s*$/, '')
        .replace(/\s+/g, ' ')
        .trim(),
      type: 'engineering'
    }));
    
    // Try to insert a few colleges as a test
    const testColleges = cleanedColleges.slice(0, 5);
    console.log('Testing with 5 colleges...');
    
    const { data: insertData, error: insertError } = await supabase
      .from('colleges')
      .upsert(testColleges, { onConflict: 'code' })
      .select('id, code, name');
    
    if (insertError) {
      console.log('❌ Still cannot insert colleges:', insertError.message);
      console.log('\n📋 SUMMARY:');
      console.log('1. RLS policies need to be updated in Supabase dashboard');
      console.log('2. Run the SQL provided above in Supabase SQL Editor');
      console.log('3. Then run this script again to populate colleges');
      console.log('4. After that, reviews will be visible to all users');
    } else {
      console.log('✅ Successfully inserted test colleges!');
      console.log('Inserted colleges:', insertData);
      
      // Now try to insert all colleges
      console.log('\n5. Inserting all colleges...');
      const batchSize = 50;
      let insertedCount = 0;
      
      for (let i = 0; i < cleanedColleges.length; i += batchSize) {
        const batch = cleanedColleges.slice(i, i + batchSize);
        
        const { data, error } = await supabase
          .from('colleges')
          .upsert(batch, { onConflict: 'code' })
          .select('id, code, name');
        
        if (error) {
          console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
          continue;
        }
        
        insertedCount += data?.length || 0;
        console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}: ${data?.length || 0} colleges`);
      }
      
      console.log(`\n🎉 Success! Inserted ${insertedCount} colleges`);
      console.log('Now reviews should be visible to all users!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixDatabaseComplete();
