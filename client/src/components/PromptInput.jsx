import { useState } from 'react'
import { Send, RotateCcw, Sparkles } from 'lucide-react'

const DEMOS = [
    { label: 'Fintech App', prompt: 'Mobile app for a fintech startup targeting Gen Z with micro-investing, savings goals, and financial literacy tools' },
    { label: 'Food Delivery', prompt: 'Food delivery app for a premium restaurant marketplace focused on local cuisine and sustainable packaging' },
    { label: 'Fitness Tracker', prompt: 'Fitness tracking app with workout plans, progress photos, and social challenges for gym enthusiasts aged 20-35' }
]

function PromptInput({ onAnalyze, loading, onReset, hasBrief }) {
    const [prompt, setPrompt] = useState('')
    const [focused, setFocused] = useState(false)

    const submit = (e) => {
        e.preventDefault()
        if (prompt.trim() && !loading) onAnalyze(prompt.trim())
    }

    const useDemo = (text) => { setPrompt(text); onAnalyze(text) }

    return (
        <div className="max-w-2xl mx-auto enter enter-d1">
            <form onSubmit={submit}>
                <div className="card p-1" style={{ borderColor: focused ? '#2e2e36' : '#232329', boxShadow: focused ? '0 8px 32px rgba(0,0,0,0.3)' : 'none' }}>
                    <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 pb-0">
                        <div className="mt-1">
                            <Sparkles size={14} style={{ color: '#3f3f46' }} />
                        </div>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            placeholder="Describe your design goal — what is it, who is it for, what should it feel like..."
                            className="flex-1 bg-transparent resize-none outline-none text-xs sm:text-sm leading-relaxed"
                            style={{ color: '#e4e4e7', minHeight: '60px' }}
                            rows={3}
                            disabled={loading}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(e) } }}
                        />
                    </div>

                    <div className="flex items-center justify-between p-2 sm:p-3 pt-1 sm:pt-2">
                        <div>
                            {prompt.length > 0 && (
                                <span className="text-[9px] sm:text-[10px] fade" style={{ color: '#3f3f46' }}>{prompt.length}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            {hasBrief && (
                                <button type="button" onClick={() => { onReset(); setPrompt('') }}
                                    className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs transition-all"
                                    style={{ color: '#3f3f46' }}>
                                    <RotateCcw size={11} />
                                    <span className="hidden sm:inline">Reset</span>
                                </button>
                            )}
                            <button type="submit" disabled={!prompt.trim() || loading}
                                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all disabled:opacity-10 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#e4e4e7', color: '#09090b' }}>
                                <span>{loading ? 'Analyzing...' : 'Analyze'}</span>
                                {!loading && <Send size={11} />}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {!hasBrief && !loading && (
                <div className="mt-4 sm:mt-6 text-center enter enter-d2">
                    <p className="label mb-2 sm:mb-3">Try a scenario</p>
                    <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                        {DEMOS.map((d, i) => (
                            <button key={i} onClick={() => useDemo(d.prompt)} className="tag cursor-pointer">
                                {d.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default PromptInput