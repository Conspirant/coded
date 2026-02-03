#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Category mapping for 2023/2024 files
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

// Course code mapping for 2023/2024 files
const COURSE_CODE_MAPPING = {
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

function cleanText(text) {
  if (!text) return '';
  return String(text)
    .replace(/[\r\n]/g, ' ')
    .replace(/[Â]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractCollegeInfo2023_2024(df, filename) {
  // In 2023/2024 files, college info is in Row 0
  if (df.length === 0) return { collegeCode: null, collegeName: null };
  
  const firstRow = df[0];
  if (!firstRow || firstRow.length === 0) return { collegeCode: null, collegeName: null };
  
  const firstCell = cleanText(firstRow[0]);
  
  // Pattern: "E005  R. V. College of Engineering  Bangalore"
  const collegeMatch = firstCell.match(/^(E\d{3})\s+(.+?)(?:\s+ENGINEERING|\s+$)/i);
  if (collegeMatch) {
    const collegeCode = collegeMatch[1];
    const collegeName = cleanText(collegeMatch[2]);
    console.log(`Found college (2023/2024): ${collegeCode} - ${collegeName}`);
    return { collegeCode, collegeName };
  }
  
  // Alternative pattern: just look for E001 pattern
  const codeMatch = firstCell.match(/^(E\d{3})/);
  if (codeMatch) {
    const collegeCode = codeMatch[1];
    const collegeName = cleanText(firstCell.replace(/^E\d{3}\s*/, ''));
    if (collegeName.length > 10) {
      console.log(`Found college (E001+name): ${collegeCode} - ${collegeName}`);
      return { collegeCode, collegeName };
    }
  }
  
  console.warn(`Could not extract college info from ${filename}`);
  return { collegeCode: null, collegeName: null };
}

function findHeaderRow2023_2024(df) {
  // In 2023/2024 files, categories are in Row 1
  if (df.length < 2) return null;
  
  const secondRow = df[1];
  if (!secondRow || secondRow.length === 0) return null;
  
  // Check if this row has category headers
  let categoryCount = 0;
  for (let j = 0; j < secondRow.length; j++) {
    const cell = cleanText(secondRow[j]);
    if (CATEGORY_MAPPING[cell]) {
      categoryCount++;
    }
  }
  
  if (categoryCount >= 2) {
    console.log(`Found header row (2023/2024): Row 1 with ${categoryCount} categories`);
    return 1;
  }
  
  return null;
}

function determineYearAndRound2023_2024(filename) {
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

function cleanCourseName2023_2024(courseName) {
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

function parseExcelFile2023_2024(workbook, filename) {
  const results = [];
  const { year, round } = determineYearAndRound2023_2024(filename);
  
  console.log(`Processing ${filename} - Year: ${year}, Round: ${round}`);
  
  // Process each sheet
  for (const sheetName of workbook.SheetNames) {
    console.log(`Processing sheet: ${sheetName}`);
    
    const worksheet = workbook.Sheets[sheetName];
    const df = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (df.length === 0) continue;
    
    // Extract college info (Row 0 in 2023/2024 files)
    const { collegeCode, collegeName } = extractCollegeInfo2023_2024(df, filename);
    if (!collegeCode || !collegeName) {
      console.log(`Skipping sheet ${sheetName} - no college info found`);
      continue;
    }
    
    // Find header row (Row 1 in 2023/2024 files)
    const headerRowIdx = findHeaderRow2023_2024(df);
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
    
    // Process data rows (starting from Row 2)
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
      const cleanCourse = cleanCourseName2023_2024(courseName);
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

function extractFromExcel2023_2024(filePath) {
  try {
    console.log(`Processing file: ${path.basename(filePath)}`);
    
    const workbook = xlsx.readFile(filePath);
    const results = parseExcelFile2023_2024(workbook, path.basename(filePath));
    
    console.log(`Extracted ${results.length} records from ${path.basename(filePath)}`);
    return results;
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return [];
  }
}

function main() {
  const rootDir = path.resolve(__dirname, '..');
  
  // Find 2023 and 2024 Excel files
  const excelFiles = fs.readdirSync(rootDir)
    .filter(file => file.endsWith('.xlsx') && (file.includes('2023') || file.includes('2024')))
    .map(file => path.join(rootDir, file));
  
  if (excelFiles.length === 0) {
    console.error('No 2023 or 2024 Excel files found in project root.');
    return;
  }
  
  console.log(`Found ${excelFiles.length} 2023/2024 Excel files to process:`);
  excelFiles.forEach(file => console.log(`  - ${path.basename(file)}`));
  
  let allResults = [];
  let processedFiles = 0;
  
  for (const excelFile of excelFiles) {
    try {
      const results = extractFromExcel2023_2024(excelFile);
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
  const outFile = path.join(outDir, 'cutoffs-2023-2024.json');
  fs.writeFileSync(outFile, JSON.stringify(finalData, null, 2), 'utf8');
  
  console.log('\n2023/2024 Excel extraction complete!');
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
