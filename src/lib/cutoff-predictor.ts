/**
 * KCET Cutoff Predictor Engine — Advanced Multi-Signal Prediction
 *
 * 7-Layer prediction pipeline:
 *   1. Participation Normalization  — adjust ranks for yearly candidate volume
 *   2. Log-Scale Weighted Regression — exponential rank distribution handling
 *   3. Peer-College Transfer        — borrow trends from same-branch at peer colleges
 *   4. Cross-Branch College Signal   — catch college-level effects
 *   5. Round-Drift Model            — R1→R2→R3 relaxation ratios
 *   6. Category Ratio Model         — anchor rare categories to GM
 *   7. Ensemble + Bayesian Confidence Bands
 */

import { CutoffService, type CutoffData } from './cutoff-service'
import { normalizeCourseName } from './course-normalization'

// ════════════════════════════════════════════════════════════════════
//  Types
// ════════════════════════════════════════════════════════════════════

export interface CutoffPrediction {
  college_code: string
  college_name: string
  course: string
  normalized_course: string
  category: string
  round: string
  predicted_cutoff: number          // median prediction
  confidence_low: number            // optimistic (higher rank = easier)
  confidence_high: number           // pessimistic (lower rank = harder)
  trend: 'rising' | 'falling' | 'stable'
  trend_pct: number                 // year-over-year change %
  historical: { year: string; rank: number }[]
  data_years: number                // how many years of data exist
  confidence_level: 'high' | 'medium' | 'low'
  // New fields
  signals_used: string[]            // which layers contributed
  backtest_error_pct?: number       // measured error from backtesting
  participation_adjusted: boolean
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
//  Constants
// ════════════════════════════════════════════════════════════════════

/** Estimated total KCET candidates per year for normalization */
const CANDIDATE_COUNTS: Record<number, number> = {
  2022: 225000,
  2023: 240000,
  2024: 259000,
  2025: 275000,
  2026: 288000,
  2027: 298000,
}

/** Ensemble weights for combining signals */
const ENSEMBLE_WEIGHTS = {
  directRegression: 0.50,
  peerTransfer: 0.20,
  collegeTransfer: 0.10,
  categoryRatio: 0.15,
  roundDrift: 0.05,
}

// ════════════════════════════════════════════════════════════════════
//  Helpers
// ════════════════════════════════════════════════════════════════════

/** Normalize round labels to a canonical form */
const normalizeRound = (round: string): string => {
  const r = String(round || '').trim().toUpperCase()
  if (r === 'R1' || r === 'ROUND 1') return 'R1'
  if (r === 'R2' || r === 'ROUND 2') return 'R2'
  if (r === 'R3' || r === 'ROUND 3' || r === 'EXT' || r.includes('EXTENDED')) return 'R3'
  if (r === 'MOCK2' || r === 'MOCK 2' || r === 'MOCK ROUND 2' || r === 'MOCK R2' || r === 'MOCK_R2') return 'MOCK2'
  if (r === 'MOCK' || r === 'MOCK 1' || r === 'MOCK1' || r === 'MOCK ROUND 1' || r.includes('MOCK')) return 'MOCK'
  return r
}

/** Get candidate count for a year, with fallback interpolation */
function getCandidateCount(year: number): number {
  if (CANDIDATE_COUNTS[year]) return CANDIDATE_COUNTS[year]
  // Extrapolate ~3% growth per year from nearest known year
  const knownYears = Object.keys(CANDIDATE_COUNTS).map(Number).sort()
  const nearest = knownYears.reduce((a, b) => Math.abs(b - year) < Math.abs(a - year) ? b : a)
  const diff = year - nearest
  return Math.round(CANDIDATE_COUNTS[nearest] * Math.pow(1.03, diff))
}

/** Safe log that handles edge cases */
function safeLog(x: number): number {
  return Math.log(Math.max(1, x))
}

/** Safe exp that prevents overflow */
function safeExp(x: number): number {
  return Math.exp(Math.min(x, 20))
}

// ════════════════════════════════════════════════════════════════════
//  Layer 1: Participation Normalization
// ════════════════════════════════════════════════════════════════════

/**
 * Convert a raw rank in a given year to a normalized percentile-space
 * value (0–1, where 0 = best rank, 1 = worst).
 */
function normalizeRankToPercentile(rank: number, year: number): number {
  const total = getCandidateCount(year)
  return Math.min(1, Math.max(0, rank / total))
}

/**
 * Convert a percentile-space value back to a raw rank for a target year.
 */
function percentileToRank(percentile: number, targetYear: number): number {
  const total = getCandidateCount(targetYear)
  return Math.max(1, Math.round(percentile * total))
}

// ════════════════════════════════════════════════════════════════════
//  Layer 2: Log-Scale Weighted Regression
// ════════════════════════════════════════════════════════════════════

interface RegressionResult {
  slope: number
  intercept: number
  predicted: number
  residualStd: number
  rSquared: number
}

/**
 * Weighted linear regression on log-transformed normalized ranks.
 * Uses exponentially increasing weights (recent years count more).
 * Returns prediction in percentile space.
 */
function logScaleRegression(
  years: number[],
  ranks: number[],
  targetYear: number
): RegressionResult {
  const n = years.length

  if (n === 0) {
    return { slope: 0, intercept: 0, predicted: 0, residualStd: 0, rSquared: 0 }
  }

  // Transform: normalize ranks to percentile, then log-transform
  const xs = years.map(y => y)
  const ys = years.map((y, i) => safeLog(normalizeRankToPercentile(ranks[i], y)))

  // Exponentially increasing weights: oldest=1, newest=2^(n-1)
  const weights = years.map((_, i) => Math.pow(2, i))

  if (n === 1) {
    const predicted = ys[0]
    return {
      slope: 0,
      intercept: predicted,
      predicted: safeExp(predicted),
      residualStd: Math.abs(predicted) * 0.12,
      rSquared: 0
    }
  }

  // Weighted linear regression
  let sumW = 0, sumWx = 0, sumWy = 0, sumWxx = 0, sumWxy = 0
  for (let i = 0; i < n; i++) {
    const w = weights[i]
    sumW += w
    sumWx += w * xs[i]
    sumWy += w * ys[i]
    sumWxx += w * xs[i] * xs[i]
    sumWxy += w * xs[i] * ys[i]
  }

  const denom = sumW * sumWxx - sumWx * sumWx
  let slope: number, intercept: number

  if (Math.abs(denom) < 1e-10) {
    slope = 0
    intercept = sumWy / sumW
  } else {
    slope = (sumW * sumWxy - sumWx * sumWy) / denom
    intercept = (sumWy - slope * sumWx) / sumW
  }

  // Predicted log-percentile for target year
  const predictedLogPct = slope * targetYear + intercept

  // R² (coefficient of determination)
  const meanY = sumWy / sumW
  let ssTot = 0, ssRes = 0
  for (let i = 0; i < n; i++) {
    const pred = slope * xs[i] + intercept
    ssTot += weights[i] * (ys[i] - meanY) ** 2
    ssRes += weights[i] * (ys[i] - pred) ** 2
  }
  const rSquared = ssTot > 1e-10 ? 1 - ssRes / ssTot : 0

  // Residual standard deviation
  let sumWResidualSq = 0
  for (let i = 0; i < n; i++) {
    const pred = slope * xs[i] + intercept
    const residual = ys[i] - pred
    sumWResidualSq += weights[i] * residual * residual
  }
  const residualStd = Math.sqrt(sumWResidualSq / sumW)

  return {
    slope,
    intercept,
    predicted: safeExp(predictedLogPct),
    residualStd: Math.max(residualStd, 0.01),
    rSquared: Math.max(0, Math.min(1, rSquared))
  }
}

// ════════════════════════════════════════════════════════════════════
//  Indexed Data Store (built once, queried many times)
// ════════════════════════════════════════════════════════════════════

interface IndexedRecord {
  code: string
  name: string
  normCourse: string
  rawCourse: string
  category: string
  round: string
  year: number
  rank: number
}

/** Multi-key index for fast lookups */
interface DataIndex {
  /** All records */
  all: IndexedRecord[]
  /** code+normCourse+category+round → year → rank */
  byCombination: Map<string, Map<number, number>>
  /** normCourse+category+round → code → year → rank (for peer lookup) */
  byBranchCategoryRound: Map<string, Map<string, Map<number, number>>>
  /** code+round → normCourse → year → rank (for cross-branch lookup) */
  byCollegeRound: Map<string, Map<string, Map<number, number>>>
  /** code+normCourse+round → category → year → rank (for category ratio) */
  byCollegeBranchRound: Map<string, Map<string, Map<number, number>>>
  /** normCourse+round → year → ratio[] (for round drift: R1 rank / R2 rank) */
  roundDriftRatios: Map<string, { r1r2: number[]; r2r3: number[] }>
  /** Best college name per code */
  collegeNames: Map<string, string>
  /** All known years */
  years: number[]
}

let _indexCache: DataIndex | null = null
let _rawCutoffs: CutoffData[] | null = null

function comboKey(code: string, normCourse: string, category: string, round: string): string {
  return `${code}|${normCourse}|${category}|${round}`
}

function branchCatRoundKey(normCourse: string, category: string, round: string): string {
  return `${normCourse}|${category}|${round}`
}

function collegeRoundKey(code: string, round: string): string {
  return `${code}|${round}`
}

function collegeBranchRoundKey(code: string, normCourse: string, round: string): string {
  return `${code}|${normCourse}|${round}`
}

/**
 * Build the indexed data store from raw cutoff data.
 * This is called once and cached.
 */
function buildIndex(cutoffs: CutoffData[]): DataIndex {
  const all: IndexedRecord[] = []
  const byCombination = new Map<string, Map<number, number>>()
  const byBranchCategoryRound = new Map<string, Map<string, Map<number, number>>>()
  const byCollegeRound = new Map<string, Map<string, Map<number, number>>>()
  const byCollegeBranchRound = new Map<string, Map<string, Map<number, number>>>()
  const collegeNames = new Map<string, string>()
  const yearSet = new Set<number>()

  for (const c of cutoffs) {
    const code = (c.institute_code || '').trim().toUpperCase()
    if (!code) continue

    const rank = c.cutoff_rank
    if (!rank || rank <= 0) continue

    const round = normalizeRound(c.round)
    const category = (c.category || '').trim()
    if (!category) continue

    const rawCourse = (c.course || '').trim()
    const normCourse = normalizeCourseName(rawCourse)
    if (!normCourse) continue

    const year = parseInt(String(c.year)) || 0
    if (year < 2020 || year > 2030) continue

    const name = (c.college_name || c.institute_code || '').trim()
    yearSet.add(year)

    // Best name per college code
    const existingName = collegeNames.get(code) || ''
    if (name.length > existingName.length) {
      collegeNames.set(code, name)
    }

    const record: IndexedRecord = { code, name, normCourse, rawCourse, category, round, year, rank }
    all.push(record)

    // 1. byCombination: code+normCourse+category+round → year → rank
    const ck = comboKey(code, normCourse, category, round)
    if (!byCombination.has(ck)) byCombination.set(ck, new Map())
    const yearMap = byCombination.get(ck)!
    const existingRank = yearMap.get(year) || 0
    // Keep the latest (highest rank = most relaxed) entry per year
    if (rank > existingRank) yearMap.set(year, rank)

    // 2. byBranchCategoryRound: normCourse+category+round → code → year → rank
    const bcrk = branchCatRoundKey(normCourse, category, round)
    if (!byBranchCategoryRound.has(bcrk)) byBranchCategoryRound.set(bcrk, new Map())
    const codeMap = byBranchCategoryRound.get(bcrk)!
    if (!codeMap.has(code)) codeMap.set(code, new Map())
    const peerYearMap = codeMap.get(code)!
    const existingPeerRank = peerYearMap.get(year) || 0
    if (rank > existingPeerRank) peerYearMap.set(year, rank)

    // 3. byCollegeRound: code+round → normCourse → year → rank (for GM or primary category)
    const crk = collegeRoundKey(code, round)
    if (!byCollegeRound.has(crk)) byCollegeRound.set(crk, new Map())
    const branchMap = byCollegeRound.get(crk)!
    if (!branchMap.has(normCourse)) branchMap.set(normCourse, new Map())
    const branchYearMap = branchMap.get(normCourse)!
    const existingBranchRank = branchYearMap.get(year) || 0
    if (rank > existingBranchRank) branchYearMap.set(year, rank)

    // 4. byCollegeBranchRound: code+normCourse+round → category → year → rank
    const cbrk = collegeBranchRoundKey(code, normCourse, round)
    if (!byCollegeBranchRound.has(cbrk)) byCollegeBranchRound.set(cbrk, new Map())
    const catMap = byCollegeBranchRound.get(cbrk)!
    if (!catMap.has(category)) catMap.set(category, new Map())
    const catYearMap = catMap.get(category)!
    const existingCatRank = catYearMap.get(year) || 0
    if (rank > existingCatRank) catYearMap.set(year, rank)
  }

  // Build round drift ratios
  const roundDriftRatios = computeRoundDriftRatios(cutoffs)

  const years = [...yearSet].sort()

  return {
    all, byCombination, byBranchCategoryRound, byCollegeRound,
    byCollegeBranchRound, roundDriftRatios, collegeNames, years
  }
}

/**
 * Compute median round-drift ratios (R2/R1 and R3/R2) per branch+category.
 */
function computeRoundDriftRatios(
  cutoffs: CutoffData[]
): Map<string, { r1r2: number[]; r2r3: number[] }> {
  // Group by code+normCourse+category+year → round → rank
  const grouped = new Map<string, Map<string, number>>()

  for (const c of cutoffs) {
    const code = (c.institute_code || '').trim().toUpperCase()
    if (!code) continue
    const rank = c.cutoff_rank
    if (!rank || rank <= 0) continue
    const round = normalizeRound(c.round)
    const category = (c.category || '').trim()
    const normCourse = normalizeCourseName((c.course || '').trim())
    const year = parseInt(String(c.year)) || 0
    if (year < 2020) continue

    const key = `${code}|${normCourse}|${category}|${year}`
    if (!grouped.has(key)) grouped.set(key, new Map())
    const rm = grouped.get(key)!
    const existing = rm.get(round) || 0
    if (rank > existing) rm.set(round, rank)
  }

  // Aggregate ratios per normCourse+category
  const result = new Map<string, { r1r2: number[]; r2r3: number[] }>()

  for (const [, roundMap] of grouped) {
    const r1 = roundMap.get('R1')
    const r2 = roundMap.get('R2')
    const r3 = roundMap.get('R3')

    // We need the normCourse+category from the key
    // Actually, let's re-derive: iterate grouped entries
    // Skip — we'll handle below
  }

  // Re-iterate to build per-branch+category ratios
  const byBranchCat = new Map<string, { r1r2: number[]; r2r3: number[] }>()

  for (const [key, roundMap] of grouped) {
    const parts = key.split('|')
    const normCourse = parts[1]
    const category = parts[2]
    const bck = `${normCourse}|${category}`

    if (!byBranchCat.has(bck)) byBranchCat.set(bck, { r1r2: [], r2r3: [] })
    const entry = byBranchCat.get(bck)!

    const r1 = roundMap.get('R1')
    const r2 = roundMap.get('R2')
    const r3 = roundMap.get('R3')

    if (r1 && r2 && r1 > 0) {
      const ratio = r2 / r1
      if (ratio >= 0.5 && ratio <= 3.0) entry.r1r2.push(ratio)
    }
    if (r2 && r3 && r2 > 0) {
      const ratio = r3 / r2
      if (ratio >= 0.5 && ratio <= 3.0) entry.r2r3.push(ratio)
    }
  }

  return byBranchCat
}

function medianOf(arr: number[]): number {
  if (arr.length === 0) return 1.0
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

// ════════════════════════════════════════════════════════════════════
//  Data Loading
// ════════════════════════════════════════════════════════════════════

async function ensureIndex(): Promise<DataIndex> {
  if (_indexCache) return _indexCache

  if (!_rawCutoffs || _rawCutoffs.length === 0) {
    _rawCutoffs = await CutoffService.loadCutoffs()
  }

  _indexCache = buildIndex(_rawCutoffs)
  return _indexCache
}

/** Force index rebuild (e.g., after admin data push) */
export function invalidateCache(): void {
  _indexCache = null
  _rawCutoffs = null
}

// ════════════════════════════════════════════════════════════════════
//  Layer 3: Peer-College Transfer Learning
// ════════════════════════════════════════════════════════════════════

/**
 * For a given normCourse+category+round, find the median YoY growth rate
 * across all colleges that have 2+ years of data. Weight peers by
 * how close their average rank is to our target college's rank.
 */
function getPeerBranchTrend(
  idx: DataIndex,
  targetCode: string,
  normCourse: string,
  category: string,
  round: string,
  targetYear: number
): { growthRate: number; peerCount: number } | null {
  const bcrk = branchCatRoundKey(normCourse, category, round)
  const codeMap = idx.byBranchCategoryRound.get(bcrk)
  if (!codeMap) return null

  // Get target college's average rank (if available) for weighting
  const targetData = codeMap.get(targetCode)
  const targetAvgRank = targetData
    ? [...targetData.values()].reduce((a, b) => a + b, 0) / targetData.size
    : null

  const growthRates: { rate: number; weight: number }[] = []

  for (const [code, yearMap] of codeMap) {
    if (code === targetCode) continue
    if (yearMap.size < 2) continue

    const sorted = [...yearMap.entries()].sort(([a], [b]) => a - b)

    // Compute YoY growth rates for this peer
    const peerRates: number[] = []
    for (let i = 1; i < sorted.length; i++) {
      const [, prevRank] = sorted[i - 1]
      const [prevYear, ] = sorted[i - 1]
      const [currYear, currRank] = sorted[i]

      // Normalize both to percentile space
      const prevPct = normalizeRankToPercentile(prevRank, prevYear)
      const currPct = normalizeRankToPercentile(currRank, currYear)

      if (prevPct > 1e-6) {
        peerRates.push(currPct / prevPct)
      }
    }

    if (peerRates.length === 0) continue

    const avgRate = peerRates.reduce((a, b) => a + b, 0) / peerRates.length
    const peerAvgRank = [...yearMap.values()].reduce((a, b) => a + b, 0) / yearMap.size

    // Weight: inverse of rank-distance (similar rank tier = more weight)
    let weight = 1.0
    if (targetAvgRank !== null && targetAvgRank > 0) {
      const rankDistance = Math.abs(Math.log(peerAvgRank / targetAvgRank))
      weight = 1.0 / (1.0 + rankDistance * 2)
    }

    // Extra weight for peers with more data years
    weight *= Math.sqrt(yearMap.size)

    growthRates.push({ rate: avgRate, weight })
  }

  if (growthRates.length < 2) return null

  // Weighted average of growth rates
  let sumW = 0, sumWR = 0
  for (const { rate, weight } of growthRates) {
    sumW += weight
    sumWR += weight * rate
  }

  const avgGrowth = sumW > 0 ? sumWR / sumW : 1.0

  return { growthRate: avgGrowth, peerCount: growthRates.length }
}

// ════════════════════════════════════════════════════════════════════
//  Layer 4: Same-College Cross-Branch Signal
// ════════════════════════════════════════════════════════════════════

/**
 * Check if other branches at the same college show a consistent YoY
 * trend. If so, return the median growth rate. This captures
 * college-level effects (e.g., new accreditation, infrastructure).
 */
function getCollegeTrend(
  idx: DataIndex,
  code: string,
  round: string,
  excludeNormCourse: string
): { growthRate: number; branchCount: number } | null {
  const crk = collegeRoundKey(code, round)
  const branchMap = idx.byCollegeRound.get(crk)
  if (!branchMap) return null

  const growthRates: number[] = []

  for (const [normCourse, yearMap] of branchMap) {
    if (normCourse === excludeNormCourse) continue
    if (yearMap.size < 2) continue

    const sorted = [...yearMap.entries()].sort(([a], [b]) => a - b)
    const rates: number[] = []

    for (let i = 1; i < sorted.length; i++) {
      const [prevYear, prevRank] = sorted[i - 1]
      const [currYear, currRank] = sorted[i]
      const prevPct = normalizeRankToPercentile(prevRank, prevYear)
      const currPct = normalizeRankToPercentile(currRank, currYear)
      if (prevPct > 1e-6) rates.push(currPct / prevPct)
    }

    if (rates.length > 0) {
      growthRates.push(rates.reduce((a, b) => a + b, 0) / rates.length)
    }
  }

  if (growthRates.length < 2) return null

  return { growthRate: medianOf(growthRates), branchCount: growthRates.length }
}

// ════════════════════════════════════════════════════════════════════
//  Layer 5: Round-Drift Model
// ════════════════════════════════════════════════════════════════════

/**
 * Get the median drift ratio when predicting one round from another.
 * E.g., if we have R1 data and need R2, multiply R1 prediction by
 * the median R2/R1 ratio for this branch+category.
 */
function getRoundDriftRatio(
  idx: DataIndex,
  normCourse: string,
  category: string,
  fromRound: string,
  toRound: string
): number | null {
  const bck = `${normCourse}|${category}`
  const entry = idx.roundDriftRatios.get(bck)
  if (!entry) return null

  // Determine which ratio to use
  if (fromRound === 'R1' && toRound === 'R2') {
    return entry.r1r2.length >= 3 ? medianOf(entry.r1r2) : null
  }
  if (fromRound === 'R2' && toRound === 'R3') {
    return entry.r2r3.length >= 3 ? medianOf(entry.r2r3) : null
  }
  if (fromRound === 'R1' && toRound === 'R3') {
    if (entry.r1r2.length >= 3 && entry.r2r3.length >= 3) {
      return medianOf(entry.r1r2) * medianOf(entry.r2r3)
    }
    return null
  }

  return null
}

// ════════════════════════════════════════════════════════════════════
//  Layer 6: Category Ratio Model
// ════════════════════════════════════════════════════════════════════

/**
 * For rare categories, compute the stable ratio of category cutoff
 * to GM cutoff for the same college+branch+round.
 * Returns the median ratio across years if stable enough.
 */
function getCategoryRatio(
  idx: DataIndex,
  code: string,
  normCourse: string,
  round: string,
  category: string
): { ratio: number; stability: number; dataPoints: number } | null {
  if (category === 'GM') return null // GM is the base — no ratio needed

  const cbrk = collegeBranchRoundKey(code, normCourse, round)
  const catMap = idx.byCollegeBranchRound.get(cbrk)
  if (!catMap) return null

  const gmData = catMap.get('GM')
  const catData = catMap.get(category)
  if (!gmData || !catData) return null

  // Compute ratio for each year where both GM and category data exist
  const ratios: number[] = []
  for (const [year, catRank] of catData) {
    const gmRank = gmData.get(year)
    if (gmRank && gmRank > 0) {
      ratios.push(catRank / gmRank)
    }
  }

  if (ratios.length === 0) return null

  const median = medianOf(ratios)

  // Stability: coefficient of variation (lower = more stable)
  const mean = ratios.reduce((a, b) => a + b, 0) / ratios.length
  const variance = ratios.reduce((sum, r) => sum + (r - mean) ** 2, 0) / ratios.length
  const cv = mean > 0 ? Math.sqrt(variance) / mean : 1

  return { ratio: median, stability: 1 - Math.min(cv, 1), dataPoints: ratios.length }
}

/**
 * Broadened category ratio: look across ALL colleges for the same
 * branch+round to get a global category ratio when per-college data
 * is insufficient.
 */
function getGlobalCategoryRatio(
  idx: DataIndex,
  normCourse: string,
  round: string,
  category: string
): { ratio: number; dataPoints: number } | null {
  if (category === 'GM') return null

  const ratios: number[] = []

  // Iterate all colleges that have both GM and this category for this branch+round
  for (const [key, catMap] of idx.byCollegeBranchRound) {
    const parts = key.split('|')
    if (parts[1] !== normCourse || parts[2] !== round) continue

    const gmData = catMap.get('GM')
    const catData = catMap.get(category)
    if (!gmData || !catData) continue

    for (const [year, catRank] of catData) {
      const gmRank = gmData.get(year)
      if (gmRank && gmRank > 0 && catRank > 0) {
        ratios.push(catRank / gmRank)
      }
    }
  }

  if (ratios.length < 3) return null

  return { ratio: medianOf(ratios), dataPoints: ratios.length }
}

// ════════════════════════════════════════════════════════════════════
//  Layer 7: Ensemble Prediction + Bayesian Confidence
// ════════════════════════════════════════════════════════════════════

interface PredictionSignal {
  name: string
  value: number     // predicted percentile
  weight: number    // how much to trust this signal
  dataPoints: number
}

/**
 * Combine multiple prediction signals with weighted averaging.
 * Returns the final predicted percentile and confidence interval.
 */
function ensemblePrediction(
  signals: PredictionSignal[],
  dataYears: number
): {
  predicted: number
  confidenceLow: number
  confidenceHigh: number
  confidenceLevel: 'high' | 'medium' | 'low'
  signalsUsed: string[]
} {
  if (signals.length === 0) {
    return { predicted: 0, confidenceLow: 0, confidenceHigh: 0, confidenceLevel: 'low', signalsUsed: [] }
  }

  // Normalize weights to sum to 1
  const totalWeight = signals.reduce((sum, s) => sum + s.weight, 0)
  if (totalWeight <= 0) {
    return { predicted: signals[0].value, confidenceLow: signals[0].value * 0.7, confidenceHigh: signals[0].value * 1.3, confidenceLevel: 'low', signalsUsed: [signals[0].name] }
  }

  // Weighted average
  let predicted = 0
  for (const s of signals) {
    predicted += (s.weight / totalWeight) * s.value
  }

  // Weighted variance (for confidence interval)
  let weightedVariance = 0
  for (const s of signals) {
    const diff = s.value - predicted
    weightedVariance += (s.weight / totalWeight) * diff * diff
  }
  const signalStd = Math.sqrt(weightedVariance)

  // Data availability penalty
  const dataPenalty = dataYears >= 3 ? 1.0 : dataYears === 2 ? 1.5 : 2.5

  // Minimum uncertainty: 5% of prediction
  const minUncertainty = predicted * 0.05

  const uncertainty = Math.max(signalStd * dataPenalty, minUncertainty)

  // Confidence level
  let confidenceLevel: 'high' | 'medium' | 'low'
  if (dataYears >= 3 && signals.length >= 2) {
    confidenceLevel = 'high'
  } else if (dataYears >= 2 || signals.length >= 3) {
    confidenceLevel = 'medium'
  } else {
    confidenceLevel = 'low'
  }

  return {
    predicted,
    confidenceLow: Math.max(0.000001, predicted - uncertainty),
    confidenceHigh: predicted + uncertainty,
    confidenceLevel,
    signalsUsed: signals.map(s => s.name)
  }
}

// ════════════════════════════════════════════════════════════════════
//  Public API
// ════════════════════════════════════════════════════════════════════

/**
 * Get all unique colleges from loaded data.
 */
export async function getAvailableColleges(): Promise<CollegeOption[]> {
  const idx = await ensureIndex()

  return Array.from(idx.collegeNames.entries())
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }))
}

