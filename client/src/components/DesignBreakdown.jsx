import { Target, Palette, Type, Layout, Brain, Hash } from 'lucide-react'

function DesignBreakdown({ brief }) {
    if (!brief) return null

    return (
        <div className="mt-16">
            {/* Brief header */}
            <div className="mb-8 enter">
                <p className="label mb-2">Design Brief</p>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--color-text)]">
                    {brief.projectTitle || 'Untitled Project'}
                </h2>
                {brief.summary && (
                    <p className="text-[var(--color-text-muted)] text-sm mt-2 leading-relaxed max-w-lg">{brief.summary}</p>
                )}
            </div>

            {/* Color Palette — Big visual strip */}
            {brief.colorPalette?.length > 0 && (
                <div className="mb-6 enter enter-d1">
                    <div className="card overflow-hidden">
                        {/* Large color blocks */}
                        <div className="flex h-24 sm:h-32">
                            {brief.colorPalette.map((c, i) => (
                                <div
                                    key={i}
                                    className="flex-1 relative group cursor-crosshair transition-all hover:flex-[1.5]"
                                    style={{ backgroundColor: c.hex }}
                                >
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/50 backdrop-blur-sm">
                                        <span className="text-white text-[10px] font-semibold uppercase tracking-wider">{c.name}</span>
                                        <span className="text-white/70 text-[11px] font-mono mt-0.5">{c.hex}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Color details below */}
                        <div className="p-4 flex flex-wrap gap-x-6 gap-y-2">
                            {brief.colorPalette.map((c, i) => (
                                <div key={i} className="flex items-center gap-2.5">
                                    <div className="w-3 h-3 rounded-full ring-1 ring-white/10" style={{ backgroundColor: c.hex }}></div>
                                    <div>
                                        <span className="text-[var(--color-text-muted)] text-[11px] font-medium">{c.name}</span>
                                        <span className="text-[var(--color-text-faint)] text-[10px] font-mono ml-2">{c.hex}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Audience */}
                {brief.targetAudience && (
                    <div className="card p-5 enter enter-d2">
                        <div className="flex items-center gap-2 mb-3">
                            <Target size={13} className="text-[var(--color-text-faint)]" />
                            <span className="label">Audience</span>
                        </div>
                        <p className="text-[var(--color-text)] text-sm font-medium">{brief.targetAudience.primary}</p>
                        <div className="flex flex-wrap gap-2 mt-2.5">
                            <span className="tag">{brief.targetAudience.ageRange}</span>
                        </div>
                        <p className="text-[var(--color-text-muted)] text-xs mt-2.5 leading-relaxed">{brief.targetAudience.psychographics}</p>
                    </div>
                )}

                {/* Tone */}
                {brief.toneAndPersonality && (
                    <div className="card p-5 enter enter-d3">
                        <div className="flex items-center gap-2 mb-3">
                            <Hash size={13} className="text-[var(--color-text-faint)]" />
                            <span className="label">Tone & Voice</span>
                        </div>
                        <div className="flex gap-2 mb-3">
                            <span className="tag">{brief.toneAndPersonality.primary}</span>
                            <span className="tag">{brief.toneAndPersonality.secondary}</span>
                        </div>
                        <p className="text-[var(--color-text-muted)] text-xs italic leading-relaxed">
                            "{brief.toneAndPersonality.brandVoice}"
                        </p>
                    </div>
                )}

                {/* Typography */}
                {brief.typography && (
                    <div className="card p-5 enter enter-d4">
                        <div className="flex items-center gap-2 mb-3">
                            <Type size={13} className="text-[var(--color-text-faint)]" />
                            <span className="label">Typography</span>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-baseline gap-2">
                                <span className="text-[var(--color-text)] text-lg font-semibold">{brief.typography.headingFont}</span>
                                <span className="text-[var(--color-text-faint)] text-[10px]">Heading</span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-[var(--color-text-muted)] text-sm">{brief.typography.bodyFont}</span>
                                <span className="text-[var(--color-text-faint)] text-[10px]">Body</span>
                            </div>
                        </div>
                        <p className="text-[var(--color-text-faint)] text-xs mt-3">{brief.typography.style}</p>
                    </div>
                )}

                {/* Layout */}
                {brief.layoutStructure && (
                    <div className="card p-5 enter enter-d5">
                        <div className="flex items-center gap-2 mb-3">
                            <Layout size={13} className="text-[var(--color-text-faint)]" />
                            <span className="label">Layout</span>
                        </div>
                        <div className="space-y-1">
                            {brief.layoutStructure.sections?.map((s, i) => (
                                <div key={i} className="flex items-center gap-2.5">
                                    <div className="w-4 h-px bg-[var(--color-border)]"></div>
                                    <span className="text-[var(--color-text-muted)] text-xs">{s}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                            <p className="text-[var(--color-text-faint)] text-[11px]">{brief.layoutStructure.heroStyle}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* UX Reasoning — Highlighted */}
            {brief.uxReasoning && (
                <div className="mt-3 enter enter-d6">
                    <div className="card p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-text-faint)] to-transparent opacity-30"></div>
                        <div className="flex items-center gap-2 mb-3">
                            <Brain size={13} className="text-[var(--color-text-faint)]" />
                            <span className="label">Design Reasoning</span>
                        </div>
                        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{brief.uxReasoning}</p>
                    </div>
                </div>
            )}

            {/* Mood tags */}
            {brief.moodKeywords?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5 enter enter-d6">
                    {brief.moodKeywords.map((k, i) => (
                        <span key={i} className="text-[var(--color-text-faint)] text-[11px]">#{k}</span>
                    ))}
                </div>
            )}
        </div>
    )
}

export default DesignBreakdown