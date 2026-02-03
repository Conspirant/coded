#!/usr/bin/env node
/**
 * KCET 2023-2024 ULTRA-PRECISE EXTRACTOR
 * 
 * Goal: Extract EVERY SINGLE college, EVERY SINGLE round, EVERY SINGLE cutoff
 * with ZERO omissions. 100% data completeness.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// All 24 category codes
const ALL_CATEGORIES = [
    '1G', '1K', '1R',
    '2AG', '2AK', '2AR',
    '2BG', '2BK', '2BR',
    '3AG', '3AK', '3AR',
    '3BG', '3BK', '3BR',
    'GM', 'GMK', 'GMR',
    'SCG', 'SCK', 'SCR',
    'STG', 'STK', 'STR'
];

const stats = {
    totalRecords: 0,
    filesProcessed: 0,
    recordsByYear: {},
    recordsByRound: {},
    uniqueInstitutes: new Set(),
    uniqueCourses: new Set(),
    uniqueCategories: new Set(),
    collegesPerFile: {},
    missingColleges: [],
    allCollegesInXLSX: new Set(),
    errors: []
};

function cleanText(text) {
    if (!text) return '';
    return String(text).replace(/[\r\n\t]/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseFilename(filename) {
    const lower = filename.toLowerCase();
    const yearMatch = lower.match(/(2023|2024)/);
    const year = yearMatch ? yearMatch[1] : null;

    let round = 'R1';
    if (lower.includes('round3') || lower.includes('extended')) round = 'EXT';
    else if (lower.includes('round2')) round = 'R2';
    else if (lower.includes('mock')) round = 'MOCK';

    return { year, round };
}

/**
 * First pass: Find ALL college codes in the entire XLSX file
 */
function findAllCollegeCodes(workbook) {
    const codes = new Set();
    const codeDetails = new Map(); // code -> {name, sheetName, row}

    for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const range = xlsx.utils.decode_range(sheet['!ref'] || 'A1:AZ1000');

        for (let row = 0; row <= range.e.r; row++) {
            for (let col = 0; col <= Math.min(30, range.e.c); col++) {
                const cellAddr = xlsx.utils.encode_cell({ r: row, c: col });
                const cell = sheet[cellAddr];
                if (!cell || !cell.v) continue;

                const value = cleanText(cell.v);

                // Match E001-E999 at start of cell
                const match = value.match(/^(E\d{3})\s*(.*)/);
                if (match) {
                    const code = match[1];
                    const name = match[2] || '';
                    codes.add(code);
                    stats.allCollegesInXLSX.add(code);

                    if (!codeDetails.has(code) || name.length > (codeDetails.get(code).name || '').length) {
                        codeDetails.set(code, { name, sheetName, row });
                    }
                }
            }
        }
    }

    return { codes, codeDetails };
}

/**
 * Find category columns in a row
 */
function findCategoryColumns(sheet, row, maxCol) {
    const categories = [];
    for (let col = 0; col <= maxCol; col++) {
        const cellAddr = xlsx.utils.encode_cell({ r: row, c: col });
        const cell = sheet[cellAddr];
        if (cell && cell.v) {
            const value = cleanText(cell.v).toUpperCase();
            if (ALL_CATEGORIES.includes(value)) {
                categories.push({ col, category: value });
            }
        }
    }
    return categories;
}

/**
 * Extract ALL data from a sheet using row-by-row scanning
 */
