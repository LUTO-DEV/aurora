import { Eye, Code2, Layers } from 'lucide-react'

function VisualConcept({ visual }) {
    if (!visual) return null
    const colors = visual.colors || []

    const bg = colors.find(c => c.name === 'Background')?.hex || '#111114'
    const primary = colors[0]?.hex || '#555'
    const secondary = colors[1]?.hex || '#444'
    const accent = colors[2]?.hex || '#666'
    const textColor = colors.find(c => c.name === 'Text')?.hex || '#eee'

    return (
        <div className="mt-14 enter">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="label mb-1">Visual Concept</p>
                    <h3 className="text-base font-semibold" style={{ color: '#e4e4e7' }}>Generated Mockup</h3>
                </div>
                <div className="flex items-center gap-1.5">
                    <Layers size={12} style={{ color: '#3f3f46' }} />
                    <span className="text-[10px]" style={{ color: '#3f3f46' }}>Live Preview</span>
                </div>
            </div>

            <div className="card overflow-hidden enter enter-d1">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: '#1a1a1f', borderBottom: '1px solid #232329' }}>
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#ff5f57' }}></div>
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#febc2e' }}></div>
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#28c840' }}></div>
                    </div>
                    <div className="flex-1 mx-4">
                        <div className="rounded-md px-3 py-1 max-w-xs mx-auto" style={{ backgroundColor: '#09090b' }}>
                            <span className="text-[10px] font-mono" style={{ color: '#3f3f46' }}>aurora-design.preview</span>
                        </div>
                    </div>
                </div>

                {/* Page mockup */}
                <div className="relative" style={{ backgroundColor: bg }}>
                    <div className="absolute inset-0 dot-bg opacity-20"></div>

                    <div className="relative p-6 sm:p-10" style={{ minHeight: '420px' }}>
                        <div className="max-w-md mx-auto">

                            {/* Nav */}
                            <div className="flex items-center justify-between mb-12">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-md" style={{ backgroundColor: primary }}></div>
                                    <div className="w-14 h-2 rounded-full" style={{ backgroundColor: textColor, opacity: 0.6 }}></div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-1.5 rounded-full" style={{ backgroundColor: textColor, opacity: 0.15 }}></div>
                                    ))}
                                    <div className="w-16 h-6 rounded-md" style={{ backgroundColor: primary, opacity: 0.8 }}></div>
                                </div>
                            </div>

                            {/* Hero */}
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-5" style={{ backgroundColor: `${primary}15`, border: `1px solid ${primary}30` }}>
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }}></div>
                                    <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: textColor, opacity: 0.3 }}></div>
                                </div>

                                <div className="space-y-2 flex flex-col items-center">
                                    <div className="h-5 rounded-md" style={{ width: '80%', backgroundColor: textColor, opacity: 0.75 }}></div>
                                    <div className="h-5 rounded-md" style={{ width: '60%', backgroundColor: textColor, opacity: 0.55 }}></div>
                                </div>

                                <div className="space-y-1.5 mt-4 flex flex-col items-center">
                                    <div className="h-2 rounded-full" style={{ width: '70%', backgroundColor: textColor, opacity: 0.12 }}></div>
                                    <div className="h-2 rounded-full" style={{ width: '55%', backgroundColor: textColor, opacity: 0.08 }}></div>
                                </div>

                                <div className="flex items-center justify-center gap-3 mt-6">
                                    <div className="w-28 h-9 rounded-lg" style={{ backgroundColor: primary }}></div>
                                    <div className="w-28 h-9 rounded-lg" style={{ border: `1.5px solid ${textColor}20` }}></div>
                                </div>
                            </div>

                            {/* Feature cards */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { color: primary, w: '70%' },
                                    { color: secondary, w: '85%' },
                                    { color: accent, w: '60%' }
                                ].map((card, i) => (
                                    <div key={i} className="rounded-xl p-4 space-y-3" style={{ backgroundColor: `${textColor}05`, border: `1px solid ${textColor}08` }}>
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}20` }}>
                                            <div className="w-3.5 h-3.5 rounded" style={{ backgroundColor: card.color, opacity: 0.7 }}></div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="h-2 rounded-full" style={{ width: card.w, backgroundColor: textColor, opacity: 0.2 }}></div>
                                            <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: textColor, opacity: 0.06 }}></div>
                                            <div className="h-1.5 rounded-full" style={{ width: '80%', backgroundColor: textColor, opacity: 0.04 }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-between mt-8 px-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="text-center space-y-1">
                                        <div className="w-10 h-3 rounded mx-auto" style={{ backgroundColor: textColor, opacity: 0.25 }}></div>
                                        <div className="w-14 h-1.5 rounded-full mx-auto" style={{ backgroundColor: textColor, opacity: 0.08 }}></div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-10 pt-4" style={{ borderTop: `1px solid ${textColor}08` }}>
                                <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: textColor, opacity: 0.1 }}></div>
                                <div className="flex gap-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: textColor, opacity: 0.08 }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-3 right-4">
                        <span className="text-[9px] font-medium tracking-widest uppercase" style={{ color: `${textColor}15` }}>Aurora</span>
                    </div>
                </div>
            </div>

            {visual.description && (
                <div className="card p-5 mt-3 enter enter-d2">
                    <div className="flex items-center gap-2 mb-3">
                        <Eye size={13} style={{ color: '#3f3f46' }} />
                        <span className="label">Visual Description</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#71717a' }}>{visual.description}</p>
                </div>
            )}

            {visual.prompt && (
                <details className="mt-2 group cursor-pointer">
                    <summary className="flex items-center gap-2 text-[11px] py-2 px-1 transition-colors" style={{ color: '#3f3f46' }}>
                        <Code2 size={11} />
                        <span>View generation prompt</span>
                    </summary>
                    <div className="card-flat p-4 mt-1">
                        <p className="text-[11px] font-mono leading-relaxed" style={{ color: '#3f3f46' }}>{visual.prompt}</p>
                    </div>
                </details>
            )}
        </div>
    )
}

export default VisualConcept