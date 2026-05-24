import { useState } from 'react'
import { Home } from './components/Home'
import { PracticeMode } from './components/PracticeMode'
import { TestMode } from './components/TestMode'
import { ResultsPage } from './components/ResultsPage'
import { LiteraturePage } from './components/LiteraturePage'
import { SessionCreator } from './components/SessionCreator'
import { CustomSession } from './components/CustomSession'
import { Dashboard } from './components/Dashboard'
import { type Question, type SessionResult } from './types'
import { saveSession, generateId } from './utils/history'

type View = 'home' | 'practice' | 'test' | 'results' | 'literature' | 'session-creator' | 'custom-session' | 'dashboard'

export default function App() {
  const [view, setView] = useState<View>('home')
  const [lastResult, setLastResult] = useState<SessionResult | null>(null)
  const [lastView, setLastView] = useState<View>('practice')
  const [customQuestions, setCustomQuestions] = useState<Question[]>([])

  function handleFinish(result: Omit<SessionResult, 'id' | 'timestamp'>, returnTo: View) {
    const fullResult: SessionResult = {
      ...result,
      id: generateId(),
      timestamp: Date.now(),
    }
    saveSession(fullResult)
    setLastResult(fullResult)
    setLastView(returnTo)
    setView('results')
  }

  if (view === 'home') {
    return (
      <Home
        onStartPractice={() => setView('practice')}
        onStartTest={() => setView('test')}
        onSessionCreator={() => setView('session-creator')}
        onLiterature={() => setView('literature')}
        onDashboard={() => setView('dashboard')}
      />
    )
  }

  if (view === 'literature') {
    return <LiteraturePage onBack={() => setView('home')} />
  }

  if (view === 'dashboard') {
    return <Dashboard onBack={() => setView('home')} />
  }

  if (view === 'session-creator') {
    return (
      <SessionCreator
        onStart={(qs) => {
          setCustomQuestions(qs)
          setView('custom-session')
        }}
        onBack={() => setView('home')}
      />
    )
  }

  if (view === 'custom-session' && customQuestions.length > 0) {
    return (
      <CustomSession
        questions={customQuestions}
        onFinish={(r) => handleFinish(r, 'session-creator')}
        onBack={() => setView('session-creator')}
      />
    )
  }

  if (view === 'practice') {
    return (
      <PracticeMode
        onFinish={(r) => handleFinish(r, 'practice')}
        onBack={() => setView('home')}
      />
    )
  }

  if (view === 'test') {
    return (
      <TestMode
        onFinish={(r) => handleFinish(r, 'test')}
        onBack={() => setView('home')}
      />
    )
  }

  if (view === 'results' && lastResult) {
    return (
      <ResultsPage
        result={lastResult}
        onHome={() => setView('home')}
        onRetry={() => setView(lastView)}
      />
    )
  }

  return null
}
