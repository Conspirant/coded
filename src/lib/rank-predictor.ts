// KCET 2025 Rank Analysis - Calibrated with real scraped data
// 2025 Calibrated Rank Table - EXACT data from scraped results
// Aggregate % (50% KCET + 50% Board) -> Rank mapping
const calibratedRankTable2025 = [
  { agg: 96.22, rank: 81 },
  { agg: 94.89, rank: 188 },
  { agg: 93.89, rank: 332 },
  { agg: 92.5, rank: 575 },
  { agg: 90.5, rank: 1106 },
  { agg: 88.89, rank: 1696 },
  { agg: 87.61, rank: 2236 },
  { agg: 86.5, rank: 2801 },
  { agg: 85, rank: 3804 },
  { agg: 84, rank: 4300 },
  { agg: 82.5, rank: 5891 },
  { agg: 80.61, rank: 7995 },
  { agg: 79, rank: 10251 },
  { agg: 78.28, rank: 11349 },
  { agg: 77, rank: 13445 },
  { agg: 75.5, rank: 16328 },
  { agg: 74, rank: 18500 },
  { agg: 72.56, rank: 22974 },
  { agg: 71, rank: 26500 },
  { agg: 70, rank: 29500 },
  { agg: 68, rank: 35000 },
  { agg: 66, rank: 41000 },
  { agg: 64, rank: 50000 },
  { agg: 62.6, rank: 70000 },
  { agg: 60, rank: 80000 },
  { agg: 50, rank: 150000 },
  { agg: 45, rank: 197000 },
  { agg: 40, rank: 235000 },
  { agg: 35, rank: 258000 },
  { agg: 30, rank: 280000 }
]

// Legacy exports for backward compatibility
export const kcet2025RankTable = calibratedRankTable2025.map(item => ({ score: item.agg, rank: item.rank }))
export const rankTable = kcet2025RankTable

// Rank gap analysis by aggregate band
export const rankGapAnalysis = [
  { range: "95-100%", rankRange: "1-200", candidatesPer1Percent: "20-30" },
  { range: "90-95%", rankRange: "200-1,200", candidatesPer1Percent: "200-300" },
  { range: "85-90%", rankRange: "1,200-3,000", candidatesPer1Percent: "350-400" },
  { range: "80-85%", rankRange: "3,000-8,000", candidatesPer1Percent: "1,000" },
  { range: "75-80%", rankRange: "8,000-16,000", candidatesPer1Percent: "1,500" },
  { range: "70-75%", rankRange: "16,000-30,000", candidatesPer1Percent: "2,800" },
  { range: "65-70%", rankRange: "25,000-50,000", candidatesPer1Percent: "5,000" },
  { range: "60-65%", rankRange: "50,000-80,000", candidatesPer1Percent: "6,000" },
  { range: "55-60%", rankRange: "70,000-80,000", candidatesPer1Percent: "2,000-3,000" },
  { range: "50-55%", rankRange: "80,000-1,55,000", candidatesPer1Percent: "15,000" },
  { range: "40-50%", rankRange: "1,55,000-2,35,000", candidatesPer1Percent: "8,000" },
  { range: "30-40%", rankRange: "2,35,000-2,59,000", candidatesPer1Percent: "10,000" }
]

// Cutoff estimates for 2025
export const cutoffEstimates2025 = [
  { targetRank: "Top 100", expectedAggregate: "96%+" },
  { targetRank: "Top 1,000", expectedAggregate: "92.5%+" },
  { targetRank: "Top 5,000", expectedAggregate: "84.5%+" },
  { targetRank: "Top 10,000", expectedAggregate: "79%+" },
  { targetRank: "Top 20,000", expectedAggregate: "74.5%+" },
  { targetRank: "Top 50,000", expectedAggregate: "65%+" },
  { targetRank: "Top 100,000", expectedAggregate: "57%+" }
]

