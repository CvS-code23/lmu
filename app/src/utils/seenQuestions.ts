const KEY = 'lmu_seen_v1'

export function getSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as string[])
  } catch {
    return new Set()
  }
}

export function markSeen(ids: string[]): void {
  if (ids.length === 0) return
  const seen = getSeenIds()
  for (const id of ids) seen.add(id)
  try {
    localStorage.setItem(KEY, JSON.stringify([...seen]))
  } catch {
    // storage full — ignore
  }
}

export function clearSeen(): void {
  localStorage.removeItem(KEY)
}
