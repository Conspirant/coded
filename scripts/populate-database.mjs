import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = "https://mwrsinofpjmlxniiecdu.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "your-service-key-here";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function populateDatabase() {
  try {
    console.log('Starting database population...');
    
    // Read the extracted data
    const dataPath = path.join(process.cwd(), 'public', 'data', 'cutoffs.json');
    const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    console.log(`Found ${rawData.length} records to process`);
    
    // First, let's create unique colleges and branches
    const colleges = new Map();
    const branches = new Map();
    
    rawData.forEach(record => {
      // Collect colleges
      if (record.colleges?.code) {
        colleges.set(record.colleges.code, {
          code: record.colleges.code,
          name: record.colleges.name,
          location: record.colleges.location,
          district: record.colleges.district,
          type: 'engineering'
        });
      }
      
      // Collect branches
      if (record.branches?.code) {
        branches.set(record.branches.code, {
          code: record.branches.code,
          name: record.branches.name,
          category: record.branches.name,
          duration: 4
        });
      }
    });
    
    console.log(`Found ${colleges.size} unique colleges and ${branches.size} unique branches`);
    
    // Insert colleges
    console.log('Inserting colleges...');
    const collegeData = Array.from(colleges.values());
    const { data: insertedColleges, error: collegeError } = await supabase
      .from('colleges')
      .upsert(collegeData, { onConflict: 'code' })
      .select();
    
    if (collegeError) {
      console.error('Error inserting colleges:', collegeError);
      return;
    }
    
    console.log(`Inserted ${insertedColleges?.length || 0} colleges`);
    
    // Insert branches
    console.log('Inserting branches...');
    const branchData = Array.from(branches.values());
    const { data: insertedBranches, error: branchError } = await supabase
      .from('branches')
      .upsert(branchData, { onConflict: 'code' })
      .select();
    
    if (branchError) {
      console.error('Error inserting branches:', branchError);
      return;
    }
    
    console.log(`Inserted ${insertedBranches?.length || 0} branches`);
    
    // Create lookup maps
    const collegeLookup = new Map();
    const branchLookup = new Map();
    
    insertedColleges?.forEach(college => {
      collegeLookup.set(college.code, college.id);
    });
    
    insertedBranches?.forEach(branch => {
      branchLookup.set(branch.code, branch.id);
    });
    
    // Prepare cutoff data
    console.log('Preparing cutoff data...');
    const cutoffData = rawData
      .filter(record => 
        record.colleges?.code && 
        record.branches?.code && 
        collegeLookup.has(record.colleges.code) && 
        branchLookup.has(record.branches.code)
      )
      .map(record => ({
        college_id: collegeLookup.get(record.colleges.code),
        branch_id: branchLookup.get(record.branches.code),
        year: record.year,
        round: record.round,
        category: record.category,
        seat_type: record.seat_type,
        quota_type: record.quota_type,
        opening_rank: record.opening_rank,
        closing_rank: record.closing_rank,
        seats_available: record.seats_available,
        source_url: record.source_url,
        verified: record.verified
      }));
    
    console.log(`Prepared ${cutoffData.length} cutoff records`);
    
    // Insert cutoffs in batches
    const batchSize = 1000;
    let insertedCount = 0;
    
    for (let i = 0; i < cutoffData.length; i += batchSize) {
      const batch = cutoffData.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('cutoffs')
        .upsert(batch, { 
          onConflict: 'college_id,branch_id,year,round,category,seat_type,quota_type' 
        });
      
      if (error) {
        console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error);
        continue;
      }
      
      insertedCount += batch.length;
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}: ${batch.length} records`);
    }
    
    console.log(`\nDatabase population complete!`);
    console.log(`Total records inserted: ${insertedCount}`);
    
  } catch (error) {
    console.error('Database population failed:', error);
  }
}

// Run the population script
populateDatabase();
