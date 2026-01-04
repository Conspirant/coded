#!/usr/bin/env node

import xlsx from 'xlsx';
import fs from 'fs';

function examineExcel(filePath) {
  console.log(`\n=== Examining: ${filePath} ===`);
  
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Get the range of the worksheet
    const range = xlsx.utils.decode_range(worksheet['!ref']);
    console.log(`Sheet range: ${worksheet['!ref']}`);
    console.log(`Rows: ${range.e.r + 1}, Cols: ${range.e.c + 1}`);
    
    // Convert to JSON with headers
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log('\nFirst 10 rows:');
    jsonData.slice(0, 10).forEach((row, i) => {
      console.log(`Row ${i}: [${row.map(cell => cell || '').join(' | ')}]`);
    });
    
    // Look for college codes (E001, E002, etc.)
    console.log('\nLooking for college codes...');
    let collegeRows = [];
    jsonData.forEach((row, i) => {
      if (row[0] && row[0].toString().match(/^E\d{3}/)) {
        collegeRows.push({ row: i, code: row[0], name: row[1] });
      }
    });
    
    if (collegeRows.length > 0) {
      console.log('Found college rows:');
      collegeRows.forEach(cr => console.log(`  Row ${cr.row}: ${cr.code} - ${cr.name}`));
    } else {
      console.log('No college codes found in first column');
    }
    
    // Look for course names
    console.log('\nLooking for course names...');
    let courseRows = [];
    jsonData.forEach((row, i) => {
      if (row[1] && row[1].toString().length > 3 && 
          !row[1].toString().includes('E') && 
          !row[1].toString().includes('--')) {
        courseRows.push({ row: i, course: row[1] });
      }
    });
    
    if (courseRows.length > 0) {
      console.log('Found course rows:');
      courseRows.slice(0, 10).forEach(cr => console.log(`  Row ${cr.row}: ${cr.course}`));
    } else {
      console.log('No course names found');
    }
    
    // Look at the header row more carefully
    if (jsonData.length > 0) {
      console.log('\nHeader row analysis:');
      const header = jsonData[0];
      header.forEach((cell, i) => {
        if (cell && cell.toString().trim()) {
          console.log(`  Col ${i}: "${cell}"`);
        }
      });
    }
    
  } catch (error) {
    console.error(`Error examining file: ${error.message}`);
  }
}

// Main function
function main() {
  const files = [
    'kcet-2023-round1-cutoffs.xlsx',
    'kcet-2024-round1-cutoffs.xlsx',
    'kcet-2025-round1-cutoffs.xlsx'
  ];
  
  files.forEach(file => {
    if (fs.existsSync(file)) {
      examineExcel(file);
    } else {
      console.log(`\nFile not found: ${file}`);
    }
  });
}

main();
