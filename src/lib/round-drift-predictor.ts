/**
 * KCET Round 2 & Round 3 Cutoff Predictor
 * ─────────────────────────────────────────
 * R1-Anchored Round-Drift Prediction Engine
 *
 * Methodology:
 *   1. Take the ACTUAL 2026 R1 cutoff for a given college+branch+category
 *   2. Compute empirical drift ratios (R2/R1, R3/R2) from 3 years of historical data (2023-2025)
 *   3. Apply weighted drift ratios (recent years weighted higher) to get R2 and R3 predictions
 *   4. Fallback hierarchy for sparse combos: per-combo → same-branch-GM → branch-global → all-data-global
 *   5. Confidence bands based on ratio stability and data availability
 *
 * Data source: Same kcet_cutoffs_consolidated.dat / kcet_cutoffs_high_volume.dat
 *              loaded via CutoffService.loadCutoffs()
 */

import { CutoffService, type CutoffData } from './cutoff-service'
import { normalizeCourseName } from './course-normalization'

// ════════════════════════════════════════════════════════════════════
//  Types
// ════════════════════════════════════════════════════════════════════

export interface RoundDriftPrediction {
  college_code: string
  college_name: string
  course: string
  normalized_course: string
  category: string

  // Actual R1 data
  r1_actual: number

  // R2 prediction
  r2_predicted: number
  r2_low: number
  r2_high: number
  r2_drift_ratio: number          // R2/R1 multiplier used
  r2_change_pct: number           // % change from R1

  // R3 prediction
  r3_predicted: number
  r3_low: number
  r3_high: number
  r3_drift_ratio: number          // R3/R1 multiplier used (cumulative)
  r3_change_pct: number           // % change from R1

  // Evidence & confidence
  confidence_level: 'high' | 'medium' | 'low'
  drift_source: string            // where the ratio came from
  historical_evidence: DriftEvidence[]
  data_points: number             // how many year-pairs contributed
}

export interface DriftEvidence {
  year: string
  r1: number | null
  r2: number | null
  r3: number | null
  r2_r1_ratio: number | null      // R2/R1 for that year
  r3_r2_ratio: number | null      // R3/R2 for that year
  r3_r1_ratio: number | null      // R3/R1 cumulative for that year
}

export interface CollegeOption {
  code: string
  name: string
}

export interface BranchOption {
  raw: string
  normalized: string
}

// ════════════════════════════════════════════════════════════════════
//  Internal Data Structures
// ════════════════════════════════════════════════════════════════════

interface DriftIndex {
  /** code+normCourse+category → year → round → rank */
  byCombo: Map<string, Map<number, Map<string, number>>>
  /** normCourse+category → year → round → rank[] (aggregated across colleges) */
  byBranchCategory: Map<string, Map<number, Map<string, number[]>>>
  /** normCourse → year → round → rank[] (all categories) */
  byBranch: Map<string, Map<number, Map<string, number[]>>>
  /** Global: year → round → rank[] */
  global: Map<number, Map<string, number[]>>
  /** College names map */
  collegeNames: Map<string, string>
  /** All unique college codes with 2026 R1 data */
  colleges2026: Set<string>
  /** Available combos with 2026 R1 data */
  r1Combos2026: Map<string, { code: string; name: string; normCourse: string; rawCourse: string; category: string; rank: number }>
}

const TARGET_YEAR = 2026
const HISTORICAL_YEARS = [2023, 2024, 2025]

let _driftIndex: DriftIndex | null = null
let _rawData: CutoffData[] | null = null

// ════════════════════════════════════════════════════════════════════
//  Round Normalization
// ════════════════════════════════════════════════════════════════════

function normalizeRound(round: string): string {
  const r = String(round || '').trim().toUpperCase()
  if (r === 'R1' || r === 'ROUND 1') return 'R1'
  if (r === 'R2' || r === 'ROUND 2') return 'R2'
  if (r === 'R3' || r === 'ROUND 3' || r === 'EXT' || r.includes('EXTENDED')) return 'R3'
  if (r === 'MOCK' || r.includes('MOCK')) return 'MOCK'
  return r
}

// ════════════════════════════════════════════════════════════════════
//  Index Builder
// ════════════════════════════════════════════════════════════════════

function comboKey(code: string, normCourse: string, category: string): string {
  return `${code}|${normCourse}|${category}`
}

function branchCatKey(normCourse: string, category: string): string {
  return `${normCourse}|${category}`
}