/**
 * Get available branches for a specific college.
 */
export async function getAvailableBranches(collegeCode: string): Promise<BranchOption[]> {
  const idx = await ensureIndex()
  const codeUpper = collegeCode.trim().toUpperCase()

  const branches = new Map<string, string>()
  for (const rec of idx.all) {
    if (rec.code !== codeUpper) continue
    if (!branches.has(rec.normCourse)) {
      branches.set(rec.normCourse, rec.rawCourse)
    }
  }

  return Array.from(branches.entries())
    .map(([normalized, raw]) => ({ raw, normalized }))
    .sort((a, b) => a.normalized.localeCompare(b.normalized))
}

/**
 * Get available categories from loaded data.
 */
export async function getAvailableCategories(): Promise<string[]> {
  const idx = await ensureIndex()
  return [...new Set(idx.all.map(r => r.category))].sort()
}

/**
 * Get available rounds (normalized) from loaded data.
 */
export async function getAvailableRounds(): Promise<string[]> {
  const idx = await ensureIndex()
  const set = new Set<string>(idx.all.map(r => r.round))
  const order = ['MOCK', 'MOCK2', 'R1', 'R2', 'R3']
  return [...set].sort((a, b) => order.indexOf(a) - order.indexOf(b))
}

/**
 * ═══════════════════════════════════════════════════════════════
 *  CORE: Predict cutoff for a single college+branch+category+round
 * ═══════════════════════════════════════════════════════════════
 */
