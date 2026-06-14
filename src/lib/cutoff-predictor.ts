/**
 * KCET Cutoff Predictor Engine
 * 
 * Predicts future cutoff ranks for a specific college + branch + category
 * combination using weighted linear regression on 3 years of historical data.
 */

import { CutoffService, type CutoffData } from './cutoff-service'
import { normalizeCourseName } from './course-normalization'

// ────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────

export interface CutoffPrediction {
  college_code: string
  college_name: string
  course: string
  normalized_course: string
  category: string
  round: string
  predicted_cutoff: number        // median prediction
  confidence_low: number          // optimistic (higher rank = easier)
  confidence_high: number         // pessimistic (lower rank = harder)
  trend: 'rising' | 'falling' | 'stable'
  trend_pct: number               // year-over-year change %
  historical: { year: string; rank: number }[]
  data_years: number              // how many years of data exist
  confidence_level: 'high' | 'medium' | 'low'
}

export interface CollegeOption {
  code: string
  name: string
}

// ────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────

/** Normalize round labels to a canonical form */
const normalizeRound = (round: string): string => {
  const r = String(round || '').trim().toUpperCase()
  if (r === 'R1' || r === 'ROUND 1') return 'R1'
  if (r === 'R2' || r === 'ROUND 2') return 'R2'
  if (r === 'R3' || r === 'ROUND 3' || r === 'EXT' || r.includes('EXTENDED')) return 'R3'
  if (r === 'MOCK' || r.includes('MOCK')) return 'MOCK'
  return r
}

/**
 * Weighted linear regression.
 * Points closer to the end of the array (most recent) receive higher weight.
 * Returns { slope, intercept } for the line y = slope * x + intercept.
 */
function weightedLinearRegression(
  xs: number[],
  ys: number[],
  weights: number[]
): { slope: number; intercept: number } {
  const n = xs.length
  if (n === 0) return { slope: 0, intercept: 0 }
  if (n === 1) return { slope: 0, intercept: ys[0] }

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
  if (Math.abs(denom) < 1e-10) {
    return { slope: 0, intercept: sumWy / sumW }
  }

  const slope = (sumW * sumWxy - sumWx * sumWy) / denom
  const intercept = (sumWy - slope * sumWx) / sumW
  return { slope, intercept }
}

/**
 * Compute standard deviation of residuals (weighted).
 */
function residualStdDev(
  xs: number[],
  ys: number[],
  weights: number[],
  slope: number,
  intercept: number
): number {
  const n = xs.length
  if (n <= 1) return 0
  let sumW = 0, sumWResidualSq = 0
  for (let i = 0; i < n; i++) {
    const predicted = slope * xs[i] + intercept
    const residual = ys[i] - predicted
    sumW += weights[i]
    sumWResidualSq += weights[i] * residual * residual
  }
  return Math.sqrt(sumWResidualSq / sumW)
}

// ────────────────────────────────────────────────────────────────────
// Core Prediction Logic
// ────────────────────────────────────────────────────────────────────

/** Internal cache for loaded cutoffs */
let _cutoffsCache: CutoffData[] | null = null

async function ensureCutoffs(): Promise<CutoffData[]> {
  if (_cutoffsCache && _cutoffsCache.length > 0) return _cutoffsCache
  _cutoffsCache = await CutoffService.loadCutoffs()
  return _cutoffsCache
}

/**
 * Get all unique colleges from loaded data.
 */
export async function getAvailableColleges(): Promise<CollegeOption[]> {
  const cutoffs = await ensureCutoffs()
  const map = new Map<string, string>()
  
  cutoffs.forEach(c => {
    const code = (c.institute_code || '').trim().toUpperCase()
    if (!code) return
    const name = (c.college_name || c.institute_code || '').trim()
    // Keep the longest / best name per code
    const existing = map.get(code) || ''
    if (name.length > existing.length) {
      map.set(code, name)
    }
  })

  return Array.from(map.entries())
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }))
}

/**
 * Get available categories from loaded data.
 */
export async function getAvailableCategories(): Promise<string[]> {
  const cutoffs = await ensureCutoffs()
  return [...new Set(cutoffs.map(c => c.category))].sort()
}

/**
 * Get available rounds (normalized) from loaded data.
 */
export async function getAvailableRounds(): Promise<string[]> {
  const cutoffs = await ensureCutoffs()
  const set = new Set<string>()
  cutoffs.forEach(c => set.add(normalizeRound(c.round)))
  const order = ['MOCK', 'R1', 'R2', 'R3']
  return [...set].sort((a, b) => order.indexOf(a) - order.indexOf(b))
}

/**
 * Predict the cutoff for a single college + course + category + round.
 */
