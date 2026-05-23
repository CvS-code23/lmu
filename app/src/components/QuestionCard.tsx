import { type Question } from '../types'
import { SubjectBadge } from './SubjectBadge'

interface QuestionCardProps {
  question: Question
  userAnswers: boolean[]
  onToggle: (index: number) => void
  showResult: boolean
  questionNumber: number
  totalQuestions: number
}

export function QuestionCard({
  question,
  userAnswers,
  onToggle,
  showResult,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  const LABELS = ['A', 'B', 'C', 'D', 'E']

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      {/* Meta row */}
      <div className="flex items-center justify-between mb-4">
        <SubjectBadge subject={question.subject} />
        <span className="text-xs text-gray-400">
          Frage {questionNumber} / {totalQuestions}
        </span>
      </div>

      {/* Question text */}
      <p className="text-gray-800 font-medium text-base leading-relaxed mb-5">
        {question.text}
      </p>

      {/* Answer options */}
      <div className="space-y-2">
        {question.options.map((option, i) => {
          const selected = userAnswers[i]
          const correct = question.correctAnswers[i]

          let bg = 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
          let icon = null

          if (showResult) {
            if (correct && selected) {
              bg = 'bg-green-50 border-green-400'
              icon = <span className="text-green-600 font-bold text-sm flex-shrink-0">✓</span>
            } else if (!correct && !selected) {
              bg = 'bg-gray-50 border-gray-200'
              icon = <span className="text-gray-400 text-sm flex-shrink-0">○</span>
            } else if (correct && !selected) {
              bg = 'bg-yellow-50 border-yellow-400'
              icon = <span className="text-yellow-600 font-bold text-sm flex-shrink-0">!</span>
            } else {
              bg = 'bg-red-50 border-red-400'
              icon = <span className="text-red-600 font-bold text-sm flex-shrink-0">✗</span>
            }
          } else if (selected) {
            bg = 'bg-blue-50 border-blue-400'
          }

          return (
            <button
              key={i}
              onClick={() => !showResult && onToggle(i)}
              disabled={showResult}
              className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${bg} ${!showResult ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs font-bold border mt-0.5 ${
                selected && !showResult
                  ? 'bg-lmu-light text-white border-lmu-light'
                  : 'bg-white text-gray-500 border-gray-300'
              }`}>
                {LABELS[i]}
              </span>
              <span className="text-sm text-gray-700 flex-1 leading-relaxed">{option}</span>
              {showResult && icon}
            </button>
          )
        })}
      </div>

      {/* Result legend */}
      {showResult && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1"><span className="text-green-600 font-bold">✓</span> Korrekt markiert</span>
            <span className="flex items-center gap-1"><span className="text-red-600 font-bold">✗</span> Falsch markiert</span>
            <span className="flex items-center gap-1"><span className="text-yellow-600 font-bold">!</span> Hätte markiert werden sollen</span>
          </div>
          {question.explanation && (
            <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-800">
              <span className="font-semibold">Erklärung: </span>{question.explanation}
            </div>
          )}
          <div className="mt-2 text-xs text-gray-400">Quelle: {question.source}</div>
        </div>
      )}
    </div>
  )
}