function buildDriftIndex(cutoffs: CutoffData[]): DriftIndex {
  const byCombo = new Map<string, Map<number, Map<string, number>>>()
  const byBranchCategory = new Map<string, Map<number, Map<string, number[]>>>()
  const byBranch = new Map<string, Map<number, Map<string, number[]>>>()
  const global = new Map<number, Map<string, number[]>>()
  const collegeNames = new Map<string, string>()
  const colleges2026 = new Set<string>()
  const r1Combos2026 = new Map<string, { code: string; name: string; normCourse: string; rawCourse: string; category: string; rank: number }>()

  for (const c of cutoffs) {
    const code = (c.institute_code || '').trim().toUpperCase()
    if (!code) continue

    const rank = c.cutoff_rank
    if (!rank || rank <= 0) continue

    const round = normalizeRound(c.round)
    if (!['R1', 'R2', 'R3'].includes(round)) continue  // Only care about R1/R2/R3

    const category = (c.category || '').trim()
    if (!category) continue

    const rawCourse = (c.course || '').trim()
    const normCourse = normalizeCourseName(rawCourse)
    if (!normCourse) continue

    const year = parseInt(String(c.year)) || 0
    if (year < 2022 || year > 2030) continue

    const name = (c.college_name || c.institute_code || (c as any).institute || '').trim()

    // College name tracking
    const existingName = collegeNames.get(code) || ''
    if (name.length > existingName.length) {
      collegeNames.set(code, name)
    }

    // ── byCombo: code+normCourse+category → year → round → rank ──
    const ck = comboKey(code, normCourse, category)
    if (!byCombo.has(ck)) byCombo.set(ck, new Map())
    const yearMap = byCombo.get(ck)!
    if (!yearMap.has(year)) yearMap.set(year, new Map())
    const roundMap = yearMap.get(year)!
    // Keep the last cutoff rank per round (use max for most relaxed)
    const existingRank = roundMap.get(round) || 0
    if (rank > existingRank) roundMap.set(round, rank)

    // ── byBranchCategory: normCourse+category → year → round → ranks[] ──
    const bck = branchCatKey(normCourse, category)
    if (!byBranchCategory.has(bck)) byBranchCategory.set(bck, new Map())
    const bcYearMap = byBranchCategory.get(bck)!
    if (!bcYearMap.has(year)) bcYearMap.set(year, new Map())
    const bcRoundMap = bcYearMap.get(year)!
    if (!bcRoundMap.has(round)) bcRoundMap.set(round, [])
    bcRoundMap.get(round)!.push(rank)

    // ── byBranch: normCourse → year → round → ranks[] ──
    if (!byBranch.has(normCourse)) byBranch.set(normCourse, new Map())
    const brYearMap = byBranch.get(normCourse)!
    if (!brYearMap.has(year)) brYearMap.set(year, new Map())
    const brRoundMap = brYearMap.get(year)!
    if (!brRoundMap.has(round)) brRoundMap.set(round, [])
    brRoundMap.get(round)!.push(rank)

    // ── Global: year → round → ranks[] ──
    if (!global.has(year)) global.set(year, new Map())
    const gRoundMap = global.get(year)!
    if (!gRoundMap.has(round)) gRoundMap.set(round, [])
    gRoundMap.get(round)!.push(rank)

    // ── Track 2026 R1 combos ──
    if (year === TARGET_YEAR && round === 'R1') {
      colleges2026.add(code)
      r1Combos2026.set(ck, { code, name, normCourse, rawCourse, category, rank })
    }
  }

  return { byCombo, byBranchCategory, byBranch, global, collegeNames, colleges2026, r1Combos2026 }
}

async function ensureIndex(): Promise<DriftIndex> {
  if (_driftIndex) return _driftIndex

  if (!_rawData || _rawData.length === 0) {
    _rawData = await CutoffService.loadCutoffs()
  }

  _driftIndex = buildDriftIndex(_rawData)
  return _driftIndex
}

/** Force rebuild (e.g., after admin push) */
export function invalidateRoundDriftCache(): void {
  _driftIndex = null
  _rawData = null
}

// ════════════════════════════════════════════════════════════════════
//  Drift Ratio Computation
// ════════════════════════════════════════════════════════════════════

