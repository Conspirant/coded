#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function examineExcelStructure(filePath) {
  try {
    console.log(`\n=== Examining: ${path.basename(filePath)} ===`);
    
    const workbook = xlsx.readFile(filePath);
    const sheetNames = workbook.SheetNames;
    
    console.log(`Sheets: ${sheetNames.length}`);
    
    // Examine first few sheets in detail
    for (let i = 0; i < Math.min(3, sheetNames.length); i++) {
      const sheetName = sheetNames[i];
      console.log(`\n--- Sheet: ${sheetName} ---`);
      
      const worksheet = workbook.Sheets[sheetName];
      const df = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (df.length === 0) {
        console.log('  Empty sheet');
        continue;
      }
      
      console.log(`  Rows: ${df.length}`);
      console.log(`  Columns: ${df[0] ? df[0].length : 0}`);
      
      // Show first 10 rows
      console.log('  First 10 rows:');
      for (let j = 0; j < Math.min(10, df.length); j++) {
        const row = df[j];
        if (row && row.length > 0) {
          const rowStr = row.map(cell => {
            if (cell === null || cell === undefined) return 'null';
            if (typeof cell === 'string' && cell.length > 50) return `"${cell.substring(0, 50)}..."`;
            return `"${cell}"`;
          }).join(' | ');
          console.log(`    Row ${j}: ${rowStr}`);
        }
      }
      
      // Look for patterns
      let hasE001 = false;
      let hasCategories = false;
      let hasNumbers = false;
      
      for (let j = 0; j < Math.min(100, df.length); j++) {
        const row = df[j];
        if (!row) continue;
        
        for (let k = 0; k < row.length; k++) {
          const cell = row[k];
          if (cell && typeof cell === 'string') {
            if (cell.match(/^E\d{3}$/)) hasE001 = true;
            if (cell.match(/^(GM|1G|2AG|2BG|3AG|3BG|SC|ST)$/)) hasCategories = true;
            if (typeof cell === 'number' || (typeof cell === 'string' && cell.match(/^\d+$/))) hasNumbers = true;
          }
        }
      }
      
      console.log(`  Patterns found:`);
      console.log(`    E001 codes: ${hasE001}`);
      console.log(`    Categories: ${hasCategories}`);
      console.log(`    Numbers: ${hasNumbers}`);
    }
    
  } catch (error) {
    console.error(`Error examining ${filePath}:`, error.message);
  }
}

function main() {
  const rootDir = path.resolve(__dirname, '..');
  
  // Find Excel files
  const excelFiles = fs.readdirSync(rootDir)
    .filter(file => file.endsWith('.xlsx'))
    .map(file => path.join(rootDir, file));
  
  console.log(`Found ${excelFiles.length} Excel files to examine`);
  
  // Examine each file
  for (const excelFile of excelFiles) {
    examineExcelStructure(excelFile);
  }
  
  console.log('\n=== Examination Complete ===');
}

main();
