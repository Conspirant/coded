#!/usr/bin/env node
/**
 * Comprehensive XLSX Cutoff Extractor
 * 
 * This script extracts ALL cutoff data from XLSX files and saves it as a backup
 * for review before replacing the main data source.
 * 
 * Output Format (matching kcet_cutoffs_consolidated.json):
 * {
 *   "institute": "COLLEGE NAME",
 *   "institute_code": "E001",
 *   "course": "Computer Science Engineering",
 *   "category": "GM",
 *   "cutoff_rank": 12345,
 *   "year": "2024",
 *   "round": "R1",
 *   "source": "xlsx_extraction"
 * }
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
    errors: []
};

/**
 * Clean text by removing special characters and normalizing whitespace
 */
function cleanText(text) {
    if (!text) return '';
    return String(text)
        .replace(/[\r\n\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/[""]/g, '"')
        .replace(/['']/g, "'")
        .trim();
}

/**
 * Determine year and round from filename
 */
function parseFilename(filename) {
    const lower = filename.toLowerCase();

    // Extract year (2023, 2024, 2025)
    const yearMatch = lower.match(/(202[3-5])/);
    const year = yearMatch ? yearMatch[1] : '2024';

    // Extract round
    let round = 'R1';
    if (lower.includes('round3') || lower.includes('extended') || lower.includes('ext')) {
        round = 'EXT';
    } else if (lower.includes('round2')) {
        round = 'R2';
    } else if (lower.includes('round1')) {
        round = 'R1';
    } else if (lower.includes('mock')) {
        round = 'MOCK';
    }

    return { year, round };
}

/**
 * Find the header row containing category columns
 */
function findCategoryHeaderRow(sheet, maxRows = 20) {
    const range = xlsx.utils.decode_range(sheet['!ref'] || 'A1:Z1');

    for (let row = 0; row <= Math.min(range.e.r, maxRows); row++) {
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

        // If we found at least 10 category columns, this is our header row
        if (categoryCount >= 10) {
            console.log(`  Found header row at index ${row} with ${categoryCount} categories`);
            return { row, categories: foundCategories };
        }
    }

    return null;
}

/**
 * Find institute info from sheet (college code and name)
 */
function findInstituteInfo(sheet, maxRows = 50) {
    const range = xlsx.utils.decode_range(sheet['!ref'] || 'A1:Z1');

    for (let row = 0; row <= Math.min(range.e.r, maxRows); row++) {
        for (let col = 0; col <= Math.min(range.e.c, 20); col++) {
            const cellAddr = xlsx.utils.encode_cell({ r: row, c: col });
            const cell = sheet[cellAddr];
            if (!cell || !cell.v) continue;

            const value = cleanText(cell.v);

            // Pattern: "E001" or "E173" standalone code
            const codeMatch = value.match(/^(E\d{3})$/);
            if (codeMatch) {
                // Look for name in next cells
                for (let nextCol = col + 1; nextCol <= Math.min(col + 5, range.e.c); nextCol++) {
                    const nextAddr = xlsx.utils.encode_cell({ r: row, c: nextCol });
                    const nextCell = sheet[nextAddr];
                    if (nextCell && nextCell.v) {
                        const name = cleanText(nextCell.v);
                        if (name.length > 5 && !name.match(/^E\d{3}$/)) {
                            return { code: codeMatch[1], name: name.toUpperCase() };
                        }
                    }
                }
                // Look in next row
                const nextRowAddr = xlsx.utils.encode_cell({ r: row + 1, c: col });
                const nextRowCell = sheet[nextRowAddr];
                if (nextRowCell && nextRowCell.v) {
                    const name = cleanText(nextRowCell.v);
                    if (name.length > 5) {
                        return { code: codeMatch[1], name: name.toUpperCase() };
                    }
                }
            }

            // Pattern: "E001 College Name" combined
            const combinedMatch = value.match(/^(E\d{3})\s+(.+)$/);
            if (combinedMatch) {
                return { code: combinedMatch[1], name: combinedMatch[2].toUpperCase() };
            }
        }
    }

    return null;
}

/**
 * Find course name column (usually column A or first column with course names)
 */
function findCourseColumn(sheet, headerRow) {
    const range = xlsx.utils.decode_range(sheet['!ref'] || 'A1:Z1');

    // Check first few columns for course-like content
    for (let col = 0; col <= Math.min(3, range.e.c); col++) {
        let courseCount = 0;

        // Check rows after header
        for (let row = headerRow + 1; row <= Math.min(headerRow + 20, range.e.r); row++) {
            const cellAddr = xlsx.utils.encode_cell({ r: row, c: col });
            const cell = sheet[cellAddr];
            if (cell && cell.v) {
                const value = cleanText(cell.v);
                // Looks like a course name (has letters, length > 2, not just numbers)
                if (value.length > 2 && /[A-Za-z]/.test(value) && !/^\d+$/.test(value)) {
                    courseCount++;
                }
            }
        }

        if (courseCount >= 3) {
            return col;
        }
    }

    return 0; // Default to first column
}

/**
 * Extract cutoff data from a single sheet
 */
function extractFromSheet(sheet, sheetName, year, round, filename) {
    const results = [];

    // Find institute info
    const instituteInfo = findInstituteInfo(sheet);
    if (!instituteInfo) {
        console.log(`  ⚠️ Could not find institute info in sheet: ${sheetName}`);
        stats.errors.push(`No institute info in ${filename}/${sheetName}`);
        return results;
    }

    console.log(`  📍 Institute: ${instituteInfo.code} - ${instituteInfo.name}`);

    // Find category header row
    const headerInfo = findCategoryHeaderRow(sheet);
    if (!headerInfo) {
        console.log(`  ⚠️ Could not find category headers in sheet: ${sheetName}`);
        stats.errors.push(`No category headers in ${filename}/${sheetName}`);
        return results;
    }

    const { row: headerRow, categories } = headerInfo;

    // Find course column
    const courseCol = findCourseColumn(sheet, headerRow);
    console.log(`  📊 Course column: ${courseCol}, Header row: ${headerRow}, Categories: ${categories.length}`);

    const range = xlsx.utils.decode_range(sheet['!ref'] || 'A1:Z1');

    // Process data rows (after header)
    for (let row = headerRow + 1; row <= range.e.r; row++) {
        // Get course name
        const courseCellAddr = xlsx.utils.encode_cell({ r: row, c: courseCol });
        const courseCell = sheet[courseCellAddr];
        if (!courseCell || !courseCell.v) continue;

        const courseName = cleanText(courseCell.v);

        // Skip empty, header-like, or invalid rows
        if (!courseName ||
            courseName === '--' ||
            courseName === 'nan' ||
            courseName.toLowerCase().includes('course') ||
            courseName.toLowerCase().includes('branch') ||
            /^[\d\s\-]+$/.test(courseName)) {
            continue;
        }

        // Extract cutoff for each category
        for (const { col, category } of categories) {
            const cellAddr = xlsx.utils.encode_cell({ r: row, c: col });
            const cell = sheet[cellAddr];

            if (!cell || cell.v === null || cell.v === undefined || cell.v === '') {
                continue;
            }

            let cutoffRank;
            if (typeof cell.v === 'number') {
                cutoffRank = Math.round(cell.v);
            } else {
                const parsed = parseInt(String(cell.v).replace(/[^\d]/g, ''));
                if (isNaN(parsed)) continue;
                cutoffRank = parsed;
            }

            // Validate rank range (1 to 500000)
            if (cutoffRank < 1 || cutoffRank > 500000) {
                continue;
            }

            results.push({
                institute: instituteInfo.name,
                institute_code: instituteInfo.code,
                course: courseName,
                category: category,
                cutoff_rank: cutoffRank,
                year: year,
                round: round,
                source: 'xlsx_extraction'
            });
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

        console.log(`  📅 Year: ${year}, Round: ${round}`);
        console.log(`  📑 Sheets: ${workbook.SheetNames.length}`);

        let fileResults = [];

        for (const sheetName of workbook.SheetNames) {
            console.log(`\n  📄 Sheet: ${sheetName}`);
            const sheet = workbook.Sheets[sheetName];

            const sheetResults = extractFromSheet(sheet, sheetName, year, round, filename);
            fileResults = fileResults.concat(sheetResults);

            console.log(`  ✅ Extracted ${sheetResults.length} records from this sheet`);
        }

        console.log(`\n  📊 Total from ${filename}: ${fileResults.length} records`);

        // Update stats
        stats.filesProcessed++;
        stats.totalRecords += fileResults.length;
        stats.recordsByYear[year] = (stats.recordsByYear[year] || 0) + fileResults.length;
        stats.recordsByRound[round] = (stats.recordsByRound[round] || 0) + fileResults.length;

        fileResults.forEach(r => {
            stats.uniqueInstitutes.add(r.institute_code);
            stats.uniqueCourses.add(r.course);
        });

        return fileResults;

    } catch (error) {
        console.error(`  ❌ Error processing ${filename}: ${error.message}`);
        stats.errors.push(`Error in ${filename}: ${error.message}`);
        return [];
    }
}

/**
 * Main extraction function
 */
async function main() {
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║     KCET XLSX Comprehensive Cutoff Extractor                 ║');
    console.log('║     Backup Extraction for Review                             ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log();

    // Find all XLSX files in root
    const xlsxFiles = fs.readdirSync(rootDir)
        .filter(f => f.endsWith('.xlsx') && f.includes('cutoff'))
        .map(f => path.join(rootDir, f))
        .sort();

    if (xlsxFiles.length === 0) {
        console.error('❌ No XLSX cutoff files found in project root!');
        process.exit(1);
    }

    console.log(`Found ${xlsxFiles.length} XLSX files to process:`);
    xlsxFiles.forEach(f => console.log(`  • ${path.basename(f)}`));

    // Process all files
    let allResults = [];

    for (const xlsxFile of xlsxFiles) {
        const results = processXLSXFile(xlsxFile);
        allResults = allResults.concat(results);
    }

    // Create output structure matching existing format
    const outputData = {
        metadata: {
            extraction_date: new Date().toISOString(),
            extraction_type: 'XLSX_BACKUP',
            total_entries: allResults.length,
            files_processed: stats.filesProcessed,
            unique_institutes: stats.uniqueInstitutes.size,
            unique_courses: stats.uniqueCourses.size,
            records_by_year: stats.recordsByYear,
            records_by_round: stats.recordsByRound,
            unique_categories: [...new Set(allResults.map(r => r.category))].sort(),
            unique_institutes_list: [...stats.uniqueInstitutes].sort(),
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
    const backupFile = path.join(backupDir, `kcet_cutoffs_xlsx_backup_${timestamp}.json`);

    fs.writeFileSync(backupFile, JSON.stringify(outputData, null, 2), 'utf8');

    // Also save a latest version
    const latestFile = path.join(backupDir, 'kcet_cutoffs_xlsx_LATEST.json');
    fs.writeFileSync(latestFile, JSON.stringify(outputData, null, 2), 'utf8');

    // Print summary
    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║                    EXTRACTION COMPLETE                       ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log();
    console.log(`📊 Summary:`);
    console.log(`   • Files Processed: ${stats.filesProcessed}`);
    console.log(`   • Total Records: ${stats.totalRecords.toLocaleString()}`);
    console.log(`   • Unique Institutes: ${stats.uniqueInstitutes.size}`);
    console.log(`   • Unique Courses: ${stats.uniqueCourses.size}`);
    console.log();
    console.log(`📅 Records by Year:`);
    Object.entries(stats.recordsByYear).sort().forEach(([year, count]) => {
        console.log(`   • ${year}: ${count.toLocaleString()}`);
    });
    console.log();
    console.log(`🔄 Records by Round:`);
    Object.entries(stats.recordsByRound).sort().forEach(([round, count]) => {
        console.log(`   • ${round}: ${count.toLocaleString()}`);
    });

    if (stats.errors.length > 0) {
        console.log();
        console.log(`⚠️ Errors (${stats.errors.length}):`);
        stats.errors.forEach(e => console.log(`   • ${e}`));
    }

    console.log();
    console.log(`📁 Backup saved to:`);
    console.log(`   ${backupFile}`);
    console.log(`   ${latestFile}`);
    console.log();
    console.log('⚠️  This is a BACKUP file. Review before replacing main data source.');
}

main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
