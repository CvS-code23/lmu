import { useState, useEffect, useRef, useMemo } from 'react'
import { questions } from '../data/questions'
import { type Subject, type SessionResult } from '../types'
import { SUBJECT_META, scoreQuestion, pickRandom } from '../utils/scoring'
import { QuestionCard } from './QuestionCard'
import { SubjectBadge } from './SubjectBadge'

const SUBJECTS: Subject[] = ['risk', 'accounting', 'digital', 'strategy', 'people', 'international']
const QUESTIONS_PER_SUBJECT = 5
const SECONDS_PER_SUBJECT = 25 * 60

interface TestModeProps {
  onFinish: (result: Omit<SessionResult, 'id' | 'timestamp'>) => void
  onBack: () => void
}

export function TestMode({ onFinish, onBack }: TestModeProps) {
  const [phase, setPhase] = useState<'intro' | 'test' | 'review'>('intro')
  const [subjectIndex, setSubjectIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [allUserAnswers, setAllUserAnswers] = useState<boolean[][][]>(
    SUBJECTS.map(() => Array.from({ length: QUESTIONS_PER_SUBJECT }, () => [false, false, false, false, false]))
  )
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_SUBJECT)
  const [showResult, setShowResult] = useState(false)
  const startTimeRef = useRef(Date.now())

  const testQuestions = useMemo(() => {
    return SUBJECTS.map((subject) => {
      const pool = questions.filter((q) => q.subject === subject)
      return pickRandom(pool, QUESTIONS_PER_SUBJECT)
    })
  }, [])

  const currentSubjectQuestions = testQuestions[subjectIndex]
  const currentQuestion = currentSubjectQuestions[questionIndex]
  const currentAnswers = allUserAnswers[subjectIndex][questionIndex]

  // Timer
  useEffect(() => {
    if (phase !== 'test') return
    if (timeLeft <= 0) {
      handleNextSubject()
      return
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [phase, timeLeft, subjectIndex])

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  function handleToggle(i: number) {
    setAllUserAnswers((prev) => {
      const next = prev.map((s) => s.map((a) => [...a]))
      next[subjectIndex][questionIndex][i] = !next[subjectIndex][questionIndex][i]
      return next
    })
  }

  function handleNextQuestion() {
    if (questionIndex + 1 < QUESTIONS_PER_SUBJECT) {
      setQuestionIndex((i) => i + 1)
      setShowResult(false)
    } else {
      handleNextSubject()
    }
  }

  function handleNextSubject() {
    if (subjectIndex + 1 < SUBJECTS.length) {
      setSubjectIndex((i) => i + 1)
      setQuestionIndex(0)
      setTimeLeft(SECONDS_PER_SUBJECT)
      setShowResult(false)
    } else {
      finishTest()
    }
  }

  function finishTest() {
    const results: SessionResult['results'] = []
    SUBJECTS.forEach((_, si) => {
      testQuestions[si].forEach((q, qi) => {
        results.push(scoreQuestion(q, allUserAnswers[si][qi]))
      })
    })
    const total = results.reduce((s, r) => s + r.score, 0)
    onFinish({
      mode: 'test',
      results,
      totalScore: total,
      maxTotalScore: results.length * 5,
      durationSeconds: Math.round((Date.now() - startTimeRef.current) / 1000),
    })
  }

  const timerPct = timeLeft / SECONDS_PER_SUBJECT
  const timerColor = timerPct > 0.4 ? 'text-green-600' : timerPct > 0.15 ? 'text-yellow-600' : 'text-red-600'
  const timerBg = timerPct > 0.4 ? 'bg-green-500' : timerPct > 0.15 ? 'bg-yellow-500' : 'bg-red-500'

  const answeredInSubject = allUserAnswers[subjectIndex].filter((a) => a.some(Boolean)).length

  // Intro screen
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <nav className="bg-lmu-blue text-white px-4 py-3 flex items-center gap-3 shadow">
          <button onClick={onBack} className="hover:bg-white hover:bg-opacity-20 rounded-lg p-1.5 transition text-sm">
            ← Zurück
          </button>
          <span className="font-semibold">Test simulieren</span>
        </nav>
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">⏱️</div>
            <h2 className="text-2xl font-bold text-lmu-blue mb-2">Testbereit?</h2>
            <p className="text-gray-500">Simuliere die Klausur unter echten Bedingungen.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
            <h3 className="font-semibold text-gray-700 mb-4">Ablauf des Simulationstests</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              {[
                ['6 Themengebiete', 'Du bearbeitest alle Gebiete nacheinander.'],
                ['5 Fragen je Gebiet', 'Zufällig aus dem Fragenpool ausgewählt.'],
                ['25 Minuten je Gebiet', 'Timer läuft automatisch. Bei Ablauf geht es weiter.'],
                ['5-3-1-0 Bewertung', 'Alle 5 Antworten je Frage einzeln bewerten.'],
              ].map(([title, desc]) => (
                <li key={title} className="flex gap-3">
                  <span className="w-2 h-2 rounded-full bg-lmu-light flex-shrink-0 mt-1.5" />
                  <div>
                    <span className="font-medium text-gray-800">{title}:</span>{' '}
                    <span>{desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800 mb-6">
            <strong>Hinweis:</strong> Einmal gestartet, läuft der Timer. Beende den Test erst wenn du Zeit hast.
          </div>

          <div className="space-y-2 mb-6">
            {SUBJECTS.map((s) => (
              <div key={s} className={`rounded-xl px-4 py-2.5 flex items-center gap-3 ${SUBJECT_META[s].bgColor}`}>
                <SubjectBadge subject={s} />
                <span className={`text-sm ${SUBJECT_META[s].color}`}>5 Fragen · 25 min</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => { startTimeRef.current = Date.now(); setPhase('test') }}
            className="w-full bg-lmu-blue text-white py-4 rounded-xl font-semibold text-lg hover:bg-lmu-light transition"
          >
            Test jetzt starten
          </button>
        </main>
      </div>
    )
  }

  // Test screen
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <nav className="bg-lmu-blue text-white shadow">
        <div className="px-4 py-3 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xs text-blue-200 uppercase tracking-wide">Gebiet {subjectIndex + 1}/6</div>
              <div className="font-semibold text-sm">{SUBJECT_META[SUBJECTS[subjectIndex]].label}</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold tabular-nums ${timerColor === 'text-red-600' ? 'text-red-300' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </div>
              <div className="text-xs text-blue-200">Verbleibend</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold">Frage {questionIndex + 1}/5</div>
              <div className="text-xs text-blue-200">{answeredInSubject} beantwortet</div>
            </div>
          </div>

          {/* Timer bar */}
          <div className="bg-white bg-opacity-20 rounded-full h-1.5">
            <div
              className={`${timerBg} rounded-full h-1.5 transition-all`}
              style={{ width: `${timerPct * 100}%` }}
            />
          </div>

          {/* Subject navigation */}
          <div className="flex gap-1 mt-2 justify-center">
            {SUBJECTS.map((s, i) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full ${
                  i < subjectIndex ? 'bg-green-400' :
                  i === subjectIndex ? 'bg-white' : 'bg-white bg-opacity-30'
                }`}
              />
            ))}
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 flex flex-col gap-4">
        {/* Question navigation for current subject */}
        <div className="flex gap-2">
          {currentSubjectQuestions.map((_, qi) => {
            const answered = allUserAnswers[subjectIndex][qi].some(Boolean)
            return (
              <button
                key={qi}
                onClick={() => { setQuestionIndex(qi); setShowResult(false) }}
                className={`flex-1 h-8 rounded-lg text-sm font-semibold transition ${
                  qi === questionIndex
                    ? 'bg-lmu-blue text-white'
                    : answered
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {qi + 1}
              </button>
            )
          })}
        </div>

        <QuestionCard
          question={currentQuestion}
          userAnswers={currentAnswers}
          onToggle={handleToggle}
          showResult={showResult}
          questionNumber={subjectIndex * QUESTIONS_PER_SUBJECT + questionIndex + 1}
          totalQuestions={SUBJECTS.length * QUESTIONS_PER_SUBJECT}
        />

        <div className="flex gap-3">
          {questionIndex + 1 < QUESTIONS_PER_SUBJECT ? (
            <button
              onClick={handleNextQuestion}
              className="flex-1 bg-lmu-blue text-white py-3 rounded-xl font-semibold hover:bg-lmu-light transition"
            >
              Nächste Frage →
            </button>
          ) : subjectIndex + 1 < SUBJECTS.length ? (
            <button
              onClick={handleNextSubject}
              className="flex-1 bg-lmu-gold text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Nächstes Gebiet: {SUBJECT_META[SUBJECTS[subjectIndex + 1]].label} →
            </button>
          ) : (
            <button
              onClick={finishTest}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Test abschließen ✓
            </button>
          )}
        </div>

        <p className="text-center text-xs text-gray-400">
          Wähle alle zutreffenden Antworten (0–5 können korrekt sein) · Kein negativer Gesamtscore
        </p>
      </main>
    </div>
  )
}