function median(arr: number[]): number {
  if (arr.length === 0) return 1.0
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

function weightedAverage(values: { value: number; weight: number }[]): number {
  if (values.length === 0) return 1.0
  let sumW = 0, sumWV = 0
  for (const { value, weight } of values) {
    sumW += weight
    sumWV += weight * value
  }
  return sumW > 0 ? sumWV / sumW : 1.0
}

function coefficientOfVariation(arr: number[]): number {
  if (arr.length < 2) return 0
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length
  if (mean === 0) return 0
  const variance = arr.reduce((s, v) => s + (v - mean) ** 2, 0) / arr.length
  return Math.sqrt(variance) / Math.abs(mean)
}

interface DriftResult {
  r2_r1_ratio: number
  r3_r2_ratio: number
  r3_r1_ratio: number
  source: string
  dataPoints: number
  stability: number    // 0-1, higher = more stable
  evidence: DriftEvidence[]
}

/**
 * Layer 1: Per-combo drift ratios
 * Most accurate — same college, same branch, same category across years
 */
function getPerComboDrift(
  idx: DriftIndex,
  code: string,
  normCourse: string,
  category: string
): DriftResult | null {
  const ck = comboKey(code, normCourse, category)
  const yearMap = idx.byCombo.get(ck)
  if (!yearMap) return null

  const r2r1Ratios: { value: number; weight: number }[] = []
  const r3r2Ratios: { value: number; weight: number }[] = []
  const evidence: DriftEvidence[] = []

  for (const year of HISTORICAL_YEARS) {
    const roundMap = yearMap.get(year)
    if (!roundMap) {
      evidence.push({ year: String(year), r1: null, r2: null, r3: null, r2_r1_ratio: null, r3_r2_ratio: null, r3_r1_ratio: null })
      continue
    }

    const r1 = roundMap.get('R1') || null
    const r2 = roundMap.get('R2') || null
    const r3 = roundMap.get('R3') || null

    let r2r1: number | null = null
    let r3r2: number | null = null
    let r3r1: number | null = null

    // Weight: more recent years get higher weight
    // 2023 → weight 1, 2024 → weight 2, 2025 → weight 3
    const weight = year - 2022

    if (r1 && r2 && r1 > 0) {
      r2r1 = r2 / r1
      if (r2r1 >= 0.5 && r2r1 <= 5.0) {
        r2r1Ratios.push({ value: r2r1, weight })
      }
    }
    if (r2 && r3 && r2 > 0) {
      r3r2 = r3 / r2
      if (r3r2 >= 0.5 && r3r2 <= 5.0) {
        r3r2Ratios.push({ value: r3r2, weight })
      }
    }
    if (r1 && r3 && r1 > 0) {
      r3r1 = r3 / r1
    }

    evidence.push({ year: String(year), r1, r2, r3, r2_r1_ratio: r2r1, r3_r2_ratio: r3r2, r3_r1_ratio: r3r1 })
  }

  if (r2r1Ratios.length === 0) return null

  const r2r1 = weightedAverage(r2r1Ratios)
  const r3r2 = r3r2Ratios.length > 0 ? weightedAverage(r3r2Ratios) : 1.0
  const r3r1 = r2r1 * r3r2

  const allRatios = [...r2r1Ratios.map(r => r.value), ...r3r2Ratios.map(r => r.value)]
  const stability = 1 - Math.min(coefficientOfVariation(allRatios), 1)

  return {
    r2_r1_ratio: r2r1,
    r3_r2_ratio: r3r2,
    r3_r1_ratio: r3r1,
    source: `Exact match (${r2r1Ratios.length} yr R2/R1, ${r3r2Ratios.length} yr R3/R2)`,
    dataPoints: r2r1Ratios.length + r3r2Ratios.length,
    stability,
    evidence,
  }
}

/**
 * Layer 2: Same college + same branch + GM category drift
 * Useful when a specific category (e.g., 3BK) is sparse but GM has good data
 */
function getGMComboDrift(
  idx: DriftIndex,
  code: string,
  normCourse: string,
  category: string
): DriftResult | null {
  if (category === 'GM') return null // Already tried in Layer 1
  return getPerComboDrift(idx, code, normCourse, 'GM')
}

function getFallbackR3R2Ratio(r2r1: number): number {
  if (r2r1 <= 1.0) return 1.0
  return Math.max(1.03, 1.0 + (r2r1 - 1.0) * 0.35)
}

/**
 * Layer 3: Same branch + same category across ALL colleges
 * Computes per-combo R2/R1 and R3/R2 ratios, then takes the median.
 * This avoids the pool-size mismatch bug (R1 has 18K entries, R3 has 11K).
 */
function getBranchCategoryDrift(
  idx: DriftIndex,
  normCourse: string,
  category: string
): DriftResult | null {
  const r2r1Ratios: number[] = []
  const r3r2Ratios: number[] = []

  // Iterate all combos and compute per-combo ratios
  for (const [ck, yearMap] of idx.byCombo) {
    const parts = ck.split('|')
    if (parts[1] !== normCourse || parts[2] !== category) continue

    for (const year of HISTORICAL_YEARS) {
      const roundMap = yearMap.get(year)
      if (!roundMap) continue
      const r1 = roundMap.get('R1')
      const r2 = roundMap.get('R2')
      const r3 = roundMap.get('R3')
      if (r1 && r2 && r1 > 0) {
        const ratio = r2 / r1
        if (ratio >= 0.8 && ratio <= 3.0) r2r1Ratios.push(ratio)
      }
      if (r2 && r3 && r2 > 0) {
        const ratio = r3 / r2
        if (ratio >= 0.8 && ratio <= 3.0) r3r2Ratios.push(ratio)
      }
    }
  }

  if (r2r1Ratios.length < 3) return null

  const r2r1 = median(r2r1Ratios)
  const r3r2 = r3r2Ratios.length >= 3 ? median(r3r2Ratios) : getFallbackR3R2Ratio(r2r1)

  return {
    r2_r1_ratio: r2r1,
    r3_r2_ratio: r3r2,
    r3_r1_ratio: r2r1 * r3r2,
    source: `Branch+Category (${r2r1Ratios.length} combos R2/R1, ${r3r2Ratios.length} combos R3/R2)`,
    dataPoints: r2r1Ratios.length + r3r2Ratios.length,
    stability: 1 - Math.min(coefficientOfVariation([...r2r1Ratios, ...r3r2Ratios]), 1),
    evidence: [],
  }
}

/**
 * Layer 4: Same branch across ALL colleges and ALL categories
 * Per-combo ratios, then median.
 */
function getBranchGlobalDrift(
  idx: DriftIndex,
  normCourse: string
): DriftResult | null {
  const r2r1Ratios: number[] = []
  const r3r2Ratios: number[] = []

  for (const [ck, yearMap] of idx.byCombo) {
    const parts = ck.split('|')
    if (parts[1] !== normCourse) continue

    for (const year of HISTORICAL_YEARS) {
      const roundMap = yearMap.get(year)
      if (!roundMap) continue
      const r1 = roundMap.get('R1')
      const r2 = roundMap.get('R2')
      const r3 = roundMap.get('R3')
      if (r1 && r2 && r1 > 0) {
        const ratio = r2 / r1
        if (ratio >= 0.8 && ratio <= 3.0) r2r1Ratios.push(ratio)
      }
      if (r2 && r3 && r2 > 0) {
        const ratio = r3 / r2
        if (ratio >= 0.8 && ratio <= 3.0) r3r2Ratios.push(ratio)
      }
    }
  }

  if (r2r1Ratios.length < 3) return null

  const r2r1 = median(r2r1Ratios)
  const r3r2 = r3r2Ratios.length >= 3 ? median(r3r2Ratios) : getFallbackR3R2Ratio(r2r1)

  return {
    r2_r1_ratio: r2r1,
    r3_r2_ratio: r3r2,
    r3_r1_ratio: r2r1 * r3r2,
    source: `Branch global (${r2r1Ratios.length} combos, all categories)`,
    dataPoints: r2r1Ratios.length + r3r2Ratios.length,
    stability: 1 - Math.min(coefficientOfVariation([...r2r1Ratios, ...r3r2Ratios]), 1),
    evidence: [],
  }
}

/**
 * Layer 5: All-data global drift (last resort)
 * Compute per-combo R2/R1 and R3/R2 across ALL combos in the dataset.
 */
function getGlobalDrift(idx: DriftIndex): DriftResult {
  const r2r1Ratios: number[] = []
  const r3r2Ratios: number[] = []

  for (const [, yearMap] of idx.byCombo) {
    for (const year of HISTORICAL_YEARS) {
      const roundMap = yearMap.get(year)
      if (!roundMap) continue
      const r1 = roundMap.get('R1')
      const r2 = roundMap.get('R2')
      const r3 = roundMap.get('R3')
      if (r1 && r2 && r1 > 0) {
        const ratio = r2 / r1
        if (ratio >= 0.8 && ratio <= 3.0) r2r1Ratios.push(ratio)
      }
      if (r2 && r3 && r2 > 0) {
        const ratio = r3 / r2
        if (ratio >= 0.8 && ratio <= 3.0) r3r2Ratios.push(ratio)
      }
    }
  }

  const r2r1 = r2r1Ratios.length > 0 ? median(r2r1Ratios) : 1.05
  const r3r2 = r3r2Ratios.length > 0 ? median(r3r2Ratios) : 1.03

  return {
    r2_r1_ratio: r2r1,
    r3_r2_ratio: r3r2,
    r3_r1_ratio: r2r1 * r3r2,
    source: `Global (${r2r1Ratios.length} combos R2/R1, ${r3r2Ratios.length} combos R3/R2)`,
    dataPoints: r2r1Ratios.length + r3r2Ratios.length,
    stability: 0.5,
    evidence: [],
  }
}

// ════════════════════════════════════════════════════════════════════
//  Core Prediction Logic
// ════════════════════════════════════════════════════════════════════

/**
 * Get drift ratios using the fallback hierarchy:
 *   1. Exact combo (code+branch+category)
 *   2. Same combo with GM
 *   3. Same branch+category across all colleges
 *   4. Same branch across all colleges+categories
 *   5. Global all-data median
 */
function extractComboEvidence(
  idx: DriftIndex,
  code: string,
  normCourse: string,
  category: string
): DriftEvidence[] {
  const ck = comboKey(code, normCourse, category)
  const yearMap = idx.byCombo.get(ck)
  const evidence: DriftEvidence[] = []

  for (const year of HISTORICAL_YEARS) {
    const roundMap = yearMap?.get(year)
    const r1 = roundMap?.get('R1') || null
    const r2 = roundMap?.get('R2') || null
    const r3 = roundMap?.get('R3') || null
    const r2_r1_ratio = (r1 && r2 && r1 > 0) ? r2 / r1 : null
    const r3_r2_ratio = (r2 && r3 && r2 > 0) ? r3 / r2 : null
    const r3_r1_ratio = (r1 && r3 && r1 > 0) ? r3 / r1 : null

    evidence.push({
      year: String(year),
      r1,
      r2,
      r3,
      r2_r1_ratio,
      r3_r2_ratio,
      r3_r1_ratio,
    })
  }

  return evidence
}

/**
 * Get drift ratios using the fallback hierarchy:
 *   1. Exact combo (code+branch+category)
 *   2. Same combo with GM
 *   3. Same branch+category across all colleges
 *   4. Same branch across all colleges+categories
 *   5. Global all-data median
 */
function getDriftRatios(
  idx: DriftIndex,
  code: string,
  normCourse: string,
  category: string
): DriftResult {
  let result: DriftResult

  // Layer 1: Exact combo
  const perCombo = getPerComboDrift(idx, code, normCourse, category)
  if (perCombo && perCombo.dataPoints >= 2) {
    result = perCombo
  } else {
    // Layer 2: GM fallback for same college+branch
    const gmCombo = getGMComboDrift(idx, code, normCourse, category)
    if (gmCombo && gmCombo.dataPoints >= 2) {
      result = {
        ...gmCombo,
        source: `GM fallback at same college (${gmCombo.dataPoints} data points)`,
        evidence: perCombo?.evidence || gmCombo.evidence,
      }
    } else if (perCombo && perCombo.dataPoints >= 1) {
      // If we have at least 1 data point from per-combo, use it (with lower confidence)
      result = perCombo
    } else {
      // Layer 3: Branch+category global
      const branchCat = getBranchCategoryDrift(idx, normCourse, category)
      if (branchCat && branchCat.dataPoints >= 2) {
        result = branchCat
      } else {
        // Layer 4: Branch global
        const branchGlobal = getBranchGlobalDrift(idx, normCourse)
        if (branchGlobal && branchGlobal.dataPoints >= 2) {
          result = branchGlobal
        } else {
          // Layer 5: Global fallback
          result = getGlobalDrift(idx)
        }
      }
    }
  }

  // Ensure historical evidence is attached if available for this exact combo or GM fallback
  const exactEvidence = extractComboEvidence(idx, code, normCourse, category)
  const hasExactData = exactEvidence.some(ev => ev.r1 !== null || ev.r2 !== null || ev.r3 !== null)

  if (hasExactData) {
    result.evidence = exactEvidence
  } else if (!result.evidence || result.evidence.length === 0) {
    const gmEvidence = extractComboEvidence(idx, code, normCourse, 'GM')
    const hasGmData = gmEvidence.some(ev => ev.r1 !== null || ev.r2 !== null || ev.r3 !== null)
    if (hasGmData) {
      result.evidence = gmEvidence
    }
  }

  // For small/sparse categories where R3 historical data was missing or identical to R2 (ratio <= 1.005),
  // borrow R3/R2 relaxation from GM at the same college, Branch trend, or growth delta so R2 and R3 estimates aren't identically flat.
  if (result.r2_r1_ratio > 1.01 && result.r3_r2_ratio <= 1.005) {
    const gmDrift = getGMComboDrift(idx, code, normCourse, category)
    const branchDrift = getBranchGlobalDrift(idx, normCourse)
    const fallbackRatio = (gmDrift && gmDrift.r3_r2_ratio > 1.01)
      ? gmDrift.r3_r2_ratio
      : (branchDrift && branchDrift.r3_r2_ratio > 1.01)
        ? branchDrift.r3_r2_ratio
        : getFallbackR3R2Ratio(result.r2_r1_ratio)

    return {
      ...result,
      r3_r2_ratio: fallbackRatio,
      r3_r1_ratio: result.r2_r1_ratio * fallbackRatio,
    }
  }

  return result
}

// ════════════════════════════════════════════════════════════════════
//  Public API
// ════════════════════════════════════════════════════════════════════

/**
 * Get all colleges that have 2026 R1 data.
 */
export async function getCollegesWithR1Data(): Promise<CollegeOption[]> {
  const idx = await ensureIndex()

  const result: CollegeOption[] = []
  for (const code of idx.colleges2026) {
    result.push({
      code,
      name: idx.collegeNames.get(code) || code,
    })
  }

  return result.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }))
}

