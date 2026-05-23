import { useState } from 'react'
import { Home } from './components/Home'
import { PracticeMode } from './components/PracticeMode'
import { TestMode } from './components/TestMode'
import { ResultsPage } from './components/ResultsPage'
import { type SessionResult } from './types'

type View = 'home' | 'practice' | 'test' | 'results'

export default function App() {
  const [view, setView] = useState<View>('home')
  const [lastResult, setLastResult] = useState<SessionResult | null>(null)
  const [lastMode, setLastMode] = useState<'practice' | 'test'>('practice')

  function handleFinish(result: SessionResult) {
    setLastResult(result)
    setLastMode(result.mode)
    setView('results')
  }

  if (view === 'home') {
    return (
      <Home
        onStartPractice={() => setView('practice')}
        onStartTest={() => setView('test')}
      />
    )
  }

  if (view === 'practice') {
    return (
      <PracticeMode
        onFinish={handleFinish}
        onBack={() => setView('home')}
      />
    )
  }

  if (view === 'test') {
    return (
      <TestMode
        onFinish={handleFinish}
        onBack={() => setView('home')}
      />
    )
  }

  if (view === 'results' && lastResult) {
    return (
      <ResultsPage
        result={lastResult}
        onHome={() => setView('home')}
        onRetry={() => setView(lastMode)}
      />
    )
  }

  return null
}
