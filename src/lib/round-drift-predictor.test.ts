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
})
