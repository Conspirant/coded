// =============================================================================
// KCET 2027 Rank Predictor Engine
// Calibrated with 612 crowd-sourced KCET 2026 data points + 2025 baseline
// Source: KCET_2026_Calibration_Report (18).pdf
// Formula: Aggregate % = ((KCET/180) * 100 + Board PCM%) / 2  (50:50 weightage)
// =============================================================================

// KCET 2026 Calibrated Rank Table
// Blended: 70% from 612 verified 2026 crowd-sourced records + 30% from 2025 baseline
// Each point is the median rank at that aggregate level, cleaned for monotonicity
const calibratedRankTable2026 = [
  { agg: 98, rank: 1 },
  { agg: 97, rank: 148 },
  { agg: 96, rank: 246 },
  { agg: 95, rank: 481 },
  { agg: 94, rank: 556 },
  { agg: 93, rank: 648 },
  { agg: 92, rank: 1279 },
  { agg: 91, rank: 1766 },
  { agg: 90, rank: 2008 },
  { agg: 89, rank: 2393 },
  { agg: 88, rank: 2788 },
  { agg: 87, rank: 4090 },
  { agg: 86, rank: 4852 },
  { agg: 85, rank: 5472 },
  { agg: 84, rank: 6406 },
  { agg: 83, rank: 7262 },
  { agg: 82, rank: 9500 },
  { agg: 81, rank: 10250 },
  { agg: 80, rank: 11527 },
  { agg: 79, rank: 12722 },
  { agg: 78, rank: 13298 },
  { agg: 77, rank: 18621 },
  { agg: 76, rank: 19693 },
  { agg: 75, rank: 21468 },
  { agg: 74, rank: 24388 },
  { agg: 73, rank: 25429 },
  { agg: 72, rank: 31555 },
  { agg: 71, rank: 34947 },
  { agg: 70, rank: 37045 },
  { agg: 69, rank: 40955 },
  { agg: 68, rank: 44099 },
  { agg: 67, rank: 53287 },
  { agg: 66, rank: 60500 },
  { agg: 65, rank: 64413 },
  { agg: 64, rank: 67251 },
  { agg: 63, rank: 74796 },
  { agg: 62, rank: 86262 },
  { agg: 61, rank: 93785 },
  { agg: 60, rank: 101480 },
  { agg: 58, rank: 118049 },
  { agg: 55, rank: 143000 },
  { agg: 52, rank: 173953 },
  { agg: 45, rank: 230000 },
  { agg: 40, rank: 260000 },
  { agg: 35, rank: 285000 },
  { agg: 30, rank: 310000 }
]

// 2025 baseline table preserved for historical comparison and backward compat
const calibratedRankTable2025 = [
  { agg: 96.22, rank: 81 },
  { agg: 94.06, rank: 308 },
  { agg: 90.00, rank: 1245 },
  { agg: 85.00, rank: 3804 },
  { agg: 80.00, rank: 8500 },
  { agg: 75.00, rank: 16000 },
  { agg: 70.00, rank: 30000 },
  { agg: 65.00, rank: 50000 },
  { agg: 60.00, rank: 80000 },
  { agg: 50.00, rank: 155000 },
  { agg: 40.00, rank: 235000 },
  { agg: 35.00, rank: 259000 },
  { agg: 30.00, rank: 280000 }
]

// Legacy exports for backward compatibility (now 2026-based)
export const kcet2025RankTable = calibratedRankTable2025.map(item => ({ score: item.agg, rank: item.rank }))
export const kcet2026RankTable = calibratedRankTable2026.map(item => ({ score: item.agg, rank: item.rank }))
export const rankTable = kcet2026RankTable

