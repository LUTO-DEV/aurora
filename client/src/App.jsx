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
        const err = await res.json().catch(() => ({ error: `Server error ${res.status}` }))
        throw new Error(err.error || 'Request failed')
      }
      const data = await res.json()
      if (!data.success || !data.brief) throw new Error('Invalid server response')
      setBrief(data.brief); setStep(2)
      generateVisual(data.brief.imagePrompt, data.brief.colorPalette)
    } catch (err) {
      console.error('Analyze:', err)
      setError(err.message)
      setStep(0)
    } finally { setLoading(false) }
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
    } catch (err) { console.error('Visual:', err) }
    finally { setVisualLoading(false) }
  }

  const handleSave = () => { saveProject(lastPrompt); showToast('Project saved') }
  const handleReset = () => { reset(); setLastPrompt(''); setShowCode(false) }

  // Logic to determine if we should be in "Hero Center" mode
  const isHome = !brief && !loading && !error;

  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-x-hidden bg-[#09090b] text-white">
      <Sidebar onAnalyze={analyze} />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)' }}></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <Header step={step} />

        {/* FIX: Conditional centering. 
            If isHome is true, we use justify-center to put the input in the middle of the screen.
        */}
        <main className={`flex-1 w-full max-w-full md:max-w-3xl mx-auto px-6 sm:px-8 flex flex-col ${isHome ? 'justify-center pb-32' : 'pt-4 pb-20'}`}>

          {isHome && (
            <div className="text-center mb-10 animate-in fade-in zoom-in duration-1000">
              {/* BUMPED FONT SIZE: text-6xl on mobile, text-9xl on desktop */}
              <h1 className="text-6xl md:text-9xl font-medium tracking-tighter mb-4 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                Aurora
              </h1>
              <p className="text-lg md:text-2xl text-zinc-500 font-light tracking-wide">
                Think before you <span className="text-white">design.</span>
              </p>
            </div>
          )}

          <div className="w-full">
            <PromptInput
              onAnalyze={analyze}
              loading={loading}
              onReset={handleReset}
              hasBrief={!!brief}
            />
          </div>

          {error && (
            <div className="mt-8 p-6 text-center rounded-[24px] border border-red-500/20 bg-red-500/5">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {loading && (
            <div className="py-20">
              <LoadingState text="Thinking through your design..." />
            </div>
          )}

          {brief && !loading && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <DesignBreakdown
                brief={brief} visual={visual}
                onSave={handleSave} showToast={showToast}
                onShowCode={() => setShowCode(!showCode)} showingCode={showCode}
              />
            </div>
          )}

          {showCode && brief && <ExportCode brief={brief} showToast={showToast} />}
          {visualLoading && <LoadingState text="Crafting visual concept..." />}
          {visual && !visualLoading && <VisualConcept visual={visual} brief={brief} />}
        </main>

        <footer className="mt-auto text-center py-10 w-full border-t border-white/5">
          <p className="text-[10px] tracking-[0.3em] uppercase opacity-20">Aurora · Hackathon 2026</p>
        </footer>
      </div>

      {toast && <Toast message={toast} />}
    </div>
  )
}

export default App