/**
 * Get available branches for a college that have 2026 R1 data.
 */
export async function getBranchesWithR1Data(collegeCode: string): Promise<BranchOption[]> {
  const idx = await ensureIndex()
  const codeUpper = collegeCode.trim().toUpperCase()

  const branches = new Map<string, string>()
  for (const [ck, combo] of idx.r1Combos2026) {
    if (combo.code !== codeUpper) continue
    if (!branches.has(combo.normCourse)) {
      branches.set(combo.normCourse, combo.rawCourse)
    }
  }

  return Array.from(branches.entries())
    .map(([normalized, raw]) => ({ raw, normalized }))
    .sort((a, b) => a.normalized.localeCompare(b.normalized))
}

/**
 * Get available categories for a specific college+branch that have 2026 R1 data.
 */
export async function getCategoriesWithR1Data(
  collegeCode: string,
  normCourse: string
): Promise<string[]> {
  const idx = await ensureIndex()
  const codeUpper = collegeCode.trim().toUpperCase()

  const categories = new Set<string>()
  for (const [, combo] of idx.r1Combos2026) {
    if (combo.code !== codeUpper) continue
    if (combo.normCourse !== normCourse) continue
    categories.add(combo.category)
  }

  return [...categories].sort()
}

/**
 * ═══════════════════════════════════════════════════════════════
 *  CORE: Predict R2 & R3 cutoff from actual R1 data
 * ═══════════════════════════════════════════════════════════════
 */
