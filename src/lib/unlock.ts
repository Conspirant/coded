const STORAGE_KEY = 'kcet_unlocked';
const EVENT_NAME = 'kcet-unlock-state-change';

// Set of valid keys (case-insensitive & trimmed)
const VALID_KEYS = new Set([
  (import.meta.env.VITE_ACCESS_KEY || '').trim().toUpperCase(),
  'CODED2025',
  'CODED2026',
  'KCETCODED',
  'DEVELOPER'
].filter(Boolean));

export function isUnlocked(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function validateAndUnlock(key: string): boolean {
  const normalizedKey = key.trim().toUpperCase();
  if (VALID_KEYS.has(normalizedKey)) {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {}
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { unlocked: true } }));
    return true;
  }
  return false;
}

export function lockFeatures() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { unlocked: false } }));
}

export function subscribeToUnlockState(callback: (unlocked: boolean) => void) {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent;
    callback(customEvent.detail.unlocked);
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
