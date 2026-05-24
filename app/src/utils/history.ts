import { type SessionResult } from '../types'

const KEY = 'lmu_history_v1'
const MAX = 200

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export function saveSession(result: SessionResult): void {
  const history = loadHistory()
  // Replace if same id, else prepend
  const idx = history.findIndex((h) => h.id === result.id)
  if (idx >= 0) history[idx] = result
  else history.unshift(result)
  if (history.length > MAX) history.splice(MAX)
  try {
    localStorage.setItem(KEY, JSON.stringify(history))
  } catch {
    // Storage full — drop oldest half
    history.splice(MAX / 2)
    localStorage.setItem(KEY, JSON.stringify(history))
  }
}

export function loadHistory(): SessionResult[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SessionResult[]
    // Back-compat: fill missing fields
    return parsed.map((s) => ({
      ...s,
      id: s.id ?? generateId(),
      timestamp: s.timestamp ?? 0,
      results: s.results.map((r) => ({ ...r, timeSeconds: r.timeSeconds ?? 0 })),
    }))
  } catch {
    return []
  }
}

export function clearHistory(): void {
  localStorage.removeItem(KEY)
}