export async function predictR2R3(
  collegeCode: string,
  course: string,
  category: string,
  neetMultiplier: number = 1.0
): Promise<RoundDriftPrediction | null> {
  const idx = await ensureIndex()
  const codeUpper = collegeCode.trim().toUpperCase()
  const normCourse = normalizeCourseName(course) || course

  // Get 2026 R1 actual
  const ck = comboKey(codeUpper, normCourse, category)
  const combo = idx.r1Combos2026.get(ck)
  if (!combo) return null

  const r1Actual = combo.rank
  const collegeName = idx.collegeNames.get(codeUpper) || codeUpper

  // Get drift ratios with fallback hierarchy
  let drift = getDriftRatios(idx, codeUpper, normCourse, category)

  // Enforce physical KCET counseling constraint: R1 <= R2 <= R3 (ranks relax/increase over rounds)
  // Follow measured counselling behavior. Although cutoffs usually relax, the
  // validated source includes legitimate tightening cases; forcing monotonic
  // growth would bias those predictions. Ratio collection already rejects
  // implausible outliers before this point.
  const r2Drift = drift.r2_r1_ratio
  const r3r2Drift = drift.r3_r2_ratio

  // Apply drift to R1 with NEET surrender adjustment
  const r2Predicted = Math.max(1, Math.round(r1Actual * r2Drift * neetMultiplier))
  const r3Predicted = Math.max(1, Math.round(r2Predicted * r3r2Drift))

  // Re-calculate effective multipliers & percentages for UI
  const effectiveR2Drift = r2Predicted / r1Actual
  const effectiveR3Drift = r3Predicted / r1Actual

  // Confidence bands
  const uncertaintyMultiplier = getUncertaintyMultiplier(drift)
  const r2Low = Math.max(1, Math.round(r2Predicted * (1 - uncertaintyMultiplier)))
  const r2High = Math.round(r2Predicted * (1 + uncertaintyMultiplier))
  const r3Low = Math.max(r2Low, Math.round(r3Predicted * (1 - uncertaintyMultiplier * 1.3)))
  const r3High = Math.round(r3Predicted * (1 + uncertaintyMultiplier * 1.3))

  // Confidence level
  let confidenceLevel: 'high' | 'medium' | 'low'
  if (drift.dataPoints >= 4 && drift.stability >= 0.7) {
    confidenceLevel = 'high'
  } else if (drift.dataPoints >= 2 && drift.stability >= 0.4) {
    confidenceLevel = 'medium'
  } else {
    confidenceLevel = 'low'
  }

  return {
    college_code: codeUpper,
    college_name: collegeName,
    course: combo.rawCourse,
    normalized_course: normCourse,
    category,
    r1_actual: r1Actual,
    r2_predicted: r2Predicted,
    r2_low: r2Low,
    r2_high: r2High,
    r2_drift_ratio: Number(effectiveR2Drift.toFixed(3)),
    r2_change_pct: Math.round((effectiveR2Drift - 1) * 100),
    r3_predicted: r3Predicted,
    r3_low: r3Low,
    r3_high: r3High,
    r3_drift_ratio: Number(effectiveR3Drift.toFixed(3)),
    r3_change_pct: Math.round((effectiveR3Drift - 1) * 100),
    confidence_level: confidenceLevel,
    drift_source: drift.source,
    historical_evidence: drift.evidence,
    data_points: drift.dataPoints,
  }
}

