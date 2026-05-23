import { useState, useMemo } from 'react'
import { questions } from '../data/questions'
import { type Subject, type SessionResult } from '../types'
import { SUBJECT_META, scoreQuestion, shuffleArray } from '../utils/scoring'
import { QuestionCard } from './QuestionCard'

interface PracticeModeProps {
  onFinish: (result: SessionResult) => void
  onBack: () => void
}

export function PracticeMode({ onFinish, onBack }: PracticeModeProps) {
  const [selectedSubjects, setSelectedSubjects] = useState<Set<Subject>>(new Set())
  const [started, setStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<boolean[]>([false, false, false, false, false])
  const [showResult, setShowResult] = useState(false)
  const [results, setResults] = useState<SessionResult['results']>([])
  const [startTime] = useState(Date.now())

  const filteredQuestions = useMemo(() => {
    const pool = selectedSubjects.size === 0
      ? questions
      : questions.filter((q) => selectedSubjects.has(q.subject))
    return shuffleArray(pool)
  }, [selectedSubjects])

  const currentQuestion = filteredQuestions[currentIndex]

  function toggleSubject(subject: Subject) {
    setSelectedSubjects((prev) => {
      const next = new Set(prev)
      if (next.has(subject)) next.delete(subject)
      else next.add(subject)
      return next
    })
  }

  function handleStart() {
    if (filteredQuestions.length === 0) return
    setStarted(true)
  }

  function handleToggle(i: number) {
    setUserAnswers((prev) => {
      const next = [...prev]
      next[i] = !next[i]
      return next
    })
  }

  function handleSubmit() {
    setShowResult(true)
    const result = scoreQuestion(currentQuestion, userAnswers)
    setResults((prev) => [...prev, result])
  }

  function handleNext() {
    if (currentIndex + 1 >= filteredQuestions.length) {
      const allResults = results
      const total = allResults.reduce((s, r) => s + r.score, 0)
      onFinish({
        mode: 'practice',
        results: allResults,
        totalScore: total,
        maxTotalScore: allResults.length * 5,
        durationSeconds: Math.round((Date.now() - startTime) / 1000),
      })
      return
    }
    setCurrentIndex((i) => i + 1)
    setUserAnswers([false, false, false, false, false])
    setShowResult(false)
  }

  const answeredCount = results.length
  const totalScore = results.reduce((s, r) => s + r.score, 0)
  const maxScore = answeredCount * 5

  // Subject selection screen
  if (!started) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <nav className="bg-lmu-blue text-white px-4 py-3 flex items-center gap-3 shadow">
          <button onClick={onBack} className="hover:bg-white hover:bg-opacity-20 rounded-lg p-1.5 transition">
            ← Zurück
          </button>
          <span className="font-semibold">Üben</span>
        </nav>
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
          <h2 className="text-2xl font-bold text-lmu-blue mb-2">Themengebiet wählen</h2>
          <p className="text-gray-500 text-sm mb-6">
            Wähle eines oder mehrere Themengebiete. Kein Gebiet = alle Fragen gemischt.
          </p>

          <div className="space-y-3 mb-8">
            {Object.values(SUBJECT_META).map((meta) => {
              const qCount = questions.filter((q) => q.subject === meta.id).length
              const selected = selectedSubjects.has(meta.id)
              return (
                <button
                  key={meta.id}
                  onClick={() => toggleSubject(meta.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all text-left ${
                    selected
                      ? `${meta.bgColor} ${meta.borderColor} shadow-sm`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{meta.language === 'en' ? '🇬🇧' : '🇩🇪'}</span>
                  <div className="flex-1">
                    <div className={`font-semibold ${selected ? meta.color : 'text-gray-700'}`}>{meta.label}</div>
                    <div className="text-xs text-gray-400">{qCount} Fragen · {meta.language === 'en' ? 'English' : 'Deutsch'}</div>
                  </div>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${selected ? `${meta.borderColor} bg-white` : 'border-gray-300'}`}>
                    {selected && <span className={`text-xs font-bold ${meta.color}`}>✓</span>}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="bg-blue-50 rounded-xl p-4 mb-6 text-sm text-blue-700">
            <strong>{selectedSubjects.size === 0 ? questions.length : filteredQuestions.length}</strong> Fragen verfügbar
            {selectedSubjects.size === 0 && ' (alle Themengebiete gemischt)'}
          </div>

          <button
            onClick={handleStart}
            disabled={filteredQuestions.length === 0}
            className="w-full bg-lmu-blue text-white py-4 rounded-xl font-semibold text-lg hover:bg-lmu-light transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Üben starten
          </button>
        </main>
      </div>
    )
  }

  // Quiz screen
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <nav className="bg-lmu-blue text-white px-4 py-3 shadow">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="hover:bg-white hover:bg-opacity-20 rounded-lg px-3 py-1.5 text-sm transition">
            ✕ Beenden
          </button>
          <div className="text-center">
            <div className="font-semibold text-sm">Üben</div>
            <div className="text-blue-200 text-xs">{currentIndex + 1} / {filteredQuestions.length}</div>
          </div>
          <div className="text-right text-sm">
            <div className="font-semibold">{totalScore} / {maxScore}</div>
            <div className="text-blue-200 text-xs">Punkte</div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mt-2">
          <div className="bg-white bg-opacity-20 rounded-full h-1.5">
            <div
              className="bg-lmu-gold rounded-full h-1.5 transition-all"
              style={{ width: `${((currentIndex) / filteredQuestions.length) * 100}%` }}
            />
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-4">
        <QuestionCard
          question={currentQuestion}
          userAnswers={userAnswers}
          onToggle={handleToggle}
          showResult={showResult}
          questionNumber={currentIndex + 1}
          totalQuestions={filteredQuestions.length}
        />

        {/* Action buttons */}
        <div className="flex gap-3">
          {!showResult ? (
            <button
              onClick={handleSubmit}
              className="flex-1 bg-lmu-blue text-white py-3 rounded-xl font-semibold hover:bg-lmu-light transition"
            >
              Antwort prüfen
            </button>
          ) : (
            <>
              {/* Score display */}
              <div className="flex-1 bg-white rounded-xl p-3 flex items-center justify-between shadow-sm border">
                <span className="text-sm text-gray-500">Punkte für diese Frage:</span>
                <span className={`text-xl font-bold ${
                  results[results.length - 1]?.score === 5 ? 'text-green-600' :
                  results[results.length - 1]?.score >= 3 ? 'text-yellow-600' : 'text-red-500'
                }`}>
                  {results[results.length - 1]?.score ?? 0} / 5
                </span>
              </div>
              <button
                onClick={handleNext}
                className="flex-1 bg-lmu-blue text-white py-3 rounded-xl font-semibold hover:bg-lmu-light transition"
              >
                {currentIndex + 1 >= filteredQuestions.length ? 'Ergebnis anzeigen' : 'Nächste Frage →'}
              </button>
            </>
          )}
        </div>

        {/* Instructions */}
        {!showResult && (
          <p className="text-center text-xs text-gray-400">
            Wähle alle zutreffenden Antworten aus (0–5 können korrekt sein).
          </p>
        )}
      </main>
    </div>
  )
}
