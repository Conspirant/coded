import { describe, test, expect } from 'vitest'
import {
    simulateAllotment,
    checkEligibility,
    getAvailableRounds,
    getPreferenceSafetyLevel,
    type PreferenceOption,
    type CutoffData,
    type SimulationInput
} from './mock-simulator'

// Mock preference data
const createPreference = (
    id: string,
    collegeCode: string,
    branchCode: string,
    collegeName: string,
    branchName: string,
    priority: number
): PreferenceOption => ({
    id,
    collegeCode,
    branchCode,
    collegeName,
    branchName,
    priority
})

// Mock cutoff data
const mockCutoffs: CutoffData[] = [
    // RVCE - Computer Science
    { institute: 'R V College of Engineering', institute_code: 'E001', course: 'Computer Science And Engineering', category: 'GM', cutoff_rank: 500, year: '2024', round: 'Round 1' },
    { institute: 'R V College of Engineering', institute_code: 'E001', course: 'Computer Science And Engineering', category: 'GM', cutoff_rank: 600, year: '2024', round: 'Round 2' },
    { institute: 'R V College of Engineering', institute_code: 'E001', course: 'Computer Science And Engineering', category: 'GM', cutoff_rank: 700, year: '2024', round: 'Round 3' },

    // MSRIT - Computer Science
    { institute: 'M S Ramaiah Institute of Technology', institute_code: 'E002', course: 'Computer Science And Engineering', category: 'GM', cutoff_rank: 1500, year: '2024', round: 'Round 1' },
    { institute: 'M S Ramaiah Institute of Technology', institute_code: 'E002', course: 'Computer Science And Engineering', category: 'GM', cutoff_rank: 1800, year: '2024', round: 'Round 2' },
    { institute: 'M S Ramaiah Institute of Technology', institute_code: 'E002', course: 'Computer Science And Engineering', category: 'GM', cutoff_rank: 2000, year: '2024', round: 'Round 3' },

    // BMS - Computer Science
    { institute: 'B M S College of Engineering', institute_code: 'E003', course: 'Computer Science And Engineering', category: 'GM', cutoff_rank: 3000, year: '2024', round: 'Round 1' },
    { institute: 'B M S College of Engineering', institute_code: 'E003', course: 'Computer Science And Engineering', category: 'GM', cutoff_rank: 3500, year: '2024', round: 'Round 2' },
    { institute: 'B M S College of Engineering', institute_code: 'E003', course: 'Computer Science And Engineering', category: 'GM', cutoff_rank: 4000, year: '2024', round: 'Round 3' },

    // Category-specific cutoffs
    { institute: 'R V College of Engineering', institute_code: 'E001', course: 'Computer Science And Engineering', category: '2A', cutoff_rank: 2000, year: '2024', round: 'Round 1' },
    { institute: 'M S Ramaiah Institute of Technology', institute_code: 'E002', course: 'Computer Science And Engineering', category: '2A', cutoff_rank: 5000, year: '2024', round: 'Round 1' },
]

describe('Mock Simulator - Core Logic', () => {
    test('should find all rounds for a year', () => {
        const rounds = getAvailableRounds(mockCutoffs, '2024')
        expect(rounds).toContain('Round 1')
        expect(rounds).toContain('Round 2')
        expect(rounds).toContain('Round 3')
        expect(rounds.length).toBe(3)
    })

    test('should return empty array for non-existent year', () => {
        const rounds = getAvailableRounds(mockCutoffs, '2020')
        expect(rounds).toEqual([])
    })
})

describe('Mock Simulator - Eligibility Check', () => {
    test('should mark as eligible when user rank is better than cutoff', () => {
        const preference = createPreference('1', 'E002', 'CS', 'M S Ramaiah Institute of Technology', 'Computer Science', 1)
        const roundCutoffs = mockCutoffs.filter(c => c.round === 'Round 1' && c.category === 'GM')

        // Rank 1000 should be eligible for MSRIT (cutoff 1500)
        const result = checkEligibility(1000, preference, 1, roundCutoffs)
        expect(result.isEligible).toBe(true)
        expect(result.cutoffRank).toBe(1500)
    })

    test('should mark as not eligible when user rank is worse than cutoff', () => {
        const preference = createPreference('1', 'E001', 'CS', 'R V College of Engineering', 'Computer Science', 1)
        const roundCutoffs = mockCutoffs.filter(c => c.round === 'Round 1' && c.category === 'GM')

        // Rank 1000 should NOT be eligible for RVCE (cutoff 500)
        const result = checkEligibility(1000, preference, 1, roundCutoffs)
        expect(result.isEligible).toBe(false)
        expect(result.cutoffRank).toBe(500)
    })

    test('should handle preference with no matching cutoff', () => {
        const preference = createPreference('1', 'E999', 'XX', 'Unknown College', 'Unknown Branch', 1)
        const roundCutoffs = mockCutoffs.filter(c => c.round === 'Round 1' && c.category === 'GM')

        const result = checkEligibility(1000, preference, 1, roundCutoffs)
        expect(result.isEligible).toBe(false)
        expect(result.cutoffRank).toBeNull()
        expect(result.reason).toContain('No cutoff data')
    })
})

