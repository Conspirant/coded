#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Category mapping based on proto.json structure
const CATEGORY_MAPPING = {
  '1G': '1G', '1K': '1K', '1R': '1R',
  '2AG': '2AG', '2AK': '2AK', '2AR': '2AR',
  '2BG': '2BG', '2BK': '2BK', '2BR': '2BR',
  '3AG': '3AG', '3AK': '3AK', '3AR': '3AR',
  '3BG': '3BG', '3BK': '3BK', '3BR': '3BR',
  'GM': 'GM', 'GMK': 'GMK', 'GMR': 'GMR',
  'SCG': 'SCG', 'SCK': 'SCK', 'SCR': 'SCR',
  'STG': 'STG', 'STK': 'STK', 'STR': 'STR'
};

function extractCollegeInfo2025(df, filename) {
  let collegeCode = null;
  let collegeName = null;
  
  // Search for college information in the dataframe - search more rows for 2025 format
  for (let i = 0; i < Math.min(200, df.length); i++) {
    const row = df[i];
    if (!row) continue;
    
    for (let j = 0; j < row.length; j++) {
      const cellValue = String(row[j] || '').trim();
      
      // Look for pattern: "College: E001 University of..." (2025 format)
      const collegeMatch = cellValue.match(/College:\s*(E\d{3})\s*(.+?)(?:\s*\(|$)/i);
      if (collegeMatch) {
        collegeCode = collegeMatch[1];
        collegeName = collegeMatch[2].trim();
        console.log(`Found college (2025): ${collegeCode} - ${collegeName}`);
        return { collegeCode, collegeName };
      }
      
      // Alternative pattern: "E001" followed by college name in next cell
      if (cellValue.match(/^E\d{3}$/)) {
        const nextCell = row[j + 1] ? String(row[j + 1]).trim() : '';
        if (nextCell && nextCell.length > 10) {
          collegeCode = cellValue;
          collegeName = nextCell;
          console.log(`Found college (2025 alt): ${collegeCode} - ${collegeName}`);
          return { collegeCode, collegeName };
        }
      }
      
      // Pattern for "College E001" format
      const collegeCodeMatch = cellValue.match(/College\s+(E\d{3})/i);
      if (collegeCodeMatch) {
        collegeCode = collegeCodeMatch[1];
        // Look for college name in next few cells
        for (let k = j + 1; k < Math.min(j + 10, row.length); k++) {
          const nameCell = String(row[k] || '').trim();
          if (nameCell && nameCell.length > 10 && !nameCell.match(/^E\d{3}$/)) {
            collegeName = nameCell;
            console.log(`Found college (2025 code + name): ${collegeCode} - ${collegeName}`);
            return { collegeCode, collegeName };
          }
        }
      }
      
      // Pattern for "E001" in any cell, then look for name
      if (cellValue.match(/^E\d{3}$/)) {
        collegeCode = cellValue;
        // Look for college name in surrounding cells
        for (let k = Math.max(0, j - 3); k < Math.min(j + 4, row.length); k++) {
          if (k === j) continue; // Skip the code cell itself
          const nameCell = String(row[k] || '').trim();
          if (nameCell && nameCell.length > 10 && !nameCell.match(/^E\d{3}$/) && !nameCell.match(/^\d+$/)) {
            collegeName = nameCell;
            console.log(`Found college (2025 surrounding): ${collegeCode} - ${collegeName}`);
            return { collegeCode, collegeName };
          }
        }
      }
    }
  }
  
  console.warn(`Could not extract college info from ${filename}`);
  return { collegeCode: null, collegeName: null };
}

function findHeaderRow2025(df) {
  // Look for row containing category headers - 2025 format
  for (let i = 0; i < df.length; i++) {
    const row = df[i];
    if (!row || row.length === 0) continue;
    
    const firstCell = String(row[0] || '').trim().toLowerCase();
    if (firstCell.includes('course') || firstCell.includes('branch')) {
      console.log(`Found header row at index ${i}`);
      return i;
    }
    
    // Check if this row contains category headers
    let categoryCount = 0;
    for (let j = 1; j < row.length; j++) {
      const cell = String(row[j] || '').trim();
      if (CATEGORY_MAPPING[cell]) {
        categoryCount++;
      }
    }
    
    if (categoryCount >= 3) { // Reduced threshold to catch more headers
      console.log(`Found category header row at index ${i}`);
      return i;
    }
  }
  
  return null;
}

function determineRound(filename) {
  const filenameLower = filename.toLowerCase();
  if (filenameLower.includes('round1')) return 'R1';
  if (filenameLower.includes('round2')) return 'R2';
  if (filenameLower.includes('round3') || filenameLower.includes('extended')) return 'EXT';
  if (filenameLower.includes('mock')) return 'MOCK';
  return 'R1';
}

function parseExcelFile2025(workbook, filename) {
  const results = [];
  const year = '2025'; // Hardcode year for 2025 files
  const round = determineRound(filename);
  
  // Process each sheet
  for (const sheetName of workbook.SheetNames) {
    console.log(`Processing sheet: ${sheetName}`);
    
    const worksheet = workbook.Sheets[sheetName];
    const df = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (df.length === 0) continue;
    
    // Extract college info
    const { collegeCode, collegeName } = extractCollegeInfo2025(df, filename);
    if (!collegeCode || !collegeName) continue;
    
    // Find header row
    const headerRowIdx = findHeaderRow2025(df);
    if (headerRowIdx === null) {
      console.warn(`Could not find header row in ${filename} sheet ${sheetName}`);
      continue;
    }
    
    const headerRow = df[headerRowIdx];
    
    // Map category columns
    const categoryColumns = {};
    for (let i = 1; i < headerRow.length; i++) {
      const category = String(headerRow[i] || '').trim();
      if (CATEGORY_MAPPING[category]) {
        categoryColumns[i] = CATEGORY_MAPPING[category];
      }
    }
    
    // Process data rows
    for (let i = headerRowIdx + 1; i < df.length; i++) {
      const row = df[i];
      if (!row || row.length === 0) continue;
      
      const courseName = String(row[0] || '').trim();
      
      // Skip empty or header-like rows
      if (!courseName || courseName === 'nan' || 
          courseName.toLowerCase().includes('course') ||
          courseName === '--' || courseName === '') {
        continue;
      }
      
      // Extract closing ranks for each category
      for (const [colIdx, category] of Object.entries(categoryColumns)) {
        const cellValue = row[parseInt(colIdx)];
        
        if (cellValue === null || cellValue === undefined || cellValue === '') {
          continue;
        }
        
        try {
          const cutoffRank = parseFloat(cellValue);
          if (cutoffRank > 0 && cutoffRank < 500000) { // Increased range for more data
            results.push({
              institute: collegeName,
              institute_code: collegeCode,
              course: courseName.toUpperCase(), // Use full course name as in proto.json
              category: category,
              cutoff_rank: Math.round(cutoffRank),
              year: year,
              round: round
            });
          }
        } catch (error) {
          // Skip invalid values
          continue;
        }
      }
    }
  }
  
  return results;
}

function extractFromExcel2025(filePath) {
  try {
    console.log(`Processing 2025 file: ${path.basename(filePath)}`);
    
    const workbook = xlsx.readFile(filePath);
    const results = parseExcelFile2025(workbook, path.basename(filePath));
    
    console.log(`Extracted ${results.length} records from ${path.basename(filePath)}`);
    return results;
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return [];
  }
}

function main() {
  const rootDir = path.resolve(__dirname, '..');
  const excelFiles = fs.readdirSync(rootDir)
    .filter(file => file.endsWith('.xlsx') && file.includes('2025'))
    .map(file => path.join(rootDir, file));
  
  if (excelFiles.length === 0) {
    console.error('No 2025 Excel files found in project root.');
    return;
  }
  
  console.log(`Found ${excelFiles.length} 2025 Excel files to process`);
  
  let allResults = [];
  let processedFiles = 0;
  
  for (const excelFile of excelFiles) {
    try {
      const results = extractFromExcel2025(excelFile);
      allResults = allResults.concat(results);
      processedFiles++;
    } catch (error) {
      console.error(`Failed to process ${path.basename(excelFile)}:`, error.message);
    }
  }
  
  // Create output directory
  const outDir = path.join(rootDir, 'public', 'data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  // Create the final data structure matching proto.json
  const finalData = {
    metadata: {
      last_updated: new Date().toISOString(),
      total_files_processed: processedFiles,
      total_entries: allResults.length
    },
    cutoffs: allResults
  };
  
  // Save the extracted data
  const outFile = path.join(outDir, 'cutoffs-2025.json');
  fs.writeFileSync(outFile, JSON.stringify(finalData, null, 2), 'utf8');
  
  console.log('\n2025 Extraction complete!');
  console.log(`Total files processed: ${processedFiles}`);
  console.log(`Total records extracted: ${allResults.length}`);
  console.log(`Data saved to: ${outFile}`);
  
  // Generate summary statistics
  const yearStats = {};
  const collegeStats = {};
  const courseStats = {};
  const categoryStats = {};
  const roundStats = {};
  
  for (const record of allResults) {
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
