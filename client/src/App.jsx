import { useState } from 'react'
import Header from './components/Header'
import PromptInput from './components/PromptInput'
import DesignBreakdown from './components/DesignBreakdown'
import VisualConcept from './components/VisualConcept'
import LoadingState from './components/LoadingState'

function App() {
  const [brief, setBrief] = useState(null)
  const [visual, setVisual] = useState(null)
  const [loading, setLoading] = useState(false)
  const [visualLoading, setVisualLoading] = useState(false)
  const [error, setError] = useState(null)
  const [step, setStep] = useState(0) // 0=idle, 1=analyzing, 2=brief done, 3=visual done

  const analyze = async (prompt) => {
    setLoading(true)
    setError(null)
    setBrief(null)
    setVisual(null)
    setStep(1)

    try {
      const res = await fetch('/api/analyze-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setBrief(data.brief)
      setStep(2)
      generateVisual(data.brief.imagePrompt, data.brief.colorPalette)
    } catch (err) {
      setError(err.message)
      setStep(0)
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
      if (res.ok) { setVisual(data.visual); setStep(3) }
    } catch (err) { console.error(err) }
    finally { setVisualLoading(false) }
  }

  const reset = () => {
    setBrief(null); setVisual(null); setError(null)
    setLoading(false); setVisualLoading(false); setStep(0)
  }

  return (
    <div className="min-h-screen relative">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-50-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.01] blur-[120px]"></div>
        <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-white/[0.008] blur-[100px]"></div>
      </div>

      <div className="relative z-10">
        <Header step={step} />

        <main className="max-w-3xl mx-auto px-5 sm:px-8 pb-32">
          <PromptInput onAnalyze={analyze} loading={loading} onReset={reset} hasBrief={!!brief} />

          {error && (
            <div className="mt-8 card-flat p-4 text-center fade border-red-500/20">
              <p className="text-red-400/70 text-sm">{error}</p>
            </div>
          )}

          {loading && <LoadingState text="Thinking through your design..." />}

          {brief && !loading && <DesignBreakdown brief={brief} />}

          {visualLoading && <LoadingState text="Crafting visual concept..." />}

          {visual && !visualLoading && <VisualConcept visual={visual} />}
        </main>

        <footer className="text-center py-10 border-t border-[var(--color-border)]">
          <p className="text-[var(--color-text-faint)] text-[11px] tracking-widest uppercase">Aurora · Hackathon 2025</p>
        </footer>
      </div>
    </div>
  )
}

export default App
