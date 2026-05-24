export type Subject =
  | 'risk'
  | 'accounting'
  | 'digital'
  | 'strategy'
  | 'people'
  | 'international'

export interface Question {
  id: string
  subject: Subject
  language: 'en' | 'de'
  text: string
  options: string[]
  correctAnswers: boolean[]
  explanation?: string
  source: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

export interface SubjectMeta {
  id: Subject
  label: string
  labelEn: string
  language: 'en' | 'de'
  color: string
  bgColor: string
  borderColor: string
}

export interface QuestionResult {
  question: Question
  userAnswers: boolean[]
  score: number
  maxScore: 5
  timeSeconds: number   // time spent on this question (0 if not tracked)
}

export interface SessionResult {
  id: string
  timestamp: number     // Unix ms when session was saved
  mode: 'practice' | 'test' | 'custom'
  subject?: Subject
  results: QuestionResult[]
  totalScore: number
  maxTotalScore: number
  durationSeconds: number
}