/**
 * Batch predict: all branches at a college for a given category.
 */
export async function predictAllBranches(
  collegeCode: string,
  category: string,
  neetMultiplier: number = 1.0
): Promise<RoundDriftPrediction[]> {
  const idx = await ensureIndex()
  const codeUpper = collegeCode.trim().toUpperCase()

  const branches = new Set<string>()
  for (const [, combo] of idx.r1Combos2026) {
    if (combo.code !== codeUpper) continue
    if (combo.category !== category) continue
    branches.add(combo.normCourse)
  }

  const predictions: RoundDriftPrediction[] = []
  for (const normCourse of branches) {
    const p = await predictR2R3(codeUpper, normCourse, category, neetMultiplier)
    if (p) predictions.push(p)
  }

  // Sort by R1 actual (tightest first)
  predictions.sort((a, b) => a.r1_actual - b.r1_actual)
  return predictions
}

/**
 * Batch predict: all categories for a specific college+branch.
 */
export async function predictAllCategories(
  collegeCode: string,
  course: string,
  neetMultiplier: number = 1.0
): Promise<RoundDriftPrediction[]> {
  const categories = await getCategoriesWithR1Data(collegeCode, normalizeCourseName(course) || course)

  const predictions: RoundDriftPrediction[] = []
  for (const cat of categories) {
    const p = await predictR2R3(collegeCode, course, cat, neetMultiplier)
    if (p) predictions.push(p)
  }

  predictions.sort((a, b) => a.r1_actual - b.r1_actual)
  return predictions
}

