#!/usr/bin/env node
/**
 * KCET Data Integration Script
 * 
 * Merges the new precise 2023-2024 extraction into the main data file
 * while preserving all 2025 data.
 * 
 * This makes the data available to:
 * - Mock Simulator
 * - Cutoff Explorer
 * - College Finder
 * - Dashboard
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('╔══════════════════════════════════════════════════════════════════════╗');
console.log('║     KCET DATA INTEGRATION                                            ║');
console.log('║     Merging new 2023-2024 data with existing 2025 data               ║');
console.log('╚══════════════════════════════════════════════════════════════════════╝');
console.log();

// Step 1: Load the new 2023-2024 extracted data
console.log('📥 Loading new 2023-2024 extracted data...');
const newDataPath = path.join(rootDir, 'backup', 'kcet_2023_2024_cutoffs_LATEST.json');
if (!fs.existsSync(newDataPath)) {
    console.error('❌ New data file not found:', newDataPath);
    process.exit(1);
}
const newData = JSON.parse(fs.readFileSync(newDataPath, 'utf8'));
console.log(`   ✅ Loaded ${newData.cutoffs.length.toLocaleString()} entries for 2023-2024`);

// Step 2: Load existing consolidated data
console.log('📥 Loading existing consolidated data...');
const existingDataPath = path.join(rootDir, 'kcet_cutoffs.json');
if (!fs.existsSync(existingDataPath)) {
    console.error('❌ Existing data file not found:', existingDataPath);
    process.exit(1);
}
const existingData = JSON.parse(fs.readFileSync(existingDataPath, 'utf8'));
console.log(`   ✅ Loaded ${existingData.cutoffs.length.toLocaleString()} total existing entries`);

// Step 3: Separate 2025 data from existing
console.log('🔄 Separating 2025 data from existing...');
const existing2025 = existingData.cutoffs.filter(c => c.year === '2025');
const existingOther = existingData.cutoffs.filter(c => c.year !== '2025');
console.log(`   📊 2025 data: ${existing2025.length.toLocaleString()} entries (KEEP)`);
console.log(`   📊 2023-2024 data (old): ${existingOther.length.toLocaleString()} entries (REPLACE)`);

// Step 4: Merge new 2023-2024 with existing 2025
console.log('🔗 Merging new data...');
const mergedCutoffs = [...newData.cutoffs, ...existing2025];
console.log(`   ✅ Merged: ${mergedCutoffs.length.toLocaleString()} total entries`);

// Step 5: Calculate new statistics
const stats = {
    totalEntries: mergedCutoffs.length,
    byYear: {},
    byRound: {},
    institutes: new Set(),
    courses: new Set(),
    categories: new Set()
};

mergedCutoffs.forEach(c => {
    stats.byYear[c.year] = (stats.byYear[c.year] || 0) + 1;
    stats.byRound[c.round] = (stats.byRound[c.round] || 0) + 1;
    stats.institutes.add(c.institute_code);
    stats.courses.add(c.course);
    stats.categories.add(c.category);
});

// Step 6: Create the merged output
const mergedOutput = {
    metadata: {
        last_updated: new Date().toISOString(),
        total_entries: mergedCutoffs.length,
        total_institutes: stats.institutes.size,
        total_courses: stats.courses.size,
        total_categories: stats.categories.size,
        years_covered: Object.keys(stats.byYear).sort(),
        extraction_method: 'Precise XLSX extraction for 2023-2024 + existing 2025 data',
        records_by_year: stats.byYear,
        records_by_round: stats.byRound
    },
    cutoffs: mergedCutoffs
};

// Step 7: Backup existing files
console.log('💾 Creating backups...');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupDir = path.join(rootDir, 'backup');

// Backup main file
const mainBackup = path.join(backupDir, `kcet_cutoffs_pre_integration_${timestamp}.json`);
fs.writeFileSync(mainBackup, JSON.stringify(existingData, null, 2), 'utf8');
console.log(`   ✅ Backed up: ${mainBackup}`);

// Step 8: Write merged data to all locations
console.log('📝 Writing merged data...');

// Main file in root
const mainFile = path.join(rootDir, 'kcet_cutoffs.json');
fs.writeFileSync(mainFile, JSON.stringify(mergedOutput, null, 2), 'utf8');
console.log(`   ✅ Updated: ${mainFile}`);

// Consolidated file in root
const consolidatedFile = path.join(rootDir, 'kcet_cutoffs_consolidated.json');
fs.writeFileSync(consolidatedFile, JSON.stringify(mergedOutput, null, 2), 'utf8');
console.log(`   ✅ Updated: ${consolidatedFile}`);

// Copy to public/data
const publicDataDir = path.join(rootDir, 'public', 'data');
if (fs.existsSync(publicDataDir)) {
    const publicConsolidated = path.join(publicDataDir, 'kcet_cutoffs_consolidated.json');
    fs.writeFileSync(publicConsolidated, JSON.stringify(mergedOutput, null, 2), 'utf8');
    console.log(`   ✅ Updated: ${publicConsolidated}`);
}

// Step 9: Update summary file for fast dashboard load
const summaryFile = path.join(publicDataDir, 'cutoffs-summary.json');
const summary = {
    totalRecords: mergedCutoffs.length,
    totalColleges: stats.institutes.size,
    totalBranches: stats.courses.size,
    years: stats.byYear,
    last_updated: new Date().toISOString()
};
fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2), 'utf8');
console.log(`   ✅ Updated: ${summaryFile}`);

// Print final summary
console.log();
console.log('═══════════════════════════════════════════════════════════════════════');
console.log('                      INTEGRATION COMPLETE');
console.log('═══════════════════════════════════════════════════════════════════════');
console.log();
console.log('📊 FINAL STATISTICS:');
console.log(`   Total Entries:    ${stats.totalEntries.toLocaleString()}`);
console.log(`   Institutes:       ${stats.institutes.size}`);
console.log(`   Courses:          ${stats.courses.size}`);
console.log(`   Categories:       ${stats.categories.size}`);
console.log();
console.log('📅 BY YEAR:');
Object.entries(stats.byYear).sort().forEach(([year, count]) => {
    console.log(`   ${year}: ${count.toLocaleString()}`);
});
console.log();
console.log('🔄 BY ROUND:');
Object.entries(stats.byRound).sort().forEach(([round, count]) => {
    console.log(`   ${round}: ${count.toLocaleString()}`);
});
console.log();
console.log('✅ Data is now available across all application features:');
console.log('   • Mock Simulator');
console.log('   • Cutoff Explorer');
console.log('   • College Finder');
console.log('   • Dashboard');
console.log();
console.log('🎉 Integration successful!');
