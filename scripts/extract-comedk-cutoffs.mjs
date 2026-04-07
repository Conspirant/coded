#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const ROOT = path.resolve(".");
const COMEDK_DIR = path.join(ROOT, "comedk");
const PUBLIC_PDF_DIR = path.join(ROOT, "public", "cutoffs", "comedk");
const OUTPUT_FILE = path.join(ROOT, "public", "data", "comedk_cutoffs.json");

const CODE_RE = /^E\d{3}$/i;
const CATEGORY_RE = /^(GM|HKR|KKR)$/i;
const PAGE_RE = /^Page\s+\d+/i;
const NUMERIC_RE = /^\d+$/;

const PDF_FILES = [
  { file: "comedk_mock_round_2022.pdf", year: "2022", round: "MOCK" },
  { file: "comedk_round1_2022.pdf", year: "2022", round: "R1" },
  { file: "comedk_round2_Phase2_2022.pdf", year: "2022", round: "R2P2" },
  { file: "comedk_round3_2022.pdf", year: "2022", round: "R3" },
  { file: "comedk_mock_round_ 2023.pdf", year: "2023", round: "MOCK" },
  { file: "comedk_round1_2023.pdf", year: "2023", round: "R1" },
  { file: "comedk_round2_phase1_2023.pdf", year: "2023", round: "R2P1" },
  { file: "comedk_round2_phase2_2023.pdf", year: "2023", round: "R2P2" },
  { file: "comedk_round3_2023.pdf", year: "2023", round: "R3" },
  { file: "comedk_round1_2024.pdf", year: "2024", round: "R1" },
  { file: "comedk_round2_phase1_2024.pdf", year: "2024", round: "R2P1" },
  { file: "comedk_round2_Phase2_2024.pdf", year: "2024", round: "R2P2" },
  { file: "comedk_round3_2024.pdf", year: "2024", round: "R3" },
  { file: "comedk_mock_round_ 2024.pdf", year: "2024", round: "MOCK" },
  { file: "comedk_mock_round_2025.pdf", year: "2025", round: "MOCK" },
  { file: "comedk_round1_2025.pdf", year: "2025", round: "R1" },
  { file: "comedk_round2_2025.pdf", year: "2025", round: "R2" },
  { file: "comedk_round3_2025.pdf", year: "2025", round: "R3" },
  { file: "comedk_round4_2025.pdf", year: "2025", round: "R4" },
];

const EXCLUDED_FILES = [
  "comedk_round2_Phase1_2022.pdf",
];

