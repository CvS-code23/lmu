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
}

export interface SessionResult {
  mode: 'practice' | 'test'
  subject?: Subject
  results: QuestionResult[]
  totalScore: number
  maxTotalScore: number
  durationSeconds: number
}
