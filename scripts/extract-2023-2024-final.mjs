#!/usr/bin/env node
/**
 * KCET 2023-2024 FINAL PRECISION EXTRACTOR
 * 
 * Strategy: 
 * 1. Find ALL category header rows in each sheet first
 * 2. Find ALL college markers  
 * 3. Associate each college with the header row immediately after it
 * 4. Extract ALL data
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xlsx from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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
    collegesPerFile: {},
    allCollegesFound: new Set(),
    extractedColleges: new Set(),
    fileDetails: []
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
 * Find all category header rows and their column mappings
 */
function findAllHeaders(sheet, maxRow) {
    const headers = [];
    const range = xlsx.utils.decode_range(sheet['!ref'] || 'A1:AZ1000');

    for (let row = 0; row <= Math.min(maxRow, range.e.r); row++) {
        const cats = [];
        for (let col = 0; col <= range.e.c; col++) {
            const addr = xlsx.utils.encode_cell({ r: row, c: col });
            const cell = sheet[addr];
            if (cell && cell.v) {
                const value = cleanText(cell.v).toUpperCase();
                if (ALL_CATEGORIES.includes(value)) {
                    cats.push({ col, category: value });
                }
            }
        }
        // Need at least 5 categories to be a header row
        if (cats.length >= 5) {
            headers.push({ row, categories: cats });
        }
    }

    return headers;
}

/**
 * Find all college markers in a sheet
 */
function findAllColleges(sheet, maxRow) {
    const colleges = [];
    const range = xlsx.utils.decode_range(sheet['!ref'] || 'A1:AZ1000');

    for (let row = 0; row <= Math.min(maxRow, range.e.r); row++) {
        for (let col = 0; col <= Math.min(5, range.e.c); col++) {
            const addr = xlsx.utils.encode_cell({ r: row, c: col });
            const cell = sheet[addr];
            if (cell && cell.v) {
                const value = cleanText(cell.v);
                const match = value.match(/^(E\d{3})\s*(.*)/);
                if (match) {
                    const code = match[1];
                    let name = match[2] || '';

                    // If name is empty, look in adjacent cells
                    if (!name || name.length < 5) {
                        for (let nc = col + 1; nc <= Math.min(col + 5, range.e.c); nc++) {
                            const naddr = xlsx.utils.encode_cell({ r: row, c: nc });
                            const ncell = sheet[naddr];
                            if (ncell && ncell.v) {
                                const nval = cleanText(ncell.v);
                                if (nval.length > 5 && !nval.match(/^E\d{3}/) && !nval.match(/^\d+$/)) {
                                    name = nval;
                                    break;
                                }
                            }
                        }
                    }

                    colleges.push({
                        code,
                        name: name.replace(/\s*\(.*$/, '').trim() || `College ${code}`,
                        row
                    });
                    stats.allCollegesFound.add(code);
                    break;
                }
            }
        }
    }

    return colleges;
}

/**
 * Extract data for a college block
 */
function extractCollegeData(sheet, college, headerRow, nextCollegeRow, year, round) {
    const results = [];
    const categories = headerRow.categories;

    // Data rows are after header, until next college or end
    const startRow = headerRow.row + 1;
    const endRow = nextCollegeRow ? nextCollegeRow - 1 : startRow + 20;

    for (let row = startRow; row <= endRow; row++) {
        // Find course name
        let courseName = '';
        for (let col = 0; col <= 3; col++) {
            const addr = xlsx.utils.encode_cell({ r: row, c: col });
            const cell = sheet[addr];
            if (cell && cell.v) {
                const val = cleanText(cell.v);
                if (val.length > 1 &&
                    /[A-Za-z]/.test(val) &&
                    !val.match(/^\d+$/) &&
                    !val.match(/^E\d{3}/) &&
                    !ALL_CATEGORIES.includes(val.toUpperCase()) &&
                    val !== '--' && val !== 'nan') {

                    // Skip if it looks like a header
                    if (val.toLowerCase().includes('course') ||
                        val.toLowerCase().includes('branch') ||
                        val.toLowerCase().includes('engineering cutoff')) {
                        break;
                    }

                    courseName = val;
                    break;
                }
            }
        }

        if (!courseName) continue;

        // Extract cutoffs for each category
        for (const { col, category } of categories) {
            const addr = xlsx.utils.encode_cell({ r: row, c: col });
            const cell = sheet[addr];

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
                institute: college.name,
                institute_code: college.code,
                course: courseName,
                category: category,
                cutoff_rank: cutoffRank,
                year: year,
                round: round
            });
        }
    }

    if (results.length > 0) {
        stats.extractedColleges.add(college.code);
        stats.uniqueInstitutes.add(college.code);
        results.forEach(r => stats.uniqueCourses.add(r.course));
    }

    return results;
}

/**
 * Process a single sheet with precise block detection
 */
function processSheet(sheet, sheetName, year, round) {
    const results = [];
    const range = xlsx.utils.decode_range(sheet['!ref'] || 'A1:AZ1000');

    // Step 1: Find all headers
    const headers = findAllHeaders(sheet, range.e.r);

    // Step 2: Find all colleges
    const colleges = findAllColleges(sheet, range.e.r);

    if (colleges.length === 0 || headers.length === 0) {
        return results;
    }

    // Step 3: For each college, find its associated header (the one immediately after college row)
    for (let i = 0; i < colleges.length; i++) {
        const college = colleges[i];
        const nextCollege = colleges[i + 1];

        // Find the header row that comes after this college row
        let headerForCollege = null;
        for (const h of headers) {
            if (h.row > college.row && (!nextCollege || h.row < nextCollege.row)) {
                headerForCollege = h;
                break;
            }
        }

        if (!headerForCollege) {
            // Try finding a header that's close to the college (within 3 rows)
            for (const h of headers) {
                if (Math.abs(h.row - college.row) <= 3) {
                    headerForCollege = h;
                    break;
                }
            }
        }

        if (headerForCollege) {
            const collegeResults = extractCollegeData(
                sheet,
                college,
                headerForCollege,
                nextCollege ? nextCollege.row : null,
                year,
                round
            );
            results.push(...collegeResults);
        }
    }

    return results;
}