// Rank gap analysis - updated from 612 KCET 2026 records
export const rankGapAnalysis = [
  { range: "95-100%", rankRange: "1-500", candidatesPer1Percent: "~100-150" },
  { range: "90-95%", rankRange: "500-2,000", candidatesPer1Percent: "~250-400" },
  { range: "85-90%", rankRange: "2,000-5,500", candidatesPer1Percent: "~500-800" },
  { range: "80-85%", rankRange: "5,500-11,500", candidatesPer1Percent: "~1,000-1,200" },
  { range: "75-80%", rankRange: "11,500-21,500", candidatesPer1Percent: "~1,500-2,000" },
  { range: "70-75%", rankRange: "21,500-37,000", candidatesPer1Percent: "~2,500-3,500" },
  { range: "65-70%", rankRange: "37,000-64,400", candidatesPer1Percent: "~4,000-5,500" },
  { range: "60-65%", rankRange: "64,400-1,01,500", candidatesPer1Percent: "~7,000-8,500" },
  { range: "55-60%", rankRange: "1,01,500-1,43,000", candidatesPer1Percent: "~8,000-9,000" },
  { range: "50-55%", rankRange: "1,43,000-1,74,000", candidatesPer1Percent: "~10,000" },
  { range: "40-50%", rankRange: "1,74,000-2,60,000", candidatesPer1Percent: "~8,500" },
  { range: "30-40%", rankRange: "2,60,000-3,10,000", candidatesPer1Percent: "~5,000" }
]

// Cutoff estimates for 2027 (projected from 2026 data with mild drift)
export const cutoffEstimates2027 = [
  { targetRank: "Top 150", expectedAggregate: "97%+" },
  { targetRank: "Top 500", expectedAggregate: "95%+" },
  { targetRank: "Top 1,500", expectedAggregate: "91.5%+" },
  { targetRank: "Top 3,000", expectedAggregate: "88%+" },
  { targetRank: "Top 5,500", expectedAggregate: "85%+" },
  { targetRank: "Top 10,000", expectedAggregate: "81%+" },
  { targetRank: "Top 20,000", expectedAggregate: "76%+" },
  { targetRank: "Top 35,000", expectedAggregate: "71%+" },
  { targetRank: "Top 65,000", expectedAggregate: "65%+" },
  { targetRank: "Top 1,00,000", expectedAggregate: "60%+" }
]

// Keep old name for backward compat
export const cutoffEstimates2025 = cutoffEstimates2027

// Historical trend data (updated with 2025 and 2026)
// Each array: ranks at aggregate levels [100%, 97%, 95%, 93%, 90%, 87%, 85%, 82%, 80%, 77%, 75%, 72%, 70%, 65%, 60%]
export const trendData = {
  2022: [1, 150, 1200, 1800, 3500, 7000, 13000, 25000, 40000, 55000, 70000, 85000, 110000, 140000, 170000],
  2023: [1, 180, 1300, 1900, 3800, 7500, 14000, 28000, 43000, 58000, 72000, 88000, 115000, 150000, 180000],
  2024: [1, 200, 1500, 2000, 4000, 8000, 15000, 30000, 45000, 60000, 75000, 90000, 120000, 160000, 190000],
  2025: [1, 81, 308, 500, 1245, 3804, 3804, 8500, 8500, 16000, 16000, 30000, 30000, 50000, 80000],
  2026: [1, 148, 481, 648, 2008, 4090, 5472, 9500, 11527, 18621, 21468, 31555, 37045, 64413, 101480]
}

export interface RankPrediction {
  low: number
  medium: number
  high: number
  composite: number
  kcetPct: number
  percentile?: string
  rankBand?: string
  competitionLevel?: string
}

export interface RankAnalysis {
  rankGap: string
  candidatesPerPercent: string
  competitionLevel: string
  improvementPotential: string
}

// Linear interpolation on the 2026 calibrated table (primary engine for 2027)
function interpolateRank(agg: number): number {
  const table = calibratedRankTable2026
  // If aggregate is higher than the highest in table, return top rank
  if (agg >= table[0].agg) return 1
  // If aggregate is lower than the lowest in table, return bottom rank
  if (agg <= table[table.length - 1].agg) return 312000

  // Linear interpolation between data points
  for (let i = 0; i < table.length - 1; i++) {
    if (agg <= table[i].agg && agg > table[i + 1].agg) {
      const ratio = (table[i].agg - agg) /
        (table[i].agg - table[i + 1].agg)
      return Math.round(
        table[i].rank +
        ratio * (table[i + 1].rank - table[i].rank)
      )
    }
  }

  return agg > table[0].agg ? 1 : 312000
}

