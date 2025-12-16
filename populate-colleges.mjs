import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://mwrsinofpjmlxniiecdu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13cnNpbm9mcGptbHhuaWllY2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDM1NzYsImV4cCI6MjA3MTg3OTU3Nn0.6LhWEpz-h9m44UtoXgO1aMPQbPJKo-A-TorjMGOE2Qw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function populateColleges() {
  try {
    console.log('🏫 Populating colleges in database...\n');
    
    // Read colleges data
    const collegesData = JSON.parse(fs.readFileSync('./public/colleges-list.json', 'utf8'));
    console.log(`Found ${collegesData.length} colleges to insert`);
    
    // Clean up college names (remove "E:" prefix and trailing ":")
    const cleanedColleges = collegesData.map(college => ({
      code: college.code,
      name: college.name
        .replace(/^E:\s*/, '')   // Remove leading "E:" prefix
        .replace(/\s*:\s*$/, '') // Remove trailing ":" and spaces
        .replace(/\s+/g, ' ')    // Replace multiple spaces with single space
        .trim(),
      type: 'engineering'
    }));
    
    console.log('Sample cleaned college:', cleanedColleges[0]);
    
    // Insert colleges in batches
    const batchSize = 50;
    let insertedCount = 0;
    
    for (let i = 0; i < cleanedColleges.length; i += batchSize) {
      const batch = cleanedColleges.slice(i, i + batchSize);
      
      console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(cleanedColleges.length / batchSize)}...`);
      
      const { data, error } = await supabase
        .from('colleges')
        .upsert(batch, { onConflict: 'code' })
        .select('id, code, name');
      
      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
        continue;
      }
      
      insertedCount += data?.length || 0;
      console.log(`✅ Inserted ${data?.length || 0} colleges`);
    }
    
    console.log(`\n🎉 College population complete!`);
    console.log(`Total colleges inserted: ${insertedCount}`);
    
    // Verify the insertion
    console.log('\n🔍 Verifying college data...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('colleges')
      .select('id, code, name')
      .limit(5);
    
    if (verifyError) {
      console.error('❌ Error verifying colleges:', verifyError.message);
    } else {
      console.log(`✅ Verification successful! Found ${verifyData?.length || 0} colleges in database`);
      if (verifyData && verifyData.length > 0) {
        console.log('Sample college:', verifyData[0]);
      }
    }
    
  } catch (error) {
    console.error('❌ Error populating colleges:', error);
  }
}

populateColleges();
