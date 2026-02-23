import { Target, Type, Layout, Brain, Hash, Save, Copy, Check, Download } from 'lucide-react'
import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

function CopyHex({ hex, showToast }) {
    const [copied, setCopied] = useState(false)
    const copy = () => {
        navigator.clipboard.writeText(hex)
        setCopied(true)
        showToast(`Copied ${hex}`)
        setTimeout(() => setCopied(false), 1500)
    }
    return (
        <button onClick={copy} className="flex items-center gap-1 transition-colors" style={{ color: '#3f3f46' }}
            onMouseEnter={e => e.currentTarget.style.color = '#71717a'}
            onMouseLeave={e => e.currentTarget.style.color = '#3f3f46'}>
            {copied ? <Check size={10} /> : <Copy size={10} />}
            <span className="text-[10px] font-mono">{hex}</span>
        </button>
    )
}

function DesignBreakdown({ brief, onSave, showToast }) {
    if (!brief) return null
    const briefRef = useRef(null)

    const exportPDF = async () => {
        if (!briefRef.current) return
        showToast('Generating PDF...')
        try {
            const canvas = await html2canvas(briefRef.current, {
                backgroundColor: '#09090b', scale: 2
            })
            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF('p', 'mm', 'a4')
            const w = pdf.internal.pageSize.getWidth()
            const h = (canvas.height * w) / canvas.width
            pdf.addImage(imgData, 'PNG', 0, 0, w, h)
            pdf.save(`${brief.projectTitle || 'aurora-brief'}.pdf`)
            showToast('PDF downloaded')
        } catch (err) {
            showToast('PDF export failed')
            console.error(err)
        }
    }

    return (
        <div className="mt-16" ref={briefRef}>
            {/* Header with actions */}
            <div className="flex items-start justify-between mb-8 enter">
                <div>
                    <p className="label mb-2">Design Brief</p>
                    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight" style={{ color: '#e4e4e7' }}>
                        {brief.projectTitle || 'Untitled Project'}
                    </h2>
                    {brief.summary && (
                        <p className="text-sm mt-2 leading-relaxed max-w-lg" style={{ color: '#71717a' }}>{brief.summary}</p>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-4">
                    <button onClick={onSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all" style={{ backgroundColor: '#131316', border: '1px solid #232329', color: '#71717a' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#2e2e36'; e.currentTarget.style.color = '#e4e4e7' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#232329'; e.currentTarget.style.color = '#71717a' }}>
                        <Save size={12} /> Save
                    </button>
                    <button onClick={exportPDF} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all" style={{ backgroundColor: '#131316', border: '1px solid #232329', color: '#71717a' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#2e2e36'; e.currentTarget.style.color = '#e4e4e7' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#232329'; e.currentTarget.style.color = '#71717a' }}>
                        <Download size={12} /> PDF
                    </button>
                </div>
            </div>

            {/* Color Palette */}
            {brief.colorPalette?.length > 0 && (
                <div className="mb-6 enter enter-d1">
                    <div className="card overflow-hidden">
                        <div className="flex" style={{ height: '96px' }}>
                            {brief.colorPalette.map((c, i) => (
                                <div key={i} className="flex-1 relative group cursor-crosshair" style={{ backgroundColor: c.hex, transition: 'flex 0.3s ease' }}
                                    onMouseEnter={e => e.currentTarget.style.flex = '1.5'}
                                    onMouseLeave={e => e.currentTarget.style.flex = '1'}>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
                                        <span className="text-white text-[10px] font-semibold uppercase tracking-wider">{c.name}</span>
                                        <span className="text-white text-[11px] font-mono mt-0.5 opacity-70">{c.hex}</span>
                                        <span className="text-white text-[9px] mt-1 opacity-50">{c.usage}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 flex flex-wrap gap-x-5 gap-y-2">
                            {brief.colorPalette.map((c, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex, boxShadow: '0 0 0 1px rgba(255,255,255,0.1)' }}></div>
                                    <span className="text-[11px] font-medium" style={{ color: '#71717a' }}>{c.name}</span>
                                    <CopyHex hex={c.hex} showToast={showToast} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {brief.targetAudience && (
                    <div className="card p-5 enter enter-d2">
                        <div className="flex items-center gap-2 mb-3">
                            <Target size={13} style={{ color: '#3f3f46' }} />
                            <span className="label">Audience</span>
                        </div>
                        <p className="text-sm font-medium" style={{ color: '#e4e4e7' }}>{brief.targetAudience.primary}</p>
                        <div className="flex flex-wrap gap-2 mt-2.5">
                            <span className="tag">{brief.targetAudience.ageRange}</span>
                        </div>
                        <p className="text-xs mt-2.5 leading-relaxed" style={{ color: '#71717a' }}>{brief.targetAudience.psychographics}</p>
                    </div>
                )}

                {brief.toneAndPersonality && (
                    <div className="card p-5 enter enter-d3">
                        <div className="flex items-center gap-2 mb-3">
                            <Hash size={13} style={{ color: '#3f3f46' }} />
                            <span className="label">Tone & Voice</span>
                        </div>
                        <div className="flex gap-2 mb-3">
                            <span className="tag">{brief.toneAndPersonality.primary}</span>
                            <span className="tag">{brief.toneAndPersonality.secondary}</span>
                        </div>
                        <p className="text-xs italic leading-relaxed" style={{ color: '#71717a' }}>"{brief.toneAndPersonality.brandVoice}"</p>
                    </div>
                )}

                {brief.typography && (
                    <div className="card p-5 enter enter-d4">
                        <div className="flex items-center gap-2 mb-3">
                            <Type size={13} style={{ color: '#3f3f46' }} />
                            <span className="label">Typography</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-lg font-semibold" style={{ color: '#e4e4e7' }}>{brief.typography.headingFont}</span>
                            <span className="text-[10px]" style={{ color: '#3f3f46' }}>Heading</span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-sm" style={{ color: '#71717a' }}>{brief.typography.bodyFont}</span>
                            <span className="text-[10px]" style={{ color: '#3f3f46' }}>Body</span>
                        </div>
                        <p className="text-xs mt-3" style={{ color: '#3f3f46' }}>{brief.typography.style}</p>
                    </div>
                )}

                {brief.layoutStructure && (
                    <div className="card p-5 enter enter-d5">
                        <div className="flex items-center gap-2 mb-3">
                            <Layout size={13} style={{ color: '#3f3f46' }} />
                            <span className="label">Layout</span>
                        </div>
                        <div className="space-y-1">
                            {brief.layoutStructure.sections?.map((s, i) => (
                                <div key={i} className="flex items-center gap-2.5">
                                    <div className="w-4 h-px" style={{ backgroundColor: '#232329' }}></div>
                                    <span className="text-xs" style={{ color: '#71717a' }}>{s}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 pt-3" style={{ borderTop: '1px solid #232329' }}>
                            <p className="text-[11px]" style={{ color: '#3f3f46' }}>{brief.layoutStructure.heroStyle}</p>
                        </div>
                    </div>
                )}
            </div>

            {brief.uxReasoning && (
                <div className="mt-3 enter enter-d6">
                    <div className="card p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, #3f3f46, transparent)', opacity: 0.3 }}></div>
                        <div className="flex items-center gap-2 mb-3">
                            <Brain size={13} style={{ color: '#3f3f46' }} />
                            <span className="label">Design Reasoning</span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: '#71717a' }}>{brief.uxReasoning}</p>
                    </div>
                </div>
            )}

            {brief.moodKeywords?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-5 enter enter-d6">
                    {brief.moodKeywords.map((k, i) => (
                        <span key={i} className="text-[11px]" style={{ color: '#3f3f46' }}>#{k}</span>
                    ))}
                </div>
            )}
        </div>
    )
}

export default DesignBreakdown