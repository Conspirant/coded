#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function main() {
  const rootDir = path.resolve(__dirname, '..');
  const cutoffsPath = path.join(rootDir, 'public', 'data', 'cutoffs.json');
  
  try {
    console.log('Testing cutoffs.json accessibility...');
    
    if (!fs.existsSync(cutoffsPath)) {
      console.error('❌ cutoffs.json not found!');
      return;
    }
    
    const data = JSON.parse(fs.readFileSync(cutoffsPath, 'utf8'));
    
    console.log('✅ cutoffs.json loaded successfully');
    console.log(`📊 Total records: ${data.metadata.total_entries}`);
    console.log(`📁 Files processed: ${data.metadata.total_files_processed}`);
    console.log(`🕒 Last updated: ${data.metadata.last_updated}`);
    
    if (data.metadata.data_sources) {
      console.log(`📋 Data sources: ${data.metadata.data_sources.join(', ')}`);
    }
    
    // Check years
    const years = [...new Set(data.cutoffs.map(item => item.year))].sort();
    console.log(`📅 Available years: ${years.join(', ')}`);
    
    // Check sample records
    console.log('\n📝 Sample records:');
    data.cutoffs.slice(0, 3).forEach((record, index) => {
      console.log(`${index + 1}. ${record.institute_code} - ${record.institute}`);
      console.log(`   Course: ${record.course}, Category: ${record.category}`);
      console.log(`   Cutoff: ${record.cutoff_rank}, Year: ${record.year}, Round: ${record.round}`);
      console.log('');
    });
    
    // Check data structure
    const sampleRecord = data.cutoffs[0];
    const requiredFields = ['institute', 'institute_code', 'course', 'category', 'cutoff_rank', 'year', 'round'];
    const missingFields = requiredFields.filter(field => !(field in sampleRecord));
    
    if (missingFields.length === 0) {
      console.log('✅ Data structure is correct - all required fields present');
    } else {
      console.log(`❌ Missing fields: ${missingFields.join(', ')}`);
    }
    
    console.log('\n🎉 cutoffs.json is ready for use!');
    
  } catch (error) {
    console.error('❌ Error testing cutoffs.json:', error.message);
  }
}

main();
