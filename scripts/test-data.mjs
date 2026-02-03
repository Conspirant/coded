#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function main() {
  const rootDir = path.resolve(__dirname, '..');
  const dataPath = path.join(rootDir, 'public', 'data', 'cutoffs.json');
  
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    console.log('Data Structure Test Results:');
    console.log('============================');
    console.log(`Total entries: ${data.metadata.total_entries}`);
    console.log(`Files processed: ${data.metadata.total_files_processed}`);
    console.log(`Last updated: ${data.metadata.last_updated}`);
    
    // Check years
    const years = [...new Set(data.cutoffs.map(item => item.year))].sort();
    console.log(`\nAvailable years: ${years.join(', ')}`);
    
    // Check 2025 data specifically
    const data2025 = data.cutoffs.filter(item => item.year === '2025');
    console.log(`\n2025 data: ${data2025.length} records`);
    
    if (data2025.length > 0) {
      console.log('\nSample 2025 records:');
      data2025.slice(0, 3).forEach((record, index) => {
        console.log(`${index + 1}. ${record.institute_code} - ${record.institute}`);
        console.log(`   Course: ${record.course}`);
        console.log(`   Category: ${record.category}, Cutoff: ${record.cutoff_rank}`);
        console.log(`   Round: ${record.round}`);
        console.log('');
      });
    }
    
    // Check categories
    const categories = [...new Set(data.cutoffs.map(item => item.category))].sort();
    console.log(`Available categories: ${categories.join(', ')}`);
    
    // Check rounds
    const rounds = [...new Set(data.cutoffs.map(item => item.round))].sort();
    console.log(`Available rounds: ${rounds.join(', ')}`);
    
    // Check top colleges
    const collegeStats = {};
    data.cutoffs.forEach(record => {
      collegeStats[record.institute_code] = (collegeStats[record.institute_code] || 0) + 1;
    });
    
    const topColleges = Object.entries(collegeStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    console.log('\nTop 5 colleges by record count:');
    topColleges.forEach(([code, count]) => {
      console.log(`${code}: ${count} records`);
    });
    
    // Check if data structure matches proto.json format
    const sampleRecord = data.cutoffs[0];
    const requiredFields = ['institute', 'institute_code', 'course', 'category', 'cutoff_rank', 'year', 'round'];
    const missingFields = requiredFields.filter(field => !(field in sampleRecord));
    
    if (missingFields.length === 0) {
      console.log('\n✅ Data structure matches proto.json format');
    } else {
      console.log(`\n❌ Missing fields: ${missingFields.join(', ')}`);
    }
    
    console.log('\n✅ Data test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing data:', error.message);
  }
}

main();
