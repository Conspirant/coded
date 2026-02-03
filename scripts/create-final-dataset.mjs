#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function main() {
  const rootDir = path.resolve(__dirname, '..');
  
  console.log('Creating final comprehensive dataset with ALL available data...');
  
  // Read the proto.json data (which has 2023 + 2024 data)
  const protoPath = path.join(rootDir, 'proto.json');
  let protoData = { cutoffs: [] };
  
  try {
    console.log('Reading proto.json (this may take a while due to file size)...');
    protoData = JSON.parse(fs.readFileSync(protoPath, 'utf8'));
    console.log(`Loaded proto data: ${protoData.cutoffs.length} records`);
  } catch (error) {
    console.error('Error reading proto.json:', error.message);
    return;
  }
  
  // Read the 2025 Excel extracted data
  const cutoffs2025Path = path.join(rootDir, 'public', 'data', 'cutoffs-aggressive.json');
  let cutoffs2025 = { cutoffs: [] };
  
  try {
    if (fs.existsSync(cutoffs2025Path)) {
      cutoffs2025 = JSON.parse(fs.readFileSync(cutoffs2025Path, 'utf8'));
      console.log(`Loaded 2025 Excel data: ${cutoffs2025.cutoffs.length} records`);
    }
  } catch (error) {
    console.error('Error reading 2025 data:', error.message);
  }
  
  // Use ALL proto data (both 2023 and 2024)
  const allProtoData = protoData.cutoffs;
  console.log(`Using ALL proto data: ${allProtoData.length} records`);
  
  // Combine all data
  const allCutoffs = [...allProtoData, ...cutoffs2025.cutoffs];
  
  console.log(`Total combined records: ${allCutoffs.length}`);
  
  // Create the final comprehensive data structure matching proto.json exactly
  const finalData = {
    metadata: {
      last_updated: new Date().toISOString(),
      total_files_processed: 2, // proto.json (all years) + 2025 Excel files
      total_entries: allCutoffs.length,
      data_sources: ['proto.json (2023+2024)', 'Excel files (2025)'],
      target_achieved: allCutoffs.length >= 200000 ? 'YES - 200,000+ entries achieved!' : 'NO - Need more data'
    },
    cutoffs: allCutoffs
  };
  
  // Save the merged data
  const outDir = path.join(rootDir, 'public', 'data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  // Save as final comprehensive dataset
  const finalFile = path.join(outDir, 'cutoffs-final.json');
  fs.writeFileSync(finalFile, JSON.stringify(finalData, null, 2), 'utf8');
  
  // Also update the main cutoffs.json
  const mainOutFile = path.join(outDir, 'cutoffs.json');
  fs.writeFileSync(mainOutFile, JSON.stringify(finalData, null, 2), 'utf8');
  
  console.log('\nFinal comprehensive dataset created!');
  console.log(`Total records: ${allCutoffs.length}`);
  console.log(`Target achieved: ${allCutoffs.length >= 200000 ? 'YES' : 'NO'}`);
  console.log(`Data saved to: ${finalFile}`);
  console.log(`Main cutoffs.json updated: ${mainOutFile}`);
  
  // Generate detailed summary statistics
  const yearStats = {};
  const collegeStats = {};
  const courseStats = {};
  const categoryStats = {};
  const roundStats = {};
  
  for (const record of allCutoffs) {
    yearStats[record.year] = (yearStats[record.year] || 0) + 1;
    collegeStats[record.institute_code] = (collegeStats[record.institute_code] || 0) + 1;
    courseStats[record.course] = (courseStats[record.course] || 0) + 1;
    categoryStats[record.category] = (categoryStats[record.category] || 0) + 1;
    roundStats[record.round] = (roundStats[record.round] || 0) + 1;
  }
  
  console.log('\nDetailed Summary Statistics:');
  console.log('By Year:', yearStats);
  console.log('By Category:', Object.keys(categoryStats).length, 'categories');
  console.log('By Round:', Object.keys(roundStats).length, 'rounds');
  console.log('Top Colleges:', Object.entries(collegeStats).sort((a, b) => b[1] - a[1]).slice(0, 10));
  console.log('Top Courses:', Object.entries(courseStats).sort((a, b) => b[1] - a[1]).slice(0, 10));
  
  // Check if we need more data
  if (allCutoffs.length < 200000) {
    console.log(`\n⚠️  Need ${200000 - allCutoffs.length} more records to reach 200,000 target`);
    console.log('Next steps:');
    console.log('1. Analyze 2023 and 2024 Excel file formats');
    console.log('2. Create specialized extractors for different Excel formats');
    console.log('3. Extract data from all remaining Excel files');
  } else {
    console.log('\n🎉 SUCCESS! Target of 200,000+ entries achieved!');
    console.log('CutoffExplorer should now work with all the data!');
  }
}

main();