/**
 * Process a single XLSX file
 */
function processXLSXFile(filePath) {
    const filename = path.basename(filePath);
    console.log(`\n📂 ${filename}`);

    try {
        const workbook = xlsx.readFile(filePath, { cellDates: true });
        const { year, round } = parseFilename(filename);

        if (!year) return [];

        let fileResults = [];
        let sheetsWithData = 0;

        for (const sheetName of workbook.SheetNames) {
            const sheet = workbook.Sheets[sheetName];
            const sheetResults = processSheet(sheet, sheetName, year, round);
            if (sheetResults.length > 0) sheetsWithData++;
            fileResults.push(...sheetResults);
        }

        const collegesInFile = new Set(fileResults.map(r => r.institute_code));
        console.log(`   ✅ ${fileResults.length.toLocaleString()} entries from ${collegesInFile.size} colleges`);

        stats.filesProcessed++;
        stats.totalRecords += fileResults.length;
        stats.recordsByYear[year] = (stats.recordsByYear[year] || 0) + fileResults.length;
        stats.recordsByRound[round] = (stats.recordsByRound[round] || 0) + fileResults.length;
        stats.collegesPerFile[filename] = collegesInFile.size;

        stats.fileDetails.push({
            file: filename,
            year,
            round,
            entries: fileResults.length,
            colleges: collegesInFile.size,
            sheets: workbook.SheetNames.length
        });

        return fileResults;

    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        return [];
    }
}

async function main() {
    console.log('╔══════════════════════════════════════════════════════════════════════╗');
    console.log('║     KCET 2023-2024 FINAL PRECISION EXTRACTOR                         ║');
    console.log('║     Every College • Every Round • Every Cutoff                       ║');
    console.log('╚══════════════════════════════════════════════════════════════════════╝');

    const xlsxFiles = fs.readdirSync(rootDir)
        .filter(f => f.toLowerCase().endsWith('.xlsx') &&
            f.toLowerCase().includes('cutoff') &&
            (f.includes('2023') || f.includes('2024')))
        .map(f => path.join(rootDir, f))
        .sort();

    console.log(`\nProcessing ${xlsxFiles.length} files...`);

    let allResults = [];
    for (const xlsxFile of xlsxFiles) {
        const results = processXLSXFile(xlsxFile);
        allResults.push(...results);
    }

    // Output
    const outputData = {
        metadata: {
            extraction_date: new Date().toISOString(),
            extraction_type: 'KCET_2023_2024_FINAL_PRECISION',
            total_entries: allResults.length,
            files_processed: stats.filesProcessed,
            colleges_found_in_xlsx: stats.allCollegesFound.size,
            colleges_with_data: stats.extractedColleges.size,
            unique_institutes: stats.uniqueInstitutes.size,
            unique_courses: stats.uniqueCourses.size,
            records_by_year: stats.recordsByYear,
            records_by_round: stats.recordsByRound,
            colleges_per_file: stats.collegesPerFile,
            unique_colleges_list: [...stats.uniqueInstitutes].sort(),
            all_colleges_in_xlsx: [...stats.allCollegesFound].sort(),
            file_details: stats.fileDetails
        },
        cutoffs: allResults
    };

    const backupDir = path.join(rootDir, 'backup');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupFile = path.join(backupDir, `kcet_2023_2024_FINAL_${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(outputData, null, 2), 'utf8');

    const latestFile = path.join(backupDir, 'kcet_2023_2024_cutoffs_LATEST.json');
    fs.writeFileSync(latestFile, JSON.stringify(outputData, null, 2), 'utf8');

    // Summary
    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('                         EXTRACTION COMPLETE');
    console.log('═══════════════════════════════════════════════════════════════════════');
    console.log(`📝 TOTAL ENTRIES:        ${stats.totalRecords.toLocaleString()}`);
    console.log(`🏫 COLLEGES IN XLSX:     ${stats.allCollegesFound.size}`);
    console.log(`✅ COLLEGES EXTRACTED:   ${stats.extractedColleges.size}`);
    console.log(`📚 UNIQUE COURSES:       ${stats.uniqueCourses.size}`);
    console.log();
    console.log('📅 BY YEAR:');
    Object.entries(stats.recordsByYear).sort().forEach(([y, c]) => console.log(`   ${y}: ${c.toLocaleString()}`));
    console.log();
    console.log('🔄 BY ROUND:');
    Object.entries(stats.recordsByRound).sort().forEach(([r, c]) => console.log(`   ${r}: ${c.toLocaleString()}`));
    console.log();

    // Check for missing
    const missing = [...stats.allCollegesFound].filter(c => !stats.extractedColleges.has(c));
    if (missing.length > 0) {
        console.log(`⚠️ COLLEGES WITHOUT DATA: ${missing.length}`);
        console.log(`   ${missing.slice(0, 20).join(', ')}${missing.length > 20 ? '...' : ''}`);
    } else {
        console.log('✅ 100% COVERAGE: All colleges extracted!');
    }

    console.log();
    console.log(`💾 Saved to: ${latestFile}`);
}

main().catch(console.error);
