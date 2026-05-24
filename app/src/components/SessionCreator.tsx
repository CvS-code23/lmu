import { useState, useMemo } from 'react'
import { questions as allQuestions } from '../data/questions'
import { type Question, type Subject } from '../types'
import { SUBJECT_META, pickRandom } from '../utils/scoring'

interface SubjectConfig {
  easy: number
  medium: number
  hard: number
}

export type SessionConfig = Record<Subject, SubjectConfig>

interface SessionCreatorProps {
  onStart: (selectedQuestions: Question[]) => void
  onBack: () => void
}

const SUBJECTS = Object.values(SUBJECT_META)

type Diff = 'easy' | 'medium' | 'hard'

const DIFF_LABEL: Record<Diff, string> = { easy: 'Leicht', medium: 'Mittel', hard: 'Schwer' }

const DIFF_NUM: Record<Diff, string> = {
  easy: 'text-green-700',
  medium: 'text-yellow-700',
  hard: 'text-red-700',
}
const DIFF_BTN: Record<Diff, string> = {
  easy: 'border-green-300 hover:bg-green-50 text-green-700',
  medium: 'border-yellow-300 hover:bg-yellow-50 text-yellow-700',
  hard: 'border-red-300 hover:bg-red-50 text-red-700',
}

function defaultConfig(): SessionConfig {
  const init = {} as SessionConfig
  for (const s of SUBJECTS) init[s.id] = { easy: 0, medium: 0, hard: 0 }
  return init
}

