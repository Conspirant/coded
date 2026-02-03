#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function main() {
  const rootDir = path.resolve(__dirname, '..');
  console.log('Optimizing kcet_cutoffs.json data file...');
  
  const inputFile = path.join(rootDir, 'public', 'data', 'kcet_cutoffs.json');
  const outputFile = path.join(rootDir, 'public', 'data', 'cutoffs-optimized.json');
  
  try {
    console.log('Reading large data file...');
    const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    
    console.log(`Original file size: ${(fs.statSync(inputFile).size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total entries: ${data.cutoffs.length}`);
    
    // Extract only essential fields and clean up the data
    const optimizedCutoffs = data.cutoffs.map(entry => ({
      institute: entry.institute_code + ' - ' + (entry.institute.split('E001')[1] || entry.institute).trim(),
      institute_code: entry.institute_code,
      course: entry.course,
      category: entry.category,
      cutoff_rank: entry.cutoff_rank,
      year: entry.year,
      round: entry.round
    }));
    
    // Create optimized data structure
    const optimizedData = {
      metadata: {
        last_updated: new Date().toISOString(),
        total_entries: optimizedCutoffs.length,
        original_file: 'kcet_cutoffs.json',
        notes: 'Optimized version with essential data only'
      },
      cutoffs: optimizedCutoffs
    };
    
    // Save optimized file
    fs.writeFileSync(outputFile, JSON.stringify(optimizedData, null, 2), 'utf8');
    
    const optimizedSize = fs.statSync(outputFile).size / 1024 / 1024;
    console.log(`Optimized file size: ${optimizedSize.toFixed(2)} MB`);
    console.log(`Size reduction: ${((1 - optimizedSize / (fs.statSync(inputFile).size / 1024 / 1024)) * 100).toFixed(1)}%`);
    
    // Also create a very small sample for testing
    const sampleData = {
      metadata: {
        last_updated: new Date().toISOString(),
        total_entries: 100,
        original_file: 'kcet_cutoffs.json',
        notes: 'Sample data for testing (first 100 entries)'
      },
      cutoffs: optimizedCutoffs.slice(0, 100)
    };
    
    const sampleFile = path.join(rootDir, 'public', 'data', 'cutoffs-sample.json');
    fs.writeFileSync(sampleFile, JSON.stringify(sampleData, null, 2), 'utf8');
    
    console.log(`Sample file created: ${sampleFile}`);
    console.log('✅ Data optimization complete!');
    
  } catch (error) {
    console.error('Error optimizing data:', error.message);
  }
}

main();