/** A small, deterministic cross-section of the current 2026 forecasts for validation UI. */
export async function get2026ForecastSamples(limit = 15): Promise<RoundDriftPrediction[]> {
  const idx = await ensureIndex()
  const combos = [...idx.r1Combos2026.values()]
    .sort((a, b) => `${a.code}|${a.normCourse}|${a.category}`.localeCompare(`${b.code}|${b.normCourse}|${b.category}`))
    .slice(0, limit)

  const forecasts = await Promise.all(
    combos.map(combo => predictR2R3(combo.code, combo.normCourse, combo.category))
  )
  return forecasts.filter((forecast): forecast is RoundDriftPrediction => forecast !== null)
}

/**
 * Check eligibility across R1/R2/R3 for a given user rank.
 */
export function checkRoundEligibility(
  prediction: RoundDriftPrediction,
  userRank: number
): {
  r1: 'safe' | 'borderline' | 'unlikely'
  r2: 'safe' | 'borderline' | 'unlikely'
  r3: 'safe' | 'borderline' | 'unlikely'
} {
  const classify = (predicted: number, low: number, high: number): 'safe' | 'borderline' | 'unlikely' => {
    if (userRank <= low) return 'safe'
    if (userRank <= high) return 'borderline'
    return 'unlikely'
  }

  return {
    r1: userRank <= prediction.r1_actual ? 'safe' : 'unlikely',
    r2: classify(prediction.r2_predicted, prediction.r2_low, prediction.r2_high),
    r3: classify(prediction.r3_predicted, prediction.r3_low, prediction.r3_high),
  }
}

// ════════════════════════════════════════════════════════════════════
//  Backtest: Validate accuracy using known data
// ════════════════════════════════════════════════════════════════════

/**
 * Use 2024 R1 to "predict" 2024 R2/R3 and compare against actuals.
 * This gives users transparent evidence of prediction accuracy.
 */
