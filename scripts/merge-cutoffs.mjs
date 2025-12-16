#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function main() {
  const rootDir = path.resolve(__dirname, '..');
  const dataDir = path.join(rootDir, 'public', 'data');
  
  // Read existing cutoffs
  const existingCutoffsPath = path.join(dataDir, 'cutoffs.json');
  const cutoffs2025Path = path.join(dataDir, 'cutoffs-2025.json');
  
  let existingData = { metadata: { total_entries: 0 }, cutoffs: [] };
  let data2025 = { metadata: { total_entries: 0 }, cutoffs: [] };
  
  try {
    if (fs.existsSync(existingCutoffsPath)) {
      const existingContent = fs.readFileSync(existingCutoffsPath, 'utf8');
      existingData = JSON.parse(existingContent);
      console.log(`Loaded existing data: ${existingData.cutoffs.length} records`);
    }
  } catch (error) {
    console.error('Error reading existing cutoffs:', error.message);
  }
  
  try {
    if (fs.existsSync(cutoffs2025Path)) {
      const content2025 = fs.readFileSync(cutoffs2025Path, 'utf8');
      data2025 = JSON.parse(content2025);
      console.log(`Loaded 2025 data: ${data2025.cutoffs.length} records`);
    }
  } catch (error) {
    console.error('Error reading 2025 cutoffs:', error.message);
  }
  
  // Merge the data
  const mergedCutoffs = [...existingData.cutoffs, ...data2025.cutoffs];
  
  // Create merged data structure
  const mergedData = {
    metadata: {
      last_updated: new Date().toISOString(),
      total_files_processed: (existingData.metadata.total_files_processed || 0) + (data2025.metadata.total_files_processed || 0),
      total_entries: mergedCutoffs.length
    },
    cutoffs: mergedCutoffs
  };
  
  // Save merged data
  const mergedPath = path.join(dataDir, 'cutoffs.json');
  fs.writeFileSync(mergedPath, JSON.stringify(mergedData, null, 2), 'utf8');
  
  console.log('\nMerge complete!');
  console.log(`Total records: ${mergedCutoffs.length}`);
  console.log(`Merged data saved to: ${mergedPath}`);
  
  // Generate summary statistics
  const yearStats = {};
  const collegeStats = {};
  const courseStats = {};
  const categoryStats = {};
  const roundStats = {};
  
  for (const record of mergedCutoffs) {
    yearStats[record.year] = (yearStats[record.year] || 0) + 1;
    collegeStats[record.institute_code] = (collegeStats[record.institute_code] || 0) + 1;
    courseStats[record.course] = (courseStats[record.course] || 0) + 1;
    categoryStats[record.category] = (categoryStats[record.category] || 0) + 1;
    roundStats[record.round] = (roundStats[record.round] || 0) + 1;
  }
  
  console.log('\nSummary Statistics:');
  console.log('By Year:', yearStats);
  console.log('By Category:', categoryStats);
  console.log('By Round:', roundStats);
  console.log('Top Colleges:', Object.entries(collegeStats).sort((a, b) => b[1] - a[1]).slice(0, 10));
  console.log('Top Courses:', Object.entries(courseStats).sort((a, b) => b[1] - a[1]).slice(0, 10));
}

main();
