import { useState, useMemo } from 'react'
import { loadHistory, clearHistory } from '../utils/history'
import { SUBJECT_META } from '../utils/scoring'
import type { Subject } from '../types'

interface DashboardProps {
  onBack: () => void
}

const MODE_LABEL: Record<string, string> = {
  practice: '📖 Üben',
  test: '⏱️ Test',
  custom: '🎛️ Custom',
}

function formatDate(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const dDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const hh = d.getHours().toString().padStart(2, '0')
  const mm = d.getMinutes().toString().padStart(2, '0')
  if (dDate.getTime() === today.getTime()) return `Heute, ${hh}:${mm}`
  if (dDate.getTime() === yesterday.getTime()) return `Gestern, ${hh}:${mm}`
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`
}

function formatDuration(sec: number): string {
  if (sec < 60) return `${sec}s`
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return s > 0 ? `${m}m ${s}s` : `${m} min`
}

function formatAvgTime(sec: number): string {
  if (sec <= 0) return '–'
  if (sec < 60) return `${sec}s`
  return `${Math.floor(sec / 60)}m ${sec % 60}s`
}

function ScoreBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="flex-1 bg-gray-100 rounded-full h-2.5">
      <div
        className={`${color} rounded-full h-2.5 transition-all duration-500`}
        style={{ width: `${Math.min(100, pct)}%` }}
      />
    </div>
  )
}

export function Dashboard({ onBack }: DashboardProps) {
  const [history, setHistory] = useState(() => loadHistory())
  const [confirmClear, setConfirmClear] = useState(false)

  const stats = useMemo(() => {
    const allResults = history.flatMap((s) => s.results)
    const totalQ = allResults.length
    const totalScore = allResults.reduce((s, r) => s + r.score, 0)
    const maxScore = allResults.reduce((s, r) => s + r.maxScore, 0)
    const timedResults = allResults.filter((r) => r.timeSeconds > 0)
    const avgTimeSec =
      timedResults.length > 0
        ? Math.round(timedResults.reduce((s, r) => s + r.timeSeconds, 0) / timedResults.length)
        : 0
    const pct = maxScore > 0 ? (totalScore / maxScore) * 100 : 0

    // By subject — only subjects with data, sorted by score desc
    const subjects = Object.keys(SUBJECT_META) as Subject[]
    const bySubject = subjects
      .map((id) => {
        const rs = allResults.filter((r) => r.question.subject === id)
        const s = rs.reduce((a, r) => a + r.score, 0)
        const m = rs.reduce((a, r) => a + r.maxScore, 0)
        return { id, count: rs.length, pct: m > 0 ? (s / m) * 100 : 0 }
      })
      .filter((s) => s.count > 0)
      .sort((a, b) => b.pct - a.pct)

    // By difficulty
    const diffs = ['easy', 'medium', 'hard'] as const
    const byDiff = diffs
      .map((d) => {
        const rs = allResults.filter((r) => r.question.difficulty === d)
        const s = rs.reduce((a, r) => a + r.score, 0)
        const m = rs.reduce((a, r) => a + r.maxScore, 0)
        return { diff: d, count: rs.length, pct: m > 0 ? (s / m) * 100 : 0 }
      })
      .filter((d) => d.count > 0)

    return { totalQ, pct, avgTimeSec, bySubject, byDiff }
  }, [history])

  function handleClear() {
    clearHistory()
    setHistory([])
    setConfirmClear(false)
  }

  const isEmpty = history.length === 0

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Nav */}
      <nav className="bg-lmu-blue text-white px-4 py-3 flex items-center gap-3 shadow sticky top-0 z-10">
        <button
          onClick={onBack}
          className="hover:bg-white hover:bg-opacity-20 p-1.5 rounded-lg transition"
        >
          ←
        </button>
        <span className="font-semibold flex-1">Mein Dashboard</span>
        {history.length > 0 && (
          <button
            onClick={() => setConfirmClear(true)}
            className="text-xs text-blue-200 hover:text-white transition px-2 py-1"
          >
            Verlauf löschen
          </button>
        )}
      </nav>

      {/* Confirm dialog */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-gray-800 mb-2">Verlauf löschen?</h3>
            <p className="text-sm text-gray-500 mb-5">
              Alle {history.length} gespeicherten Sessions werden unwiderruflich gelöscht.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmClear(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Abbrechen
              </button>
              <button
                onClick={handleClear}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 pb-10 space-y-4">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Noch keine Daten</h2>
            <p className="text-gray-400 text-sm max-w-xs">
              Starte eine Session — deine Statistiken erscheinen dann hier.
            </p>
          </div>
        ) : (
          <>
            {/* ── Overview stats ── */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                <div className="text-3xl font-bold text-lmu-blue tabular-nums">{history.length}</div>
                <div className="text-xs text-gray-400 mt-1">Sessions</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                <div className="text-3xl font-bold text-lmu-blue tabular-nums">{stats.totalQ}</div>
                <div className="text-xs text-gray-400 mt-1">Fragen beantwortet</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                <div
                  className={`text-3xl font-bold tabular-nums ${
                    stats.pct >= 50
                      ? 'text-green-600'
                      : stats.pct >= 35
                      ? 'text-yellow-600'
                      : 'text-red-500'
                  }`}
                >
                  {stats.pct.toFixed(0)}%
                </div>
                <div className="text-xs text-gray-400 mt-1">Ø Score</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                <div className="text-3xl font-bold text-lmu-blue tabular-nums">
                  {formatAvgTime(stats.avgTimeSec)}
                </div>
                <div className="text-xs text-gray-400 mt-1">Ø Zeit / Frage</div>
              </div>
            </div>

            {/* ── By Subject ── */}
            {stats.bySubject.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50">
                  <h3 className="font-semibold text-gray-700 text-sm">Nach Themengebiet</h3>
                </div>
                <div className="px-4 py-4 space-y-3">
                  {stats.bySubject.map(({ id, count, pct }) => {
                    const meta = SUBJECT_META[id]
                    const barColor =
                      pct >= 50 ? 'bg-green-500' : pct >= 35 ? 'bg-yellow-400' : 'bg-red-400'
                    const textColor =
                      pct >= 50 ? 'text-green-600' : pct >= 35 ? 'text-yellow-600' : 'text-red-500'
                    return (
                      <div key={id} className="flex items-center gap-3">
                        <div className="w-28 text-xs font-medium text-gray-600 truncate leading-tight">
                          {meta.label.split(' ')[0]}
                        </div>
                        <ScoreBar pct={pct} color={barColor} />
                        <div
                          className={`w-11 text-right text-sm font-bold tabular-nums ${textColor}`}
                        >
                          {pct.toFixed(0)}%
                        </div>
                        <div className="w-8 text-right text-xs text-gray-400 tabular-nums">
                          {count}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── By Difficulty ── */}
            {stats.byDiff.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50">
                  <h3 className="font-semibold text-gray-700 text-sm">Nach Schwierigkeit</h3>
                </div>
                <div className="px-4 py-4 space-y-3">
                  {stats.byDiff.map(({ diff, count, pct }) => {
                    const label = { easy: 'Leicht', medium: 'Mittel', hard: 'Schwer' }[diff]
                    const dotColor = {
                      easy: 'bg-green-400',
                      medium: 'bg-yellow-400',
                      hard: 'bg-red-400',
                    }[diff]
                    const barColor =
                      pct >= 50 ? 'bg-green-500' : pct >= 35 ? 'bg-yellow-400' : 'bg-red-400'
                    const textColor =
                      pct >= 50 ? 'text-green-600' : pct >= 35 ? 'text-yellow-600' : 'text-red-500'
                    return (
                      <div key={diff} className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 w-16">
                          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotColor}`} />
                          <span className="text-xs font-medium text-gray-600">{label}</span>
                        </div>
                        <ScoreBar pct={pct} color={barColor} />
                        <div
                          className={`w-11 text-right text-sm font-bold tabular-nums ${textColor}`}
                        >
                          {pct.toFixed(0)}%
                        </div>
                        <div className="w-8 text-right text-xs text-gray-400 tabular-nums">
                          {count}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Session History ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-semibold text-gray-700 text-sm">
                  Verlauf
                  <span className="ml-1.5 text-gray-400 font-normal">({history.length})</span>
                </h3>
              </div>
              <div className="divide-y divide-gray-50">
                {history.map((session) => {
                  const pct =
                    session.maxTotalScore > 0
                      ? (session.totalScore / session.maxTotalScore) * 100
                      : 0
                  const pctColor =
                    pct >= 50
                      ? 'text-green-600 bg-green-50'
                      : pct >= 35
                      ? 'text-yellow-600 bg-yellow-50'
                      : 'text-red-500 bg-red-50'
                  return (
                    <div key={session.id} className="px-4 py-3 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-gray-700">
                            {MODE_LABEL[session.mode] ?? session.mode}
                          </span>
                          <span className="text-xs text-gray-400">
                            {session.results.length} Fragen
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDate(session.timestamp)} · {formatDuration(session.durationSeconds)}
                        </div>
                      </div>
                      <div
                        className={`text-sm font-bold px-2.5 py-1 rounded-lg tabular-nums ${pctColor}`}
                      >
                        {pct.toFixed(0)}%
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-700 tabular-nums">
                          {session.totalScore}/{session.maxTotalScore}
                        </div>
                        <div className="text-xs text-gray-400">Punkte</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
