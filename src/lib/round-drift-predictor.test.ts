import { afterEach, describe, expect, it, vi } from 'vitest'
import { invalidateRoundDriftCache, predictR2R3 } from './round-drift-predictor'

const stableRoundFixture = [2023, 2024, 2025].flatMap(year => [
  { year: String(year), round: 'R1', institute_code: 'E001', course: 'CS Computers', category: 'GM', cutoff_rank: 100 },
  { year: String(year), round: 'R2', institute_code: 'E001', course: 'CS Computers', category: 'GM', cutoff_rank: 100 },
  { year: String(year), round: 'R3', institute_code: 'E001', course: 'CS Computers', category: 'GM', cutoff_rank: 100 },
]).concat([
  { year: '2026', round: 'R1', institute_code: 'E001', course: 'CS Computers', category: 'GM', cutoff_rank: 100 },
])

describe('round-drift-predictor', () => {
  afterEach(() => {
    invalidateRoundDriftCache()
    vi.unstubAllGlobals()
  })

  it('preserves a stable cutoff instead of fabricating a 2% increase', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ cutoffs: stableRoundFixture }),
    }))

    const prediction = await predictR2R3('E001', 'CS Computers', 'GM')

    expect(prediction).not.toBeNull()
    expect(prediction?.r2_predicted).toBe(100)
    expect(prediction?.r3_predicted).toBe(100)
  })

  it('provides a realistic R3 relaxation for small categories when R3 historical data is missing and R2 relaxed over R1', async () => {
    const missingR3Fixture = [2023, 2024, 2025].flatMap(year => [
      { year: String(year), round: 'R1', institute_code: 'E001', course: 'Mechanical Engineering', category: '3AR', cutoff_rank: 10000 },
      { year: String(year), round: 'R2', institute_code: 'E001', course: 'Mechanical Engineering', category: '3AR', cutoff_rank: 12000 },
      // Notice: No R3 data for 3AR
      // GM has R3 relaxation
      { year: String(year), round: 'R1', institute_code: 'E001', course: 'Mechanical Engineering', category: 'GM', cutoff_rank: 1000 },
      { year: String(year), round: 'R2', institute_code: 'E001', course: 'Mechanical Engineering', category: 'GM', cutoff_rank: 1200 },
      { year: String(year), round: 'R3', institute_code: 'E001', course: 'Mechanical Engineering', category: 'GM', cutoff_rank: 1260 },
    ]).concat([
      { year: '2026', round: 'R1', institute_code: 'E001', course: 'Mechanical Engineering', category: '3AR', cutoff_rank: 10000 },
      { year: '2026', round: 'R1', institute_code: 'E001', course: 'Mechanical Engineering', category: 'GM', cutoff_rank: 1000 },
    ])

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ cutoffs: missingR3Fixture }),
    }))

    const prediction = await predictR2R3('E001', 'Mechanical Engineering', '3AR')

    expect(prediction).not.toBeNull()
    expect(prediction?.r2_predicted).toBe(12000)
    expect(prediction?.r3_predicted).toBeGreaterThan(prediction!.r2_predicted)
  })
})