export async function predictCutoff(
  collegeCode: string,
  course: string,
  category: string,
  round: string,
  targetYear: number = 2026
): Promise<CutoffPrediction | null> {
  const idx = await ensureIndex()
  const codeUpper = collegeCode.trim().toUpperCase()
  const normRound = normalizeRound(round)
  const normCourse = normalizeCourseName(course)
  if (!normCourse) return null

  const collegeName = idx.collegeNames.get(codeUpper) || codeUpper
  const signals: PredictionSignal[] = []

  // ── Gather historical data points ──
  const ck = comboKey(codeUpper, normCourse, category, normRound)
  const yearMap = idx.byCombination.get(ck)

  const historical: { year: string; rank: number }[] = []
  const histYears: number[] = []
  const histRanks: number[] = []

  if (yearMap && yearMap.size > 0) {
    const sorted = [...yearMap.entries()].sort(([a], [b]) => a - b)
    for (const [year, rank] of sorted) {
      historical.push({ year: String(year), rank })
      histYears.push(year)
      histRanks.push(rank)
    }
  }

  const dataYears = historical.length

  // Determine the latest raw course name for display
  let latestRawCourse = course
  if (historical.length > 0) {
    for (const rec of idx.all) {
      if (rec.code === codeUpper && rec.normCourse === normCourse && rec.round === normRound && rec.category === category) {
        if (rec.year >= (histYears[histYears.length - 1] || 0)) {
          latestRawCourse = rec.rawCourse
        }
      }
    }
  }

  let participationAdjusted = false

  // ═══ Signal 1+2: Direct Log-Scale Regression ═══
  if (dataYears >= 1) {
    const reg = logScaleRegression(histYears, histRanks, targetYear)
    participationAdjusted = true

    signals.push({
      name: dataYears >= 3 ? 'Weighted Regression (3+ years)' : dataYears === 2 ? 'Regression (2 years)' : 'Single-Year Baseline',
      value: reg.predicted,
      weight: dataYears >= 3 ? ENSEMBLE_WEIGHTS.directRegression : dataYears === 2 ? ENSEMBLE_WEIGHTS.directRegression * 0.7 : ENSEMBLE_WEIGHTS.directRegression * 0.3,
      dataPoints: dataYears
    })
  }

  // ═══ Signal 3: Peer-College Transfer ═══
  const peerTrend = getPeerBranchTrend(idx, codeUpper, normCourse, category, normRound, targetYear)
  if (peerTrend && peerTrend.peerCount >= 3) {
    let basePercentile: number
    if (dataYears >= 1) {
      // Apply peer growth rate to our most recent year
      const latestYear = histYears[histYears.length - 1]
      const latestRank = histRanks[histRanks.length - 1]
      const latestPct = normalizeRankToPercentile(latestRank, latestYear)
      const yearsToProject = targetYear - latestYear
      basePercentile = latestPct * Math.pow(peerTrend.growthRate, yearsToProject)
    } else {
      // No direct data — can't apply peer trend without a base
      basePercentile = 0
    }

    if (basePercentile > 0) {
      signals.push({
        name: `Peer Transfer (${peerTrend.peerCount} colleges)`,
        value: basePercentile,
        weight: ENSEMBLE_WEIGHTS.peerTransfer,
        dataPoints: peerTrend.peerCount
      })
    }
  }

  // ═══ Signal 4: Cross-Branch College Signal ═══
  const collegeTrend = getCollegeTrend(idx, codeUpper, normRound, normCourse)
  if (collegeTrend && collegeTrend.branchCount >= 2 && dataYears >= 1) {
    const latestYear = histYears[histYears.length - 1]
    const latestRank = histRanks[histRanks.length - 1]
    const latestPct = normalizeRankToPercentile(latestRank, latestYear)
    const yearsToProject = targetYear - latestYear
    const projectedPct = latestPct * Math.pow(collegeTrend.growthRate, yearsToProject)

    if (projectedPct > 0) {
      signals.push({
        name: `College Signal (${collegeTrend.branchCount} branches)`,
        value: projectedPct,
        weight: ENSEMBLE_WEIGHTS.collegeTransfer,
        dataPoints: collegeTrend.branchCount
      })
    }
  }

  // ═══ Signal 6: Category Ratio Model ═══
  if (category !== 'GM') {
    // First try per-college ratio
    let catRatio = getCategoryRatio(idx, codeUpper, normCourse, normRound, category)

    // Fallback to global ratio
    if (!catRatio || catRatio.dataPoints < 2) {
      const globalRatio = getGlobalCategoryRatio(idx, normCourse, normRound, category)
      if (globalRatio) {
        catRatio = { ratio: globalRatio.ratio, stability: 0.5, dataPoints: globalRatio.dataPoints }
      }
    }

    if (catRatio) {
      // Predict GM first, then multiply
      const gmCk = comboKey(codeUpper, normCourse, 'GM', normRound)
      const gmYearMap = idx.byCombination.get(gmCk)
      if (gmYearMap && gmYearMap.size > 0) {
        const gmSorted = [...gmYearMap.entries()].sort(([a], [b]) => a - b)
        const gmYears = gmSorted.map(([y]) => y)
        const gmRanks = gmSorted.map(([, r]) => r)

        const gmReg = logScaleRegression(gmYears, gmRanks, targetYear)
        const gmPredictedPct = gmReg.predicted
        const catPredictedPct = gmPredictedPct * catRatio.ratio

        if (catPredictedPct > 0) {
          signals.push({
            name: `Category Ratio (${catRatio.dataPoints} data points, ${Math.round(catRatio.stability * 100)}% stable)`,
            value: catPredictedPct,
            weight: ENSEMBLE_WEIGHTS.categoryRatio * catRatio.stability,
            dataPoints: catRatio.dataPoints
          })
        }
      }
    }
  }

  // ═══ Signal 5: Round-Drift Model ═══
  // If predicting for a specific round but data is sparse, check if
  // we can predict from another round's data + drift ratio
  if (dataYears <= 1) {
    const roundOrder = ['R1', 'R2', 'R3']
    const targetRoundIdx = roundOrder.indexOf(normRound)

    for (const altRound of roundOrder) {
      if (altRound === normRound) continue

      const altCk = comboKey(codeUpper, normCourse, category, altRound)
      const altYearMap = idx.byCombination.get(altCk)
      if (!altYearMap || altYearMap.size < 2) continue

      const driftRatio = getRoundDriftRatio(idx, normCourse, category, altRound, normRound)
      if (!driftRatio) continue

      // Predict cutoff for the alt round, then apply drift
      const altSorted = [...altYearMap.entries()].sort(([a], [b]) => a - b)
      const altYears = altSorted.map(([y]) => y)
      const altRanks = altSorted.map(([, r]) => r)
      const altReg = logScaleRegression(altYears, altRanks, targetYear)

      const driftedPct = altReg.predicted * driftRatio

      if (driftedPct > 0) {
        signals.push({
          name: `Round Drift (${altRound}→${normRound})`,
          value: driftedPct,
          weight: ENSEMBLE_WEIGHTS.roundDrift,
          dataPoints: altYearMap.size
        })
        break // Use the best alt round only
      }
    }
  }

  // ═══ Ensemble all signals ═══
  if (signals.length === 0) return null

  const ensemble = ensemblePrediction(signals, dataYears)

  // Convert from percentile space back to raw rank
  const predictedRank = percentileToRank(ensemble.predicted, targetYear)
  const confLow = percentileToRank(ensemble.confidenceLow, targetYear)
  const confHigh = percentileToRank(ensemble.confidenceHigh, targetYear)

  // Ensure low ≤ predicted ≤ high (in rank terms, lower = better)
  const finalPredicted = Math.max(1, predictedRank)
  const finalLow = Math.max(1, Math.min(confLow, confHigh))
  const finalHigh = Math.max(confLow, confHigh)

  // ── Trend ──
  let trend: 'rising' | 'falling' | 'stable' = 'stable'
  let trendPct = 0

  if (dataYears >= 2) {
    const firstPct = normalizeRankToPercentile(histRanks[0], histYears[0])
    const lastPct = normalizeRankToPercentile(histRanks[dataYears - 1], histYears[dataYears - 1])
    const change = lastPct - firstPct
    trendPct = firstPct > 1e-6 ? Math.round((change / firstPct) * 100) : 0

    if (Math.abs(trendPct) <= 5) {
      trend = 'stable'
    } else if (change > 0) {
      trend = 'rising'   // percentile went up = cutoff rank rose = easier
    } else {
      trend = 'falling'  // percentile went down = cutoff rank dropped = harder
    }
  }

  // ── Backtest error (optional) ──
  let backtestErrorPct: number | undefined
  if (dataYears >= 3) {
    // Quick backtest: predict most recent year from older data
    const btYears = histYears.slice(0, -1)
    const btRanks = histRanks.slice(0, -1)
    const actualYear = histYears[histYears.length - 1]
    const actualRank = histRanks[histRanks.length - 1]

    const btReg = logScaleRegression(btYears, btRanks, actualYear)
    const btPredictedRank = percentileToRank(btReg.predicted, actualYear)

    if (actualRank > 0) {
      backtestErrorPct = Math.round(Math.abs(btPredictedRank - actualRank) / actualRank * 100)
    }
  }

  return {
    college_code: codeUpper,
    college_name: collegeName,
    course: latestRawCourse,
    normalized_course: normCourse,
    category,
    round: normRound,
    predicted_cutoff: finalPredicted,
    confidence_low: finalLow,
    confidence_high: finalHigh,
    trend,
    trend_pct: trendPct,
    historical,
    data_years: dataYears,
    confidence_level: ensemble.confidenceLevel,
    signals_used: ensemble.signalsUsed,
    backtest_error_pct: backtestErrorPct,
    participation_adjusted: participationAdjusted,
  }
}