// KCET 2027 Rank Prediction using 2026 calibrated data with interpolation
// Formula: Aggregate % = ((KCET/180) * 100 + Board PCM%) / 2
export const predictKCETRank = (cet: number, puc: number): RankPrediction => {
  // Calculate KCET percentage and aggregate (50% KCET + 50% Board)
  const kcetPct = (cet / 180) * 100
  const aggPct = (kcetPct + puc) / 2

  if (isNaN(aggPct) || cet < 0 || cet > 180 || puc < 0 || puc > 100) {
    throw new Error('Please enter valid marks (KCET: 0-180, PUC: 0-100%)')
  }

  // Get rank using linear interpolation on 2026 calibrated table
  const predictedRank = interpolateRank(aggPct)

  // Dynamic variance based on rank band (tighter at top, wider at bottom)
  let varianceLow: number
  let varianceHigh: number
  if (predictedRank <= 500) {
    varianceLow = 50; varianceHigh = 100
  } else if (predictedRank <= 2000) {
    varianceLow = 200; varianceHigh = 500
  } else if (predictedRank <= 10000) {
    varianceLow = 1000; varianceHigh = 2000
  } else if (predictedRank <= 50000) {
    varianceLow = 2000; varianceHigh = 4000
  } else if (predictedRank <= 100000) {
    varianceLow = 3000; varianceHigh = 5000
  } else {
    varianceLow = 5000; varianceHigh = 8000
  }

  const low = Math.max(1, predictedRank - varianceLow)
  const high = Math.min(312000, predictedRank + varianceHigh)

  return {
    low,
    medium: predictedRank,
    high,
    composite: aggPct,
    kcetPct,
    percentile: calculatePercentile(predictedRank),
    rankBand: getRankBand(predictedRank),
    competitionLevel: getCompetitionLevel(aggPct)
  }
}

// Rank band labels updated with 2026 data boundaries
export const getRankBand = (rank: number): string => {
  if (rank <= 250) return 'Elite'
  if (rank <= 650) return 'Outstanding'
  if (rank <= 2000) return 'Excellent'
  if (rank <= 5500) return 'Very Good'
  if (rank <= 11500) return 'Good'
  if (rank <= 21500) return 'Above Average'
  if (rank <= 37000) return 'Average'
  if (rank <= 64000) return 'Below Average'
  if (rank <= 87000) return 'Lower Average'
  if (rank <= 102000) return 'Lower'
  if (rank <= 175000) return 'Poor'
  return 'Very Poor'
}

export const getCompetitionLevel = (score: number): string => {
  if (score >= 95) return 'Extremely High'
  if (score >= 90) return 'Very High'
  if (score >= 85) return 'High'
  if (score >= 80) return 'Moderately High'
  if (score >= 75) return 'Moderate'
  if (score >= 70) return 'Moderately Low'
  if (score >= 60) return 'Low'
  return 'Very Low'
}

export const getRankGapAnalysis = (score: number): RankAnalysis => {
  const band = rankGapAnalysis.find(band => {
    const [min, max] = band.range.split('-').map(s => parseFloat(s.replace('%', '')))
    return score >= min && score <= max
  }) || rankGapAnalysis[rankGapAnalysis.length - 1]

  return {
    rankGap: band.rankRange,
    candidatesPerPercent: band.candidatesPer1Percent,
    competitionLevel: getCompetitionLevel(score),
    improvementPotential: score >= 80 ? 'Limited' : score >= 60 ? 'Moderate' : 'High'
  }
}

export const getPercentile = (composite: number): string => {
  if (composite >= 95) return 'Top 0.5%'
  if (composite >= 90) return 'Top 2%'
  if (composite >= 85) return 'Top 5%'
  if (composite >= 80) return 'Top 12%'
  if (composite >= 75) return 'Top 22%'
  if (composite >= 70) return 'Top 35%'
  if (composite >= 65) return 'Top 50%'
  if (composite >= 60) return 'Top 65%'
  return 'Below Average'
}

export const calculatePercentile = (rank: number): string => {
  const totalCandidates = 312000 // Updated from KCET 2026 data (3.12 lakh candidates)
  const percentile = ((totalCandidates - rank) / totalCandidates * 100).toFixed(2)
  return `${percentile}%`
}