describe('Mock Simulator - Full Simulation', () => {
    test('should allot first eligible preference', () => {
        const preferences = [
            createPreference('1', 'E001', 'CS', 'R V College of Engineering', 'Computer Science', 1),
            createPreference('2', 'E002', 'CS', 'M S Ramaiah Institute of Technology', 'Computer Science', 2),
            createPreference('3', 'E003', 'CS', 'B M S College of Engineering', 'Computer Science', 3),
        ]

        const input: SimulationInput = {
            userRank: 1000,
            category: 'GM',
            year: '2024',
            preferences
        }

        const result = simulateAllotment(input, mockCutoffs)

        // Rank 1000 should get MSRIT (cutoff 1500) as first eligible
        // RVCE (cutoff 500) is not eligible
        expect(result.roundResults[0].allottedCollege?.collegeCode).toBe('E002')
        expect(result.roundResults[0].allottedPreferenceNumber).toBe(2)
    })

    test('should return no allotment when no preferences are eligible', () => {
        const preferences = [
            createPreference('1', 'E001', 'CS', 'R V College of Engineering', 'Computer Science', 1),
        ]

        const input: SimulationInput = {
            userRank: 100000, // Very high rank, not eligible for anything
            category: 'GM',
            year: '2024',
            preferences
        }

        const result = simulateAllotment(input, mockCutoffs)

        expect(result.roundResults[0].allottedCollege).toBeNull()
        expect(result.summary.bestOutcome).toBeNull()
    })

    test('should show round-wise variation in allotments', () => {
        const preferences = [
            createPreference('1', 'E001', 'CS', 'R V College of Engineering', 'Computer Science', 1),
            createPreference('2', 'E002', 'CS', 'M S Ramaiah Institute of Technology', 'Computer Science', 2),
        ]

        const input: SimulationInput = {
            userRank: 550, // Between RVCE Round 1 (500) and Round 2 (600)
            category: 'GM',
            year: '2024',
            preferences
        }

        const result = simulateAllotment(input, mockCutoffs)

        // Round 1: Rank 550 > cutoff 500, so NOT eligible for RVCE, eligible for MSRIT
        expect(result.roundResults[0].allottedCollege?.collegeCode).toBe('E002')

        // Round 2: Rank 550 < cutoff 600, so ELIGIBLE for RVCE
        expect(result.roundResults[1].allottedCollege?.collegeCode).toBe('E001')

        // Round 3: Same as Round 2
        expect(result.roundResults[2].allottedCollege?.collegeCode).toBe('E001')
    })

    test('should work with different categories', () => {
        const preferences = [
            createPreference('1', 'E001', 'CS', 'R V College of Engineering', 'Computer Science', 1),
            createPreference('2', 'E002', 'CS', 'M S Ramaiah Institute of Technology', 'Computer Science', 2),
        ]

        const input: SimulationInput = {
            userRank: 1500,
            category: '2A', // Different category with different cutoffs
            year: '2024',
            preferences
        }

        const result = simulateAllotment(input, mockCutoffs)

        // For 2A category: RVCE cutoff is 2000, MSRIT cutoff is 5000
        // Rank 1500 should get RVCE (cutoff 2000 > 1500)
        expect(result.roundResults[0].allottedCollege?.collegeCode).toBe('E001')
    })

    test('should generate correct summary', () => {
        const preferences = [
            createPreference('1', 'E001', 'CS', 'R V College of Engineering', 'Computer Science', 1),
            createPreference('2', 'E002', 'CS', 'M S Ramaiah Institute of Technology', 'Computer Science', 2),
        ]

        const input: SimulationInput = {
            userRank: 300, // Good rank, should get RVCE in all rounds
            category: 'GM',
            year: '2024',
            preferences
        }

        const result = simulateAllotment(input, mockCutoffs)

        expect(result.summary.bestOutcome?.preferenceNumber).toBe(1)
        expect(result.summary.totalRoundsWithAllotment).toBe(3)
        expect(result.summary.consistentAllotment).toBe(true)
    })
})

describe('Mock Simulator - Safety Level', () => {
    test('should return safe for good margin', () => {
        const preference = createPreference('1', 'E003', 'CS', 'B M S College of Engineering', 'Computer Science', 1)
        const level = getPreferenceSafetyLevel(1000, preference, mockCutoffs, '2024', 'GM')
        expect(level).toBe('safe') // Cutoff 3000 >> Rank 1000
    })

    test('should return risky for close margin', () => {
        const preference = createPreference('1', 'E003', 'CS', 'B M S College of Engineering', 'Computer Science', 1)
        const level = getPreferenceSafetyLevel(2900, preference, mockCutoffs, '2024', 'GM')
        expect(level).toBe('risky') // Cutoff 3000, Rank 2900 - very close
    })

    test('should return unknown for missing cutoff', () => {
        const preference = createPreference('1', 'E999', 'XX', 'Unknown College', 'Unknown Branch', 1)
        const level = getPreferenceSafetyLevel(1000, preference, mockCutoffs, '2024', 'GM')
        expect(level).toBe('unknown')
    })
})
