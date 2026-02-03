#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to clean and normalize text
function cleanText(text) {
  if (!text) return '';
  return text.toString().trim().replace(/\s+/g, ' ');
}

// Function to extract year from filename
function extractYearFromFilename(filename) {
  const yearMatch = filename.match(/(\d{4})/);
  return yearMatch ? yearMatch[1] : '2025';
}

// Function to extract round from filename
function extractRoundFromFilename(filename) {
  if (filename.includes('round1')) return 'R1';
  if (filename.includes('round2')) return 'R2';
  if (filename.includes('round3') || filename.includes('extended')) return 'EXT';
  if (filename.includes('mock')) return 'MOCK';
  return 'R1';
}

// Function to parse 2023/2024 format Excel files
function parseExcelFile2023_2024(filePath, jsonData) {
  console.log(`  Parsing 2023/2024 format...`);
  
  const cutoffs = [];
  let currentCollege = '';
  let currentCollegeCode = '';
  
  // Find the header row (row with category names like 1G, 2AG, etc.)
  let headerRowIndex = -1;
  for (let i = 0; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (row && row[1] === '1G') {
      headerRowIndex = i;
      break;
    }
  }
  
  if (headerRowIndex === -1) {
    console.log('    No header row found');
    return cutoffs;
  }
  
  const headers = jsonData[headerRowIndex];
  console.log(`    Header row found at index ${headerRowIndex}`);
  
  // Extract first college from the header row (E001 is in the first row)
  const firstRow = jsonData[0];
  if (firstRow && firstRow[0] && firstRow[0].toString().includes('E001')) {
    currentCollegeCode = 'E001';
    currentCollege = cleanText(firstRow[1]) || 'University of Visvesvaraya College of Engineering Bangalore';
    console.log(`    Found first college: ${currentCollegeCode} - ${currentCollege}`);
  }
  
  // Process rows after the header
  for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (!row || row.length === 0) continue;
    
    // Check if this row contains college information
    const firstCell = cleanText(row[0]);
    if (firstCell && firstCell.match(/^E\d{3}/)) {
      // This is a college row
      currentCollegeCode = firstCell;
      currentCollege = cleanText(row[1]) || '';
      console.log(`    Found college: ${currentCollegeCode} - ${currentCollege}`);
      continue;
    }
    
    // Check if this row contains course information
    if (currentCollege && currentCollegeCode && row[0] && row[0].toString().length > 2) {
      const course = cleanText(row[0]);
      if (course && !course.includes('--') && !course.includes('E') && course !== 'Course Name') {
        // This is a course row, extract cutoff ranks
        for (let j = 1; j < Math.min(headers.length, row.length); j++) {
          const category = cleanText(headers[j]);
          const cutoffValue = row[j];
          
          if (category && category.length > 0 && category !== '--' && 
              cutoffValue && cutoffValue !== '--' && cutoffValue !== '') {
            
            // Convert cutoff value to number
            let cutoffRank = parseFloat(cutoffValue);
            if (isNaN(cutoffRank)) continue;
            
            // Create cutoff entry
            const cutoff = {
              institute: currentCollege,
              institute_code: currentCollegeCode,
              course: course,
              category: category,
              cutoff_rank: cutoffRank,
              year: extractYearFromFilename(path.basename(filePath)),
              round: extractRoundFromFilename(path.basename(filePath))
            };
            
            cutoffs.push(cutoff);
          }
        }
      }
    }
  }
  
  return cutoffs;
}

// Function to parse 2025 format Excel files
function parseExcelFile2025(filePath, jsonData) {
  console.log(`  Parsing 2025 format...`);
  
  const cutoffs = [];
  let currentCollege = '';
  let currentCollegeCode = '';
  
  // Find the header row (row with category names)
  let headerRowIndex = -1;
  for (let i = 0; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (row && row[0] === 'Course Name') {
      headerRowIndex = i;
      break;
    }
  }
  
  if (headerRowIndex === -1) {
    console.log('    No header row found');
    return cutoffs;
  }
  
  const headers = jsonData[headerRowIndex];
  console.log(`    Header row found at index ${headerRowIndex}`);
  
  // Find college information (row above header)
  for (let i = headerRowIndex - 1; i >= 0; i--) {
    const row = jsonData[i];
    if (row && row[0] && row[0].toString().includes('College:')) {
      const collegeText = row[0].toString();
      const collegeMatch = collegeText.match(/College:\s*E(\d{3})\s+(.+?)(?:\s+\(|$)/);
      if (collegeMatch) {
        currentCollegeCode = `E${collegeMatch[1]}`;
        currentCollege = cleanText(collegeMatch[2]);
        console.log(`    Found college: ${currentCollegeCode} - ${currentCollege}`);
        break;
      }
    }
  }
  
  // If no college found in the expected format, try alternative patterns
  if (!currentCollege || !currentCollegeCode) {
    for (let i = headerRowIndex - 1; i >= 0; i--) {
      const row = jsonData[i];
      if (row && row[0] && row[0].toString().includes('E001')) {
        const collegeText = row[0].toString();
        currentCollegeCode = 'E001';
        currentCollege = 'University of Visvesvaraya College of Engineering Bangalore';
        console.log(`    Found college (alternative): ${currentCollegeCode} - ${currentCollege}`);
        break;
      }
    }
  }
  
  if (!currentCollege || !currentCollegeCode) {
    console.log('    No college information found');
    return cutoffs;
  }
  
  // Process rows after the header
  for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    if (!row || row.length === 0) continue;
    
    // Check if this row contains course information
    if (row[0] && row[0].toString().length > 2) {
      const course = cleanText(row[0]);
      if (course && !course.includes('--') && !course.includes('E') && course !== 'Course Name') {
        // This is a course row, extract cutoff ranks
        for (let j = 1; j < Math.min(headers.length, row.length); j++) {
          const category = cleanText(headers[j]);
          const cutoffValue = row[j];
          
          if (category && category.length > 0 && category !== '--' && 
              cutoffValue && cutoffValue !== '--' && cutoffValue !== '') {
            
            // Convert cutoff value to number
            let cutoffRank = parseFloat(cutoffValue);
            if (isNaN(cutoffRank)) continue;
            
            // Create cutoff entry
            const cutoff = {
              institute: currentCollege,
              institute_code: currentCollegeCode,
              course: course,
              category: category,
              cutoff_rank: cutoffRank,
              year: extractYearFromFilename(path.basename(filePath)),
              round: extractRoundFromFilename(path.basename(filePath))
            };
            
            cutoffs.push(cutoff);
          }
        }
      }
    }
  }
  
  return cutoffs;
}