/**
 * Predict cutoffs for ALL branches at a given college, for a specific
 * category + round.
 */
export async function predictMultiple(
  collegeCode: string,
  category: string,
  round: string,
  targetYear: number = 2026
): Promise<CutoffPrediction[]> {
  const idx = await ensureIndex()
  const normRound = normalizeRound(round)
  const codeUpper = collegeCode.trim().toUpperCase()

  // Find all distinct normalized courses at this college for this category + round
  const normalizedCourses = new Set<string>()
  for (const rec of idx.all) {
    if (rec.code !== codeUpper) continue
    if (rec.round !== normRound) continue
    if (rec.category !== category) continue
    normalizedCourses.add(rec.normCourse)
  }

  // Predict each one
  const predictions: CutoffPrediction[] = []
  for (const nc of normalizedCourses) {
    const prediction = await predictCutoff(codeUpper, nc, category, round, targetYear)
    if (prediction) predictions.push(prediction)
  }

  // Sort by predicted cutoff (tightest/best rank first)
  predictions.sort((a, b) => a.predicted_cutoff - b.predicted_cutoff)

  return predictions
}

/**
 * Predict cutoffs for a single branch across ALL categories at a
 * given college + round.
 */
export async function predictAcrossCategories(
  collegeCode: string,
  course: string,
  round: string,
  targetYear: number = 2026
): Promise<CutoffPrediction[]> {
  const idx = await ensureIndex()
  const normRound = normalizeRound(round)
  const codeUpper = collegeCode.trim().toUpperCase()
  const normCourse = normalizeCourseName(course)

  // Find all categories that have data for this college+branch+round
  const categories = new Set<string>()
  for (const rec of idx.all) {
    if (rec.code !== codeUpper) continue
    if (rec.normCourse !== normCourse) continue
    if (rec.round !== normRound) continue
    categories.add(rec.category)
  }

  const predictions: CutoffPrediction[] = []
  for (const cat of categories) {
    const p = await predictCutoff(codeUpper, course, cat, round, targetYear)
    if (p) predictions.push(p)
  }

  predictions.sort((a, b) => a.predicted_cutoff - b.predicted_cutoff)
  return predictions
}