export function SessionCreator({ onStart, onBack }: SessionCreatorProps) {
  const [configs, setConfigs] = useState<SessionConfig>(defaultConfig)

  const availability = useMemo(() => {
    const out = {} as Record<Subject, Record<Diff, number>>
    for (const s of SUBJECTS) {
      const sq = allQuestions.filter((q) => q.subject === s.id)
      out[s.id] = {
        easy: sq.filter((q) => q.difficulty === 'easy').length,
        medium: sq.filter((q) => q.difficulty === 'medium').length,
        hard: sq.filter((q) => q.difficulty === 'hard').length,
      }
    }
    return out
  }, [])

  function adjust(subject: Subject, diff: Diff, delta: number) {
    setConfigs((prev) => {
      const max = availability[subject][diff]
      const next = Math.max(0, Math.min(max, prev[subject][diff] + delta))
      return { ...prev, [subject]: { ...prev[subject], [diff]: next } }
    })
  }

  function setExact(subject: Subject, diff: Diff, n: number) {
    setConfigs((prev) => {
      const max = availability[subject][diff]
      return { ...prev, [subject]: { ...prev[subject], [diff]: Math.min(n, max) } }
    })
  }

  function resetAll() {
    setConfigs(defaultConfig())
  }

  function applyPreset(easyN: number, medN: number, hardN: number) {
    setConfigs(() => {
      const next = {} as SessionConfig
      for (const s of SUBJECTS) {
        next[s.id] = {
          easy: Math.min(easyN, availability[s.id].easy),
          medium: Math.min(medN, availability[s.id].medium),
          hard: Math.min(hardN, availability[s.id].hard),
        }
      }
      return next
    })
  }

  const totalQuestions = Object.values(configs).reduce(
    (sum, c) => sum + c.easy + c.medium + c.hard,
    0,
  )

  function handleStart() {
    if (totalQuestions === 0) return
    const selected: Question[] = []
    for (const s of SUBJECTS) {
      const { easy, medium, hard } = configs[s.id]
      const pool = allQuestions.filter((q) => q.subject === s.id)
      if (easy > 0) selected.push(...pickRandom(pool.filter((q) => q.difficulty === 'easy'), easy))
      if (medium > 0) selected.push(...pickRandom(pool.filter((q) => q.difficulty === 'medium'), medium))
      if (hard > 0) selected.push(...pickRandom(pool.filter((q) => q.difficulty === 'hard'), hard))
    }
    // Shuffle so subjects are interleaved
    for (let i = selected.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[selected[i], selected[j]] = [selected[j], selected[i]]
    }
    onStart(selected)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-lmu-blue text-white px-4 py-3 flex items-center gap-3 shadow sticky top-0 z-10">
        <button onClick={onBack} className="hover:bg-white hover:bg-opacity-20 p-1.5 rounded-lg transition">
          ←
        </button>
        <span className="font-semibold flex-1">Session erstellen</span>
        <button onClick={resetAll} className="text-xs text-blue-200 hover:text-white transition px-2 py-1">
          Zurücksetzen
        </button>
      </nav>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 pb-36 space-y-3">
        {/* Presets */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs text-gray-400 self-center">Vorlagen:</span>
          {[
            { label: 'Klausur (2L·2M·1S)', e: 2, m: 2, h: 1 },
            { label: 'Nur Leicht (5)', e: 5, m: 0, h: 0 },
            { label: 'Nur Schwer (5)', e: 0, m: 0, h: 5 },
            { label: 'Gemischt (2·2·2)', e: 2, m: 2, h: 2 },
          ].map(({ label, e, m, h }) => (
            <button
              key={label}
              onClick={() => applyPreset(e, m, h)}
              className="text-xs px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-lmu-blue hover:text-lmu-blue transition"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Subject cards */}
        {SUBJECTS.map((meta) => {
          const cfg = configs[meta.id]
          const avail = availability[meta.id]
          const subjectTotal = cfg.easy + cfg.medium + cfg.hard
          const isActive = subjectTotal > 0

          return (
            <div
              key={meta.id}
              className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all ${
                isActive ? 'border-gray-200' : 'border-gray-100 opacity-70'
              }`}
            >
              {/* Header */}
              <div className={`px-4 py-3 flex items-center gap-2 border-b ${meta.bgColor}`}>
                <span className="text-base">{meta.language === 'en' ? '🇬🇧' : '🇩🇪'}</span>
                <span className={`font-bold text-sm flex-1 ${meta.color}`}>{meta.label}</span>
                {isActive && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${meta.bgColor} ${meta.color} ring-1 ${meta.borderColor}`}>
                    {subjectTotal} Fragen
                  </span>
                )}
              </div>

              {/* Per-difficulty rows */}
              <div className="px-4 py-3 space-y-2">
                {(['easy', 'medium', 'hard'] as Diff[]).map((diff) => {
                  const count = cfg[diff]
                  const max = avail[diff]
                  return (
                    <div key={diff} className="flex items-center gap-3">
                      {/* Label */}
                      <div className={`w-16 text-xs font-semibold ${DIFF_NUM[diff]}`}>
                        {DIFF_LABEL[diff]}
                        <span className="font-normal text-gray-400 ml-1">({max})</span>
                      </div>

                      {/* − */}
                      <button
                        onClick={() => adjust(meta.id, diff, -1)}
                        disabled={count === 0}
                        className={`w-7 h-7 rounded-full border flex items-center justify-center text-base font-bold transition disabled:opacity-20 disabled:cursor-not-allowed ${DIFF_BTN[diff]}`}
                      >
                        −
                      </button>

                      {/* Count */}
                      <div className={`w-8 text-center text-lg font-bold tabular-nums ${count > 0 ? DIFF_NUM[diff] : 'text-gray-300'}`}>
                        {count}
                      </div>

                      {/* + */}
                      <button
                        onClick={() => adjust(meta.id, diff, +1)}
                        disabled={count >= max}
                        className={`w-7 h-7 rounded-full border flex items-center justify-center text-base font-bold transition disabled:opacity-20 disabled:cursor-not-allowed ${DIFF_BTN[diff]}`}
                      >
                        +
                      </button>

                      {/* Quick chips */}
                      <div className="flex gap-1 ml-1">
                        {[0, 3, 6, 'Max'].map((n) => {
                          const val = n === 'Max' ? max : (n as number)
                          const active = count === val && (n !== 0 || count === 0)
                          return (
                            <button
                              key={n}
                              onClick={() => setExact(meta.id, diff, val)}
                              className={`px-2 py-0.5 rounded text-xs font-medium transition ${
                                active
                                  ? diff === 'easy' ? 'bg-green-500 text-white'
                                  : diff === 'medium' ? 'bg-yellow-500 text-white'
                                  : 'bg-red-500 text-white'
                                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}
                            >
                              {n}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </main>

      {/* Sticky start bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 px-4 pb-6 pt-3 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent">
        <div className="max-w-2xl mx-auto">
          <div className="bg-lmu-blue text-white rounded-2xl px-5 py-4 shadow-xl flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="font-bold text-lg leading-none mb-1">
                {totalQuestions} {totalQuestions === 1 ? 'Frage' : 'Fragen'}
              </div>
              {totalQuestions > 0 ? (
                <div className="text-blue-200 text-xs">
                  {SUBJECTS.filter((s) => {
                    const c = configs[s.id]
                    return c.easy + c.medium + c.hard > 0
                  }).map((s) => {
                    const c = configs[s.id]
                    const parts = []
                    if (c.easy > 0) parts.push(`${c.easy}L`)
                    if (c.medium > 0) parts.push(`${c.medium}M`)
                    if (c.hard > 0) parts.push(`${c.hard}S`)
                    return `${s.label.split(' ')[0]}: ${parts.join('·')}`
                  }).join(' / ')}
                </div>
              ) : (
                <div className="text-blue-300 text-xs">Keine Fragen ausgewählt</div>
              )}
            </div>
            <button
              onClick={handleStart}
              disabled={totalQuestions === 0}
              className="bg-lmu-gold text-lmu-blue font-bold px-6 py-2.5 rounded-xl hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              Starten →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
