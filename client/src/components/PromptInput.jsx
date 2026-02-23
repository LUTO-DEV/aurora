import { useState } from 'react'

const DEMOS = [
    { label: 'Fintech Landing', prompt: 'Landing page for a fintech startup targeting Gen Z with micro-investing and financial literacy' },
    { label: 'Wellness App', prompt: 'Brand identity for a premium wellness and meditation app for stressed professionals aged 25-40' },
    { label: 'Esports Platform', prompt: 'Dashboard for a competitive esports tournament platform with live streaming and team management' }
]

function PromptInput({ onAnalyze, loading, onReset, hasBrief }) {
    const [prompt, setPrompt] = useState('')

    const submit = (e) => {
        e.preventDefault()
        if (prompt.trim() && !loading) onAnalyze(prompt.trim())
    }

    const useDemoPrompt = (text) => {
        setPrompt(text)
        onAnalyze(text)
    }

    return (
        <div className="max-w-2xl mx-auto">
            <form onSubmit={submit}>
                <div className="card p-1.5">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="What are you designing? Be specific about the audience, purpose, and vibe..."
                        className="w-full bg-transparent text-white/80 placeholder-white/20 p-4 rounded-xl resize-none outline-none text-sm leading-relaxed"
                        rows={3}
                        disabled={loading}
                    />
                    <div className="flex items-center justify-between px-3 pb-2">
                        <span className="text-white/15 text-xs">
                            {prompt.length > 0 && `${prompt.length} chars`}
                        </span>
                        <div className="flex gap-2">
                            {hasBrief && (
                                <button type="button" onClick={() => { onReset(); setPrompt('') }}
                                    className="px-4 py-1.5 rounded-lg text-white/30 text-xs hover:text-white/50 hover:bg-white/5 transition-all">
                                    Start over
                                </button>
                            )}
                            <button type="submit" disabled={!prompt.trim() || loading}
                                className="px-5 py-1.5 rounded-lg bg-white/[0.07] text-white/70 text-xs font-medium hover:bg-white/12 hover:text-white/90 disabled:opacity-20 disabled:cursor-not-allowed transition-all border border-white/10">
                                {loading ? 'Working...' : 'Analyze'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {!hasBrief && !loading && (
                <div className="mt-5 anim-fade">
                    <p className="text-white/20 text-xs text-center mb-2.5">or try:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {DEMOS.map((d, i) => (
                            <button key={i} onClick={() => useDemoPrompt(d.prompt)}
                                className="px-3.5 py-1.5 rounded-full text-white/30 text-xs border border-white/8 hover:border-white/20 hover:text-white/50 transition-all">
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