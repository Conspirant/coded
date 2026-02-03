#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Category mapping for edge cases
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

function cleanText(text) {
  if (!text) return '';
  return String(text)
    .replace(/[\r\n]/g, ' ')
    .replace(/[Â]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractCollegeInfoFinalPush(df, filename) {
  // Try multiple strategies to extract college info
  
  // Strategy 1: Look in first few rows for E001 pattern
  for (let i = 0; i < Math.min(10, df.length); i++) {
    const row = df[i];
    if (!row || row.length === 0) continue;
    
    for (let j = 0; j < row.length; j++) {
      const cellValue = cleanText(row[j]);
      
      // Look for E001 pattern anywhere
      const codeMatch = cellValue.match(/E\d{3}/);
      if (codeMatch) {
        const collegeCode = codeMatch[0];
        
        // Try to find college name in nearby cells
        for (let k = Math.max(0, j - 3); k < Math.min(j + 4, row.length); k++) {
          if (k === j) continue;
          const nameCell = cleanText(row[k]);
          if (nameCell && nameCell.length > 15 && !nameCell.match(/E\d{3}/) && !nameCell.match(/^\d+$/)) {
            console.log(`Found college (final push): ${collegeCode} - ${nameCell}`);
            return { collegeCode, collegeName: nameCell };
          }
        }
        
        // Try to find college name in next few rows
        for (let k = i + 1; k < Math.min(i + 5, df.length); k++) {
          const nextRow = df[k];
          if (!nextRow) continue;
          
          for (let l = 0; l < nextRow.length; l++) {
            const nameCell = cleanText(nextRow[l]);
            if (nameCell && nameCell.length > 15 && !nameCell.match(/E\d{3}/) && !nameCell.match(/^\d+$/)) {
              console.log(`Found college (final push next row): ${collegeCode} - ${nameCell}`);
              return { collegeCode, collegeName: nameCell };
            }
          }
        }
      }
    }
  }
  
  // Strategy 2: Look for college name patterns and search for code
  for (let i = 0; i < Math.min(20, df.length); i++) {
    const row = df[i];
    if (!row || row.length === 0) continue;
    
    for (let j = 0; j < row.length; j++) {
      const cellValue = cleanText(row[j]);
      
      // Look for college name patterns
      if (cellValue.length > 20 && 
          (cellValue.toLowerCase().includes('college') || 
           cellValue.toLowerCase().includes('institute') ||
           cellValue.toLowerCase().includes('university'))) {
        
        // Search for E001 pattern in nearby cells
        for (let k = Math.max(0, j - 5); k < Math.min(j + 6, row.length); k++) {
          const codeCell = cleanText(row[k]);
          const codeMatch = codeCell.match(/E\d{3}/);
          if (codeMatch) {
            console.log(`Found college (final push name+code): ${codeMatch[0]} - ${cellValue}`);
            return { collegeCode: codeMatch[0], collegeName: cellValue };
          }
        }
        
        // Search in previous/next rows for code
        for (let k = Math.max(0, i - 3); k < Math.min(i + 4, df.length); k++) {
          if (k === i) continue;
          const searchRow = df[k];
          if (!searchRow) continue;
          
          for (let l = 0; l < searchRow.length; l++) {
            const codeCell = cleanText(searchRow[l]);
            const codeMatch = codeCell.match(/E\d{3}/);
            if (codeMatch) {
              console.log(`Found college (final push cross-row): ${codeMatch[0]} - ${cellValue}`);
              return { collegeCode: codeMatch[0], collegeName: cellValue };
            }
          }
        }
      }
    }
  }
  
  return { collegeCode: null, collegeName: null };
}

function findHeaderRowFinalPush(df) {
  // Try multiple strategies to find header row
  
  // Strategy 1: Look for row with multiple category headers
  for (let i = 0; i < Math.min(20, df.length); i++) {
    const row = df[i];
    if (!row || row.length === 0) continue;
    
    let categoryCount = 0;
    for (let j = 0; j < row.length; j++) {
      const cell = cleanText(row[j]);
      if (CATEGORY_MAPPING[cell]) {
        categoryCount++;
      }
    }
    
    if (categoryCount >= 3) {
      console.log(`Found header row (final push): ${i} with ${categoryCount} categories`);
      return i;
    }
  }
  
  // Strategy 2: Look for row with category-like patterns
  for (let i = 0; i < Math.min(20, df.length); i++) {
    const row = df[i];
    if (!row || row.length === 0) continue;
    
    let categoryCount = 0;
    for (let j = 0; j < row.length; j++) {
      const cell = cleanText(row[j]);
      if (cell && (cell.match(/^[A-Z]+\d*[A-Z]*$/) || CATEGORY_MAPPING[cell])) {
        categoryCount++;
      }
    }
    
    if (categoryCount >= 3) {
      console.log(`Found header row (final push patterns): ${i} with ${categoryCount} categories`);
      return i;
    }
  }
  
  return null;
}

function determineYearAndRoundFinalPush(filename) {
  const filenameLower = filename.toLowerCase();
  
  // Extract year
  const yearMatch = filenameLower.match(/(20\d{2})/);
  const year = yearMatch ? yearMatch[1] : '2023';
  
  // Extract round
  let round = 'R1';
  if (filenameLower.includes('round1')) round = 'R1';
  else if (filenameLower.includes('round2')) round = 'R2';
  else if (filenameLower.includes('round3') || filenameLower.includes('extended')) round = 'EXT';
  else if (filenameLower.includes('mock')) round = 'MOCK';
  
  return { year, round };
}

function cleanCourseNameFinalPush(courseName) {
  if (!courseName) return '';
  
  const cleaned = cleanText(courseName);
  
  // Try to extract course code from the name
  const courseMappings = {
    'AI': 'AI', 'ARTIFICIAL INTELLIGENCE': 'AI',
    'CS': 'CS', 'COMPUTERS': 'CS', 'COMPUTER SCIENCE': 'CS',
    'CSE': 'CS', 'COMPUTER SCIENCE AND ENGINEERING': 'CS',
    'EC': 'EC', 'ELECTRONICS': 'EC', 'ELECTRONICS AND COMMUNICATION': 'EC',
    'EE': 'EE', 'ELECTRICAL': 'EE', 'ELECTRICAL AND ELECTRONICS': 'EE',
    'IE': 'IS', 'INFO.SCIENCE': 'IS', 'INFORMATION SCIENCE': 'IS',
    'ISE': 'IS', 'INFORMATION SCIENCE AND ENGINEERING': 'IS',
    'ME': 'ME', 'MECHANICAL': 'ME', 'MECHANICAL ENGINEERING': 'ME',
    'CE': 'CE', 'CIVIL': 'CE', 'CIVIL ENGINEERING': 'CE',
    'ET': 'TE', 'TELECOMMUNICATION': 'TE', 'TELECOMMN. ENGG.': 'TE',
    'IM': 'IM', 'IND. ENGG. MGMT.': 'IM', 'INDUSTRIAL ENGINEERING': 'IM',
    'SE': 'SE', 'AERO SPACE ENGG.': 'SE', 'AEROSPACE ENGINEERING': 'SE',
    'RI': 'RI', 'ROBOTICS AND AI': 'RI', 'ROBOTICS': 'RI',
    'IC': 'IC', 'CS-IOT': 'IC', 'CYBER SECURITY': 'IC',
    'MD': 'MD', 'MED.ELECT.': 'MD', 'MEDICAL ELECTRONICS': 'MD',
    'AR': 'AR', 'ARCHITECTURE': 'AR',
    'DS': 'DS', 'DATA SCIENCE': 'DS', 'COMP. SC. ENGG-DATA SC.': 'DS',
    'BT': 'BT', 'BIOTECH': 'BT', 'BIOTECHNOLOGY': 'BT',
    'CH': 'CH', 'CHEMICAL': 'CH', 'CHEMICAL ENGINEERING': 'CH',
    'IT': 'IT', 'INSTRUMENTATION': 'IT'
  };
  
  for (const [code, cleanCode] of Object.entries(courseMappings)) {
    if (cleaned.toUpperCase().includes(code)) {
      return cleanCode;
    }
  }
  
  // If no code found, return the first few characters
  return cleaned.substring(0, 10).toUpperCase();
}

function parseExcelFileFinalPush(workbook, filename) {
  const results = [];
  const { year, round } = determineYearAndRoundFinalPush(filename);
  
  console.log(`Processing ${filename} - Year: ${year}, Round: ${round}`);
  
  // Process each sheet
  for (const sheetName of workbook.SheetNames) {
    console.log(`Processing sheet: ${sheetName}`);
    
    const worksheet = workbook.Sheets[sheetName];
    const df = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (df.length === 0) continue;
    
    // Extract college info using final push strategy
    const { collegeCode, collegeName } = extractCollegeInfoFinalPush(df, filename);
    if (!collegeCode || !collegeName) {
      console.log(`Skipping sheet ${sheetName} - no college info found`);
      continue;
    }
    
    // Find header row using final push strategy
    const headerRowIdx = findHeaderRowFinalPush(df);
    if (headerRowIdx === null) {
      console.log(`Skipping sheet ${sheetName} - no header row found`);
      continue;
    }
    
    const headerRow = df[headerRowIdx];
    
    // Map category columns
    const categoryColumns = {};
    for (let i = 0; i < headerRow.length; i++) {
      const category = cleanText(headerRow[i]);
      if (CATEGORY_MAPPING[category]) {
        categoryColumns[i] = CATEGORY_MAPPING[category];
      }
    }
    
    if (Object.keys(categoryColumns).length === 0) {
      console.log(`Skipping sheet ${sheetName} - no valid categories found`);
      continue;
    }
    
    // Process data rows
    for (let i = headerRowIdx + 1; i < df.length; i++) {
      const row = df[i];
      if (!row || row.length === 0) continue;
      
      const courseName = cleanText(row[0]);
      
      // Skip empty or header-like rows
      if (!courseName || courseName === 'nan' || 
          courseName.toLowerCase().includes('course') ||
          courseName === '--' || courseName === '') {
        continue;
      }
      
      // Clean and standardize course name
      const cleanCourse = cleanCourseNameFinalPush(courseName);
      if (!cleanCourse) continue;
      
      // Extract closing ranks for each category
      for (const [colIdx, category] of Object.entries(categoryColumns)) {
        const cellValue = row[parseInt(colIdx)];
        
        if (cellValue === null || cellValue === undefined || cellValue === '' || cellValue === '--') {
          continue;
        }
        
        try {
          const cutoffRank = parseFloat(cellValue);
          if (cutoffRank > 0 && cutoffRank < 500000) {
            results.push({
              institute: collegeName,
              institute_code: collegeCode,
              course: cleanCourse,
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

function extractFromExcelFinalPush(filePath) {
  try {
    console.log(`Processing file: ${path.basename(filePath)}`);
    
    const workbook = xlsx.readFile(filePath);
    const results = parseExcelFileFinalPush(workbook, path.basename(filePath));
    
    console.log(`Extracted ${results.length} records from ${path.basename(filePath)}`);
    return results;
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return [];
  }
}

function main() {
  const rootDir = path.resolve(__dirname, '..');
  
  // Find 2023 and 2024 Excel files for final push
  const excelFiles = fs.readdirSync(rootDir)
    .filter(file => file.endsWith('.xlsx') && (file.includes('2023') || file.includes('2024')))
    .map(file => path.join(rootDir, file));
  
  if (excelFiles.length === 0) {
    console.error('No 2023 or 2024 Excel files found in project root.');
    return;
  }
  
  console.log(`Found ${excelFiles.length} 2023/2024 Excel files for final push:`);
  excelFiles.forEach(file => console.log(`  - ${path.basename(file)}`));
  
  let allResults = [];
  let processedFiles = 0;
  
  for (const excelFile of excelFiles) {
    try {
      const results = extractFromExcelFinalPush(excelFile);
      allResults = allResults.concat(results);
      processedFiles++;
      console.log(`Total records so far: ${allResults.length}`);
    } catch (error) {
      console.error(`Failed to process ${path.basename(excelFile)}:`, error.message);
    }
  }
  
  // Create output directory
  const outDir = path.join(rootDir, 'public', 'data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  // Save the final push data
  const outFile = path.join(outDir, 'cutoffs-final-push.json');
  fs.writeFileSync(outFile, JSON.stringify({
    metadata: {
      last_updated: new Date().toISOString(),
      total_files_processed: processedFiles,
      total_entries: allResults.length
    },
    cutoffs: allResults
  }, null, 2), 'utf8');
  
  console.log('\nFinal push extraction complete!');
  console.log(`Total files processed: ${processedFiles}`);
  console.log(`Total records extracted: ${allResults.length}`);
  console.log(`Data saved to: ${outFile}`);
  
  // Generate summary statistics
  const yearStats = {};
  const roundStats = {};
  
  for (const record of allResults) {
    yearStats[record.year] = (yearStats[record.year] || 0) + 1;
    roundStats[record.round] = (roundStats[record.round] || 0) + 1;
  }
  
  console.log('\nSummary Statistics:');
  console.log('By Year:', yearStats);
  console.log('By Round:', roundStats);
}

main();