/**
 * Predict cutoffs for a single branch across ALL rounds at a
 * given college + category.
 */
export async function predictAcrossRounds(
  collegeCode: string,
  course: string,
  category: string,
  targetYear: number = 2026
): Promise<CutoffPrediction[]> {
  const idx = await ensureIndex()
  const codeUpper = collegeCode.trim().toUpperCase()
  const normCourse = normalizeCourseName(course)

  const rounds = new Set<string>()
  for (const rec of idx.all) {
    if (rec.code !== codeUpper) continue
    if (rec.normCourse !== normCourse) continue
    if (rec.category !== category) continue
    rounds.add(rec.round)
  }

  const predictions: CutoffPrediction[] = []
  const roundOrder = ['MOCK', 'MOCK2', 'R1', 'R2', 'R3']
  for (const r of roundOrder) {
    if (!rounds.has(r)) continue
    const p = await predictCutoff(codeUpper, course, category, r, targetYear)
    if (p) predictions.push(p)
  }

  return predictions
}

/**
 * Check eligibility: given a user rank, categorize each prediction.
 */
export function checkEligibility(
  predictions: CutoffPrediction[],
  userRank: number
): (CutoffPrediction & { eligibility: 'high' | 'moderate' | 'borderline' | 'unlikely' })[] {
  return predictions.map(p => {
    let eligibility: 'high' | 'moderate' | 'borderline' | 'unlikely'

    if (userRank <= p.confidence_low) {
      eligibility = 'high'
    } else if (userRank <= p.predicted_cutoff) {
      eligibility = 'moderate'
    } else if (userRank <= p.confidence_high) {
      eligibility = 'borderline'
    } else {
      eligibility = 'unlikely'
    }

    return { ...p, eligibility }
  })
}

