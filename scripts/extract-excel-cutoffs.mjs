import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { glob } from 'glob';

// Comprehensive college mapping with accurate details
const COLLEGE_MAPPING = {
  'E001': { name: 'University of Visvesvaraya College of Engineering', location: 'Bangalore', district: 'Bangalore Urban' },
  'E002': { name: 'S K S J T Institute of Engineering', location: 'Bangalore', district: 'Bangalore Urban' },
  'E003': { name: 'B M S College of Engineering', location: 'Basavanagudi, Bangalore', district: 'Bangalore Urban' },
  'E004': { name: 'Dr. Ambedkar Institute Of Technology', location: 'Bangalore', district: 'Bangalore Urban' },
  'E005': { name: 'R. V. College of Engineering', location: 'Bangalore', district: 'Bangalore Urban' },
  'E006': { name: 'P E S University', location: 'Bangalore', district: 'Bangalore Urban' },
  'E007': { name: 'B M S Institute of Technology and Management', location: 'Bangalore', district: 'Bangalore Urban' },
  'E008': { name: 'M S Ramaiah Institute of Technology', location: 'Bangalore', district: 'Bangalore Urban' },
  'E009': { name: 'Bangalore Institute of Technology', location: 'Bangalore', district: 'Bangalore Urban' },
  'E010': { name: 'P E S Institute of Technology', location: 'Bangalore', district: 'Bangalore Urban' }
};

// Comprehensive branch mapping
const BRANCH_MAPPING = {
  'CIVIL ENGINEERING': { name: 'Civil Engineering', code: 'CE' },
  'COMPUTER SCIENCE AND ENGINEERING': { name: 'Computer Science And Engineering', code: 'CS' },
  'ELECTRICAL & ELECTRONICS ENGINEERING': { name: 'Electrical And Electronics Engineering', code: 'EE' },
  'ELECTRONICS AND COMMUNICATION ENGG': { name: 'Electronics and Communication Engineering', code: 'EC' },
  'INFORMATION SCIENCE AND ENGINEERING': { name: 'Information Science and Engineering', code: 'IE' },
  'MECHANICAL ENGINEERING': { name: 'Mechanical Engineering', code: 'ME' },
  'CHEMICAL ENGINEERING': { name: 'Chemical Engineering', code: 'CH' },
  'BIOTECHNOLOGY': { name: 'Bio Technology', code: 'BT' },
  'INDUSTRIAL ENGINEERING AND MANAGEMENT': { name: 'Industrial Engineering and Management', code: 'IM' },
  'TELECOMMUNICATION ENGINEERING': { name: 'Telecommunication Engineering', code: 'TC' },
  'INSTRUMENTATION TECHNOLOGY': { name: 'Instrumentation Technology', code: 'IT' },
  'MEDICAL ELECTRONICS': { name: 'Medical Electronics', code: 'MD' },
  'COMPUTER SCIENCE AND ENGINEERING (ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING)': { name: 'Computer Science Engineering-AI', code: 'CA' },
  'COMPUTER SCIENCE AND ENGINEERING (DATA SCIENCE)': { name: 'Computer Science Engineering-Data', code: 'DS' },
  'COMPUTER SCIENCE AND ENGINEERING (CYBER SECURITY)': { name: 'Computer Science Engineering-Cyber', code: 'CY' },
  'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING': { name: 'Artificial Intelligence and Machine Learning', code: 'AI' },
  'ROBOTICS AND AUTOMATION': { name: 'Robotics and Automation', code: 'RA' },
  'AEROSPACE ENGINEERING': { name: 'Aerospace Engineering', code: 'SE' },
  'AUTOMATION AND ROBOTICS ENGINEERING': { name: 'Automation and Robotics Engineering', code: 'RO' },
  'COMPUTER SCIENCE AND BUSINESS SYSTEMS': { name: 'Computer Science and Business Systems', code: 'CB' }
};

// Category mapping based on Excel structure
const CATEGORY_MAPPING = {
  '1G': '1G',
  '1K': '1G', // Kannada medium
  '1R': '1G', // Rural
  '2AG': '2A',
  '2AK': '2A', // Kannada medium
  '2AR': '2A', // Rural
  '2BG': '2B',
  '2BK': '2B', // Kannada medium
  '2BR': '2B', // Rural
  '3AG': '3A',
  '3AK': '3A', // Kannada medium
  '3AR': '3A', // Rural
  '3BG': '3B',
  '3BK': '3B', // Kannada medium
  '3BR': '3B', // Rural
  'GM': 'GM',
  'GMK': 'GM', // Kannada medium
  'GMR': 'GM', // Rural
  'SCG': 'SC',
  'SCK': 'SC', // Kannada medium
  'SCR': 'SC', // Rural
  'STG': 'ST',
  'STK': 'ST', // Kannada medium
  'STR': 'ST'  // Rural
};