function extractSheetData(sheet, sheetName, year, round, codeDetails) {
    const results = [];
    const range = xlsx.utils.decode_range(sheet['!ref'] || 'A1:AZ1000');

    let currentCollege = null;
    let categoryColumns = [];
    let lastCategoryRow = -100;

    for (let row = 0; row <= range.e.r; row++) {
        // Check if this row starts a new college
        for (let col = 0; col <= Math.min(5, range.e.c); col++) {
            const cellAddr = xlsx.utils.encode_cell({ r: row, c: col });
            const cell = sheet[cellAddr];
            if (cell && cell.v) {
                const value = cleanText(cell.v);
                const collegeMatch = value.match(/^(E\d{3})\s*(.*)/);
                if (collegeMatch) {
                    currentCollege = {
                        code: collegeMatch[1],
                        name: collegeMatch[2] || codeDetails.get(collegeMatch[1])?.name || `College ${collegeMatch[1]}`,
                        startRow: row
                    };
                    // Reset category columns for new college
                    categoryColumns = [];
                    break;
                }
            }
        }

        // Check for category header row
        const newCategories = findCategoryColumns(sheet, row, range.e.c);
        if (newCategories.length >= 8) {
            categoryColumns = newCategories;
            lastCategoryRow = row;
            continue; // This is header row, skip to data rows
        }

        // If we have a current college and category columns, extract data
        if (currentCollege && categoryColumns.length > 0 && row > lastCategoryRow) {
            // Find course name in first few columns
            let courseName = '';
            for (let col = 0; col <= Math.min(3, range.e.c); col++) {
                const cellAddr = xlsx.utils.encode_cell({ r: row, c: col });
                const cell = sheet[cellAddr];
                if (cell && cell.v) {
                    const val = cleanText(cell.v);
                    // Check if it looks like a course name
                    if (val.length > 2 &&
                        /[A-Za-z]/.test(val) &&
                        !val.match(/^\d+$/) &&
                        !val.match(/^E\d{3}/) &&
                        !ALL_CATEGORIES.includes(val.toUpperCase()) &&
                        val !== '--' &&
                        !val.toLowerCase().includes('engineering cutoff')) {
                        courseName = val;
                        break;
                    }
                }
            }

            if (!courseName) continue;
            if (courseName.toLowerCase().includes('course') ||
                courseName.toLowerCase().includes('branch') ||
                courseName.toLowerCase() === 'nan') continue;

            // Extract cutoffs for each category
            for (const { col, category } of categoryColumns) {
                const cellAddr = xlsx.utils.encode_cell({ r: row, c: col });
                const cell = sheet[cellAddr];

                if (!cell || cell.v === null || cell.v === undefined ||
                    cell.v === '' || cell.v === '--' || cell.v === 'nan') {
                    continue;
                }

                let cutoffRank;
                if (typeof cell.v === 'number') {
                    cutoffRank = Math.round(cell.v);
                } else {
                    const strVal = String(cell.v).replace(/[^\d]/g, '');
                    if (!strVal) continue;
                    cutoffRank = parseInt(strVal);
                    if (isNaN(cutoffRank)) continue;
                }

                if (cutoffRank < 1 || cutoffRank > 500000) continue;

                results.push({
                    institute: currentCollege.name.replace(/\s*\(.*$/, '').trim() || `College ${currentCollege.code}`,
                    institute_code: currentCollege.code,
                    course: courseName,
                    category: category,
                    cutoff_rank: cutoffRank,
                    year: year,
                    round: round
                });

                stats.uniqueCategories.add(category);
                stats.uniqueInstitutes.add(currentCollege.code);
                stats.uniqueCourses.add(courseName);
            }
        }
    }

    return results;
}

/**
 * Process a single XLSX file with ultra precision
 */
function processXLSXFile(filePath) {
    const filename = path.basename(filePath);
    console.log(`\n📂 Processing: ${filename}`);

    try {
        const workbook = xlsx.readFile(filePath, { cellDates: true });
        const { year, round } = parseFilename(filename);

        if (!year) {
            console.log(`  ⚠️ Skipping: Not a 2023/2024 file`);
            return [];
        }

        console.log(`  📅 Year: ${year}, Round: ${round}, Sheets: ${workbook.SheetNames.length}`);

        // First pass: find all colleges
        const { codes, codeDetails } = findAllCollegeCodes(workbook);
        console.log(`  🏫 Found ${codes.size} college codes in file`);
        stats.collegesPerFile[filename] = codes.size;

        // Second pass: extract all data
        let fileResults = [];
        for (const sheetName of workbook.SheetNames) {
            const sheet = workbook.Sheets[sheetName];
            const sheetResults = extractSheetData(sheet, sheetName, year, round, codeDetails);
            fileResults.push(...sheetResults);
        }

        const extractedColleges = new Set(fileResults.map(r => r.institute_code));
        console.log(`  ✅ Extracted ${fileResults.length.toLocaleString()} entries from ${extractedColleges.size} colleges`);

        // Check for missing colleges
        const missing = [...codes].filter(c => !extractedColleges.has(c));
        if (missing.length > 0) {
            console.log(`  ⚠️ Missing colleges: ${missing.join(', ')}`);
            stats.missingColleges.push(...missing.map(m => `${filename}: ${m}`));
        }

        stats.filesProcessed++;
        stats.totalRecords += fileResults.length;
        stats.recordsByYear[year] = (stats.recordsByYear[year] || 0) + fileResults.length;
        stats.recordsByRound[round] = (stats.recordsByRound[round] || 0) + fileResults.length;

        return fileResults;

    } catch (error) {
        console.error(`  ❌ Error: ${error.message}`);
        stats.errors.push(`${filename}: ${error.message}`);
        return [];
    }
}

async function main() {
    console.log('╔════════════════════════════════════════════════════════════════════╗');
    console.log('║   KCET 2023-2024 ULTRA-PRECISE EXTRACTOR                           ║');
    console.log('║   Goal: 100% data completeness - EVERY college, EVERY cutoff      ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝');
    console.log();

    const xlsxFiles = fs.readdirSync(rootDir)
        .filter(f => {
            const lower = f.toLowerCase();
            return lower.endsWith('.xlsx') &&
                lower.includes('cutoff') &&
                (lower.includes('2023') || lower.includes('2024'));
        })
        .map(f => path.join(rootDir, f))
        .sort();

    if (xlsxFiles.length === 0) {
        console.error('❌ No 2023/2024 XLSX files found!');
        process.exit(1);
    }

    console.log(`Found ${xlsxFiles.length} XLSX files:`);
    xlsxFiles.forEach(f => console.log(`  • ${path.basename(f)}`));

    let allResults = [];
    for (const xlsxFile of xlsxFiles) {
        const results = processXLSXFile(xlsxFile);
        allResults.push(...results);
    }

    // Create output
    const outputData = {
        metadata: {
            extraction_date: new Date().toISOString(),
            extraction_type: 'KCET_2023_2024_ULTRA_PRECISE',
            description: '100% precise extraction - every college, every round, every cutoff',
            total_entries: allResults.length,
            files_processed: stats.filesProcessed,
            unique_institutes: stats.uniqueInstitutes.size,
            total_colleges_in_xlsx: stats.allCollegesInXLSX.size,
            unique_courses: stats.uniqueCourses.size,
            unique_categories: stats.uniqueCategories.size,
            records_by_year: stats.recordsByYear,
            records_by_round: stats.recordsByRound,
            colleges_per_file: stats.collegesPerFile,
            unique_institutes_list: [...stats.uniqueInstitutes].sort(),
            all_colleges_in_xlsx: [...stats.allCollegesInXLSX].sort(),
            missing_colleges: stats.missingColleges,
            errors: stats.errors
        },
        cutoffs: allResults
    };

    // Save
    const backupDir = path.join(rootDir, 'backup');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupFile = path.join(backupDir, `kcet_2023_2024_ULTRA_${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(outputData, null, 2), 'utf8');

    const latestFile = path.join(backupDir, 'kcet_2023_2024_cutoffs_LATEST.json');
    fs.writeFileSync(latestFile, JSON.stringify(outputData, null, 2), 'utf8');

    // Summary
    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════════════╗');
    console.log('║                    EXTRACTION COMPLETE                             ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝');
    console.log();
    console.log('📊 FINAL STATISTICS:');
    console.log('═══════════════════════════════════════════════════════════════════════');
    console.log(`   📝 TOTAL ENTRIES:          ${stats.totalRecords.toLocaleString()}`);
    console.log(`   🏫 COLLEGES EXTRACTED:     ${stats.uniqueInstitutes.size}`);
    console.log(`   📋 COLLEGES IN XLSX:       ${stats.allCollegesInXLSX.size}`);
    console.log(`   📚 UNIQUE COURSES:         ${stats.uniqueCourses.size}`);
    console.log(`   📊 UNIQUE CATEGORIES:      ${stats.uniqueCategories.size}`);
    console.log();

    console.log('📅 BY YEAR:');
    Object.entries(stats.recordsByYear).sort().forEach(([y, c]) => console.log(`   • ${y}: ${c.toLocaleString()}`));
    console.log();

    console.log('🔄 BY ROUND:');
    Object.entries(stats.recordsByRound).sort().forEach(([r, c]) => console.log(`   • ${r}: ${c.toLocaleString()}`));
    console.log();

    console.log('🏫 COLLEGES PER FILE:');
    Object.entries(stats.collegesPerFile).forEach(([f, c]) => console.log(`   • ${f}: ${c}`));

    if (stats.missingColleges.length > 0) {
        console.log();
        console.log(`⚠️ MISSING COLLEGES (${stats.missingColleges.length}):`);
        stats.missingColleges.slice(0, 20).forEach(m => console.log(`   • ${m}`));
    }

    console.log();
    console.log('💾 SAVED TO:', latestFile);
    console.log();

    if (stats.uniqueInstitutes.size === stats.allCollegesInXLSX.size) {
        console.log('✅ SUCCESS: 100% of colleges extracted!');
    } else {
        console.log(`⚠️ Extracted ${stats.uniqueInstitutes.size}/${stats.allCollegesInXLSX.size} colleges`);
    }
}

main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
