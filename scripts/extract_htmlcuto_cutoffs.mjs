import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";

const ROOT = process.cwd();
const HTML_DIR = path.join(ROOT, "HTMLCUTO");
const OUT_DIR = path.join(ROOT, "public", "data");
const OUT_JSON = path.join(OUT_DIR, "kcet_cutoffs_htmlcuto.json");
const OUT_CSV = path.join(OUT_DIR, "kcet_cutoffs_htmlcuto.csv");

const DEFAULT_CATEGORIES = [
  "1G",
  "1K",
  "1R",
  "2AG",
  "2AK",
  "2AR",
  "2BG",
  "2BK",
  "2BR",
  "3AG",
  "3AK",
  "3AR",
  "3BG",
  "3BK",
  "3BR",
  "GM",
  "GMK",
  "GMR",
  "SCG",
  "SCK",
  "SCR",
  "STG",
  "STK",
  "STR",
];

const KNOWN_CATEGORIES = new Set(DEFAULT_CATEGORIES);
const COURSE_X_MAX = 6.95;

function normalizeText(value) {
  return String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseStylePosition(style) {
  const m = /left:([\d.]+)em;top:([\d.]+)em;?/i.exec(style || "");
  if (!m) return null;
  return { x: Number(m[1]), y: Number(m[2]) };
}

function fileRoundToCode(roundPart) {
  const raw = String(roundPart || "").toLowerCase();
  if (raw.includes("mock")) return "MOCK";
  if (raw.includes("round1")) return "R1";
  if (raw.includes("round2")) return "R2";
  if (raw.includes("round3")) return "R3";
  return raw.toUpperCase();
}

function isCategoryToken(token) {
  const t = String(token || "").toUpperCase();
  if (KNOWN_CATEGORIES.has(t)) return true;
  if (/^[123][AB]?[GKR]?$/.test(t)) return true;
  if (/^(GM|GMK|GMR|SCG|SCK|SCR|STG|STK|STR)$/.test(t)) return true;
  return false;
}

function extractCategoryTokens(text) {
  const tokens = normalizeText(text).split(" ");
  return tokens.filter(isCategoryToken);
}

function dedupeKeepOrder(values) {
  const seen = new Set();
  const out = [];
  for (const value of values) {
    if (!seen.has(value)) {
      seen.add(value);
      out.push(value);
    }
  }
  return out;
}

function parseCollegeFromText(text) {
  const cleaned = normalizeText(text);
  let m = /College:\s*\((E\d{3})\)\s*(.+)$/i.exec(cleaned);
  if (m) return { institute_code: m[1].toUpperCase(), institute: m[2].trim() };
  m = /College:\s*(E\d{3})\s+(.+)$/i.exec(cleaned);
  if (m) return { institute_code: m[1].toUpperCase(), institute: m[2].trim() };
  m = /^\d+\s+(E\d{3})\s+(.+)$/i.exec(cleaned);
  if (m) return { institute_code: m[1].toUpperCase(), institute: m[2].trim() };
  m = /^(E\d{3})\s+(.+)$/i.exec(cleaned);
  if (m) return { institute_code: m[1].toUpperCase(), institute: m[2].trim() };
  return null;
}

function isNoiseText(text) {
  const t = normalizeText(text);
  if (!t) return true;
  if (/^Page\s+\d+\s+of\s+\d+/i.test(t)) return true;
  if (/ENGINEERING CUTOFF RANK/i.test(t)) return true;
  if (/KARNATAKA EXAMINATIONS AUTHORITY/i.test(t)) return true;
  if (/UGCET-\d{4}/i.test(t)) return true;
  if (/Non-Interactive Admission System/i.test(t)) return true;
  if (/Seat Type:/i.test(t)) return true;
  if (/^\d{1,2}-[A-Z]{3}-\d{2}/.test(t)) return true;
  return false;
}

function isValueToken(token) {
  return /^--$/.test(token) || /^\d+(?:\.\d+)?$/.test(token);
}

function splitLongNumberToken(token) {
  const s = String(token || "");
  if (!/^\d{7,18}$/.test(s)) return [token];
  const results = [];

  function dfs(index, pieces) {
    if (index === s.length) {
      if (pieces.length > 1) results.push([...pieces]);
      return;
    }
    if (pieces.length >= 3) return;
    for (let len = 4; len <= 6; len += 1) {
      if (index + len > s.length) continue;
      const part = s.slice(index, index + len);
      const n = Number(part);
      if (!Number.isFinite(n) || n <= 0 || n > 999999) continue;
      pieces.push(part);
      dfs(index + len, pieces);
      pieces.pop();
    }
  }

  dfs(0, []);
  if (results.length === 0) return [token];
  results.sort((a, b) => {
    if (a.length !== b.length) return b.length - a.length;
    const scoreA = a.reduce((sum, p) => sum + Math.max(0, Number(p) - 300000), 0);
    const scoreB = b.reduce((sum, p) => sum + Math.max(0, Number(p) - 300000), 0);
    return scoreA - scoreB;
  });
  return results[0];
}

function tokenToRank(token) {
  if (!token || token === "--") return null;
  const value = Number(String(token).replace(/,/g, ""));
  if (!Number.isFinite(value)) return null;
  if (value <= 0 || value > 999999) return null;
  return Math.round(value);
}

function collectItemsFromView(viewEl) {
  const out = [];
  for (const div of viewEl.querySelectorAll("div.stl_01")) {
    const position = parseStylePosition(div.getAttribute("style"));
    if (!position) continue;
    const text = normalizeText(div.textContent);
    if (!text) continue;
    out.push({ ...position, text, node: div });
  }
  out.sort((a, b) => (a.y === b.y ? a.x - b.x : a.y - b.y));
  return out;
}

function parseCategoriesInBlock(items, blockStartY) {
  const candidates = [];
  const courseName = items.find((it) => /Course Name/i.test(it.text));
  if (courseName) {
    const rowCats = items
      .filter((it) => Math.abs(it.y - courseName.y) <= 0.25)
      .flatMap((it) => extractCategoryTokens(it.text));
    if (rowCats.length >= 4) return dedupeKeepOrder(rowCats);
  }

  for (const it of items) {
    if (it.y < blockStartY || it.y > blockStartY + 8) continue;
    const cats = extractCategoryTokens(it.text);
    if (cats.length >= 3) candidates.push(...cats);
  }

  const deduped = dedupeKeepOrder(candidates);
  return deduped.length >= 4 ? deduped : [...DEFAULT_CATEGORIES];
}

function buildRowLabels(items, blockStartY) {
  const labels = items
    .filter((it) => it.y > blockStartY && it.x <= COURSE_X_MAX)
    .filter((it) => !isNoiseText(it.text))
    .filter((it) => !/Course Name/i.test(it.text))
    .filter((it) => extractCategoryTokens(it.text).length < 3)
    .filter((it) => !parseCollegeFromText(it.text));

  const rows = [];
  for (const item of labels) {
    if (rows.length === 0) {
      rows.push({ startY: item.y, lastY: item.y, labelItems: [item] });
      continue;
    }

    const current = rows[rows.length - 1];
    const dy = item.y - current.lastY;
    const hasValue = normalizeText(item.text).split(" ").some(isValueToken);
    const lastLabel = current.labelItems[current.labelItems.length - 1];
    const xDelta = Math.abs(item.x - lastLabel.x);
    const startsWithCourseCode = /^[A-Z]{2,4}\b/.test(item.text);
    const mayContinueCompact = !hasValue && dy <= 0.62;
    const mayContinueCodeStyle =
      !hasValue &&
      dy <= 1.05 &&
      xDelta <= 0.55 &&
      item.x >= 6.2 &&
      item.x <= 7.0 &&
      !startsWithCourseCode;
    const mayContinue = mayContinueCompact || mayContinueCodeStyle;

    if (dy <= 0.08 || mayContinue) {
      current.labelItems.push(item);
      current.lastY = item.y;
    } else {
      rows.push({ startY: item.y, lastY: item.y, labelItems: [item] });
    }
  }
  return rows;
}

function extractValueTokens(text) {
  const raw = normalizeText(text).split(" ");
  const out = [];
  for (const token of raw) {
    if (token === "--") {
      out.push(token);
      continue;
    }
    if (/^\d+(?:\.\d+)?$/.test(token)) {
      out.push(...splitLongNumberToken(token));
    }
  }
  return out;
}

function parseRowsFromBlock(college, items, year, round) {
  if (!college?.institute_code || !college?.institute) return [];
  if (items.length === 0) return [];
  const blockStartY = items[0].y;
  const categories = parseCategoriesInBlock(items, blockStartY);
  const rowDefs = buildRowLabels(items, blockStartY);
  if (rowDefs.length === 0) return [];

  const rows = [];
  for (let i = 0; i < rowDefs.length; i += 1) {
    const current = rowDefs[i];
    const nextStartY = i + 1 < rowDefs.length ? rowDefs[i + 1].startY : Number.POSITIVE_INFINITY;
    const orderedLabelItems = current.labelItems
      .slice()
      .sort((a, b) => (a.y === b.y ? a.x - b.x : a.y - b.y))
      .map((x) => x.text);

    const courseParts = [];
    const initialValues = [];
    for (const line of orderedLabelItems) {
      const lineTokens = normalizeText(line).split(" ");
      const valueIndex = lineTokens.findIndex(isValueToken);
      if (valueIndex < 0) {
        if (lineTokens.length > 0) courseParts.push(lineTokens.join(" "));
      } else {
        if (valueIndex > 0) courseParts.push(lineTokens.slice(0, valueIndex).join(" "));
        initialValues.push(...lineTokens.slice(valueIndex).flatMap(splitLongNumberToken));
      }
    }
    const course = normalizeText(courseParts.join(" "));
    if (!course) continue;

    const localLabelNodes = new Set(current.labelItems.map((x) => x.node));
    const rightItems = items
      .filter((it) => it.y >= current.startY - 0.05 && it.y < nextStartY - 0.05)
      .filter((it) => !localLabelNodes.has(it.node))
      .filter((it) => !isNoiseText(it.text))
      .filter((it) => !parseCollegeFromText(it.text))
      .filter((it) => !/Course Name/i.test(it.text));

    const tailValues = [];
    for (const it of rightItems) {
      const tokens = extractValueTokens(it.text);
      if (tokens.length > 0) tailValues.push(...tokens);
    }

    const values = [...initialValues, ...tailValues];
    if (values.length === 0) continue;

    for (let c = 0; c < categories.length && c < values.length; c += 1) {
      const category = categories[c];
      const cutoffRank = tokenToRank(values[c]);
      if (cutoffRank == null) continue;
      rows.push({
        institute: college.institute,
        institute_code: college.institute_code,
        course,
        category,
        cutoff_rank: cutoffRank,
        year,
        round,
      });
    }
  }
  return rows;
}

function parseHtmlFile(filePath) {
  const name = path.basename(filePath);
  const m = /kcet-(\d{4})-(.+)-cutoffs\.html$/i.exec(name);
  if (!m) return { rows: [], summary: { file: name, skipped: true, reason: "filename-mismatch" } };
  const year = m[1];
  const round = fileRoundToCode(m[2]);
  const stat = fs.statSync(filePath);
  if (stat.size === 0) {
    return { rows: [], summary: { file: name, year, round, pages: 0, rows: 0, skipped: true, reason: "empty-file" } };
  }

  const html = fs.readFileSync(filePath, "utf8");
  const dom = new JSDOM(html);
  const views = [...dom.window.document.querySelectorAll("div.stl_view")];
  const allRows = [];
  let carryCollege = null;

  for (const view of views) {
    const items = collectItemsFromView(view);
    if (items.length === 0) continue;

    const headerCandidates = items
      .map((it) => ({ item: it, college: parseCollegeFromText(it.text) }))
      .filter((x) => !!x.college)
      .map((x) => ({ ...x.item, college: x.college }));

    const headers = [];
    for (const h of headerCandidates) {
      if (headers.length === 0 || Math.abs(headers[headers.length - 1].y - h.y) > 0.08) {
        headers.push(h);
      }
    }

    if (headers.length === 0) {
      if (!carryCollege) continue;
      allRows.push(...parseRowsFromBlock(carryCollege, items, year, round));
      continue;
    }

    for (let i = 0; i < headers.length; i += 1) {
      const h = headers[i];
      const endY = i + 1 < headers.length ? headers[i + 1].y : Number.POSITIVE_INFINITY;
      const blockItems = items.filter((it) => it.y >= h.y && it.y < endY);
      allRows.push(...parseRowsFromBlock(h.college, blockItems, year, round));
      carryCollege = h.college;
    }
  }

  return {
    rows: allRows,
    summary: { file: name, year, round, pages: views.length, rows: allRows.length, skipped: false },
  };
}

function dedupeRows(rows) {
  const seen = new Set();
  const unique = [];
  for (const row of rows) {
    const key = [
      row.institute_code,
      row.institute,
      row.course,
      row.category,
      row.year,
      row.round,
      row.cutoff_rank,
    ].join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(row);
  }
  return unique;
}

function writeCsv(filePath, rows) {
  const header = "institute,institute_code,course,category,cutoff_rank,year,round";
  const lines = [header];
  for (const row of rows) {
    const cells = [
      row.institute,
      row.institute_code,
      row.course,
      row.category,
      String(row.cutoff_rank),
      row.year,
      row.round,
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`);
    lines.push(cells.join(","));
  }
  fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
}

function writeYearFiles(rows) {
  const years = ["2023", "2024", "2025"];
  for (const year of years) {
    const yearRows = rows.filter((r) => r.year === year);
    const jsonPath = path.join(OUT_DIR, `kcet_cutoffs_htmlcuto_${year}.json`);
    const csvPath = path.join(OUT_DIR, `kcet_cutoffs_htmlcuto_${year}.csv`);
    const payload = {
      metadata: {
        generated_at: new Date().toISOString(),
        source: "HTMLCUTO/*.html",
        year,
        total_entries: yearRows.length,
      },
      cutoffs: yearRows,
    };
    fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2), "utf8");
    writeCsv(csvPath, yearRows);
  }
}

function run() {
  if (!fs.existsSync(HTML_DIR)) {
    throw new Error(`HTML source directory not found: ${HTML_DIR}`);
  }
  const files = fs
    .readdirSync(HTML_DIR)
    .filter((name) => /^kcet-\d{4}-.+-cutoffs\.html$/i.test(name))
    .map((name) => path.join(HTML_DIR, name))
    .sort();

  const summaries = [];
  let rows = [];
  for (const file of files) {
    const result = parseHtmlFile(file);
    summaries.push(result.summary);
    rows = rows.concat(result.rows);
  }

  const uniqueRows = dedupeRows(rows);
  const byYearRound = {};
  for (const row of uniqueRows) {
    const key = `${row.year}-${row.round}`;
    byYearRound[key] = (byYearRound[key] || 0) + 1;
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const payload = {
    metadata: {
      generated_at: new Date().toISOString(),
      source: "HTMLCUTO/*.html",
      total_files: files.length,
      total_entries_raw: rows.length,
      total_entries_unique: uniqueRows.length,
      dedupe_key: "institute_code+institute+course+category+year+round+cutoff_rank",
      by_year_round: byYearRound,
      file_summaries: summaries,
    },
    cutoffs: uniqueRows,
  };

  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2), "utf8");
  writeCsv(OUT_CSV, uniqueRows);
  writeYearFiles(uniqueRows);

  console.log(`Processed files: ${files.length}`);
  for (const s of summaries) {
    const state = s.skipped ? `SKIPPED(${s.reason})` : "OK";
    console.log(` - ${s.file}: ${state}, pages=${s.pages || 0}, rows=${s.rows || 0}`);
  }
  console.log(`Raw rows: ${rows.length}`);
  console.log(`Unique rows: ${uniqueRows.length}`);
  console.log("By year/round:");
  for (const key of Object.keys(byYearRound).sort()) {
    console.log(` - ${key}: ${byYearRound[key]}`);
  }
  console.log(`Wrote JSON: ${OUT_JSON}`);
  console.log(`Wrote CSV : ${OUT_CSV}`);
}

run();
