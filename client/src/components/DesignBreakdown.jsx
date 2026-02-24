import { Target, Type, Layout, Brain, Hash, Save, Copy, Check, Download, Code2, Shield, Zap } from 'lucide-react'
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

function DesignBreakdown({ brief, onSave, showToast, onShowCode, showingCode, visual }) {
    if (!brief) return null

    const handlePDF = () => {
        showToast('Generating PDF...')
        try {
            generatePDF(brief, visual)
            showToast('PDF downloaded')
        } catch (err) {
            console.error(err)
            showToast('PDF failed')
        }
    }

    return (
        <div className="mt-16">
            {/* Header */}
            <div className="flex items-start justify-between mb-8 enter">
                <div className="min-w-0 flex-1">
                    <p className="label mb-2">Design Brief</p>
                    <h2 className="text-xl sm:text-2xl font-semibold tracking-tight" style={{ color: '#e4e4e7' }}>
                        {brief.projectTitle || 'Untitled'}
                    </h2>
                    {brief.summary && (
                        <p className="text-sm mt-2 leading-relaxed max-w-lg" style={{ color: '#71717a' }}>{brief.summary}</p>
                    )}
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0 ml-4 flex-wrap justify-end">
                    <ActionBtn onClick={onShowCode} active={showingCode} icon={<Code2 size={12} />} label="Code" />
                    <ActionBtn onClick={onSave} icon={<Save size={12} />} label="Save" />
                    <ActionBtn onClick={handlePDF} icon={<Download size={12} />} label="PDF" />
                </div>
            </div>

            {/* Color Palette */}
            {brief.colorPalette?.length > 0 && (
                <div className="mb-6 enter enter-d1">
                    <div className="card overflow-hidden">
                        <div className="flex" style={{ height: '96px' }}>
                            {brief.colorPalette.map((c, i) => (
                                <div key={i} className="flex-1 relative group cursor-crosshair"
                                    style={{ backgroundColor: c.hex, transition: 'flex 0.3s' }}
                                    onMouseEnter={e => e.currentTarget.style.flex = '1.5'}
                                    onMouseLeave={e => e.currentTarget.style.flex = '1'}>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                                        <span className="text-white text-[10px] font-semibold uppercase tracking-wider">{c.name}</span>
                                        <span className="text-white text-[11px] font-mono mt-0.5 opacity-70">{c.hex}</span>
                                        <span className="text-white text-[9px] mt-1 opacity-40 max-w-[100px] text-center">{c.psychology || c.usage}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 space-y-3">
                            {brief.colorPalette.map((c, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="w-4 h-4 rounded-md flex-shrink-0 mt-0.5"
                                        style={{ backgroundColor: c.hex, boxShadow: '0 0 0 1px rgba(255,255,255,0.1)' }}></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-medium" style={{ color: '#e4e4e7' }}>{c.name}</span>
                                            <CopyHex hex={c.hex} showToast={showToast} />
                                        </div>
                                        {c.psychology && (
                                            <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: '#52525b' }}>{c.psychology}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Audience */}
                {brief.targetAudience && (
                    <InfoCard icon={<Target size={13} />} label="Audience" delay="enter-d2">
                        <p className="text-sm font-medium" style={{ color: '#e4e4e7' }}>{brief.targetAudience.primary}</p>
                        <div className="flex flex-wrap gap-2 mt-2"><span className="tag">{brief.targetAudience.ageRange}</span></div>
                        <p className="text-xs mt-2 leading-relaxed" style={{ color: '#71717a' }}>{brief.targetAudience.psychographics}</p>
                        {brief.targetAudience.painPoints && (
                            <div className="mt-3 pt-3" style={{ borderTop: '1px solid #232329' }}>
                                <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: '#3f3f46' }}>Pain Points</p>
                                <p className="text-xs" style={{ color: '#52525b' }}>{brief.targetAudience.painPoints}</p>
                            </div>
                        )}
                        {brief.targetAudience.designImplication && (
                            <p className="text-[11px] mt-2 italic" style={{ color: '#3f3f46' }}>→ {brief.targetAudience.designImplication}</p>
                        )}
                    </InfoCard>
                )}

                {/* Tone */}
                {brief.toneAndPersonality && (
                    <InfoCard icon={<Hash size={13} />} label="Tone & Voice" delay="enter-d3">
                        <div className="flex gap-2 mb-2">
                            <span className="tag">{brief.toneAndPersonality.primary}</span>
                            <span className="tag">{brief.toneAndPersonality.secondary}</span>
                        </div>
                        <p className="text-xs italic" style={{ color: '#71717a' }}>"{brief.toneAndPersonality.brandVoice}"</p>
                        {brief.toneAndPersonality.emotionalGoal && (
                            <div className="mt-3 pt-3" style={{ borderTop: '1px solid #232329' }}>
                                <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: '#3f3f46' }}>Emotional Goal</p>
                                <p className="text-xs" style={{ color: '#52525b' }}>{brief.toneAndPersonality.emotionalGoal}</p>
                            </div>
                        )}
                        {brief.toneAndPersonality.reasoning && (
                            <p className="text-[11px] mt-2 italic" style={{ color: '#3f3f46' }}>→ {brief.toneAndPersonality.reasoning}</p>
                        )}
                    </InfoCard>
                )}

                {/* Typography */}
                {brief.typography && (
                    <InfoCard icon={<Type size={13} />} label="Typography" delay="enter-d4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-lg font-semibold" style={{ color: '#e4e4e7' }}>{brief.typography.headingFont}</span>
                            <span className="text-[10px]" style={{ color: '#3f3f46' }}>Heading</span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-sm" style={{ color: '#71717a' }}>{brief.typography.bodyFont}</span>
                            <span className="text-[10px]" style={{ color: '#3f3f46' }}>Body</span>
                        </div>
                        {brief.typography.scale && (
                            <p className="text-[10px] mt-2" style={{ color: '#3f3f46' }}>Scale: {brief.typography.scale}</p>
                        )}
                        {brief.typography.reasoning && (
                            <div className="mt-3 pt-3" style={{ borderTop: '1px solid #232329' }}>
                                <p className="text-[11px] leading-relaxed" style={{ color: '#52525b' }}>{brief.typography.reasoning}</p>
                            </div>
                        )}
                    </InfoCard>
                )}

                {/* Layout */}
                {brief.layoutStructure && (
                    <InfoCard icon={<Layout size={13} />} label="Layout" delay="enter-d5">
                        <div className="space-y-1 mb-3">
                            {brief.layoutStructure.sections?.map((s, i) => (
                                <div key={i} className="flex items-center gap-2.5">
                                    <span className="text-[9px] w-3 text-right" style={{ color: '#27272a' }}>{i + 1}</span>
                                    <div className="w-3 h-px" style={{ backgroundColor: '#232329' }}></div>
                                    <span className="text-xs" style={{ color: '#71717a' }}>{s}</span>
                                </div>
                            ))}
                        </div>
                        {brief.layoutStructure.userFlow && (
                            <div className="pt-3" style={{ borderTop: '1px solid #232329' }}>
                                <p className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: '#3f3f46' }}>User Flow</p>
                                <p className="text-[11px]" style={{ color: '#52525b' }}>{brief.layoutStructure.userFlow}</p>
                            </div>
                        )}
                        {brief.layoutStructure.reasoning && (
                            <p className="text-[11px] mt-2 italic" style={{ color: '#3f3f46' }}>→ {brief.layoutStructure.reasoning}</p>
                        )}
                    </InfoCard>
                )}
            </div>

            {/* UX Reasoning */}
            {brief.uxReasoning && (
                <div className="mt-3 enter enter-d6">
                    <div className="card p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, #3f3f46, transparent)', opacity: 0.3 }}></div>
                        <div className="flex items-center gap-2 mb-3">
                            <Brain size={13} style={{ color: '#3f3f46' }} />
                            <span className="label">Strategic Reasoning</span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: '#a1a1aa' }}>{brief.uxReasoning}</p>
                    </div>
                </div>
            )}

            {/* Extra insights row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {brief.accessibilityNotes && (
                    <div className="card p-4 enter enter-d6">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield size={12} style={{ color: '#3f3f46' }} />
                            <span className="label">Accessibility</span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: '#52525b' }}>{brief.accessibilityNotes}</p>
                    </div>
                )}
                {brief.competitiveInsight && (
                    <div className="card p-4 enter enter-d6">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap size={12} style={{ color: '#3f3f46' }} />
                            <span className="label">Differentiator</span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: '#52525b' }}>{brief.competitiveInsight}</p>
                    </div>
                )}
            </div>

            {/* Mood */}
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

function InfoCard({ icon, label, delay, children }) {
    return (
        <div className={`card p-5 enter ${delay}`}>
            <div className="flex items-center gap-2 mb-3">
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
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