/**
 * Run a backtest: predict the most recent year's cutoffs using only
 * older data, and measure accuracy across all combos.
 */
export async function backtestAccuracy(): Promise<{
  totalCombos: number
  testedCombos: number
  medianErrorPct: number
  p90ErrorPct: number
  coverageRate: number    // % of actuals within confidence band
  sampleErrors: { combo: string; actual: number; predicted: number; errorPct: number }[]
}> {
  const idx = await ensureIndex()

  const errors: number[] = []
  const withinBand: number[] = []
  const sampleErrors: { combo: string; actual: number; predicted: number; errorPct: number }[] = []

  const latestYear = Math.max(...idx.years)

  for (const [ck, yearMap] of idx.byCombination) {
    if (yearMap.size < 2) continue
    if (!yearMap.has(latestYear)) continue

    const actualRank = yearMap.get(latestYear)!
    const olderYears = [...yearMap.entries()]
      .filter(([y]) => y < latestYear)
      .sort(([a], [b]) => a - b)

    if (olderYears.length === 0) continue

    const btYears = olderYears.map(([y]) => y)
    const btRanks = olderYears.map(([, r]) => r)
    const reg = logScaleRegression(btYears, btRanks, latestYear)
    const predictedRank = percentileToRank(reg.predicted, latestYear)

    const errorPct = actualRank > 0 ? Math.abs(predictedRank - actualRank) / actualRank * 100 : 0
    errors.push(errorPct)

    // Check if actual is within a reasonable confidence band
    const uncertainty = Math.max(reg.residualStd * 1.5, reg.predicted * 0.05)
    const low = percentileToRank(Math.max(0, reg.predicted - uncertainty), latestYear)
    const high = percentileToRank(reg.predicted + uncertainty, latestYear)
    const inBand = actualRank >= Math.min(low, high) && actualRank <= Math.max(low, high)
    withinBand.push(inBand ? 1 : 0)

    if (sampleErrors.length < 10) {
      const parts = ck.split('|')
      sampleErrors.push({
        combo: `${parts[0]} | ${parts[1]} | ${parts[2]} | ${parts[3]}`,
        actual: actualRank,
        predicted: predictedRank,
        errorPct: Math.round(errorPct)
      })
    }
  }

  errors.sort((a, b) => a - b)
  const medianErrorPct = errors.length > 0 ? Math.round(medianOf(errors)) : 0
  const p90Idx = Math.floor(errors.length * 0.9)
  const p90ErrorPct = errors.length > 0 ? Math.round(errors[p90Idx] || errors[errors.length - 1]) : 0
  const coverageRate = withinBand.length > 0
    ? Math.round(withinBand.reduce((a, b) => a + b, 0) / withinBand.length * 100)
    : 0

  return {
    totalCombos: idx.byCombination.size,
    testedCombos: errors.length,
    medianErrorPct,
    p90ErrorPct,
    coverageRate,
    sampleErrors
  }
}