// Historical trend data
export const trendData = {
  2022: [1, 150, 1200, 1800, 3500, 7000, 13000, 25000, 40000, 55000, 70000, 85000, 110000, 140000, 170000],
  2023: [1, 180, 1300, 1900, 3800, 7500, 14000, 28000, 43000, 58000, 72000, 88000, 115000, 150000, 180000],
  2024: [1, 200, 1500, 2000, 4000, 8000, 15000, 30000, 45000, 60000, 75000, 90000, 120000, 160000, 190000]
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

// Linear interpolation function - EXACT logic from the HTML file
function interpolateRank(agg: number): number {
  // If aggregate is higher than the highest in table, return top rank
  if (agg >= calibratedRankTable2025[0].agg) return 1
  // If aggregate is lower than the lowest in table, return bottom rank
  if (agg <= calibratedRankTable2025[calibratedRankTable2025.length - 1].agg) return 300000

  // Linear interpolation between data points
  for (let i = 0; i < calibratedRankTable2025.length - 1; i++) {
    if (agg <= calibratedRankTable2025[i].agg && agg > calibratedRankTable2025[i + 1].agg) {
      const ratio = (calibratedRankTable2025[i].agg - agg) /
        (calibratedRankTable2025[i].agg - calibratedRankTable2025[i + 1].agg)
      return Math.round(
        calibratedRankTable2025[i].rank +
        ratio * (calibratedRankTable2025[i + 1].rank - calibratedRankTable2025[i].rank)
      )
    }
  }

  return agg > calibratedRankTable2025[0].agg ? 1 : 300000
}

// KCET Rank Prediction using EXACT 2025 calibrated data with interpolation
// Formula: Aggregate % = ((KCET/180) * 100 + Board%) / 2
export const predictKCETRank = (cet: number, puc: number): RankPrediction => {
  // Calculate KCET percentage and aggregate (50% KCET + 50% Board)
  const kcetPct = (cet / 180) * 100
  const aggPct = (kcetPct + puc) / 2

  if (isNaN(aggPct) || cet < 0 || cet > 180 || puc < 0 || puc > 100) {
    throw new Error('Please enter valid marks (KCET: 0-180, PUC: 0-100%)')
  }

  // Get rank using linear interpolation (exact HTML logic)
  const predictedRank = interpolateRank(aggPct)

  // Variance range: -3000 to +5000 (category/competition variance)
  const low = Math.max(1, predictedRank - 3000)
  const high = Math.min(300000, predictedRank + 5000)

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

// Enhanced utility functions for KCET 2025 analysis

export const getRankBand = (rank: number): string => {
  if (rank <= 200) return 'Elite'
  if (rank <= 1200) return 'Excellent'
  if (rank <= 3000) return 'Very Good'
  if (rank <= 8000) return 'Good'
  if (rank <= 16000) return 'Above Average'
  if (rank <= 30000) return 'Average'
  if (rank <= 50000) return 'Below Average'
  if (rank <= 70000) return 'Lower Average' // Updated to include 69,918 range
  if (rank <= 80000) return 'Lower'
  if (rank <= 155000) return 'Poor'
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
  if (composite >= 95) return 'Top 1%'
  if (composite >= 90) return 'Top 5%'
  if (composite >= 80) return 'Top 15%'
  if (composite >= 70) return 'Top 30%'
  if (composite >= 60) return 'Top 50%'
  return 'Below Average'
}

export const calculatePercentile = (rank: number): string => {
  const totalCandidates = 260000 // Updated based on KCET 2025 data
  const percentile = ((totalCandidates - rank) / totalCandidates * 100).toFixed(2)
  return `${percentile}%`
}

export const getRankAnalysis = (rank: number): string => {
  if (rank <= 200) return 'Elite rank! Top colleges like RVCE, BMSCE, MSRIT are within reach.'
  if (rank <= 1200) return 'Excellent rank! Strong chances for premier engineering colleges.'
  if (rank <= 3000) return 'Very good rank! Good options for top-tier colleges.'
  if (rank <= 8000) return 'Good rank! Solid chances for reputed colleges.'
  if (rank <= 16000) return 'Above average rank. Consider various college options.'
  if (rank <= 30000) return 'Average rank. Explore multiple college choices.'
  if (rank <= 50000) return 'Below average rank. Consider all available options.'
  if (rank <= 70000) return 'Lower average rank. Focus on colleges with higher acceptance rates and consider regional colleges.'
  if (rank <= 80000) return 'Lower rank. Focus on colleges with higher acceptance rates.'
  if (rank <= 155000) return 'Poor rank. Consider alternative pathways and colleges.'
  return 'Very poor rank. Explore all possible options including diploma courses.'
}

// Get cutoff estimates for target ranks
export const getCutoffEstimates = () => {
  return cutoffEstimates2025
}

// Enhanced college suggestions based on KCET 2025 data
export const getCollegeSuggestions = (rank: number, category: string) => {
  const colleges = {
    general: [
      { rank: 200, name: 'RVCE, BMSCE, IISc', branch: 'CSE, ECE, EEE' },
      { rank: 1200, name: 'MSRIT, PESIT, BMSIT', branch: 'CSE, ECE, ISE' },
      { rank: 3000, name: 'SIT, NMIT, DSCE', branch: 'CSE, ECE, ME' },
      { rank: 8000, name: 'CIT, SJCE, UVCE', branch: 'All branches' },
      { rank: 16000, name: 'Regional colleges', branch: 'All branches' },
      { rank: 30000, name: 'Private colleges', branch: 'All branches' },
      { rank: 70000, name: 'Regional engineering colleges', branch: 'All branches' },
      { rank: 100000, name: 'Private engineering colleges', branch: 'All branches' }
    ],
    obc: [
      { rank: 300, name: 'RVCE, BMSCE', branch: 'CSE, ECE' },
      { rank: 1500, name: 'MSRIT, PESIT', branch: 'CSE, ECE' },
      { rank: 4000, name: 'SIT, NMIT', branch: 'CSE, ECE' },
      { rank: 10000, name: 'CIT, SJCE', branch: 'All branches' },
      { rank: 20000, name: 'Regional colleges', branch: 'All branches' },
      { rank: 40000, name: 'Private colleges', branch: 'All branches' },
      { rank: 80000, name: 'Regional engineering colleges', branch: 'All branches' },
      { rank: 120000, name: 'Private engineering colleges', branch: 'All branches' }
    ],
    sc: [
      { rank: 500, name: 'RVCE, BMSCE', branch: 'CSE, ECE' },
      { rank: 2000, name: 'MSRIT, PESIT', branch: 'CSE, ECE' },
      { rank: 6000, name: 'SIT, NMIT', branch: 'CSE, ECE' },
      { rank: 15000, name: 'CIT, SJCE', branch: 'All branches' },
      { rank: 30000, name: 'Regional colleges', branch: 'All branches' },
      { rank: 60000, name: 'Private colleges', branch: 'All branches' },
      { rank: 100000, name: 'Regional engineering colleges', branch: 'All branches' },
      { rank: 150000, name: 'Private engineering colleges', branch: 'All branches' }
    ],
    st: [
      { rank: 800, name: 'RVCE, BMSCE', branch: 'CSE, ECE' },
      { rank: 3000, name: 'MSRIT, PESIT', branch: 'CSE, ECE' },
      { rank: 8000, name: 'SIT, NMIT', branch: 'CSE, ECE' },
      { rank: 20000, name: 'CIT, SJCE', branch: 'All branches' },
      { rank: 40000, name: 'Regional colleges', branch: 'All branches' },
      { rank: 80000, name: 'Private colleges', branch: 'All branches' },
      { rank: 120000, name: 'Regional engineering colleges', branch: 'All branches' },
      { rank: 180000, name: 'Private engineering colleges', branch: 'All branches' }
    ]
  }
  const suggestions = colleges[category as keyof typeof colleges] || colleges.general
  return suggestions.find(s => rank <= s.rank) || { name: 'Other colleges', branch: 'All branches' }
}

/**
 * Get top college suggestions dynamically from actual cutoff data
 * @param rank User's predicted rank
 * @param category User's category
 * @param cutoutData Array of CutoffData objects
 * @param limit Number of suggestions to return (default 5)
 */
// Predict 2026 rank based on 2025 prediction with adjustment for expected competition increase
// Typically competition increases by ~3-5% year-over-year
export const predict2026Rank = (rank2025: number): number => {
  // 2026 prediction: slight rank shift due to expected higher competition
  // Lower ranks see higher absolute shift, top ranks stay similar
  let adjustmentFactor: number

  if (rank2025 <= 500) {
    // Top performers - minimal change
    adjustmentFactor = 1.02
  } else if (rank2025 <= 5000) {
    // High performers - small change
    adjustmentFactor = 1.03
  } else if (rank2025 <= 30000) {
    // Mid-range - moderate change
    adjustmentFactor = 1.04
  } else if (rank2025 <= 100000) {
    // Lower-mid range - slightly more change
    adjustmentFactor = 1.05
  } else {
    // Lower ranks - compression at bottom
    adjustmentFactor = 1.03
  }

  const predicted2026 = Math.round(rank2025 * adjustmentFactor)
  return Math.min(predicted2026, 270000) // Cap at estimated 2026 total candidates
}

export interface Rank2026Prediction extends RankPrediction {
  rank2025: number
  rank2026: number
  yearOverYearChange: number
}

// Enhanced prediction that returns both 2025 and 2026 ranks
export const predictKCETRankBothYears = (cet: number, puc: number): Rank2026Prediction => {
  const prediction2025 = predictKCETRank(cet, puc)
  const rank2026 = predict2026Rank(prediction2025.medium)

  return {
    ...prediction2025,
    rank2025: prediction2025.medium,
    rank2026,
    yearOverYearChange: Math.round(((rank2026 - prediction2025.medium) / prediction2025.medium) * 100)
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
