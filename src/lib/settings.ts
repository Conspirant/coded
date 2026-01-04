export type ThemeOption = 'system' | 'light' | 'dark'

export interface AppSettings {
  theme: ThemeOption
  compactMode: boolean
  reduceMotion: boolean
  dashboardFastMode: boolean
  showCourseCodes: boolean
  showInstituteCodes: boolean
  defaultYear: string | ''
  defaultRound: string | ''
  defaultCategory: string | ''
}

const STORAGE_KEY = 'kcet.settings.v1'

export const defaultSettings: AppSettings = {
  theme: 'dark',
  compactMode: false,
  reduceMotion: false,
  dashboardFastMode: true,
  showCourseCodes: true,
  showInstituteCodes: true,
  defaultYear: '',
  defaultRound: '',
  defaultCategory: ''
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultSettings }
    const parsed = JSON.parse(raw)
    return { ...defaultSettings, ...parsed }
  } catch {
    return { ...defaultSettings }
  }
}

export function saveSettings(s: AppSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  } catch { }
}

export function applyRuntimeSettings(s: AppSettings) {
  // Theme
  const root = document.documentElement
  const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const dark = s.theme === 'dark' || (s.theme === 'system' && systemDark)
  root.classList.toggle('dark', dark)

  // Compact density
  root.dataset.density = s.compactMode ? 'compact' : 'normal'

  // Reduced motion
  root.style.setProperty('--motion-scale', s.reduceMotion ? '0' : '1')
}