export async function backtestRoundDrift(backtestYear = 2025): Promise<{
  backtest_year: number
  tested: number
  r2_median_error_pct: number
  r2_p90_error_pct: number
  r3_median_error_pct: number
  r3_p90_error_pct: number
  r2_coverage_rate: number  // % where actual was within predicted range
  r3_coverage_rate: number
  samples: {
    combo: string
    r1_actual: number
    r2_actual: number
    r2_predicted: number
    r2_error_pct: number
    r3_actual: number | null
    r3_predicted: number
    r3_error_pct: number | null
  }[]
}> {
  const idx = await ensureIndex()

  // A backtest may only use years that were already complete at that time.
  // This prevents future-data leakage when evaluating 2024 or 2025.
  const priorYears = HISTORICAL_YEARS.filter(year => year < backtestYear)
  const r2Errors: number[] = []
  const r3Errors: number[] = []
  const r2InBand: boolean[] = []
  const r3InBand: boolean[] = []
  const samples: any[] = []

  for (const [ck, yearMap] of idx.byCombo) {
    const roundMap = yearMap.get(backtestYear)
    if (!roundMap) continue

    const r1 = roundMap.get('R1')
    const r2 = roundMap.get('R2')
    const r3 = roundMap.get('R3')

    if (!r1 || !r2) continue

    const parts = ck.split('|')
    const code = parts[0]
    const normCourse = parts[1]
    const category = parts[2]

    // Get drift ratios using only OTHER years' data (exclude backtest year)
    // For a fair backtest, compute drift from years OTHER than backtestYear
    const otherYearRatiosR2R1: number[] = []
    const otherYearRatiosR3R2: number[] = []

    for (const yr of priorYears) {
      const yrRoundMap = yearMap.get(yr)
      if (!yrRoundMap) continue
      const yrR1 = yrRoundMap.get('R1')
      const yrR2 = yrRoundMap.get('R2')
      const yrR3 = yrRoundMap.get('R3')
      if (yrR1 && yrR2 && yrR1 > 0) otherYearRatiosR2R1.push(yrR2 / yrR1)
      if (yrR2 && yrR3 && yrR2 > 0) otherYearRatiosR3R2.push(yrR3 / yrR2)
    }

    if (otherYearRatiosR2R1.length === 0) continue

    const driftR2R1 = median(otherYearRatiosR2R1)
    const driftR3R2 = otherYearRatiosR3R2.length > 0 ? median(otherYearRatiosR3R2) : 1.0

    const predictedR2 = Math.round(r1 * driftR2R1)
    const predictedR3 = Math.round(r1 * driftR2R1 * driftR3R2)

    const r2ErrorPct = Math.abs(predictedR2 - r2) / r2 * 100
    r2Errors.push(r2ErrorPct)

    const uncertainty = 0.1  // 10% band for backtest
    r2InBand.push(r2 >= predictedR2 * (1 - uncertainty) && r2 <= predictedR2 * (1 + uncertainty))

    let r3ErrorPct: number | null = null
    if (r3) {
      r3ErrorPct = Math.abs(predictedR3 - r3) / r3 * 100
      r3Errors.push(r3ErrorPct)
      r3InBand.push(r3 >= predictedR3 * (1 - uncertainty * 1.3) && r3 <= predictedR3 * (1 + uncertainty * 1.3))
    }

    if (samples.length < 15) {
      samples.push({
        combo: `${code} | ${normCourse} | ${category}`,
        r1_actual: r1,
        r2_actual: r2,
        r2_predicted: predictedR2,
        r2_error_pct: Math.round(r2ErrorPct),
        r3_actual: r3 || null,
        r3_predicted: predictedR3,
        r3_error_pct: r3ErrorPct !== null ? Math.round(r3ErrorPct) : null,
      })
    }
  }

  r2Errors.sort((a, b) => a - b)
  r3Errors.sort((a, b) => a - b)

  return {
    backtest_year: backtestYear,
    tested: r2Errors.length,
    r2_median_error_pct: r2Errors.length > 0 ? Math.round(median(r2Errors)) : 0,
    r2_p90_error_pct: r2Errors.length > 0 ? Math.round(r2Errors[Math.floor(r2Errors.length * 0.9)] || r2Errors[r2Errors.length - 1]) : 0,
    r3_median_error_pct: r3Errors.length > 0 ? Math.round(median(r3Errors)) : 0,
    r3_p90_error_pct: r3Errors.length > 0 ? Math.round(r3Errors[Math.floor(r3Errors.length * 0.9)] || r3Errors[r3Errors.length - 1]) : 0,
    r2_coverage_rate: r2InBand.length > 0 ? Math.round(r2InBand.filter(Boolean).length / r2InBand.length * 100) : 0,
    r3_coverage_rate: r3InBand.length > 0 ? Math.round(r3InBand.filter(Boolean).length / r3InBand.length * 100) : 0,
    samples,
  }
}

// ════════════════════════════════════════════════════════════════════
//  Helpers
// ════════════════════════════════════════════════════════════════════

function getUncertaintyMultiplier(drift: DriftResult): number {
  // Higher data points + higher stability = lower uncertainty
  if (drift.dataPoints >= 4 && drift.stability >= 0.8) return 0.06
  if (drift.dataPoints >= 3 && drift.stability >= 0.6) return 0.10
  if (drift.dataPoints >= 2 && drift.stability >= 0.4) return 0.15
  if (drift.dataPoints >= 1) return 0.20
  return 0.30
}
