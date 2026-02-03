type SafetyLevel = 'Eligible'

export interface FinderMatch {
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

interface FinderState {
  userRank: number | null
  userCategory: string
  selectedYear: string
  selectedRound: string
  selectedInstitute: string
  selectedCourses: string[]
  locationFilter: string
  matches: FinderMatch[]
}

type Listener = (state: FinderState) => void

class FinderStore {
  private state: FinderState = {
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

  getState(): FinderState {
    return this.state
  }

  setState(partial: Partial<FinderState>) {
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

export const finderStore = new FinderStore()


