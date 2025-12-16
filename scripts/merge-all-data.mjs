#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function main() {
  const rootDir = path.resolve(__dirname, '..');
  
  console.log('Merging all cutoff data...');
  
  // Read the newly extracted 2025 data
  const cutoffs2025Path = path.join(rootDir, 'public', 'data', 'cutoffs.json');
  let cutoffs2025 = { cutoffs: [] };
  
  try {
    if (fs.existsSync(cutoffs2025Path)) {
      cutoffs2025 = JSON.parse(fs.readFileSync(cutoffs2025Path, 'utf8'));
      console.log(`Loaded 2025 data: ${cutoffs2025.cutoffs.length} records`);
    }
  } catch (error) {
    console.error('Error reading 2025 data:', error.message);
  }
  
  // Read the proto.json data (which has 2023 data)
  const protoPath = path.join(rootDir, 'proto.json');
  let protoData = { cutoffs: [] };
  
  try {
    if (fs.existsSync(protoPath)) {
      console.log('Reading proto.json (this may take a while due to file size)...');
      protoData = JSON.parse(fs.readFileSync(protoPath, 'utf8'));
      console.log(`Loaded proto data: ${protoData.cutoffs.length} records`);
    }
  } catch (error) {
    console.error('Error reading proto.json:', error.message);
  }
  
  // Filter proto data to only include 2023 data (since we have 2025 from Excel)
  const proto2023Data = protoData.cutoffs.filter(item => item.year === '2023');
  console.log(`Filtered proto 2023 data: ${proto2023Data.length} records`);
  
  // Combine all data
  const allCutoffs = [...proto2023Data, ...cutoffs2025.cutoffs];
  
  // Create the final comprehensive data structure
  const finalData = {
    metadata: {
      last_updated: new Date().toISOString(),
      total_files_processed: 2, // proto.json + 2025 Excel files
      total_entries: allCutoffs.length,
      data_sources: ['proto.json (2023)', 'Excel files (2025)']
    },
    cutoffs: allCutoffs
  };
  
  // Save the merged data
  const outDir = path.join(rootDir, 'public', 'data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  const outFile = path.join(outDir, 'cutoffs-complete.json');
  fs.writeFileSync(outFile, JSON.stringify(finalData, null, 2), 'utf8');
  
  // Also update the main cutoffs.json
  const mainOutFile = path.join(outDir, 'cutoffs.json');
  fs.writeFileSync(mainOutFile, JSON.stringify(finalData, null, 2), 'utf8');
  
  console.log('\nMerge complete!');
  console.log(`Total records: ${allCutoffs.length}`);
  console.log(`Data saved to: ${outFile}`);
  console.log(`Main cutoffs.json updated: ${mainOutFile}`);
  
  // Generate summary statistics
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
  
  console.log('\nSummary Statistics:');
  console.log('By Year:', yearStats);
  console.log('By Category:', Object.keys(categoryStats).length, 'categories');
  console.log('By Round:', Object.keys(roundStats).length, 'rounds');
  console.log('Top Colleges:', Object.entries(collegeStats).sort((a, b) => b[1] - a[1]).slice(0, 10));
  console.log('Top Courses:', Object.entries(courseStats).sort((a, b) => b[1] - a[1]).slice(0, 10));
}

main();
