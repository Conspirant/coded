import { describe, test, expect } from 'vitest'
import { predictKCETRank, getPercentile, calculatePercentile, getRankAnalysis, getCollegeSuggestions } from './rank-predictor'

// Test the rank prediction logic
describe('Rank Predictor Logic', () => {
  test('should calculate rank correctly for real data point', () => {
    // Real data point: KCET 71 + 86% boards = rank 69,918
    const result = predictKCETRank(71, 86)
    
    // Should be close to 69,918
    expect(result.medium).toBeCloseTo(69918, -3) // Within 1000
    expect(result.composite).toBeCloseTo(0.6 * (71/180*100) + 0.4 * 86, 1)
  })

  test('should calculate rank with adjusted weight correctly', () => {
    // Test case: KCET 140/180 (77.78%) + PUC 94% 
    const result = predictKCETRank(140, 94)
    
    expect(result.composite).toBeCloseTo(0.6 * (140/180*100) + 0.4 * 94, 1)
    expect(result.medium).toBeGreaterThan(0)
    expect(result.low).toBeLessThan(result.medium)
    expect(result.high).toBeGreaterThan(result.medium)
  })

  test('should handle edge cases', () => {
    // Perfect score
    const perfect = predictKCETRank(180, 100)
    expect(perfect.medium).toBe(1)
    
    // Minimum score
    const minimum = predictKCETRank(0, 0)
    expect(minimum.medium).toBeGreaterThan(180000)
  })

  test('should provide correct percentile analysis', () => {
    expect(getPercentile(95)).toBe('Top 1%')
    expect(getPercentile(90)).toBe('Top 5%')
    expect(getPercentile(80)).toBe('Top 15%')
    expect(getPercentile(70)).toBe('Below Average')
  })

  test('should calculate percentile correctly', () => {
    expect(calculatePercentile(1)).toBe('100.00')
    expect(calculatePercentile(312000)).toBe('0.00')
  })

  test('should provide rank analysis', () => {
    expect(getRankAnalysis(500)).toContain('Elite rank')
    expect(getRankAnalysis(3000)).toContain('Great rank')
    expect(getRankAnalysis(10000)).toContain('Solid rank')
  })

  test('should suggest colleges based on rank and category', () => {
    const generalCollege = getCollegeSuggestions(500, 'general')
    expect(generalCollege.name).toContain('MSRIT')
    
    const obcCollege = getCollegeSuggestions(2000, 'obc')
    expect(obcCollege.name).toContain('MSRIT')
  })
})

// Example usage demonstration
console.log('Example rank predictions:')
console.log('KCET 71 + PUC 86% (Real data):', predictKCETRank(71, 86))
console.log('KCET 140 + PUC 94%:', predictKCETRank(140, 94))
console.log('KCET 120 + PUC 80%:', predictKCETRank(120, 80))
console.log('KCET 90 + PUC 60%:', predictKCETRank(90, 60))
