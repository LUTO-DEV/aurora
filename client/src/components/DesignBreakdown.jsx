function DesignBreakdown({ brief }) {
    if (!brief) return null

    return (
        <div className="mt-14 anim-rise">
            {/* Title */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-white/85">{brief.projectTitle || 'Design Brief'}</h2>
                {brief.summary && <p className="text-white/35 text-sm mt-1 font-light">{brief.summary}</p>}
            </div>

            {/* Color Palette — most visual so it goes first */}
            {brief.colorPalette && brief.colorPalette.length > 0 && (
                <div className="mb-6">
                    <div className="flex rounded-xl overflow-hidden h-16 mb-3">
                        {brief.colorPalette.map((c, i) => (
                            <div key={i} className="flex-1 relative group cursor-pointer" style={{ backgroundColor: c.hex }}>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                    <span className="text-white text-xs font-mono">{c.hex}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {brief.colorPalette.map((c, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: c.hex }}></div>
                                <span className="text-white/30 text-xs">{c.name}</span>
                                <span className="text-white/15 text-xs font-mono">{c.hex}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Grid of cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Audience */}
                {brief.targetAudience && (
                    <div className="card p-5">
                        <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Audience</h3>
                        <p className="text-white/70 text-sm">{brief.targetAudience.primary}</p>
                        <p className="text-white/35 text-xs mt-1.5">{brief.targetAudience.ageRange} · {brief.targetAudience.psychographics}</p>
                    </div>
                )}

                {/* Tone */}
                {brief.toneAndPersonality && (
                    <div className="card p-5">
                        <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Tone</h3>
                        <div className="flex gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-white/5 text-white/50 text-xs">{brief.toneAndPersonality.primary}</span>
                            <span className="px-2.5 py-0.5 rounded-md bg-white/5 text-white/50 text-xs">{brief.toneAndPersonality.secondary}</span>
                        </div>
                        <p className="text-white/30 text-xs italic">"{brief.toneAndPersonality.brandVoice}"</p>
                    </div>
                )}

                {/* Typography */}
                {brief.typography && (
                    <div className="card p-5">
                        <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Typography</h3>
                        <p className="text-white/70 text-sm font-medium">{brief.typography.headingFont}</p>
                        <p className="text-white/40 text-xs mt-0.5">{brief.typography.bodyFont} · {brief.typography.style}</p>
                    </div>
                )}

                {/* Layout */}
                {brief.layoutStructure && (
                    <div className="card p-5">
                        <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Layout</h3>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {brief.layoutStructure.sections?.map((s, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-md bg-white/4 text-white/40 text-xs border border-white/6">{s}</span>
                            ))}
                        </div>
                        <p className="text-white/30 text-xs mt-1">{brief.layoutStructure.heroStyle}</p>
                    </div>
                )}
            </div>

            {/* UX Reasoning */}
            {brief.uxReasoning && (
                <div className="card p-5 mt-3 border-l-2 border-l-white/10">
                    <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Why these choices</h3>
                    <p className="text-white/55 text-sm leading-relaxed">{brief.uxReasoning}</p>
                </div>
            )}

            {/* Mood keywords */}
            {brief.moodKeywords && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {brief.moodKeywords.map((k, i) => (
                        <span key={i} className="text-white/20 text-xs">#{k}</span>
                    ))}
                </div>
            )}
        </div>
    )
}

export default DesignBreakdown