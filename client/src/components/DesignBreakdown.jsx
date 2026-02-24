import { Target, Type, Layout, Brain, Hash, Save, Copy, Check, Download, Code2, Shield, Zap, Palette } from 'lucide-react'
import { useState } from 'react'
import { generatePDF } from '../utils/pdf'

function CopyHex({ hex, showToast }) {
    const [copied, setCopied] = useState(false)
    const copy = (e) => {
        e.stopPropagation()
        navigator.clipboard.writeText(hex)
        setCopied(true)
        showToast(`Copied ${hex}`)
        setTimeout(() => setCopied(false), 1500)
    }
    return (
        <button onClick={copy} className="flex items-center gap-1 transition-colors"
            style={{ color: '#3f3f46' }}
            onMouseEnter={e => e.currentTarget.style.color = '#e4e4e7'}
            onMouseLeave={e => e.currentTarget.style.color = '#3f3f46'}>
            {copied ? <Check size={10} /> : <Copy size={10} />}
            <span className="text-[10px] font-mono">{hex}</span>
        </button>
    )
}

function DesignBreakdown({ brief, visual, onSave, showToast, onShowCode, showingCode }) {
    if (!brief) return null

    const handlePDF = () => {
        showToast('Generating PDF...')
        try { generatePDF(brief, visual); showToast('PDF downloaded') }
        catch (err) { console.error(err); showToast('PDF failed') }
    }

    return (
        <div className="mt-10 sm:mt-16">
            {/* Header — stacks on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 enter">
                <div className="min-w-0 flex-1">
                    <p className="label mb-1 sm:mb-2">Design Brief</p>
                    <h2 className="text-lg sm:text-2xl font-semibold tracking-tight" style={{ color: '#e4e4e7' }}>
                        {brief.projectTitle || 'Untitled'}
                    </h2>
                    {brief.summary && (
                        <p className="text-xs sm:text-sm mt-1.5 sm:mt-2 leading-relaxed" style={{ color: '#71717a' }}>{brief.summary}</p>
                    )}
                    {brief.projectType && (
                        <div className="mt-2"><span className="tag">{brief.projectType}</span></div>
                    )}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                    <ActionBtn onClick={onShowCode} active={showingCode} icon={<Code2 size={12} />} label="Code" />
                    <ActionBtn onClick={onSave} icon={<Save size={12} />} label="Save" />
                    <ActionBtn onClick={handlePDF} icon={<Download size={12} />} label="PDF" />
                </div>
            </div>

            {/* Colors */}
            {brief.colorPalette?.length > 0 && (
                <div className="mb-4 sm:mb-6 enter enter-d1">
                    <div className="card overflow-hidden">
                        <div className="flex" style={{ height: '72px' }}>
                            {brief.colorPalette.map((c, i) => (
                                <div key={i} className="flex-1 relative group cursor-crosshair"
                                    style={{ backgroundColor: c.hex, transition: 'flex 0.3s' }}
                                    onMouseEnter={e => e.currentTarget.style.flex = '1.5'}
                                    onMouseLeave={e => e.currentTarget.style.flex = '1'}>
                                    <div className="absolute inset-0 flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex"
                                        style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                                        <span className="text-white text-[9px] font-semibold uppercase tracking-wider">{c.name}</span>
                                        <span className="text-white text-[10px] font-mono mt-0.5 opacity-70">{c.hex}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 sm:p-4 space-y-2.5 sm:space-y-3">
                            {brief.colorPalette.map((c, i) => (
                                <div key={i} className="flex items-start gap-2.5 sm:gap-3">
                                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md flex-shrink-0 mt-0.5"
                                        style={{ backgroundColor: c.hex, boxShadow: '0 0 0 1px rgba(255,255,255,0.1)' }}></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-[11px] font-medium" style={{ color: '#e4e4e7' }}>{c.name}</span>
                                            <CopyHex hex={c.hex} showToast={showToast} />
                                        </div>
                                        {c.reasoning && (
                                            <p className="text-[10px] sm:text-[11px] mt-0.5 leading-relaxed" style={{ color: '#52525b' }}>{c.reasoning}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Info Grid — single column on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {brief.targetAudience && (
                    <InfoCard icon={<Target size={13} />} label="Audience" delay="enter-d2">
                        <p className="text-xs sm:text-sm font-medium" style={{ color: '#e4e4e7' }}>{brief.targetAudience.primary}</p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2"><span className="tag">{brief.targetAudience.ageRange}</span></div>
                        <p className="text-[11px] sm:text-xs mt-2 leading-relaxed" style={{ color: '#71717a' }}>{brief.targetAudience.psychographics}</p>
                        {brief.targetAudience.painPoints && (
                            <div className="mt-2.5 pt-2.5" style={{ borderTop: '1px solid #232329' }}>
                                <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: '#3f3f46' }}>Pain Points</p>
                                <p className="text-[11px] sm:text-xs" style={{ color: '#52525b' }}>{brief.targetAudience.painPoints}</p>
                            </div>
                        )}
                        {brief.targetAudience.designImplication && (
                            <p className="text-[10px] sm:text-[11px] mt-2 italic" style={{ color: '#3f3f46' }}>→ {brief.targetAudience.designImplication}</p>
                        )}
                    </InfoCard>
                )}

                {brief.toneAndPersonality && (
                    <InfoCard icon={<Hash size={13} />} label="Tone & Voice" delay="enter-d3">
                        <div className="flex gap-1.5 sm:gap-2 mb-2">
                            <span className="tag">{brief.toneAndPersonality.primary}</span>
                            <span className="tag">{brief.toneAndPersonality.secondary}</span>
                        </div>
                        <p className="text-[11px] sm:text-xs italic" style={{ color: '#71717a' }}>"{brief.toneAndPersonality.brandVoice}"</p>
                        {brief.toneAndPersonality.emotionalGoal && (
                            <div className="mt-2.5 pt-2.5" style={{ borderTop: '1px solid #232329' }}>
                                <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: '#3f3f46' }}>Emotional Goal</p>
                                <p className="text-[11px] sm:text-xs" style={{ color: '#52525b' }}>{brief.toneAndPersonality.emotionalGoal}</p>
                            </div>
                        )}
                        {brief.toneAndPersonality.reasoning && (
                            <p className="text-[10px] sm:text-[11px] mt-2 italic" style={{ color: '#3f3f46' }}>→ {brief.toneAndPersonality.reasoning}</p>
                        )}
                    </InfoCard>
                )}

                {brief.typography && (
                    <InfoCard icon={<Type size={13} />} label="Typography" delay="enter-d4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-base sm:text-lg font-semibold" style={{ color: '#e4e4e7' }}>{brief.typography.headingFont}</span>
                            <span className="text-[9px] sm:text-[10px]" style={{ color: '#3f3f46' }}>Heading</span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-xs sm:text-sm" style={{ color: '#71717a' }}>{brief.typography.bodyFont}</span>
                            <span className="text-[9px] sm:text-[10px]" style={{ color: '#3f3f46' }}>Body</span>
                        </div>
                        {brief.typography.reasoning && (
                            <div className="mt-2.5 pt-2.5" style={{ borderTop: '1px solid #232329' }}>
                                <p className="text-[10px] sm:text-[11px] leading-relaxed" style={{ color: '#52525b' }}>{brief.typography.reasoning}</p>
                            </div>
                        )}
                    </InfoCard>
                )}

                {brief.layoutStructure && (
                    <InfoCard icon={<Layout size={13} />} label="Layout" delay="enter-d5">
                        <div className="space-y-1 mb-2">
                            {brief.layoutStructure.sections?.map((s, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className="text-[8px] sm:text-[9px] w-3 text-right" style={{ color: '#27272a' }}>{i + 1}</span>
                                    <div className="w-3 h-px" style={{ backgroundColor: '#232329' }}></div>
                                    <span className="text-[11px] sm:text-xs" style={{ color: '#71717a' }}>{s}</span>
                                </div>
                            ))}
                        </div>
                        {brief.layoutStructure.userFlow && (
                            <div className="pt-2.5" style={{ borderTop: '1px solid #232329' }}>
                                <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: '#3f3f46' }}>User Flow</p>
                                <p className="text-[10px] sm:text-[11px]" style={{ color: '#52525b' }}>{brief.layoutStructure.userFlow}</p>
                            </div>
                        )}
                    </InfoCard>
                )}

                {/* Visual Elements */}
                {brief.visualElements && (
                    <InfoCard icon={<Palette size={13} />} label="Visual Elements" delay="enter-d5" span2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: '#3f3f46' }}>Hero Image</p>
                                <p className="text-[11px] sm:text-xs" style={{ color: '#71717a' }}>{brief.visualElements.heroImage}</p>
                            </div>
                            <div>
                                <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: '#3f3f46' }}>Icon Style</p>
                                <p className="text-[11px] sm:text-xs" style={{ color: '#71717a' }}>{brief.visualElements.iconStyle}</p>
                            </div>
                            {brief.visualElements.supportingImages?.length > 0 && (
                                <div className="sm:col-span-2">
                                    <p className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: '#3f3f46' }}>Supporting Visuals</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {brief.visualElements.supportingImages.map((img, i) => (
                                            <span key={i} className="tag">{img}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </InfoCard>
                )}
            </div>

            {/* Reasoning */}
            {brief.uxReasoning && (
                <div className="mt-2.5 sm:mt-3 enter enter-d6">
                    <div className="card p-4 sm:p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, #3f3f46, transparent)', opacity: 0.3 }}></div>
                        <div className="flex items-center gap-2 mb-2 sm:mb-3">
                            <Brain size={13} style={{ color: '#3f3f46' }} />
                            <span className="label">Strategic Reasoning</span>
                        </div>
                        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#a1a1aa' }}>{brief.uxReasoning}</p>
                    </div>
                </div>
            )}

            {/* Extra row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mt-2.5 sm:mt-3">
                {brief.accessibilityNotes && (
                    <div className="card p-3 sm:p-4 enter enter-d6">
                        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                            <Shield size={12} style={{ color: '#3f3f46' }} />
                            <span className="label">Accessibility</span>
                        </div>
                        <p className="text-[11px] sm:text-xs leading-relaxed" style={{ color: '#52525b' }}>{brief.accessibilityNotes}</p>
                    </div>
                )}
                {brief.competitiveInsight && (
                    <div className="card p-3 sm:p-4 enter enter-d6">
                        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                            <Zap size={12} style={{ color: '#3f3f46' }} />
                            <span className="label">Differentiator</span>
                        </div>
                        <p className="text-[11px] sm:text-xs leading-relaxed" style={{ color: '#52525b' }}>{brief.competitiveInsight}</p>
                    </div>
                )}
            </div>

            {/* Mood */}
            {brief.moodKeywords?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4 sm:mt-5 enter enter-d6">
                    {brief.moodKeywords.map((k, i) => (
                        <span key={i} className="text-[10px] sm:text-[11px]" style={{ color: '#3f3f46' }}>#{k}</span>
                    ))}
                </div>
            )}
        </div>
    )
}

function InfoCard({ icon, label, delay, children, span2 }) {
    return (
        <div className={`card p-4 sm:p-5 enter ${delay} ${span2 ? 'sm:col-span-2' : ''}`}>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <span style={{ color: '#3f3f46' }}>{icon}</span>
                <span className="label">{label}</span>
            </div>
            {children}
        </div>
    )
}

function ActionBtn({ onClick, icon, label, active }) {
    return (
        <button onClick={onClick}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-medium transition-all"
            style={{
                backgroundColor: active ? '#e4e4e7' : '#131316',
                border: active ? '1px solid #e4e4e7' : '1px solid #232329',
                color: active ? '#09090b' : '#71717a'
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = '#2e2e36'; e.currentTarget.style.color = '#e4e4e7' } }}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = '#232329'; e.currentTarget.style.color = '#71717a' } }}>
            {icon} {label}
        </button>
    )
}

export default DesignBreakdown