export const getRankAnalysis = (rank: number): string => {
  if (rank <= 250) return 'Elite rank! Top colleges like RVCE, BMSCE, MSRIT are within reach for premium branches (CSE, ECE, AI/ML).'
  if (rank <= 650) return 'Outstanding rank! Strong chances for premier engineering colleges across top branches.'
  if (rank <= 2000) return 'Excellent rank! Very good options at top-tier colleges including PESIT, BMS, MSRIT.'
  if (rank <= 5500) return 'Very good rank! Good options for reputed colleges like SIT, NMIT, DSCE across most branches.'
  if (rank <= 11500) return 'Good rank! Solid chances for reputed colleges across multiple branches.'
  if (rank <= 21500) return 'Above average rank. Good options at regional and private colleges across various branches.'
  if (rank <= 37000) return 'Average rank. Explore multiple college choices across engineering disciplines.'
  if (rank <= 64000) return 'Below average rank. Consider private and regional engineering colleges.'
  if (rank <= 87000) return 'Lower average rank. Focus on colleges with higher acceptance rates and consider regional colleges.'
  if (rank <= 102000) return 'Lower rank. Focus on colleges with higher acceptance rates across all branches.'
  if (rank <= 175000) return 'Consider alternative pathways, diploma courses, or private universities.'
  return 'Very low rank. Explore all possible options including diploma courses and lateral entry paths.'
}

// Get cutoff estimates for target ranks
export const getCutoffEstimates = () => {
  return cutoffEstimates2027
}

// Enhanced college suggestions based on KCET 2026 data
export const getCollegeSuggestions = (rank: number, category: string) => {
  const colleges = {
    general: [
      { rank: 250, name: 'RVCE, BMSCE, IISc', branch: 'CSE, ECE, AI/ML' },
      { rank: 650, name: 'MSRIT, PESIT BSC', branch: 'CSE, ECE, ISE' },
      { rank: 2000, name: 'MSRIT, PESIT, BMSIT', branch: 'CSE, ECE, ISE' },
      { rank: 5500, name: 'SIT, NMIT, DSCE', branch: 'CSE, ECE, ME' },
      { rank: 11500, name: 'CIT, SJCE, UVCE', branch: 'All branches' },
      { rank: 21500, name: 'Regional engineering colleges', branch: 'All branches' },
      { rank: 37000, name: 'Private colleges', branch: 'All branches' },
      { rank: 64000, name: 'Regional engineering colleges', branch: 'All branches' },
      { rank: 102000, name: 'Private engineering colleges', branch: 'All branches' }
    ],
    obc: [
      { rank: 400, name: 'RVCE, BMSCE', branch: 'CSE, ECE' },
      { rank: 2500, name: 'MSRIT, PESIT', branch: 'CSE, ECE' },
      { rank: 7000, name: 'SIT, NMIT', branch: 'CSE, ECE' },
      { rank: 15000, name: 'CIT, SJCE', branch: 'All branches' },
      { rank: 28000, name: 'Regional colleges', branch: 'All branches' },
      { rank: 50000, name: 'Private colleges', branch: 'All branches' },
      { rank: 90000, name: 'Regional engineering colleges', branch: 'All branches' },
      { rank: 130000, name: 'Private engineering colleges', branch: 'All branches' }
    ],
    sc: [
      { rank: 700, name: 'RVCE, BMSCE', branch: 'CSE, ECE' },
      { rank: 3500, name: 'MSRIT, PESIT', branch: 'CSE, ECE' },
      { rank: 9000, name: 'SIT, NMIT', branch: 'CSE, ECE' },
      { rank: 20000, name: 'CIT, SJCE', branch: 'All branches' },
      { rank: 40000, name: 'Regional colleges', branch: 'All branches' },
      { rank: 75000, name: 'Private colleges', branch: 'All branches' },
      { rank: 120000, name: 'Regional engineering colleges', branch: 'All branches' },
      { rank: 170000, name: 'Private engineering colleges', branch: 'All branches' }
    ],
    st: [
      { rank: 1000, name: 'RVCE, BMSCE', branch: 'CSE, ECE' },
      { rank: 4500, name: 'MSRIT, PESIT', branch: 'CSE, ECE' },
      { rank: 12000, name: 'SIT, NMIT', branch: 'CSE, ECE' },
      { rank: 25000, name: 'CIT, SJCE', branch: 'All branches' },
      { rank: 50000, name: 'Regional colleges', branch: 'All branches' },
      { rank: 100000, name: 'Private colleges', branch: 'All branches' },
      { rank: 140000, name: 'Regional engineering colleges', branch: 'All branches' },
      { rank: 200000, name: 'Private engineering colleges', branch: 'All branches' }
    ]
  }
  const suggestions = colleges[category as keyof typeof colleges] || colleges.general
  return suggestions.find(s => rank <= s.rank) || { name: 'Other colleges', branch: 'All branches' }
}

