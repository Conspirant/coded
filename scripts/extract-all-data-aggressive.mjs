#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Comprehensive category mapping
const CATEGORY_MAPPING = {
  '1G': '1G', '1K': '1K', '1R': '1R',
  '2AG': '2AG', '2AK': '2AK', '2AR': '2AR',
  '2BG': '2BG', '2BK': '2BK', '2BR': '2BR',
  '3AG': '3AG', '3AK': '3AK', '3AR': '3AR',
  '3BG': '3BG', '3BK': '3BK', '3BR': '3BR',
  'GM': 'GM', 'GMK': 'GMK', 'GMR': 'GMR',
  'SCG': 'SCG', 'SCK': 'SCK', 'SCR': 'SCR',
  'STG': 'STG', 'STK': 'STK', 'STR': 'STR',
  // Additional variations
  'GENERAL': 'GM', 'SC': 'SCG', 'ST': 'STG',
  'CAT1': '1G', 'CAT2A': '2AG', 'CAT2B': '2BG', 'CAT3A': '3AG', 'CAT3B': '3BG'
};

// Comprehensive course mapping
const COURSE_CODE_MAPPING = {
  'AI': 'AI', 'ARTIFICIAL INTELLIGENCE': 'AI', 'AIML': 'AI',
  'CS': 'CS', 'CSE': 'CS', 'COMPUTER SCIENCE': 'CS', 'COMPUTER SCIENCE AND ENGINEERING': 'CS',
  'EC': 'EC', 'ECE': 'EC', 'ELECTRONICS': 'EC', 'ELECTRONICS AND COMMUNICATION': 'EC',
  'EE': 'EE', 'EEE': 'EE', 'ELECTRICAL': 'EE', 'ELECTRICAL AND ELECTRONICS': 'EE',
  'ME': 'ME', 'MECHANICAL': 'ME', 'MECHANICAL ENGINEERING': 'ME',
  'CE': 'CE', 'CIVIL': 'CE', 'CIVIL ENGINEERING': 'CE',
  'IS': 'IS', 'ISE': 'IS', 'INFORMATION SCIENCE': 'IS', 'INFORMATION SCIENCE AND ENGINEERING': 'IS',
  'BT': 'BT', 'BIOTECH': 'BT', 'BIOTECHNOLOGY': 'BT',
  'CH': 'CH', 'CHEMICAL': 'CH', 'CHEMICAL ENGINEERING': 'CH',
  'IT': 'IT', 'INSTRUMENTATION': 'IT', 'INSTRUMENTATION TECHNOLOGY': 'IT',
  'TE': 'TE', 'TELECOMMUNICATION': 'TE',
  'CV': 'CV', 'COMPUTER VISION': 'CV'
};

