#!/usr/bin/env node
/**
 * KCET 2023-2024 Precise Cutoff Extractor
 * 
 * Extracts ALL cutoff data from 2023 and 2024 XLSX files ONLY.
 * Saves to backup folder without connecting to database.
 * 
 * Expected: 200,000+ entries
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
    fileStats: []
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

    // Extract year (2023 or 2024 only)
    const yearMatch = lower.match(/(2023|2024)/);
    const year = yearMatch ? yearMatch[1] : null;

    // Extract round
    let round = 'R1';
    if (lower.includes('round3') || lower.includes('extended') || lower.includes('ext')) {
        round = 'EXT';
    } else if (lower.includes('round2')) {
        round = 'R2';
    } else if (lower.includes('round1')) {
        round = 'R1';
    }
    if (lower.includes('mock')) {
        round = 'MOCK';
    }

    return { year, round };
}

/**
 * Find the header row containing category columns - more aggressive search
 */
function findCategoryHeaderRow(sheet, maxRows = 50) {
    const range = xlsx.utils.decode_range(sheet['!ref'] || 'A1:AZ1');

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

        // If we found at least 8 category columns, this is our header row
        if (categoryCount >= 8) {
            return { row, categories: foundCategories };
        }
    }

    return null;
}

/**
 * Find institute info from sheet (college code and name) - comprehensive search
 */
function findInstituteInfo(sheet, maxRows = 100) {
    const range = xlsx.utils.decode_range(sheet['!ref'] || 'A1:AZ1');

    for (let row = 0; row <= Math.min(range.e.r, maxRows); row++) {
        for (let col = 0; col <= Math.min(range.e.c, 30); col++) {
            const cellAddr = xlsx.utils.encode_cell({ r: row, c: col });
            const cell = sheet[cellAddr];
            if (!cell || !cell.v) continue;

            const value = cleanText(cell.v);

            // Pattern: "E001" or "E173" standalone code
            const codeMatch = value.match(/^(E\d{3})$/);
            if (codeMatch) {
                // Look for name in next cells on same row
                for (let nextCol = col + 1; nextCol <= Math.min(col + 10, range.e.c); nextCol++) {
                    const nextAddr = xlsx.utils.encode_cell({ r: row, c: nextCol });
                    const nextCell = sheet[nextAddr];
                    if (nextCell && nextCell.v) {
                        const name = cleanText(nextCell.v);
                        if (name.length > 5 && !name.match(/^E\d{3}$/)) {
                            return { code: codeMatch[1], name: name };
                        }
                    }
                }
                // Look in next row
                const nextRowAddr = xlsx.utils.encode_cell({ r: row + 1, c: col });
                const nextRowCell = sheet[nextRowAddr];
                if (nextRowCell && nextRowCell.v) {
                    const name = cleanText(nextRowCell.v);
                    if (name.length > 5) {
                        return { code: codeMatch[1], name: name };
                    }
                }
                // Use code with placeholder name
                return { code: codeMatch[1], name: `College ${codeMatch[1]}` };
            }

            // Pattern: "E001 College Name" combined
            const combinedMatch = value.match(/^(E\d{3})\s+(.+)$/);
            if (combinedMatch) {
                return { code: combinedMatch[1], name: combinedMatch[2] };
            }
        }
    }

    return null;
}

/**
 * Find course name column
 */
function findCourseColumn(sheet, headerRow) {
    const range = xlsx.utils.decode_range(sheet['!ref'] || 'A1:AZ1');

    // Check first few columns for course-like content
    for (let col = 0; col <= Math.min(5, range.e.c); col++) {
        let courseCount = 0;

        // Check rows after header
        for (let row = headerRow + 1; row <= Math.min(headerRow + 30, range.e.r); row++) {
            const cellAddr = xlsx.utils.encode_cell({ r: row, c: col });
            const cell = sheet[cellAddr];
            if (cell && cell.v) {
                const value = cleanText(cell.v);
                // Looks like a course name
                if (value.length > 2 && /[A-Za-z]/.test(value) && !/^\d+$/.test(value) && value !== '--') {
                    courseCount++;
                }
            }
        }

        if (courseCount >= 2) {
            return col;
        }
    }

    return 0;
}

/**
 * Extract cutoff data from a single sheet
 */
