import { Eye, Code2, Layers, MousePointer2 } from 'lucide-react'
import { useState } from 'react'

function VisualConcept({ visual, brief }) {
    const [hoveredSection, setHoveredSection] = useState(null)
    const [activeView, setActiveView] = useState('desktop')

    if (!visual) return null
    const colors = visual.colors || []

    const bg = colors.find(c => c.name === 'Background')?.hex || '#111114'
    const primary = colors[0]?.hex || '#555'
    const secondary = colors[1]?.hex || '#444'
    const accent = colors[2]?.hex || '#666'
    const textColor = colors.find(c => c.name === 'Text')?.hex || '#eee'

    const sections = [
        { id: 'nav', label: 'Navigation', tip: brief?.layoutStructure?.ctaStrategy || 'Top navigation bar' },
        { id: 'hero', label: 'Hero Section', tip: brief?.layoutStructure?.heroStyle || 'Main hero area' },
        { id: 'features', label: 'Features', tip: 'Feature cards showcasing key benefits' },
        { id: 'stats', label: 'Social Proof', tip: 'Stats and trust indicators' },
        { id: 'footer', label: 'Footer', tip: 'Footer with links and info' }
    ]

    const sectionStyle = (id) => ({
        outline: hoveredSection === id ? `2px solid ${accent}` : '2px solid transparent',
        outlineOffset: '2px',
        borderRadius: '8px',
        transition: 'outline 0.2s ease',
        cursor: 'pointer',
        position: 'relative'
    })

    return (
        <div className="mt-14 enter">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="label mb-1">Visual Concept</p>
                    <h3 className="text-base font-semibold" style={{ color: '#e4e4e7' }}>Interactive Mockup</h3>
                </div>
                <div className="flex items-center gap-2">
                    {/* View toggle */}
                    <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #232329' }}>
                        {['desktop', 'tablet', 'mobile'].map(v => (
                            <button key={v} onClick={() => setActiveView(v)}
                                className="px-2.5 py-1 text-[10px] font-medium transition-all capitalize"
                                style={{
                                    backgroundColor: activeView === v ? '#1a1a1f' : 'transparent',
                                    color: activeView === v ? '#e4e4e7' : '#3f3f46'
                                }}>
                                {v}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MousePointer2 size={11} style={{ color: '#3f3f46' }} />
                        <span className="text-[10px]" style={{ color: '#3f3f46' }}>Hover sections</span>
                    </div>
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
                            <span className="text-[10px] font-mono" style={{ color: '#3f3f46' }}>
                                {brief?.projectTitle?.toLowerCase().replace(/\s+/g, '-') || 'aurora-design'}.com
                            </span>
                        </div>
                    </div>
                </div>

                {/* Mockup with responsive wrapper */}
                <div className="flex justify-center" style={{ backgroundColor: '#1a1a1f', padding: '24px' }}>
                    <div style={{
                        width: activeView === 'desktop' ? '100%' : activeView === 'tablet' ? '480px' : '320px',
                        transition: 'width 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                        backgroundColor: bg,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid #232329'
                    }}>
                        <div className="relative" style={{ backgroundColor: bg }}>
                            <div className="absolute inset-0 dot-bg opacity-10"></div>

                            <div className="relative p-6 sm:p-8" style={{ minHeight: '400px' }}>
                                <div className="max-w-md mx-auto">

                                    {/* Nav */}
                                    <div style={sectionStyle('nav')} onMouseEnter={() => setHoveredSection('nav')} onMouseLeave={() => setHoveredSection(null)}>
                                        {hoveredSection === 'nav' && <SectionLabel label="Navigation" color={accent} />}
                                        <div className="flex items-center justify-between mb-10 p-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-md" style={{ backgroundColor: primary }}></div>
                                                <div className="w-14 h-2 rounded-full" style={{ backgroundColor: textColor, opacity: 0.6 }}></div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {activeView !== 'mobile' && [1, 2, 3].map(i => (
                                                    <div key={i} className="w-8 h-1.5 rounded-full" style={{ backgroundColor: textColor, opacity: 0.15 }}></div>
                                                ))}
                                                <div className="h-6 rounded-md px-3" style={{ backgroundColor: primary, opacity: 0.8, width: activeView === 'mobile' ? '40px' : '60px' }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hero */}
                                    <div style={sectionStyle('hero')} onMouseEnter={() => setHoveredSection('hero')} onMouseLeave={() => setHoveredSection(null)}>
                                        {hoveredSection === 'hero' && <SectionLabel label="Hero" color={accent} />}
                                        <div className="text-center mb-10 p-2">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-5" style={{ backgroundColor: `${primary}15`, border: `1px solid ${primary}30` }}>
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }}></div>
                                                <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: textColor, opacity: 0.3 }}></div>
                                            </div>
                                            <div className="space-y-2 flex flex-col items-center">
                                                <div className="h-5 rounded-md" style={{ width: '80%', backgroundColor: textColor, opacity: 0.75 }}></div>
                                                <div className="h-5 rounded-md" style={{ width: '55%', backgroundColor: textColor, opacity: 0.55 }}></div>
                                            </div>
                                            <div className="space-y-1.5 mt-4 flex flex-col items-center">
                                                <div className="h-2 rounded-full" style={{ width: '65%', backgroundColor: textColor, opacity: 0.12 }}></div>
                                                <div className="h-2 rounded-full" style={{ width: '45%', backgroundColor: textColor, opacity: 0.08 }}></div>
                                            </div>
                                            <div className="flex items-center justify-center gap-3 mt-6">
                                                <div className="w-28 h-9 rounded-lg" style={{ backgroundColor: primary }}></div>
                                                <div className="w-28 h-9 rounded-lg" style={{ border: `1.5px solid ${textColor}20` }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div style={sectionStyle('features')} onMouseEnter={() => setHoveredSection('features')} onMouseLeave={() => setHoveredSection(null)}>
                                        {hoveredSection === 'features' && <SectionLabel label="Features" color={accent} />}
                                        <div className={`grid gap-3 p-2 ${activeView === 'mobile' ? 'grid-cols-1' : 'grid-cols-3'}`}>
                                            {[{ color: primary, w: '70%' }, { color: secondary, w: '85%' }, { color: accent, w: '60%' }].map((card, i) => (
                                                <div key={i} className="rounded-xl p-4 space-y-3" style={{ backgroundColor: `${textColor}05`, border: `1px solid ${textColor}08` }}>
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}20` }}>
                                                        <div className="w-3.5 h-3.5 rounded" style={{ backgroundColor: card.color, opacity: 0.7 }}></div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <div className="h-2 rounded-full" style={{ width: card.w, backgroundColor: textColor, opacity: 0.2 }}></div>
                                                        <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: textColor, opacity: 0.06 }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div style={sectionStyle('stats')} onMouseEnter={() => setHoveredSection('stats')} onMouseLeave={() => setHoveredSection(null)}>
                                        {hoveredSection === 'stats' && <SectionLabel label="Social Proof" color={accent} />}
                                        <div className={`flex items-center justify-between mt-8 px-2 py-4 ${activeView === 'mobile' ? 'flex-col gap-4' : ''}`}>
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="text-center space-y-1">
                                                    <div className="w-10 h-3 rounded mx-auto" style={{ backgroundColor: textColor, opacity: 0.25 }}></div>
                                                    <div className="w-14 h-1.5 rounded-full mx-auto" style={{ backgroundColor: textColor, opacity: 0.08 }}></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div style={sectionStyle('footer')} onMouseEnter={() => setHoveredSection('footer')} onMouseLeave={() => setHoveredSection(null)}>
                                        {hoveredSection === 'footer' && <SectionLabel label="Footer" color={accent} />}
                                        <div className="flex items-center justify-between mt-6 pt-4 px-2 pb-2" style={{ borderTop: `1px solid ${textColor}08` }}>
                                            <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: textColor, opacity: 0.1 }}></div>
                                            <div className="flex gap-2">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: textColor, opacity: 0.08 }}></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section info bar */}
                <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: '#131316', borderTop: '1px solid #232329' }}>
                    <div className="flex items-center gap-2">
                        <Layers size={12} style={{ color: '#3f3f46' }} />
                        <span className="text-[11px]" style={{ color: hoveredSection ? '#e4e4e7' : '#3f3f46' }}>
                            {hoveredSection ? sections.find(s => s.id === hoveredSection)?.tip : 'Hover over sections to explore'}
                        </span>
                    </div>
                    <span className="text-[10px] font-mono" style={{ color: '#27272a' }}>
                        {activeView} · {colors.length} colors
                    </span>
                </div>
            </div>

            {/* Description */}
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
                    <div className="p-4 mt-1" style={{ background: '#131316', border: '1px solid #232329', borderRadius: '16px' }}>
                        <p className="text-[11px] font-mono leading-relaxed" style={{ color: '#3f3f46' }}>{visual.prompt}</p>
                    </div>
                </details>
            )}
        </div>
    )
}

// Floating label that shows on hover
function SectionLabel({ label, color }) {
    return (
        <div className="absolute -top-3 left-3 z-10 fade">
            <span className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md" style={{ backgroundColor: color, color: '#fff' }}>
                {label}
            </span>
        </div>
    )
}

export default VisualConcept