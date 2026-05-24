import { type Question, type QuestionResult, type SubjectMeta, type Subject } from '../types'

export function scoreQuestion(question: Question, userAnswers: boolean[]): QuestionResult {
  // 5-3-1-0 schema: count positions where correctAnswers[i] !== userAnswers[i]
  const errors = question.correctAnswers.reduce(
    (acc, correct, i) => acc + (correct !== userAnswers[i] ? 1 : 0),
    0,
  )
  const score = (errors === 0 ? 5 : errors === 1 ? 3 : errors === 2 ? 1 : 0) as 0 | 1 | 3 | 5
  return { question, userAnswers, score, maxScore: 5 }
}

export function calcTotalScore(results: QuestionResult[]) {
  return results.reduce((sum, r) => sum + r.score, 0)
}

export function calcMaxScore(results: QuestionResult[]) {
  return results.length * 5
}

export function passedExam(totalScore: number, maxScore: number, avgFirstTimerScore?: number): boolean {
  const pct = totalScore / maxScore
  if (pct >= 0.5) return true
  if (avgFirstTimerScore !== undefined && pct >= 0.4 && totalScore >= avgFirstTimerScore * 0.9) return true
  return false
}

export const SUBJECT_META: Record<Subject, SubjectMeta> = {
  risk: {
    id: 'risk',
    label: 'Risk Management',
    labelEn: 'Risk Management',
    language: 'en',
    color: 'text-blue-800',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
  },
  accounting: {
    id: 'accounting',
    label: 'Unternehmensrechnung',
    labelEn: 'Accounting',
    language: 'de',
    color: 'text-green-800',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
  },
  digital: {
    id: 'digital',
    label: 'Digitale Unternehmung',
    labelEn: 'Digital Enterprise',
    language: 'de',
    color: 'text-purple-800',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
  },
  strategy: {
    id: 'strategy',
    label: 'Competition & Strategy',
    labelEn: 'Competition & Strategy',
    language: 'en',
    color: 'text-red-800',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
  },
  people: {
    id: 'people',
    label: 'People & Organization',
    labelEn: 'People & Organization',
    language: 'en',
    color: 'text-orange-800',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
  },
  international: {
    id: 'international',
    label: 'International Management',
    labelEn: 'International Management',
    language: 'en',
    color: 'text-teal-800',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-300',
  },
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function pickRandom<T>(arr: T[], n: number): T[] {
  return shuffleArray(arr).slice(0, n)
}
