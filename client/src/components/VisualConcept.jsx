function VisualConcept({ visual }) {
    if (!visual) return null
    const colors = visual.colors || []

    return (
        <div className="mt-10 anim-rise">
            <h2 className="text-lg font-semibold text-white/85 mb-4">Visual Concept</h2>

            {/* Mockup */}
            <div className="card overflow-hidden">
                {/* Color strip */}
                <div className="flex h-1">
                    {colors.map((c, i) => <div key={i} className="flex-1" style={{ backgroundColor: c.hex }}></div>)}
                </div>

                {/* Wireframe mockup using palette colors */}
                <div className="p-8 sm:p-12" style={{ backgroundColor: colors.find(c => c.name === 'Background')?.hex || '#111' }}>
                    <div className="max-w-sm mx-auto space-y-5">
                        {/* Nav */}
                        <div className="flex items-center justify-between">
                            <div className="w-16 h-2.5 rounded-full" style={{ backgroundColor: colors[0]?.hex || '#444' }}></div>
                            <div className="flex gap-4">
                                {[1, 2, 3].map(i => <div key={i} className="w-8 h-1.5 rounded-full bg-white/10"></div>)}
                            </div>
                        </div>

                        {/* Hero */}
                        <div className="pt-8 space-y-2.5">
                            <div className="w-4/5 h-4 rounded" style={{ backgroundColor: colors.find(c => c.name === 'Text')?.hex || '#eee', opacity: 0.7 }}></div>
                            <div className="w-3/5 h-4 rounded" style={{ backgroundColor: colors.find(c => c.name === 'Text')?.hex || '#eee', opacity: 0.5 }}></div>
                            <div className="w-full h-2 rounded bg-white/6 mt-3"></div>
                            <div className="w-4/5 h-2 rounded bg-white/6"></div>
                        </div>

                        {/* CTA */}
                        <div className="pt-2">
                            <div className="w-24 h-7 rounded-md" style={{ backgroundColor: colors[2]?.hex || colors[0]?.hex || '#555' }}></div>
                        </div>

                        {/* Cards */}
                        <div className="grid grid-cols-3 gap-2.5 pt-6">
                            {[0, 1, 2].map(i => (
                                <div key={i} className="rounded-lg p-3 space-y-2" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div className="w-5 h-5 rounded" style={{ backgroundColor: colors[i]?.hex || '#444', opacity: 0.6 }}></div>
                                    <div className="w-full h-1.5 rounded bg-white/8"></div>
                                    <div className="w-3/4 h-1.5 rounded bg-white/5"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            {visual.description && (
                <div className="card p-5 mt-3">
                    <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Visual Description</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{visual.description}</p>
                </div>
            )}

            {/* Generation prompt (collapsible) */}
            {visual.prompt && (
                <details className="mt-2 group">
                    <summary className="text-white/15 text-xs cursor-pointer hover:text-white/30 transition-colors px-1 py-2">
                        View generation prompt
                    </summary>
                    <div className="card p-4 mt-1">
                        <p className="text-white/25 text-xs font-mono leading-relaxed">{visual.prompt}</p>
                    </div>
                </details>
            )}
        </div>
    )
}

export default VisualConcept