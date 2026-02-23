import { useState } from 'react'
import { Send, RotateCcw, Sparkles } from 'lucide-react'

const DEMOS = [
    { label: 'Fintech · Gen Z', prompt: 'Landing page for a fintech startup targeting Gen Z with micro-investing and financial literacy tools' },
    { label: 'Wellness · Premium', prompt: 'Brand identity for a premium wellness and meditation app aimed at stressed professionals aged 25-40' },
    { label: 'Esports · Dashboard', prompt: 'Dashboard for a competitive esports tournament platform with live streaming and team management features' }
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
                <div className={`card p-1 transition-all duration-300 ${focused ? 'border-[var(--color-border-hover)] shadow-lg shadow-black/20' : ''}`}>
                    <div className="flex items-start gap-3 p-3 pb-0">
                        <div className="mt-1">
                            <Sparkles size={16} className="text-[var(--color-text-faint)]" />
                        </div>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            placeholder="Describe your design goal — who it's for, what it needs to feel like..."
                            className="flex-1 bg-transparent text-[var(--color-text)] placeholder-[var(--color-text-faint)] resize-none outline-none text-sm leading-relaxed min-h-[72px]"
                            rows={3}
                            disabled={loading}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(e) } }}
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 pt-2">
                        <div className="flex items-center gap-3">
                            {prompt.length > 0 && (
                                <span className="text-[var(--color-text-faint)] text-[10px] tabular-nums fade">{prompt.length}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {hasBrief && (
                                <button type="button" onClick={() => { onReset(); setPrompt('') }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[var(--color-text-faint)] text-xs hover:text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] transition-all">
                                    <RotateCcw size={12} />
                                    <span>Reset</span>
                                </button>
                            )}
                            <button type="submit" disabled={!prompt.trim() || loading}
                                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[var(--color-text)] text-[var(--color-bg)] text-xs font-semibold hover:opacity-90 disabled:opacity-10 disabled:cursor-not-allowed transition-all">
                                <span>{loading ? 'Analyzing...' : 'Analyze'}</span>
                                {!loading && <Send size={12} />}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Demo prompts */}
            {!hasBrief && !loading && (
                <div className="mt-6 text-center enter enter-d2">
                    <p className="label mb-3">Try a scenario</p>
                    <div className="flex flex-wrap justify-center gap-2">
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