function extractFromSheet(sheet, sheetName, year, round, filename) {
    const results = [];

    // Find institute info
    const instituteInfo = findInstituteInfo(sheet);
    if (!instituteInfo) {
        stats.errors.push(`No institute info in ${filename}/${sheetName}`);
        return results;
    }

    // Find category header row
    const headerInfo = findCategoryHeaderRow(sheet);
    if (!headerInfo) {
        stats.errors.push(`No category headers in ${filename}/${sheetName}`);
        return results;
    }

    const { row: headerRow, categories } = headerInfo;

    // Find course column
    const courseCol = findCourseColumn(sheet, headerRow);

    const range = xlsx.utils.decode_range(sheet['!ref'] || 'A1:AZ1');

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
                round: round
            });

            stats.uniqueCategories.add(category);
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
        let sheetsWithData = 0;

        for (const sheetName of workbook.SheetNames) {
            const sheet = workbook.Sheets[sheetName];

            const sheetResults = extractFromSheet(sheet, sheetName, year, round, filename);
            if (sheetResults.length > 0) {
                sheetsWithData++;
            }
            fileResults = fileResults.concat(sheetResults);
        }

        console.log(`  ✅ Extracted ${fileResults.length.toLocaleString()} records from ${sheetsWithData} sheets`);

        // Update stats
        stats.filesProcessed++;
        stats.totalRecords += fileResults.length;
        stats.recordsByYear[year] = (stats.recordsByYear[year] || 0) + fileResults.length;
        stats.recordsByRound[round] = (stats.recordsByRound[round] || 0) + fileResults.length;

        fileResults.forEach(r => {
            stats.uniqueInstitutes.add(r.institute_code);
            stats.uniqueCourses.add(r.course);
        });

        stats.fileStats.push({
            file: filename,
            year,
            round,
            records: fileResults.length,
            sheets: workbook.SheetNames.length,
            sheetsWithData
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
    console.log('╔══════════════════════════════════════════════════════════════════╗');
    console.log('║     KCET 2023-2024 PRECISE CUTOFF EXTRACTOR                      ║');
    console.log('║     Backup Extraction - NOT Connected to Database                ║');
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
        console.error('❌ No 2023/2024 XLSX cutoff files found in project root!');
        process.exit(1);
    }

    console.log(`Found ${xlsxFiles.length} XLSX files for 2023-2024:`);
    xlsxFiles.forEach(f => console.log(`  • ${path.basename(f)}`));

    // Process all files
    let allResults = [];

    for (const xlsxFile of xlsxFiles) {
        const results = processXLSXFile(xlsxFile);
        allResults = allResults.concat(results);
    }

    // Create output structure
    const outputData = {
        metadata: {
            extraction_date: new Date().toISOString(),
            extraction_type: 'KCET_2023_2024_PRECISE_BACKUP',
            description: 'Precise extraction of all 2023 and 2024 KCET cutoff data - NOT connected to database',
            total_entries: allResults.length,
            files_processed: stats.filesProcessed,
            unique_institutes: stats.uniqueInstitutes.size,
            unique_courses: stats.uniqueCourses.size,
            unique_categories: stats.uniqueCategories.size,
            records_by_year: stats.recordsByYear,
            records_by_round: stats.recordsByRound,
            unique_categories_list: [...stats.uniqueCategories].sort(),
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
    const backupFile = path.join(backupDir, `kcet_2023_2024_cutoffs_${timestamp}.json`);

    fs.writeFileSync(backupFile, JSON.stringify(outputData, null, 2), 'utf8');

    // Also save a latest version
    const latestFile = path.join(backupDir, 'kcet_2023_2024_cutoffs_LATEST.json');
    fs.writeFileSync(latestFile, JSON.stringify(outputData, null, 2), 'utf8');

    // Print comprehensive summary
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

    console.log('📄 FILE DETAILS:');
    console.log('───────────────────────────────────────────────────────────────────');
    stats.fileStats.forEach(f => {
        console.log(`   • ${f.file}: ${f.records.toLocaleString()} entries (${f.sheetsWithData}/${f.sheets} sheets)`);
    });

    if (stats.errors.length > 0) {
        console.log();
        console.log(`⚠️ ERRORS (${stats.errors.length}):`);
        console.log('───────────────────────────────────────────────────────────────────');
        stats.errors.forEach(e => console.log(`   • ${e}`));
    }

    console.log();
    console.log('💾 OUTPUT FILES:');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log(`   ${backupFile}`);
    console.log(`   ${latestFile}`);
    console.log();

    // Final verification
    if (stats.totalRecords >= 200000) {
        console.log('✅ SUCCESS: Total entries exceed 200,000 target!');
    } else {
        console.log(`⚠️ WARNING: Total entries (${stats.totalRecords.toLocaleString()}) is below 200,000 target`);
    }

    console.log();
    console.log('⚠️ NOTE: This is a BACKUP file. Data is NOT connected to the database.');
}

main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
