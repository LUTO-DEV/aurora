import { useState } from 'react'
import Header from './components/Header'
import PromptInput from './components/PromptInput'
import DesignBreakdown from './components/DesignBreakdown'
import VisualConcept from './components/VisualConcept'

function App() {
  const [brief, setBrief] = useState(null)
  const [visual, setVisual] = useState(null)
  const [loading, setLoading] = useState(false)
  const [visualLoading, setVisualLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyze = async (prompt) => {
    setLoading(true)
    setError(null)
    setBrief(null)
    setVisual(null)

    try {
      const res = await fetch('/api/analyze-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBrief(data.brief)
      generateVisual(data.brief.imagePrompt, data.brief.colorPalette)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const generateVisual = async (imagePrompt, colorPalette) => {
    setVisualLoading(true)
    try {
      const res = await fetch('/api/generate-visual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePrompt, colorPalette })
      })
      const data = await res.json()
      if (res.ok) setVisual(data.visual)
    } catch (err) {
      console.error(err)
    } finally {
      setVisualLoading(false)
    }
  }

  const reset = () => {
    setBrief(null)
    setVisual(null)
    setError(null)
    setLoading(false)
    setVisualLoading(false)
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-5 pb-24">
        <PromptInput onAnalyze={analyze} loading={loading} onReset={reset} hasBrief={!!brief} />

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400/80 text-sm text-center anim-fade">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-16 text-center anim-fade">
            <div className="inline-flex items-center gap-3 text-white/40 text-sm">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"></div>
              Analyzing your design goal...
            </div>
          </div>
        )}

        {brief && <DesignBreakdown brief={brief} />}

        {visualLoading && (
          <div className="mt-8 text-center anim-fade">
            <div className="inline-flex items-center gap-3 text-white/30 text-sm">
              <div className="w-3 h-3 border-2 border-white/15 border-t-white/50 rounded-full animate-spin"></div>
              Crafting visual concept...
            </div>
          </div>
        )}

        {visual && <VisualConcept visual={visual} />}
      </main>

      <footer className="text-center py-8 text-white/15 text-xs border-t border-white/5">
        AURORA — Hackathon 2025
      </footer>
    </div>
  )
}

export default App
