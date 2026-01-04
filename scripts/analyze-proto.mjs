#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function main() {
  const rootDir = path.resolve(__dirname, '..');
  const protoPath = path.join(rootDir, 'proto.json');
  
  console.log('Analyzing proto.json structure...');
  
  try {
    console.log('Reading proto.json (this may take a while due to file size)...');
    const protoData = JSON.parse(fs.readFileSync(protoPath, 'utf8'));
    
    console.log(`Total records in proto.json: ${protoData.cutoffs.length}`);
    
    // Analyze years
    const yearStats = {};
    const roundStats = {};
    const categoryStats = {};
    const courseStats = {};
    const collegeStats = {};
    
    for (const record of protoData.cutoffs) {
      yearStats[record.year] = (yearStats[record.year] || 0) + 1;
      roundStats[record.round] = (roundStats[record.round] || 0) + 1;
      categoryStats[record.category] = (categoryStats[record.category] || 0) + 1;
      courseStats[record.course] = (courseStats[record.course] || 0) + 1;
      collegeStats[record.institute_code] = (collegeStats[record.institute_code] || 0) + 1;
    }
    
    console.log('\nYear Distribution:');
    Object.entries(yearStats).sort().forEach(([year, count]) => {
      console.log(`  ${year}: ${count} records`);
    });
    
    console.log('\nRound Distribution:');
    Object.entries(roundStats).sort().forEach(([round, count]) => {
      console.log(`  ${round}: ${count} records`);
    });
    
    console.log('\nCategory Distribution:');
    Object.entries(categoryStats).sort().forEach(([category, count]) => {
      console.log(`  ${category}: ${count} records`);
    });
    
    console.log('\nTop 10 Courses:');
    Object.entries(courseStats).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([course, count]) => {
      console.log(`  ${course}: ${count} records`);
    });
    
    console.log('\nTop 10 Colleges:');
    Object.entries(collegeStats).sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([college, count]) => {
      console.log(`  ${college}: ${count} records`);
    });
    
    // Check if we have enough data for 200,000 target
    const totalRecords = protoData.cutoffs.length;
    if (totalRecords >= 200000) {
      console.log(`\n🎉 SUCCESS! proto.json has ${totalRecords} records - enough for 200,000+ target!`);
      
      // Create the final dataset directly from proto.json
      const finalData = {
        metadata: {
          last_updated: new Date().toISOString(),
          total_files_processed: 1,
          total_entries: totalRecords,
          data_sources: ['proto.json (all years)'],
          target_achieved: 'YES - 200,000+ entries achieved!'
        },
        cutoffs: protoData.cutoffs
      };
      
      // Save the data
      const outDir = path.join(rootDir, 'public', 'data');
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
      
      const outFile = path.join(outDir, 'cutoffs.json');
      fs.writeFileSync(outFile, JSON.stringify(finalData, null, 2), 'utf8');
      
      console.log(`\nData saved to: ${outFile}`);
      console.log('CutoffExplorer should now work with 200,000+ records!');
      
    } else {
      console.log(`\n⚠️  proto.json only has ${totalRecords} records - need ${200000 - totalRecords} more`);
      console.log('Need to extract from Excel files to reach target');
    }
    
  } catch (error) {
    console.error('Error analyzing proto.json:', error.message);
  }
}

main();