// =============================================================================
// 2027 Projection Engine
// Uses 2026 calibrated rank as baseline and applies participation + difficulty
// drift coefficients derived from observed 2025 -> 2026 year-over-year shifts
// =============================================================================

/**
 * Predict 2027 rank from 2026 baseline using two calibrated terms:
 * 1) Participation drift - candidate volume increase (observed ~1.5-3% YoY)
 * 2) Difficulty normalization coefficient - paper toughness effect
 *
 * Drift coefficients computed from actual 2025->2026 observed data:
 *   Top ranks (agg>90%): 2026 rank ~1.6x of 2025 rank (more competition at top)
 *   Mid ranks (agg 75-90%): 2026 rank ~1.3x of 2025 rank
 *   Lower ranks (agg<75%): 2026 rank ~1.2x of 2025 rank
 *
 * For 2027 projection we apply a conservative 1.5-2.5% additional drift
 */
export const predict2027Rank = (rank2026: number): number => {
  // Participation & candidate density expansion calibrated from historical KCET data:
  // KCET candidate registration grew from ~2.59 lakh (2025) to ~3.12 lakh (2026) (+20.4%).
  // For 2027, projecting a standard +3% to +5% candidate growth and board score clustering.
  // This yields a slight algorithmic upward shift in rank for any given aggregate.
  let participationDrift: number

  if (rank2026 <= 500) {
    participationDrift = 1.018 // Top 500 ranks have strong stability (~1.8% expansion)
  } else if (rank2026 <= 2000) {
    participationDrift = 1.025
  } else if (rank2026 <= 10000) {
    participationDrift = 1.032
  } else if (rank2026 <= 40000) {
    participationDrift = 1.038
  } else if (rank2026 <= 100000) {
    participationDrift = 1.045
  } else {
    participationDrift = 1.040
  }

  // Difficulty normalization & board inflation damping (0.992 - 0.997)
  let difficultyNormCoeff: number
  if (rank2026 <= 1000) {
    difficultyNormCoeff = 0.995
  } else if (rank2026 <= 10000) {
    difficultyNormCoeff = 0.994
  } else if (rank2026 <= 50000) {
    difficultyNormCoeff = 0.995
  } else if (rank2026 <= 120000) {
    difficultyNormCoeff = 0.996
  } else {
    difficultyNormCoeff = 0.997
  }

  const adjustmentFactor = participationDrift * difficultyNormCoeff
  const predicted2027 = Math.round(rank2026 * adjustmentFactor)
  return Math.min(predicted2027, 325000) // Cap at estimated 2027 total candidates
}

// Keep old export name for backward compatibility
export const predict2026Rank = predict2027Rank

export interface Rank2027Prediction extends RankPrediction {
  rank2026: number
  rank2027: number
  yearOverYearChange: number
}

// Keep the old type name for backward compat
export type Rank2026Prediction = Rank2027Prediction

// Enhanced prediction that returns both 2026 and 2027 ranks
export const predictKCETRankBothYears = (cet: number, puc: number): Rank2027Prediction => {
  const prediction2026 = predictKCETRank(cet, puc)
  const rank2027 = predict2027Rank(prediction2026.medium)

  return {
    ...prediction2026,
    rank2026: prediction2026.medium,
    rank2027,
    // Keep backward-compat property names
    get rank2025() { return this.rank2026 },
    yearOverYearChange: Math.round(((rank2027 - prediction2026.medium) / prediction2026.medium) * 100)
  }
}

export const getTopCollegesForRank = (
  rank: number,
  category: string,
  cutoffData: any[],
  limit = 5
) => {
  if (!cutoffData || cutoffData.length === 0) return []

  // Filter for valid cutoffs within range (e.g. within 120% of rank or simply next available)
  // We want colleges where the user has a chance, so cutoff rank >= user rank
  const matches = cutoffData.filter(c =>
    c.category.toLowerCase() === category.toLowerCase() &&
    c.cutoff_rank >= rank &&
    c.cutoff_rank <= rank * 1.5 // Reasonable range
  )

  // Sort by cutoff rank (closest to user rank first, ascending)
  matches.sort((a, b) => a.cutoff_rank - b.cutoff_rank)

  // Remove duplicates (same college different course) if we just want college names
  const uniqueColleges = new Set()
  const result = []

  for (const m of matches) {
    if (!uniqueColleges.has(m.institute) && uniqueColleges.size < limit) {
      uniqueColleges.add(m.institute)
      result.push(m)
    }
  }

  return result
}