export async function predictCutoff(
  collegeCode: string,
  course: string,
  category: string,
  round: string,
  targetYear: number = 2026
): Promise<CutoffPrediction | null> {
  const cutoffs = await ensureCutoffs()
  const normRound = normalizeRound(round)
  const codeUpper = collegeCode.trim().toUpperCase()

  // Gather historical data points for this combo
  const historicalMap = new Map<string, number>()
  let collegeName = codeUpper
  const targetNormalized = normalizeCourseName(course)
  let latestRawCourse = ""
  let latestRawCourseYear = 0

  cutoffs.forEach(c => {
    const code = (c.institute_code || '').trim().toUpperCase()
    if (code !== codeUpper) return
    if (normalizeRound(c.round) !== normRound) return
    if (c.category !== category) return
    if (normalizeCourseName(c.course) !== targetNormalized) return
    if (c.cutoff_rank <= 0) return

    const year = String(c.year)
    // If multiple entries for same year, keep the latest (highest cutoff rank = more relaxed)
    const existing = historicalMap.get(year) || 0
    if (c.cutoff_rank > existing) {
      historicalMap.set(year, c.cutoff_rank)
    }

    if (c.college_name && c.college_name.length > collegeName.length) {
      collegeName = c.college_name
    }

    const yearNum = parseInt(c.year) || 0
    if (yearNum >= latestRawCourseYear) {
      latestRawCourseYear = yearNum
      latestRawCourse = c.course
    }
  })

  if (historicalMap.size === 0) return null

  const finalCourse = latestRawCourse || course
  const normalizedCourse = targetNormalized

  // Sort by year
  const historical = Array.from(historicalMap.entries())
    .map(([year, rank]) => ({ year, rank }))
    .sort((a, b) => a.year.localeCompare(b.year))

  const dataYears = historical.length

  // ── Prediction ──
  let predictedCutoff: number
  let stdDev: number = 0

  if (dataYears === 1) {
    // Only 1 year: use that value with a small drift
    predictedCutoff = Math.round(historical[0].rank * 1.02) // slight inflation
    stdDev = historical[0].rank * 0.15 // 15% uncertainty
  } else if (dataYears === 2) {
    // 2 years: simple weighted average (recent year weighted 60%)
    const [older, newer] = historical
    predictedCutoff = Math.round(older.rank * 0.4 + newer.rank * 0.6)
    const delta = Math.abs(newer.rank - older.rank)
    // Project the trend forward
    const trendDirection = newer.rank - older.rank
    predictedCutoff = Math.round(predictedCutoff + trendDirection * 0.3)
    stdDev = delta * 0.5
  } else {
    // 3+ years: weighted linear regression
    const xs = historical.map(h => parseInt(h.year))
    const ys = historical.map(h => h.rank)
    // Exponentially increasing weights: 1, 2, 4, 8, ...
    const weights = historical.map((_, i) => Math.pow(2, i))

    const { slope, intercept } = weightedLinearRegression(xs, ys, weights)
    stdDev = residualStdDev(xs, ys, weights, slope, intercept)

    predictedCutoff = Math.round(slope * targetYear + intercept)

    // Minimum stdDev = 5% of prediction
    stdDev = Math.max(stdDev, predictedCutoff * 0.05)
  }

  // Ensure prediction is positive
  predictedCutoff = Math.max(1, predictedCutoff)

  // ── Confidence band ──
  const confidenceMultiplier = dataYears >= 3 ? 1.0 : dataYears === 2 ? 1.5 : 2.0
  const band = Math.round(stdDev * confidenceMultiplier)
  const confidenceLow = Math.max(1, predictedCutoff - band)  // better rank (optimistic)
  const confidenceHigh = predictedCutoff + band                // worse rank (pessimistic)

  // ── Trend ──
  let trend: 'rising' | 'falling' | 'stable' = 'stable'
  let trendPct = 0

  if (dataYears >= 2) {
    const first = historical[0].rank
    const last = historical[dataYears - 1].rank
    const change = last - first
    trendPct = first > 0 ? Math.round((change / first) * 100) : 0

    if (Math.abs(trendPct) <= 5) {
      trend = 'stable'
    } else if (change > 0) {
      trend = 'rising'   // cutoff rank went up = easier to get in
    } else {
      trend = 'falling'  // cutoff rank went down = harder to get in
    }
  }

  // ── Confidence level ──
  let confidenceLevel: 'high' | 'medium' | 'low' = 'low'
  if (dataYears >= 3) confidenceLevel = 'high'
  else if (dataYears === 2) confidenceLevel = 'medium'

  return {
    college_code: codeUpper,
    college_name: collegeName,
    course: finalCourse,
    normalized_course: normalizedCourse,
    category,
    round: normRound,
    predicted_cutoff: predictedCutoff,
    confidence_low: confidenceLow,
    confidence_high: confidenceHigh,
    trend,
    trend_pct: trendPct,
    historical,
    data_years: dataYears,
    confidence_level: confidenceLevel,
  }
}

/**
 * Predict cutoffs for ALL branches at a given college, for a specific category + round.
 */
export async function predictMultiple(
  collegeCode: string,
  category: string,
  round: string,
  targetYear: number = 2026
): Promise<CutoffPrediction[]> {
  const cutoffs = await ensureCutoffs()
  const normRound = normalizeRound(round)
  const codeUpper = collegeCode.trim().toUpperCase()

  // Find all distinct normalized courses at this college for this category + round
  const normalizedCourses = new Set<string>()
  cutoffs.forEach(c => {
    const code = (c.institute_code || '').trim().toUpperCase()
    if (code !== codeUpper) return
    if (normalizeRound(c.round) !== normRound) return
    if (c.category !== category) return
    if (c.cutoff_rank <= 0) return
    normalizedCourses.add(normalizeCourseName(c.course))
  })

  // Predict each one
  const predictions: CutoffPrediction[] = []
  for (const normCourse of normalizedCourses) {
    const prediction = await predictCutoff(codeUpper, normCourse, category, round, targetYear)
    if (prediction) {
      predictions.push(prediction)
    }
  }

  // Sort by predicted cutoff (tightest/best rank first)
  predictions.sort((a, b) => a.predicted_cutoff - b.predicted_cutoff)

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
