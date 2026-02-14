#!/usr/bin/env node

/**
 * Merge Missing Into Master
 * ==========================
 * 1. Loads the EXISTING master JSON (keeps every entry).
 * 2. Normalises all rounds: EXT → R3 (they are the same round).
 * 3. Scans additional JSON/CSV sources and the fresh extraction.
 * 4. Adds ONLY entries whose dedup-key is NOT already in the master.
 * 5. Writes back to all output locations.
 */

import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

const MOTHER_FILE = path.join(ROOT, 'public', 'kcet_cutoffs_master.json');

// Fresh extraction output + all legacy sources
const JSON_SOURCES = [
  'public/data/kcet_extracted_all.json',        // new comprehensive extraction
  'public/data/kcet_cutoffs_high_volume.json',
  'public/data/kcet_cutoffs_consolidated.json',
  'public/data/cutoffs.json',
  'public/data/backup_cutoffs.json',
  'public/data/cutoffs-2023.json',
  'public/data/cutoffs-2024.json',
  'public/data/cutoffs-2025.json',
  'public/data/cutoffs-2025-part1.json',
  'public/data/cutoffs-2025-part2.json',
  'public/kcet_cutoffs_high_volume.json',
  'public/kcet_cutoffs_consolidated.json',
  'public/kcet_cutoffs.json',
  'public/kcet_cutoffs2025.json',
  'backup/kcet_cutoffs_xlsx_LATEST.json',
].map((p) => path.join(ROOT, p));

const CSV_SOURCES = [
  path.join(ROOT, 'public', 'cutoffs', 'kcet_2025_pdf_extracted.csv'),
  path.join(ROOT, 'public', 'data', 'kcet_extracted_all.csv'),  // new CSV
  path.join(ROOT, 'kcet_2025_pdf_extracted.csv'),
  path.join(ROOT, 'kcet_cutoffs_extracted.csv'),
];

const OUTPUTS = [
  path.join(ROOT, 'public', 'data', 'kcet_cutoffs_master.json'),
  path.join(ROOT, 'public', 'kcet_cutoffs_master.json'),
  path.join(ROOT, 'public', 'data', 'kcet_cutoffs_high_volume.json'),
  path.join(ROOT, 'public', 'kcet_cutoffs_high_volume.json'),
];

// ─── Utilities ───────────────────────────────────────────────────────────────

function clean(value) {
  return String(value ?? '')
    .replace(/[\r\n]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalize round value. R3 and EXT are the SAME round → always "R3".
 */
function normalizeRound(value) {
  const s = clean(value).toUpperCase();
  if (!s) return '';
  if (s === 'ROUND 1' || s === 'R1') return 'R1';
  if (s === 'ROUND 2' || s === 'R2') return 'R2';
  // R3, Round 3, Extended, EXT, Round 3 Extended — ALL become R3
  if (s === 'ROUND 3' || s === 'R3' || s === 'ROUND 3 EXTENDED' ||
    s === 'R3 EXTENDED' || s === 'EXTENDED' || s === 'EXT') return 'R3';
  if (s === 'MOCK ROUND 1' || s === 'MOCK' || s === 'MR1' ||
    s === 'MOCK ROUND' || s === 'Mock Round 1') return 'MOCK';
  return s;
}

function parseRank(value) {
  const s = clean(value).replace(/,/g, '');
  if (!s || s === '--' || s === '-') return null;
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  if (n <= 0 || n > 500000) return null;
  return Number.isInteger(n) ? n : Number(s);
}

function toCutoffArray(raw) {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.cutoffs)) return raw.cutoffs;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.cutoffs_data)) return raw.cutoffs_data;
  return [];
}