function parseExcelData(workbook, year, source) {
  const results = [];
  const sheetNames = workbook.SheetNames;
  
  for (const sheetName of sheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Determine round from sheet name or filename
    let round = 1;
    if (source.includes('round2')) round = 2;
    else if (source.includes('round3')) round = 3;
    else if (source.includes('mock')) round = 0; // Mock round
    
    // Find college information
    let collegeCode = null;
    let collegeName = null;
    
    // Look for college information in the first few rows
    for (let i = 0; i < Math.min(10, jsonData.length); i++) {
      const row = jsonData[i];
      if (!row) continue;
      
      for (let j = 0; j < row.length; j++) {
        const cell = String(row[j] || '').trim();
        const collegeMatch = cell.match(/College:\s*(E\d{3})\s*(.+?)(?:\s*\(|$)/);
        if (collegeMatch) {
          collegeCode = collegeMatch[1];
          collegeName = collegeMatch[2].trim();
          break;
        }
      }
      if (collegeCode) break;
    }
    
    if (!collegeCode) continue;
    
    // Find the header row with categories
    let headerRowIndex = -1;
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row) continue;
      
      const firstCell = String(row[0] || '').trim();
      if (firstCell === 'Course Name' || firstCell.includes('Course Name')) {
        headerRowIndex = i;
        break;
      }
    }
    
    if (headerRowIndex === -1) continue;
    
    const headerRow = jsonData[headerRowIndex];
    const categoryColumns = {};
    
    // Map category columns
    for (let j = 1; j < headerRow.length; j++) {
      const category = String(headerRow[j] || '').trim();
      if (CATEGORY_MAPPING[category]) {
        categoryColumns[j] = CATEGORY_MAPPING[category];
      }
    }
    
    // Process data rows
    for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row || row.length < 2) continue;
      
      const courseName = String(row[0] || '').trim();
      if (!courseName || courseName === 'Course Name' || courseName === '--') continue;
      
      // Find branch mapping
      let branchInfo = BRANCH_MAPPING[courseName.toUpperCase()];
      if (!branchInfo) {
        // Try partial matching
        const partialMatch = Object.keys(BRANCH_MAPPING).find(key => 
          courseName.toUpperCase().includes(key) || key.includes(courseName.toUpperCase())
        );
        if (partialMatch) {
          branchInfo = BRANCH_MAPPING[partialMatch];
        }
      }
      
      if (!branchInfo) {
        console.log(`Unknown course: ${courseName}`);
        continue;
      }
      
      // Extract closing ranks for each category
      for (const [colIndex, category] of Object.entries(categoryColumns)) {
        const cellValue = row[parseInt(colIndex)];
        if (cellValue && !isNaN(cellValue) && cellValue > 0 && cellValue < 200000) {
          const closingRank = parseFloat(cellValue);
          
          results.push({
            id: `${year}-${collegeCode}-${branchInfo.code}-${category}-${Math.random().toString(36).slice(2, 8)}`,
            year: parseInt(year),
            category: category,
            seat_type: 'government',
            quota_type: 'general',
            round: round,
            opening_rank: null,
            closing_rank: Math.round(closingRank),
            seats_available: null,
            source_url: source,
            verified: true,
            colleges: {
              name: collegeName || COLLEGE_MAPPING[collegeCode]?.name || `College ${collegeCode}`,
              code: collegeCode,
              location: COLLEGE_MAPPING[collegeCode]?.location || 'Unknown',
              district: COLLEGE_MAPPING[collegeCode]?.district || 'Unknown'
            },
            branches: {
              name: branchInfo.name,
              code: branchInfo.code
            }
          });
        }
      }
    }
  }
  
  return results;
}

async function extractFromExcel(file) {
  try {
    console.log(`Processing: ${path.basename(file)}`);
    
    const workbook = XLSX.readFile(file);
    
    // Detect year from filename
    const yearMatch = file.match(/20\d{2}/);
    const year = yearMatch ? yearMatch[0] : new Date().getFullYear().toString();
    
    // Parse the cutoff data
    const results = parseExcelData(workbook, year, path.basename(file));
    
    console.log(`Extracted ${results.length} records from ${path.basename(file)}`);
    return results;
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
    return [];
  }
}

async function main() {
  const root = process.cwd();
  const excelFiles = await glob('*.xlsx', { cwd: root });
  
  if (!excelFiles.length) {
    console.error('No Excel files found in project root.');
    process.exit(1);
  }
  
  console.log(`Found ${excelFiles.length} Excel files to process`);
  
  const allResults = [];
  
  for (const excelFile of excelFiles) {
    try {
      const results = await extractFromExcel(path.join(root, excelFile));
      allResults.push(...results);
    } catch (error) {
      console.error(`Failed to process ${excelFile}:`, error.message);
    }
  }
  
  // Create output directory
  const outDir = path.join(root, 'public', 'data');
  fs.mkdirSync(outDir, { recursive: true });
  
  // Save the extracted data
  const outFile = path.join(outDir, 'cutoffs.json');
  fs.writeFileSync(outFile, JSON.stringify(allResults, null, 2));
  
  console.log(`\nExtraction complete!`);
  console.log(`Total records extracted: ${allResults.length}`);
  console.log(`Data saved to: ${outFile}`);
  
  // Generate summary statistics
  const yearStats = {};
  const collegeStats = {};
  const branchStats = {};
  const categoryStats = {};
  
  allResults.forEach(record => {
    yearStats[record.year] = (yearStats[record.year] || 0) + 1;
    collegeStats[record.colleges.code] = (collegeStats[record.colleges.code] || 0) + 1;
    branchStats[record.branches.code] = (branchStats[record.branches.code] || 0) + 1;
    categoryStats[record.category] = (categoryStats[record.category] || 0) + 1;
  });
  
  console.log('\nSummary Statistics:');
  console.log('By Year:', yearStats);
  console.log('By Category:', categoryStats);
  console.log('Top Colleges:', Object.entries(collegeStats).sort((a, b) => b[1] - a[1]).slice(0, 10));
  console.log('Top Branches:', Object.entries(branchStats).sort((a, b) => b[1] - a[1]).slice(0, 10));
}

main().catch((error) => {
  console.error('Extraction failed:', error);
  process.exit(1);
});