function cleanText(text) {
  if (!text) return '';
  return String(text)
    .replace(/[\r\n]/g, ' ')
    .replace(/[Â]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractCollegeInfoAggressive(df, filename) {
  let collegeCode = null;
  let collegeName = null;
  
  // Strategy 1: Look for "College: E001" pattern (2025 format)
  for (let i = 0; i < Math.min(300, df.length); i++) {
    const row = df[i];
    if (!row) continue;
    
    for (let j = 0; j < row.length; j++) {
      const cellValue = cleanText(row[j]);
      
      // Pattern: "College: E001 University of..."
      const collegeMatch = cellValue.match(/College:\s*(E\d{3})\s*(.+?)(?:\s*\(|$)/i);
      if (collegeMatch) {
        collegeCode = collegeMatch[1];
        collegeName = cleanText(collegeMatch[2]);
        console.log(`Found college (2025): ${collegeCode} - ${collegeName}`);
        return { collegeCode, collegeName };
      }
      
      // Pattern: "E001" followed by college name
      if (cellValue.match(/^E\d{3}$/)) {
        const nextCell = cleanText(row[j + 1]);
        if (nextCell && nextCell.length > 10) {
          collegeCode = cellValue;
          collegeName = nextCell;
          console.log(`Found college (E001+name): ${collegeCode} - ${collegeName}`);
          return { collegeCode, collegeName };
        }
      }
    }
  }
  
  // Strategy 2: Look for college code in any cell, then search for name
  for (let i = 0; i < Math.min(500, df.length); i++) {
    const row = df[i];
    if (!row) continue;
    
    for (let j = 0; j < row.length; j++) {
      const cellValue = cleanText(row[j]);
      
      if (cellValue.match(/^E\d{3}$/)) {
        collegeCode = cellValue;
        
        // Search in surrounding cells for college name
        for (let k = Math.max(0, j - 5); k < Math.min(j + 6, row.length); k++) {
          if (k === j) continue;
          const nameCell = cleanText(row[k]);
          if (nameCell && nameCell.length > 15 && !nameCell.match(/^E\d{3}$/) && !nameCell.match(/^\d+$/)) {
            collegeName = nameCell;
            console.log(`Found college (surrounding): ${collegeCode} - ${collegeName}`);
            return { collegeCode, collegeName };
          }
        }
        
        // Search in next few rows for college name
        for (let k = i + 1; k < Math.min(i + 10, df.length); k++) {
          const nextRow = df[k];
          if (!nextRow) continue;
          
          for (let l = 0; l < nextRow.length; l++) {
            const nameCell = cleanText(nextRow[l]);
            if (nameCell && nameCell.length > 15 && !nameCell.match(/^E\d{3}$/) && !nameCell.match(/^\d+$/)) {
              collegeName = nameCell;
              console.log(`Found college (next row): ${collegeCode} - ${collegeName}`);
              return { collegeCode, collegeName };
            }
          }
        }
      }
    }
  }
  
  // Strategy 3: Look for college name patterns and extract code
  for (let i = 0; i < Math.min(300, df.length); i++) {
    const row = df[i];
    if (!row) continue;
    
    for (let j = 0; j < row.length; j++) {
      const cellValue = cleanText(row[j]);
      
      // Look for college name patterns
      if (cellValue.length > 20 && 
          (cellValue.toLowerCase().includes('college') || 
           cellValue.toLowerCase().includes('institute') ||
           cellValue.toLowerCase().includes('university'))) {
        
        // Search for E001 pattern in nearby cells
        for (let k = Math.max(0, j - 3); k < Math.min(j + 4, row.length); k++) {
          const codeCell = cleanText(row[k]);
          if (codeCell.match(/^E\d{3}$/)) {
            collegeCode = codeCell;
            collegeName = cellValue;
            console.log(`Found college (name+code): ${collegeCode} - ${collegeName}`);
            return { collegeCode, collegeName };
          }
        }
        
        // Search in previous/next rows for code
        for (let k = Math.max(0, i - 2); k < Math.min(i + 3, df.length); k++) {
          if (k === i) continue;
          const searchRow = df[k];
          if (!searchRow) continue;
          
          for (let l = 0; l < searchRow.length; l++) {
            const codeCell = cleanText(searchRow[l]);
            if (codeCell.match(/^E\d{3}$/)) {
              collegeCode = codeCell;
              collegeName = cellValue;
              console.log(`Found college (name+code cross-row): ${collegeCode} - ${collegeName}`);
              return { collegeCode, collegeName };
            }
          }
        }
      }
    }
  }
  
  console.warn(`Could not extract college info from ${filename}`);
  return { collegeCode: null, collegeName: null };
}

function findHeaderRowAggressive(df) {
  // Strategy 1: Look for row with "course" or "branch"
  for (let i = 0; i < df.length; i++) {
    const row = df[i];
    if (!row || row.length === 0) continue;
    
    const firstCell = cleanText(row[0]).toLowerCase();
    if (firstCell.includes('course') || firstCell.includes('branch')) {
      console.log(`Found header row (course): ${i}`);
      return i;
    }
  }
  
  // Strategy 2: Look for row with multiple category headers
  for (let i = 0; i < df.length; i++) {
    const row = df[i];
    if (!row || row.length === 0) continue;
    
    let categoryCount = 0;
    for (let j = 1; j < row.length; j++) {
      const cell = cleanText(row[j]);
      if (CATEGORY_MAPPING[cell]) {
        categoryCount++;
      }
    }
    
    if (categoryCount >= 2) {
      console.log(`Found header row (categories): ${i} with ${categoryCount} categories`);
      return i;
    }
  }
  
  // Strategy 3: Look for row with numeric values in first column and categories in others
  for (let i = 0; i < df.length; i++) {
    const row = df[i];
    if (!row || row.length === 0) continue;
    
    const firstCell = cleanText(row[0]);
    if (firstCell && firstCell.match(/^\d+$/) && firstCell.length <= 5) {
      // Check if other columns have category-like values
      let categoryCount = 0;
      for (let j = 1; j < row.length; j++) {
        const cell = cleanText(row[j]);
        if (cell && (cell.match(/^[A-Z]+\d*[A-Z]*$/) || CATEGORY_MAPPING[cell])) {
          categoryCount++;
        }
      }
      
      if (categoryCount >= 2) {
        console.log(`Found header row (numeric+categories): ${i}`);
        return i;
      }
    }
  }
  
  return null;
}

function determineYearAndRound(filename) {
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

function cleanCourseName(courseName) {
  if (!courseName) return '';
  
  const cleaned = cleanText(courseName);
  
  // Try to extract course code from the name
  for (const [code, cleanCode] of Object.entries(COURSE_CODE_MAPPING)) {
    if (cleaned.toUpperCase().includes(code)) {
      return cleanCode;
    }
  }
  
  // If no code found, return the first few characters
  return cleaned.substring(0, 10).toUpperCase();
}

function parseExcelFileAggressive(workbook, filename) {
  const results = [];
  const { year, round } = determineYearAndRound(filename);
  
  console.log(`Processing ${filename} - Year: ${year}, Round: ${round}`);
  
  // Process each sheet
  for (const sheetName of workbook.SheetNames) {
    console.log(`Processing sheet: ${sheetName}`);
    
    const worksheet = workbook.Sheets[sheetName];
    const df = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (df.length === 0) continue;
    
    // Extract college info using aggressive strategy
    const { collegeCode, collegeName } = extractCollegeInfoAggressive(df, filename);
    if (!collegeCode || !collegeName) {
      console.log(`Skipping sheet ${sheetName} - no college info found`);
      continue;
    }
    
    // Find header row using aggressive strategy
    const headerRowIdx = findHeaderRowAggressive(df);
    if (headerRowIdx === null) {
      console.log(`Skipping sheet ${sheetName} - no header row found`);
      continue;
    }
    
    const headerRow = df[headerRowIdx];
    
    // Map category columns
    const categoryColumns = {};
    for (let i = 1; i < headerRow.length; i++) {
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
      const cleanCourse = cleanCourseName(courseName);
      if (!cleanCourse) continue;
      
      // Extract closing ranks for each category
      for (const [colIdx, category] of Object.entries(categoryColumns)) {
        const cellValue = row[parseInt(colIdx)];
        
        if (cellValue === null || cellValue === undefined || cellValue === '') {
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

function extractFromExcelAggressive(filePath) {
  try {
    console.log(`Processing file: ${path.basename(filePath)}`);
    
    const workbook = xlsx.readFile(filePath);
    const results = parseExcelFileAggressive(workbook, path.basename(filePath));
    
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
    .filter(file => file.endsWith('.xlsx'))
    .map(file => path.join(rootDir, file));
  
  if (excelFiles.length === 0) {
    console.error('No Excel files found in project root.');
    return;
  }
  
  console.log(`Found ${excelFiles.length} Excel files to process:`);
  excelFiles.forEach(file => console.log(`  - ${path.basename(file)}`));
  
  let allResults = [];
  let processedFiles = 0;
  
  for (const excelFile of excelFiles) {
    try {
      const results = extractFromExcelAggressive(excelFile);
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
  
  // Create the final data structure matching proto.json exactly
  const finalData = {
    metadata: {
      last_updated: new Date().toISOString(),
      total_files_processed: processedFiles,
      total_entries: allResults.length
    },
    cutoffs: allResults
  };
  
  // Save the extracted data
  const outFile = path.join(outDir, 'cutoffs-aggressive.json');
  fs.writeFileSync(outFile, JSON.stringify(finalData, null, 2), 'utf8');
  
  console.log('\nAggressive extraction complete!');
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