function canonicalize(record) {
  const institute = clean(record.institute || record.CollegeName || '');
  const institute_code = clean(
    record.institute_code ||
    record.instituteCode ||
    record.college_code ||
    record.collegeCode ||
    record.CollegeCode ||
    ''
  ).toUpperCase();
  const course = clean(record.course || record.course_name || record.CourseName || record.CourseCode || record.branch || '');
  const category = clean(record.category || record.cat || record.Category || '').toUpperCase();
  const year = clean(record.year || record.Year || '');
  const round = normalizeRound(record.round || record.round_name || record.Round || '');
  const cutoff_rank = parseRank(record.cutoff_rank ?? record.rank ?? record.CutoffRank);

  if (!institute_code || !course || !category || !year || !round || cutoff_rank === null) {
    return null;
  }

  return {
    institute: institute || institute_code,
    institute_code,
    course,
    category,
    cutoff_rank,
    year,
    round,
  };
}

function dedupeKey(row) {
  return [
    row.institute_code,
    row.course,
    row.category,
    row.year,
    row.round,
    String(row.cutoff_rank),
  ].join('|');
}

function parseCsvRecords(filePath) {
  const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/);
  if (lines.length === 0) return [];

  const parseCsvLine = (line) => {
    const cols = [];
    let cur = '';
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (quoted && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          quoted = !quoted;
        }
      } else if (ch === ',' && !quoted) {
        cols.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
    cols.push(cur);
    return cols;
  };

  const header = parseCsvLine(lines[0]).map((h) => clean(h));
  const idx = {};
  header.forEach((h, i) => {
    idx[h] = i;
  });

  const out = [];
  let acc = '';
  let openQuote = false;

  for (let lineNo = 1; lineNo < lines.length; lineNo++) {
    const line = lines[lineNo];
    if (line === undefined) continue;

    acc = acc ? `${acc}\n${line}` : line;
    const quoteCount = (line.match(/"/g) || []).length;
    if (quoteCount % 2 === 1) openQuote = !openQuote;
    if (openQuote) continue;

    const cols = parseCsvLine(acc);
    acc = '';

    // Support both CollegeName/CollegeCode and institute/institute_code headers
    out.push({
      institute: cols[idx.institute] ?? cols[idx.CollegeName] ?? '',
      institute_code: cols[idx.institute_code] ?? cols[idx.CollegeCode] ?? '',
      course: cols[idx.course] ?? cols[idx.CourseName] ?? cols[idx.CourseCode] ?? '',
      category: cols[idx.category] ?? cols[idx.Category] ?? '',
      cutoff_rank: cols[idx.cutoff_rank] ?? cols[idx.CutoffRank] ?? '',
      year: cols[idx.year] ?? cols[idx.Year] ?? '',
      round: cols[idx.round] ?? cols[idx.Round] ?? '',
    });
  }

  return out;
}

function buildStats(rows) {
  const byYear = {};
  const byRound = {};
  const institutes = new Set();
  const courses = new Set();
  const categories = new Set();

  for (const r of rows) {
    byYear[r.year] = (byYear[r.year] || 0) + 1;
    byRound[r.round] = (byRound[r.round] || 0) + 1;
    institutes.add(r.institute_code);
    courses.add(r.course);
    categories.add(r.category);
  }

  return {
    total_entries: rows.length,
    total_institutes: institutes.size,
    total_courses: courses.size,
    total_categories: categories.size,
    years_covered: Object.keys(byYear).sort((a, b) => b.localeCompare(a)),
    rounds_covered: Object.keys(byRound).sort(),
    records_by_year: byYear,
    records_by_round: byRound,
  };
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  MERGE MISSING INTO MASTER (R3 = EXT unified)            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log();

  if (!fs.existsSync(MOTHER_FILE)) {
    throw new Error(`Mother file not found: ${MOTHER_FILE}`);
  }

  // Step 1: Load ALL existing master entries (keep every one)
  console.log('📥 Loading master file...');
  const motherRaw = JSON.parse(fs.readFileSync(MOTHER_FILE, 'utf8'));
  const motherRowsRaw = toCutoffArray(motherRaw);

  const merged = [];
  const seen = new Map();
  let motherAccepted = 0;
  let motherNormalized = 0;

  for (const row of motherRowsRaw) {
    const c = canonicalize(row);
    if (!c) continue;

    // Track if EXT was normalised to R3
    const origRound = clean(row.round || row.Round || '').toUpperCase();
    if (origRound === 'EXT' || origRound === 'EXTENDED' || origRound === 'ROUND 3 EXTENDED') {
      motherNormalized++;
    }

    const key = dedupeKey(c);
    if (seen.has(key)) continue;
    seen.set(key, true);
    merged.push(c);
    motherAccepted++;
  }

  console.log(`   Master entries kept: ${motherAccepted.toLocaleString()}`);
  console.log(`   EXT→R3 normalized:  ${motherNormalized.toLocaleString()}`);
  console.log();

  // Step 2: Scan additional sources — add ONLY what's missing
  const sourceAdds = {};
  let totalAdded = 0;

  console.log('📥 Scanning additional JSON sources for missing entries...');
  for (const sourcePath of JSON_SOURCES) {
    if (!fs.existsSync(sourcePath)) continue;
    const raw = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    const rows = toCutoffArray(raw);
    let added = 0;
    for (const row of rows) {
      const c = canonicalize(row);
      if (!c) continue;
      const key = dedupeKey(c);
      if (seen.has(key)) continue;
      seen.set(key, true);
      merged.push(c);
      added++;
    }
    const relPath = path.relative(ROOT, sourcePath);
    sourceAdds[relPath] = added;
    totalAdded += added;
    if (added > 0) {
      console.log(`   + ${relPath}: ${added.toLocaleString()} new entries`);
    }
  }

  console.log();
  console.log('📥 Scanning CSV sources for missing entries...');
  for (const csvPath of CSV_SOURCES) {
    if (!fs.existsSync(csvPath)) continue;
    const rows = parseCsvRecords(csvPath);
    let added = 0;
    for (const row of rows) {
      const c = canonicalize(row);
      if (!c) continue;
      const key = dedupeKey(c);
      if (seen.has(key)) continue;
      seen.set(key, true);
      merged.push(c);
      added++;
    }
    const relPath = path.relative(ROOT, csvPath);
    sourceAdds[relPath] = added;
    totalAdded += added;
    if (added > 0) {
      console.log(`   + ${relPath}: ${added.toLocaleString()} new entries`);
    }
  }

  console.log();
  console.log(`   Total new entries added: ${totalAdded.toLocaleString()}`);
  console.log();

  // Step 3: Build stats and write output
  const stats = buildStats(merged);
  const output = {
    metadata: {
      last_updated: new Date().toISOString(),
      source_type: 'master_plus_missing_merged',
      dedupe_key: 'institute_code+course+category+year+round+cutoff_rank',
      mother_file: path.relative(ROOT, MOTHER_FILE),
      mother_entries_kept: motherAccepted,
      new_entries_added: totalAdded,
      total_sources_considered:
        JSON_SOURCES.filter((p) => fs.existsSync(p)).length +
        CSV_SOURCES.filter((p) => fs.existsSync(p)).length,
      source_additions: sourceAdds,
      ...stats,
    },
    cutoffs: merged,
  };

  for (const outputPath of OUTPUTS) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(output));
  }

  // Summary
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                   MERGE COMPLETE                         ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log();
  console.log(`  📝 Total entries:     ${stats.total_entries.toLocaleString()}`);
  console.log(`  🏫 Institutes:        ${stats.total_institutes}`);
  console.log(`  📚 Courses:           ${stats.total_courses}`);
  console.log(`  📊 Categories:        ${stats.total_categories}`);
  console.log();
  console.log('  📅 By year:');
  for (const [y, c] of Object.entries(stats.records_by_year).sort()) {
    console.log(`     ${y}: ${c.toLocaleString()}`);
  }
  console.log();
  console.log('  🔄 By round:');
  for (const [r, c] of Object.entries(stats.records_by_round).sort()) {
    console.log(`     ${r}: ${c.toLocaleString()}`);
  }
  console.log();
  console.log('  💾 Written to:');
  for (const outputPath of OUTPUTS) {
    console.log(`     ${path.relative(ROOT, outputPath)}`);
  }
  console.log();

  if (stats.total_entries >= 250000) {
    console.log('  ✅ SUCCESS: Exceeds 250,000 target!');
  } else {
    console.log(`  ⚠️ Total (${stats.total_entries.toLocaleString()}) below 250K target.`);
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