function cleanText(value) {
  return String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/[–—]/g, "-")
    .replace(/ﬁ/g, "fi")
    .replace(/ﬂ/g, "fl")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKey(value) {
  return cleanText(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[()]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseCourse(raw) {
  const cleaned = cleanText(raw)
    .replace(/\s+/g, " ")
    .trim();

  const codeMatch = cleaned.match(/^([A-Z]{1,4})\s*-\s*(.+)$/);
  const courseCode = codeMatch ? codeMatch[1].toUpperCase() : null;

  return {
    course_code: courseCode,
    course: cleaned,
  };
}

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function uniqueItems(items) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = `${item.text}|${item.x.toFixed(1)}|${item.y.toFixed(1)}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

function sortBandItems(items) {
  return [...items].sort((a, b) => {
    if (Math.abs(a.y - b.y) > 1.2) return b.y - a.y;
    return a.x - b.x;
  });
}

function joinBandText(items) {
  return cleanText(sortBandItems(uniqueItems(items)).map((item) => item.text).join(" "));
}

function mergeSplitInstituteCodes(items) {
  const result = [];
  for (let i = 0; i < items.length; i += 1) {
    const cur = items[i];
    const next = items[i + 1];
    if (
      next &&
      /^E$/i.test(cur.text) &&
      Math.abs(cur.y - next.y) < 3 &&
      next.x > cur.x &&
      next.x - cur.x < 30 &&
      /^\d{3}$/.test(next.text)
    ) {
      result.push({
        text: `${cur.text}${next.text}`.toUpperCase(),
        x: cur.x,
        y: cur.y,
        w: (cur.w || 0) + (next.w || 0),
      });
      i += 1;
    } else {
      result.push(cur);
    }
  }
  return result;
}

async function extractPageItems(page) {
  const content = await page.getTextContent();
  const raw = content.items
    .filter((item) => item.str && item.str.trim())
    .map((item) => ({
      text: cleanText(item.str),
      x: item.transform[4],
      y: item.transform[5],
      w: item.width || 0,
    }));
  return mergeSplitInstituteCodes(raw);
}

function groupLines(items, tolerance = 2.5) {
  const sorted = [...items].sort((a, b) => b.y - a.y);
  const lines = [];

  for (const item of sorted) {
    const line = lines.find((entry) => Math.abs(entry.y - item.y) <= tolerance);
    if (line) {
      line.items.push(item);
      line.y = (line.y * (line.items.length - 1) + item.y) / line.items.length;
    } else {
      lines.push({ y: item.y, items: [item] });
    }
  }

  for (const line of lines) {
    line.items.sort((a, b) => a.x - b.x);
  }

  return lines.sort((a, b) => b.y - a.y);
}

function buildBands(rowLines, headerFloorY) {
  const ys = rowLines.map((line) => line.y);
  const gaps = [];

  for (let index = 0; index < ys.length - 1; index += 1) {
    gaps.push(ys[index] - ys[index + 1]);
  }

  const defaultGap = median(gaps.filter((gap) => gap > 0)) || 16;

  return rowLines.map((line, index) => {
    const upper =
      index === 0
        ? headerFloorY
          ? (headerFloorY + line.y) / 2
          : line.y + defaultGap / 2
        : (rowLines[index - 1].y + line.y) / 2;

    const lower =
      index === rowLines.length - 1
        ? line.y - defaultGap / 2
        : (line.y + rowLines[index + 1].y) / 2;

    return {
      line,
      upper: upper + 1.5,
      lower: lower - 1.5,
    };
  });
}

function getHeaderFloorY(items, firstRowY) {
  const headerCandidates = items
    .filter((item) => item.y > firstRowY)
    .map((item) => item.y);

  if (!headerCandidates.length) return null;
  return Math.min(...headerCandidates);
}

function isHeaderNoise(text) {
  const normalized = normalizeKey(text);
  return (
    normalized.includes("college") ||
    normalized.includes("seat") ||
    normalized.includes("category") ||
    normalized.includes("type") ||
    normalized.startsWith("page ") ||
    normalized.includes("round") ||
    normalized.includes("allotment") ||
    normalized.includes("cut off") ||
    normalized.includes("cutoff") ||
    normalized.includes("notified on") ||
    normalized.includes("comedk") ||
    normalized.includes("engineering seats")
  );
}

function detectCrossTabColumns(headerItems, dataStartX, pageMaxX) {
  const candidates = headerItems
    .filter((item) => item.x >= dataStartX - 10)
    .filter((item) => !isHeaderNoise(item.text))
    .filter((item) => !CATEGORY_RE.test(item.text))
    .filter((item) => !PAGE_RE.test(item.text));

  const groups = [];
  const sorted = [...candidates].sort((a, b) => a.x - b.x || b.y - a.y);

  for (const item of sorted) {
    const current = groups[groups.length - 1];
    if (!current || Math.abs(item.x - current.centerX) > 30) {
      groups.push({ items: [item], centerX: item.x });
      continue;
    }

    current.items.push(item);
    current.centerX = median(current.items.map((entry) => entry.x));
  }

  const columns = groups
    .map((group) => {
      const { course, course_code } = parseCourse(joinBandText(group.items));
      return {
        course,
        course_code,
        centerX: median(group.items.map((item) => item.x)),
      };
    })
    .filter((column) => column.course && !isHeaderNoise(column.course));

  columns.sort((a, b) => a.centerX - b.centerX);

  return columns.map((column, index) => {
    const prev = columns[index - 1];
    const next = columns[index + 1];
    const left = prev ? (prev.centerX + column.centerX) / 2 : dataStartX - 12;
    const right = next ? (column.centerX + next.centerX) / 2 : pageMaxX + 24;
    return { ...column, left, right };
  });
}

function findColumnForX(x, columns) {
  const direct = columns.find((column) => x >= column.left && x < column.right);
  if (direct) return direct;
  let best = null;
  let bestDist = Infinity;
  for (const col of columns) {
    const d = Math.abs(x - col.centerX);
    if (d < bestDist && d < 42) {
      bestDist = d;
      best = col;
    }
  }
  return best || null;
}

function detectFormat(items) {
  const hasCourseHeader = items.some((item) => /^Course Name$/i.test(item.text));
  const hasCutoffHeader = items.some((item) => /^Cutoff$/i.test(item.text));
  return hasCourseHeader && hasCutoffHeader ? "ROW" : "CROSS_TAB";
}

function ensurePublicPdf(pdfFileName) {
  fs.mkdirSync(PUBLIC_PDF_DIR, { recursive: true });
  const sourcePath = path.join(COMEDK_DIR, pdfFileName);
  const targetPath = path.join(PUBLIC_PDF_DIR, pdfFileName);
  fs.copyFileSync(sourcePath, targetPath);
  return `/cutoffs/comedk/${pdfFileName}`;
}

async function extractCrossTabFile(pdfDef) {
  const sourcePath = path.join(COMEDK_DIR, pdfDef.file);
  const publicPdfUrl = ensurePublicPdf(pdfDef.file);
  const data = new Uint8Array(fs.readFileSync(sourcePath));
  const document = await getDocument({ data, useSystemFonts: true }).promise;

  const entries = [];
  let totalNumericCandidates = 0;
  let mappedNumericCandidates = 0;
  let pagesWithNoColumns = 0;
  const unmappedSamples = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const items = await extractPageItems(page);
    const lines = groupLines(items);
    const rowLines = lines.filter((line) => line.items.some((item) => CODE_RE.test(item.text)));

    if (!rowLines.length) {
      continue;
    }

    const firstRowY = rowLines[0].y;
    const headerFloorY = getHeaderFloorY(items, firstRowY);
    const bands = buildBands(rowLines, headerFloorY);
    const categoryXs = rowLines
      .flatMap((line) => line.items.filter((item) => CATEGORY_RE.test(item.text)).map((item) => item.x));
    const categoryX = categoryXs.length ? median(categoryXs) : null;
    const codeXs = rowLines
      .flatMap((line) => line.items.filter((item) => CODE_RE.test(item.text)).map((item) => item.x));
    const codeX = codeXs.length ? Math.min(...codeXs) : 0;
    const nameStartX = codeX + 18;
    const nameEndX = categoryX ? categoryX - 12 : codeX + 280;
    const dataStartX = categoryX ? categoryX + 18 : nameEndX + 12;

    const headerItems = items.filter((item) => item.y > bands[0].upper - 1);
    const pageMaxX = Math.max(...items.map((item) => item.x + item.w), dataStartX + 30);
    const columns = detectCrossTabColumns(headerItems, dataStartX, pageMaxX);

    if (!columns.length) {
      pagesWithNoColumns += 1;
      continue;
    }

    for (const band of bands) {
      const bandItemsCurrent = items.filter((item) => item.y <= band.upper && item.y >= band.lower);
      const codeItem = band.line.items.find((item) => CODE_RE.test(item.text));
      if (!codeItem) continue;

      const categoryItem = bandItemsCurrent.find((item) => CATEGORY_RE.test(item.text));
      const category = categoryItem ? categoryItem.text.toUpperCase() : "GM";
      const nameItems = bandItemsCurrent.filter((item) => {
        if (item.x < nameStartX || item.x > nameEndX) return false;
        if (CODE_RE.test(item.text) || CATEGORY_RE.test(item.text) || PAGE_RE.test(item.text)) return false;
        if (NUMERIC_RE.test(item.text)) return false;
        return true;
      });

      const institute = joinBandText(nameItems) || codeItem.text;
      const numericItems = bandItemsCurrent.filter((item) => item.x >= dataStartX - 4 && NUMERIC_RE.test(item.text));

      totalNumericCandidates += numericItems.length;

      for (const numericItem of numericItems) {
        const column = findColumnForX(numericItem.x, columns);
        if (!column) {
          if (unmappedSamples.length < 15) {
            unmappedSamples.push({
              page: pageNumber,
              code: codeItem.text,
              value: numericItem.text,
              x: Number(numericItem.x.toFixed(1)),
            });
          }
          continue;
        }

        mappedNumericCandidates += 1;
        entries.push({
          institute,
          institute_code: codeItem.text.toUpperCase(),
          course: column.course,
          course_code: column.course_code || undefined,
          category,
          cutoff_rank: Number.parseInt(numericItem.text, 10),
          year: pdfDef.year,
          round: pdfDef.round,
          source_pdf: publicPdfUrl,
          source_page: pageNumber,
        });
      }
    }
  }

  return {
    entries,
    stats: {
      pages: document.numPages,
      extracted: entries.length,
      categories: [...new Set(entries.map((entry) => entry.category))].sort(),
      colleges: new Set(entries.map((entry) => entry.institute_code)).size,
      numeric_candidates: totalNumericCandidates,
      mapped_candidates: mappedNumericCandidates,
      unmapped_candidates: totalNumericCandidates - mappedNumericCandidates,
      pages_without_columns: pagesWithNoColumns,
      unmapped_samples: unmappedSamples,
    },
  };
}

function findRowLayout(items) {
  const courseHeader = items.find(
    (item) => /^Course Name$/i.test(item.text) || /^Course\s*$/i.test(item.text),
  );
  const cutoffHeader = items.find(
    (item) =>
      /^Cutoff$/i.test(item.text) ||
      /^Cut-off$/i.test(item.text) ||
      /^Cut\s+Off$/i.test(item.text),
  );
  const nameHeader = items.find(
    (item) => /^College Name$/i.test(item.text) || /^College\s*$/i.test(item.text),
  );
  if (!courseHeader || !cutoffHeader || !nameHeader) return null;
  return {
    courseX: courseHeader.x,
    cutoffX: cutoffHeader.x,
    nameStartX: nameHeader.x,
  };
}

async function extractRowFile(pdfDef) {
  const sourcePath = path.join(COMEDK_DIR, pdfDef.file);
  const publicPdfUrl = ensurePublicPdf(pdfDef.file);
  const data = new Uint8Array(fs.readFileSync(sourcePath));
  const document = await getDocument({ data, useSystemFonts: true }).promise;

  const entries = [];
  let cachedLayout = null;

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const items = await extractPageItems(page);
    const lines = groupLines(items);
    const rowLines = lines.filter((line) => line.items.some((item) => CODE_RE.test(item.text)));
    if (!rowLines.length) continue;

    const firstRowY = rowLines[0].y;
    const headerFloorY = getHeaderFloorY(items, firstRowY);
    const bands = buildBands(rowLines, headerFloorY);

    const layout = findRowLayout(items) || cachedLayout;
    if (layout) {
      cachedLayout = layout;
    }
    const courseX = layout?.courseX ?? 380;
    const cutoffX = layout?.cutoffX ?? 640;
    const nameStartX = layout?.nameStartX ?? 140;

    for (const band of bands) {
      const bandItems = items.filter((item) => item.y <= band.upper && item.y >= band.lower);
      const codeItem = band.line.items.find((item) => CODE_RE.test(item.text));
      if (!codeItem) continue;

      const cutoffItem = [...bandItems]
        .filter((item) => item.x >= cutoffX - 30 && NUMERIC_RE.test(item.text))
        .sort((a, b) => b.x - a.x)[0];

      if (!cutoffItem) continue;

      const institute = joinBandText(
        bandItems.filter((item) => item.x >= nameStartX - 10 && item.x < courseX - 20 && !CODE_RE.test(item.text) && !NUMERIC_RE.test(item.text)),
      );

      const courseText = joinBandText(
        bandItems.filter((item) => item.x >= courseX - 20 && item.x < cutoffX - 20 && !NUMERIC_RE.test(item.text) && !PAGE_RE.test(item.text)),
      );

      const { course, course_code } = parseCourse(courseText);
      if (!course) continue;

      entries.push({
        institute: institute || codeItem.text,
        institute_code: codeItem.text.toUpperCase(),
        course,
        course_code: course_code || undefined,
        category: "GM",
        cutoff_rank: Number.parseInt(cutoffItem.text, 10),
        year: pdfDef.year,
        round: pdfDef.round,
        source_pdf: publicPdfUrl,
        source_page: pageNumber,
      });
    }
  }

  return {
    entries,
    stats: {
      pages: document.numPages,
      extracted: entries.length,
      categories: [...new Set(entries.map((entry) => entry.category))].sort(),
      colleges: new Set(entries.map((entry) => entry.institute_code)).size,
    },
  };
}

function deduplicate(entries) {
  const seen = new Set();
  const deduped = [];

  for (const entry of entries) {
    const key = [
      entry.institute_code,
      entry.course,
      entry.category,
      entry.cutoff_rank,
      entry.year,
      entry.round,
    ].join("|");

    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(entry);
    }
  }

  return deduped;
}

function canonicalizeInstituteNames(entries) {
  const byCode = new Map();
  for (const entry of entries) {
    const code = entry.institute_code;
    const name = cleanText(entry.institute);
    if (!name || name === code) continue;
    if (!byCode.has(code)) {
      byCode.set(code, new Map());
    }
    const counts = byCode.get(code);
    counts.set(name, (counts.get(name) || 0) + 1);
  }

  const canonical = new Map();
  for (const [code, nameCounts] of byCode) {
    let bestName = "";
    let bestCount = -1;
    for (const [name, count] of nameCounts) {
      if (count > bestCount || (count === bestCount && name.length > bestName.length)) {
        bestName = name;
        bestCount = count;
      }
    }
    if (bestName) {
      canonical.set(code, bestName);
    }
  }

  return entries.map((entry) => {
    const name = canonical.get(entry.institute_code);
    return name ? { ...entry, institute: name } : entry;
  });
}

function buildMetadata(entries, fileStats) {
  const recordsByYearRound = {};
  for (const entry of entries) {
    const key = `${entry.year}_${entry.round}`;
    recordsByYearRound[key] = (recordsByYearRound[key] || 0) + 1;
  }

  return {
    exam: "COMEDK",
    last_updated: new Date().toISOString(),
    total_entries: entries.length,
    total_colleges: new Set(entries.map((entry) => entry.institute_code)).size,
    total_courses: new Set(entries.map((entry) => entry.course)).size,
    years_covered: [...new Set(entries.map((entry) => entry.year))].sort(),
    rounds_covered: [...new Set(entries.map((entry) => entry.round))].sort(),
    categories: [...new Set(entries.map((entry) => entry.category))].sort(),
    records_by_year_round: recordsByYearRound,
    files: fileStats,
    excluded_files: EXCLUDED_FILES,
    notes: [
      "Only 2022 Round 2 Phase 1 PDF was intentionally excluded.",
      "Rows include source_pdf and source_page for direct PDF linking in the explorer.",
      "Institute names are canonicalized per institute_code (most frequent full name across all PDFs).",
    ],
  };
}

async function main() {
  console.log("COMEDK extractor: starting strict rebuild");
  console.log(`Input directory: ${COMEDK_DIR}`);

  const allEntries = [];
  const fileStats = {};

  for (const pdfDef of PDF_FILES) {
    const filePath = path.join(COMEDK_DIR, pdfDef.file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Missing PDF: ${pdfDef.file}`);
    }

    const firstPageDoc = await getDocument({
      data: new Uint8Array(fs.readFileSync(filePath)),
      useSystemFonts: true,
    }).promise;
    const firstPage = await firstPageDoc.getPage(1);
    const firstPageItems = await extractPageItems(firstPage);
    const format = detectFormat(firstPageItems);

    console.log(`\n${pdfDef.year} ${pdfDef.round} -> ${pdfDef.file}`);
    console.log(`Format detected: ${format}`);

    const result =
      format === "ROW"
        ? await extractRowFile(pdfDef)
        : await extractCrossTabFile(pdfDef);

    allEntries.push(...result.entries);
    fileStats[`${pdfDef.year}_${pdfDef.round}`] = {
      file: pdfDef.file,
      format,
      ...result.stats,
    };

    console.log(`Extracted entries: ${result.entries.length}`);
    if ("unmapped_candidates" in result.stats && result.stats.unmapped_candidates > 0) {
      console.log(`Unmapped numeric candidates: ${result.stats.unmapped_candidates}`);
    }
  }

  const deduped = canonicalizeInstituteNames(deduplicate(allEntries));
  const output = {
    metadata: buildMetadata(deduped, fileStats),
    cutoffs: deduped,
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

  console.log(`\nWrote ${deduped.length} entries to ${OUTPUT_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
