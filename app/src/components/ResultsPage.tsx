import { type SessionResult, type Subject } from '../types'
import { SUBJECT_META } from '../utils/scoring'
import { SubjectBadge } from './SubjectBadge'

interface ResultsPageProps {
  result: SessionResult
  onHome: () => void
  onRetry: () => void
}

export function ResultsPage({ result, onHome, onRetry }: ResultsPageProps) {
  const { totalScore, maxTotalScore, results, mode, durationSeconds } = result
  const pct = totalScore / maxTotalScore
  const passed = pct >= 0.5

  const bySubject = Object.keys(SUBJECT_META).reduce((acc, key) => {
    const subject = key as Subject
    const subjectResults = results.filter((r) => r.question.subject === subject)
    if (subjectResults.length === 0) return acc
    const score = subjectResults.reduce((s, r) => s + r.score, 0)
    const max = subjectResults.length * 5
    acc[subject] = { score, max, results: subjectResults }
    return acc
  }, {} as Record<Subject, { score: number; max: number; results: SessionResult['results'] }>)

  function formatDuration(s: number) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-lmu-blue text-white px-4 py-3 shadow">
        <div className="max-w-2xl mx-auto font-semibold">
          {mode === 'test' ? 'Testergebnis' : 'Übungsergebnis'}
        </div>
      </nav>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5">
        {/* Big score card */}
        <div className={`rounded-2xl p-6 text-white text-center shadow-lg ${passed ? 'bg-gradient-to-br from-green-500 to-green-700' : 'bg-gradient-to-br from-red-500 to-red-700'}`}>
          <div className="text-6xl mb-2">{passed ? '🎉' : '📚'}</div>
          <div className="text-5xl font-bold mb-1">{totalScore} / {maxTotalScore}</div>
          <div className="text-lg opacity-90">{(pct * 100).toFixed(1)}% erreicht</div>
          {mode === 'test' && (
            <div className={`mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${passed ? 'bg-white bg-opacity-20' : 'bg-white bg-opacity-20'}`}>
              {passed ? '✓ Bestanden (≥ 50%)' : '✗ Nicht bestanden (< 50%)'}
            </div>
          )}
          <div className="mt-2 text-sm opacity-75">Dauer: {formatDuration(durationSeconds)}</div>
        </div>

        {/* Scoring info */}
        {mode === 'test' && (
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-xs text-gray-500 leading-relaxed">
              <strong>Bestehensregel:</strong> Die Klausur gilt als bestanden bei (1) mindestens 50% der Gesamtpunktzahl <em>oder</em> (2) mindestens 40% und die Punktzahl unterschreitet den Erstversuch-Schnitt um nicht mehr als 10%.
            </p>
          </div>
        )}

        {/* Per-subject breakdown */}
        {Object.keys(bySubject).length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="px-5 py-4 border-b">
              <h3 className="font-semibold text-gray-800">Ergebnis je Themengebiet</h3>
            </div>
            <div className="divide-y">
              {(Object.entries(bySubject) as [Subject, typeof bySubject[Subject]][]).map(([subject, data]) => {
                const subPct = data.score / data.max
                return (
                  <div key={subject} className="px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <SubjectBadge subject={subject} />
                      <span className={`font-bold ${subPct >= 0.6 ? 'text-green-600' : subPct >= 0.4 ? 'text-yellow-600' : 'text-red-500'}`}>
                        {data.score} / {data.max}
                      </span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2">
                      <div
                        className={`rounded-full h-2 transition-all ${subPct >= 0.6 ? 'bg-green-500' : subPct >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${subPct * 100}%` }}
                      />
                    </div>
                    <div className="flex gap-3 mt-2">
                      {data.results.map((r, i) => (
                        <div
                          key={i}
                          title={`Frage ${i + 1}: ${r.score}/5 Punkte`}
                          className={`flex-1 h-1.5 rounded-full ${r.score === 5 ? 'bg-green-400' : r.score >= 3 ? 'bg-yellow-400' : r.score > 0 ? 'bg-orange-400' : 'bg-red-400'}`}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Question-by-question review */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h3 className="font-semibold text-gray-800">Fragen im Detail</h3>
          </div>
          <div className="divide-y max-h-96 overflow-y-auto">
            {results.map((r, idx) => (
              <div key={idx} className="px-5 py-3 flex items-start gap-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${r.score === 5 ? 'bg-green-500' : r.score >= 3 ? 'bg-yellow-500' : r.score > 0 ? 'bg-orange-500' : 'bg-red-500'}`}>
                  {r.score}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <SubjectBadge subject={r.question.subject} />
                    <span className="text-xs text-gray-400">#{idx + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700 truncate">{r.question.text}</p>
                  <div className="flex gap-1 mt-1">
                    {r.question.correctAnswers.map((correct, i) => {
                      const userSel = r.userAnswers[i]
                      const correct_mark = correct === userSel
                      return (
                        <span
                          key={i}
                          title={`Option ${String.fromCharCode(65 + i)}: ${correct ? 'korrekt' : 'falsch'}, du: ${userSel ? 'markiert' : 'nicht markiert'}`}
                          className={`w-5 h-5 rounded text-xs font-bold flex items-center justify-center ${correct_mark ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                      )
                    })}
                  </div>
                </div>
                <div className="text-xs text-gray-400 flex-shrink-0">/ 5</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 border-2 border-lmu-blue text-lmu-blue py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
          >
            Nochmal
          </button>
          <button
            onClick={onHome}
            className="flex-1 bg-lmu-blue text-white py-3 rounded-xl font-semibold hover:bg-lmu-light transition"
          >
            Startseite
          </button>
        </div>
      </main>
    </div>
  )
}
