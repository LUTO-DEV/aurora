import Header from './components/Header'
import PromptInput from './components/PromptInput'
import DesignBreakdown from './components/DesignBreakdown'
import VisualConcept from './components/VisualConcept'
import LoadingState from './components/LoadingState'
import Sidebar from './components/Sidebar'
import ExportCode from './components/ExportCode'
import Toast from './components/Toast'
import useStore from './store'
import { useState } from 'react'

// Backend URL - change this to your Render backend URL after deploying
const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function App() {
  const { brief, visual, loading, visualLoading, error, step,
    setBrief, setVisual, setLoading, setVisualLoading,
    setError, setStep, reset, saveProject } = useStore()
  const [lastPrompt, setLastPrompt] = useState('')
  const [toast, setToast] = useState(null)
  const [showCode, setShowCode] = useState(false)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500) }

  const analyze = async (prompt) => {
    setLoading(true); setError(null); setBrief(null); setVisual(null)
    setStep(1); setLastPrompt(prompt); setShowCode(false)
    try {
      const res = await fetch(`${API}/api/analyze-design`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Server error' }))
        throw new Error(errData.error || `Server error ${res.status}`)
      }

      const data = await res.json()
      if (!data.success || !data.brief) throw new Error('Invalid response from server')

      setBrief(data.brief); setStep(2)
      generateVisual(data.brief.imagePrompt, data.brief.colorPalette)
    } catch (err) {
      console.error('Analyze failed:', err)
      setError(err.message)
      setStep(0)
    } finally {
      setLoading(false)
    }
  }

  const generateVisual = async (imagePrompt, colorPalette) => {
    setVisualLoading(true)
    try {
      const res = await fetch(`${API}/api/generate-visual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePrompt, colorPalette })
      })
      const data = await res.json()
      if (data.success) { setVisual(data.visual); setStep(3) }
    } catch (err) { console.error('Visual failed:', err) }
    finally { setVisualLoading(false) }
  }

  const handleSave = () => { saveProject(lastPrompt); showToast('Project saved') }
  const handleReset = () => { reset(); setLastPrompt(''); setShowCode(false) }

  return (
    <div className="min-h-screen relative">
      <Sidebar onAnalyze={analyze} />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.015) 0%, transparent 70%)' }}></div>
      </div>

      <div className="relative z-10">
        <Header step={step} />

        <main className="max-w-3xl mx-auto px-5 sm:px-8 pb-32">
          <PromptInput onAnalyze={analyze} loading={loading} onReset={handleReset} hasBrief={!!brief} />

          {error && (
            <div className="mt-8 p-4 rounded-2xl text-center fade" style={{ background: '#131316', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p className="text-red-400 text-sm opacity-70">{error}</p>
              <p className="text-xs mt-2" style={{ color: '#3f3f46' }}>Check that your backend is running</p>
            </div>
          )}

          {loading && <LoadingState text="Thinking through your design..." />}

          {brief && !loading && (
            <DesignBreakdown
              brief={brief}
              onSave={handleSave}
              showToast={showToast}
              onShowCode={() => setShowCode(!showCode)}
              showingCode={showCode}
            />
          )}

          {showCode && brief && <ExportCode brief={brief} showToast={showToast} />}

          {visualLoading && <LoadingState text="Crafting visual concept..." />}
          {visual && !visualLoading && <VisualConcept visual={visual} brief={brief} />}
        </main>

        <footer className="text-center py-10" style={{ borderTop: '1px solid #232329' }}>
          <p className="text-xs tracking-widest uppercase" style={{ color: '#3f3f46' }}>Aurora · Hackathon 2025</p>
        </footer>
      </div>

      {toast && <Toast message={toast} />}
    </div>
  )
}

export default App
