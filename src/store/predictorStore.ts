type SafetyLevel = 'Eligible'

export interface PredictorMatch {
  institute: string
  institute_code: string
  course: string
  category: string
  cutoff_rank: number
  year: string
  round: string
  matchScore: number
  safetyLevel: SafetyLevel
}

interface PredictorState {
  userRank: number | null
  userCategory: string
  selectedYear: string
  selectedRound: string
  selectedInstitute: string
  selectedCourses: string[]
  locationFilter: string
  matches: PredictorMatch[]
}

type Listener = (state: PredictorState) => void

class PredictorStore {
  private state: PredictorState = {
    userRank: null,
    userCategory: '',
    selectedYear: '',
    selectedRound: '',
    selectedInstitute: '',
    selectedCourses: [],
    locationFilter: '',
    matches: [],
  }
  private listeners: Set<Listener> = new Set()

  getState(): PredictorState {
    return this.state
  }

  setState(partial: Partial<PredictorState>) {
    this.state = { ...this.state, ...partial }
    this.emit()
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private emit() {
    for (const l of this.listeners) l(this.state)
  }
}

export const predictorStore = new PredictorStore()