// Function to parse Excel file and extract cutoffs
function parseExcelFile(filePath) {
  console.log(`Parsing Excel file: ${path.basename(filePath)}`);
  
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON with headers
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length < 2) {
      console.log('  No data found in sheet');
      return [];
    }
    
    console.log(`  Data rows: ${jsonData.length}`);
    
    // Determine file format and parse accordingly
    const filename = path.basename(filePath);
    if (filename.includes('2025')) {
      return parseExcelFile2025(filePath, jsonData);
    } else {
      return parseExcelFile2023_2024(filePath, jsonData);
    }
    
  } catch (error) {
    console.error(`  Error parsing file: ${error.message}`);
    return [];
  }
}

// Main function
function main() {
  const rootDir = path.resolve(__dirname, '..');
  console.log('Creating CLEAN dataset from Excel files...');
  
  // Find all Excel files in the root directory
  const excelFiles = fs.readdirSync(rootDir)
    .filter(file => file.endsWith('.xlsx') && file.includes('cutoff'))
    .map(file => path.join(rootDir, file));
  
  console.log(`Found ${excelFiles.length} Excel files to process:`);
  excelFiles.forEach(file => console.log(`  - ${path.basename(file)}`));
  
  if (excelFiles.length === 0) {
    console.log('No Excel files found. Please ensure cutoff Excel files are in the root directory.');
    return;
  }
  
  // Process each Excel file
  const allCutoffs = [];
  const processedFiles = [];
  
  for (const excelFile of excelFiles) {
    const cutoffs = parseExcelFile(excelFile);
    if (cutoffs.length > 0) {
      allCutoffs.push(...cutoffs);
      processedFiles.push(path.basename(excelFile));
      console.log(`  ✅ Extracted ${cutoffs.length} records`);
    } else {
      console.log(`  ❌ No records extracted`);
    }
  }
  
  // Remove duplicates based on unique combination of institute_code, course, category, year, round
  console.log('\nRemoving duplicates...');
  const uniqueCutoffs = [];
  const seen = new Set();
  
  for (const cutoff of allCutoffs) {
    const key = `${cutoff.institute_code}-${cutoff.course}-${cutoff.category}-${cutoff.year}-${cutoff.round}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueCutoffs.push(cutoff);
    }
  }
  
  console.log(`Original records: ${allCutoffs.length}`);
  console.log(`Unique records: ${uniqueCutoffs.length}`);
  console.log(`Duplicates removed: ${allCutoffs.length - uniqueCutoffs.length}`);
  
  // Create the final data structure
  const finalData = {
    metadata: {
      last_updated: new Date().toISOString(),
      total_files_processed: processedFiles.length,
      total_entries: uniqueCutoffs.length,
      data_sources: processedFiles,
      notes: "Clean dataset extracted from Excel files without duplicates"
    },
    cutoffs: uniqueCutoffs
  };
  
  // Save the data
  const outDir = path.join(rootDir, 'public', 'data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  const outputFile = path.join(outDir, 'kcet_cutoffs.json');
  fs.writeFileSync(outputFile, JSON.stringify(finalData, null, 2), 'utf8');
  
  console.log('\n✅ Clean dataset created successfully!');
  console.log(`📁 Output file: ${outputFile}`);
  console.log(`📊 Total unique records: ${uniqueCutoffs.length}`);
  console.log(`📋 Files processed: ${processedFiles.join(', ')}`);
  
  // Generate summary statistics
  const yearStats = {};
  const collegeStats = {};
  const courseStats = {};
  const categoryStats = {};
  const roundStats = {};
  
  for (const record of uniqueCutoffs) {
    yearStats[record.year] = (yearStats[record.year] || 0) + 1;
    collegeStats[record.institute_code] = (collegeStats[record.institute_code] || 0) + 1;
    courseStats[record.course] = (courseStats[record.course] || 0) + 1;
    categoryStats[record.category] = (categoryStats[record.category] || 0) + 1;
    roundStats[record.round] = (roundStats[record.round] || 0) + 1;
  }
  
  console.log('\n📈 Summary Statistics:');
  console.log('By Year:', yearStats);
  console.log('By Round:', roundStats);
  console.log('By Category:', Object.keys(categoryStats).length, 'categories');
  console.log('Top Colleges:', Object.entries(collegeStats).sort((a, b) => b[1] - a[1]).slice(0, 5));
  console.log('Top Courses:', Object.entries(courseStats).sort((a, b) => b[1] - a[1]).slice(0, 5));
  
  console.log('\n🎯 Next steps:');
  console.log('1. The CutoffExplorer should now work properly');
  console.log('2. No duplicate entries in the data');
  console.log('3. Clean, structured data ready for the web app');
  console.log('4. Main data source: kcet_cutoffs.json');
}

main();
