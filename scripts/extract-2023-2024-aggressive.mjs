#!/usr/bin/env node
/**
 * KCET 2023-2024 AGGRESSIVE Cutoff Extractor
 * 
 * Fixes the multi-college per sheet issue.
 * Each sheet has MULTIPLE colleges, not just one!
 * 
 * Expected: 200,000+ entries (all 258 colleges x all rounds)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// All 24 category codes used in KCET
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

// Stats tracking
const stats = {
    filesProcessed: 0,
    totalRecords: 0,
    recordsByYear: {},
    recordsByRound: {},
    uniqueInstitutes: new Set(),
    uniqueCourses: new Set(),
    uniqueCategories: new Set(),
    errors: [],
    fileStats: [],
    collegesPerFile: {}
};

/**
 * Clean text
 */
function cleanText(text) {
    if (!text) return '';
    return String(text)
        .replace(/[\r\n\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Determine year and round from filename
 */
function parseFilename(filename) {
    const lower = filename.toLowerCase();
    const yearMatch = lower.match(/(2023|2024)/);
    const year = yearMatch ? yearMatch[1] : null;

    let round = 'R1';
    if (lower.includes('round3') || lower.includes('extended')) {
        round = 'EXT';
    } else if (lower.includes('round2')) {
        round = 'R2';
    } else if (lower.includes('mock')) {
        round = 'MOCK';
    }

    return { year, round };
}

/**
 * Find all college blocks in a sheet
 * Each college starts with a row containing "EXXX College Name"
 */
function findCollegeBlocks(sheet) {
    const range = xlsx.utils.decode_range(sheet['!ref'] || 'A1:AZ500');
    const blocks = [];

    // Search all rows and first few columns for college code patterns
    for (let row = 0; row <= range.e.r; row++) {
        for (let col = 0; col <= Math.min(5, range.e.c); col++) {
            const cellAddr = xlsx.utils.encode_cell({ r: row, c: col });
            const cell = sheet[cellAddr];
            if (!cell || !cell.v) continue;

            const value = cleanText(cell.v);

            // Pattern 1: "E001 College Name" combined
            const combinedMatch = value.match(/^(E\d{3})\s+(.+)/);
            if (combinedMatch) {
                blocks.push({
                    startRow: row,
                    code: combinedMatch[1],
                    name: combinedMatch[2].replace(/\s*\(.*$/, '').trim() // Remove trailing parentheses
                });
                break; // Found college marker, move to next row
            }

            // Pattern 2: Just "E001" standalone
            const standaloneMatch = value.match(/^(E\d{3})$/);
            if (standaloneMatch) {
                // Look for name in adjacent cells
                let name = '';
                for (let nc = col + 1; nc <= Math.min(col + 5, range.e.c); nc++) {
                    const nextAddr = xlsx.utils.encode_cell({ r: row, c: nc });
                    const nextCell = sheet[nextAddr];
                    if (nextCell && nextCell.v) {
                        const nextVal = cleanText(nextCell.v);
                        if (nextVal.length > 3 && !nextVal.match(/^\d+$/)) {
                            name = nextVal;
                            break;
                        }
                    }
                }
                blocks.push({
                    startRow: row,
                    code: standaloneMatch[1],
                    name: name || `College ${standaloneMatch[1]}`
                });
                break;
            }
        }
    }

    // Calculate end rows for each block
    for (let i = 0; i < blocks.length; i++) {
        if (i < blocks.length - 1) {
            blocks[i].endRow = blocks[i + 1].startRow - 1;
        } else {
            blocks[i].endRow = range.e.r;
        }
    }

    return blocks;
}

/**
 * Find category header row within a college block
 */
function findCategoryHeader(sheet, startRow, endRow) {
    const range = xlsx.utils.decode_range(sheet['!ref'] || 'A1:AZ500');

    for (let row = startRow; row <= Math.min(startRow + 10, endRow); row++) {
        let categoryCount = 0;
        const foundCategories = [];

        for (let col = 0; col <= range.e.c; col++) {
            const cellAddr = xlsx.utils.encode_cell({ r: row, c: col });
            const cell = sheet[cellAddr];
            if (cell && cell.v) {
                const value = cleanText(cell.v).toUpperCase();
                if (ALL_CATEGORIES.includes(value)) {
                    categoryCount++;
                    foundCategories.push({ col, category: value });
                }
            }
        }

        if (categoryCount >= 8) {
            return { row, categories: foundCategories };
        }
    }

    return null;
}

/**
 * Extract data from a single college block
 */
function extractCollegeBlock(sheet, block, year, round) {
    const results = [];

    // Find category header within this block
    const headerInfo = findCategoryHeader(sheet, block.startRow, block.endRow);
    if (!headerInfo) {
        return results;
    }

    const { row: headerRow, categories } = headerInfo;

    // Find course column (usually column 0 or 1)
    let courseCol = 0;

    // Process data rows after header
    for (let row = headerRow + 1; row <= block.endRow; row++) {
        // Get course name from first columns
        let courseName = '';
        for (let col = 0; col <= 2; col++) {
            const cellAddr = xlsx.utils.encode_cell({ r: row, c: col });
            const cell = sheet[cellAddr];
            if (cell && cell.v) {
                const val = cleanText(cell.v);
                // Check if this looks like a course name
                if (val.length > 2 && /[A-Za-z]/.test(val) && !val.match(/^\d+$/) && !ALL_CATEGORIES.includes(val.toUpperCase())) {
                    if (val !== '--' && !val.match(/^E\d{3}/)) {
                        courseName = val;
                        courseCol = col;
                        break;
                    }
                }
            }
        }

        if (!courseName) continue;

        // Skip header-like rows
        if (courseName.toLowerCase().includes('course') ||
            courseName.toLowerCase().includes('branch') ||
            courseName.toLowerCase().includes('engineering cutoff')) {
            continue;
        }

        // Extract cutoff for each category
        for (const { col, category } of categories) {
            const cellAddr = xlsx.utils.encode_cell({ r: row, c: col });
            const cell = sheet[cellAddr];

            if (!cell || cell.v === null || cell.v === undefined || cell.v === '' || cell.v === '--') {
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

            // Validate rank range
            if (cutoffRank < 1 || cutoffRank > 500000) {
                continue;
            }

            results.push({
                institute: block.name,
                institute_code: block.code,
                course: courseName,
                category: category,
                cutoff_rank: cutoffRank,
                year: year,
                round: round
            });

            stats.uniqueCategories.add(category);
        }
    }

    return results;
}

/**
 * Process a single sheet - now handles MULTIPLE colleges
 */
function extractFromSheet(sheet, sheetName, year, round, filename) {
    const results = [];

    // Find all college blocks in this sheet
    const blocks = findCollegeBlocks(sheet);

    if (blocks.length === 0) {
        stats.errors.push(`No colleges found in ${filename}/${sheetName}`);
        return results;
    }

    console.log(`    Found ${blocks.length} colleges in sheet`);

    // Extract data from each college block
    for (const block of blocks) {
        const blockResults = extractCollegeBlock(sheet, block, year, round);
        results.push(...blockResults);

        if (blockResults.length > 0) {
            stats.uniqueInstitutes.add(block.code);
        }
    }

    return results;
}

/**
 * Process a single XLSX file
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

        console.log(`  📅 Year: ${year}, Round: ${round}`);
        console.log(`  📑 Sheets: ${workbook.SheetNames.length}`);

        let fileResults = [];
        let collegesFound = 0;

        for (const sheetName of workbook.SheetNames) {
            console.log(`  📄 Sheet: ${sheetName}`);
            const sheet = workbook.Sheets[sheetName];

            const sheetResults = extractFromSheet(sheet, sheetName, year, round, filename);
            fileResults.push(...sheetResults);

            // Count unique colleges in this sheet
            const sheetColleges = new Set(sheetResults.map(r => r.institute_code));
            collegesFound += sheetColleges.size;
        }

        console.log(`  ✅ Total: ${fileResults.length.toLocaleString()} records from ${collegesFound} colleges`);

        // Update stats
        stats.filesProcessed++;
        stats.totalRecords += fileResults.length;
        stats.recordsByYear[year] = (stats.recordsByYear[year] || 0) + fileResults.length;
        stats.recordsByRound[round] = (stats.recordsByRound[round] || 0) + fileResults.length;
        stats.collegesPerFile[filename] = collegesFound;

        fileResults.forEach(r => {
            stats.uniqueCourses.add(r.course);
        });

        stats.fileStats.push({
            file: filename,
            year,
            round,
            records: fileResults.length,
            colleges: collegesFound,
            sheets: workbook.SheetNames.length
        });

        return fileResults;

    } catch (error) {
        console.error(`  ❌ Error: ${error.message}`);
        stats.errors.push(`Error in ${filename}: ${error.message}`);
        return [];
    }
}

/**
 * Main extraction function
 */
async function main() {
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║   KCET 2023-2024 AGGRESSIVE EXTRACTOR (Multi-College Fix)        ║');
    console.log('║   Backup Only - NOT Connected to Database                        ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log();

    // Find only 2023 and 2024 XLSX files
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
        console.error('❌ No 2023/2024 XLSX cutoff files found!');
        process.exit(1);
    }

    console.log(`Found ${xlsxFiles.length} XLSX files for 2023-2024:`);
    xlsxFiles.forEach(f => console.log(`  • ${path.basename(f)}`));

    // Process all files
    let allResults = [];

    for (const xlsxFile of xlsxFiles) {
        const results = processXLSXFile(xlsxFile);
        allResults.push(...results);
    }

    // Create output
    const outputData = {
        metadata: {
            extraction_date: new Date().toISOString(),
            extraction_type: 'KCET_2023_2024_AGGRESSIVE_BACKUP',
            description: 'Aggressive extraction of all 2023-2024 KCET cutoffs - Multi-college per sheet fix applied',
            total_entries: allResults.length,
            files_processed: stats.filesProcessed,
            unique_institutes: stats.uniqueInstitutes.size,
            unique_courses: stats.uniqueCourses.size,
            unique_categories: stats.uniqueCategories.size,
            records_by_year: stats.recordsByYear,
            records_by_round: stats.recordsByRound,
            colleges_per_file: stats.collegesPerFile,
            unique_institutes_list: [...stats.uniqueInstitutes].sort(),
            file_details: stats.fileStats,
            errors: stats.errors
        },
        cutoffs: allResults
    };

    // Save to backup directory
    const backupDir = path.join(rootDir, 'backup');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupFile = path.join(backupDir, `kcet_2023_2024_aggressive_${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(outputData, null, 2), 'utf8');

    const latestFile = path.join(backupDir, 'kcet_2023_2024_cutoffs_LATEST.json');
    fs.writeFileSync(latestFile, JSON.stringify(outputData, null, 2), 'utf8');

    // Print summary
    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║                    EXTRACTION COMPLETE                           ║');
    console.log('╚══════════════════════════════════════════════════════════════════╝');
    console.log();
    console.log('📊 SUMMARY:');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log(`   📁 Files Processed:     ${stats.filesProcessed}`);
    console.log(`   📝 TOTAL ENTRIES:       ${stats.totalRecords.toLocaleString()}`);
    console.log(`   🏫 Unique Institutes:   ${stats.uniqueInstitutes.size}`);
    console.log(`   📚 Unique Courses:      ${stats.uniqueCourses.size}`);
    console.log(`   📊 Unique Categories:   ${stats.uniqueCategories.size}`);
    console.log();

    console.log('📅 RECORDS BY YEAR:');
    console.log('───────────────────────────────────────────────────────────────────');
    Object.entries(stats.recordsByYear).sort().forEach(([year, count]) => {
        console.log(`   • ${year}: ${count.toLocaleString()} entries`);
    });
    console.log();

    console.log('🔄 RECORDS BY ROUND:');
    console.log('───────────────────────────────────────────────────────────────────');
    Object.entries(stats.recordsByRound).sort().forEach(([round, count]) => {
        console.log(`   • ${round}: ${count.toLocaleString()} entries`);
    });
    console.log();

    console.log('🏫 COLLEGES PER FILE:');
    console.log('───────────────────────────────────────────────────────────────────');
    Object.entries(stats.collegesPerFile).forEach(([file, count]) => {
        console.log(`   • ${file}: ${count} colleges`);
    });

    if (stats.errors.length > 0) {
        console.log();
        console.log(`⚠️ ERRORS (${stats.errors.length}):`);
        stats.errors.slice(0, 10).forEach(e => console.log(`   • ${e}`));
        if (stats.errors.length > 10) console.log(`   ... and ${stats.errors.length - 10} more`);
    }

    console.log();
    console.log('💾 OUTPUT FILES:');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log(`   ${backupFile}`);
    console.log(`   ${latestFile}`);
    console.log();

    if (stats.totalRecords >= 200000) {
        console.log('✅ SUCCESS: Total entries exceed 200,000 target!');
    } else {
        console.log(`📊 Total: ${stats.totalRecords.toLocaleString()} entries from ${stats.uniqueInstitutes.size} institutes`);
    }

    console.log();
    console.log('⚠️ NOTE: This is a BACKUP file. Data is NOT connected to the database.');
}

main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
