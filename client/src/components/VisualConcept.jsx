import { Eye, Code2 } from 'lucide-react'
import { useState } from 'react'

// Dynamic layout renderers based on project type
const layouts = {
    landing: LandingLayout,
    ecommerce: EcommerceLayout,
    dashboard: DashboardLayout,
    social: SocialLayout,
    media: MediaLayout,
    portfolio: PortfolioLayout,
    blog: BlogLayout,
    app: AppLayout,
    saas: SaasLayout,
}

function VisualConcept({ visual, brief }) {
    const [hoveredSection, setHoveredSection] = useState(null)
    if (!visual) return null

    const colors = visual.colors || []
    const bg = colors.find(c => c.name === 'Background')?.hex || '#111'
    const primary = colors[0]?.hex || '#555'
    const secondary = colors[1]?.hex || '#444'
    const accent = colors[2]?.hex || '#666'
    const text = colors.find(c => c.name === 'Text')?.hex || '#eee'
    const type = brief?.projectType || 'landing'
    const ve = brief?.visualElements || {}
    const symbol = ve.brandSymbol || '✦'

    const LayoutComponent = layouts[type] || LandingLayout
    const palette = { bg, primary, secondary, accent, text }

    return (
        <div className="mt-14 enter">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="label mb-1">Visual Concept</p>
                    <h3 className="text-sm sm:text-base font-semibold" style={{ color: '#e4e4e7' }}>
                        {type.charAt(0).toUpperCase() + type.slice(1)} Mockup
                    </h3>
                </div>
                <span className="tag">{type}</span>
            </div>

            {/* Phone Frame */}
            <div className="flex justify-center enter enter-d1">
                <div className="relative" style={{ width: '100%', maxWidth: '375px' }}>
                    {/* Phone bezel */}
                    <div style={{
                        background: '#1a1a1f',
                        borderRadius: '40px',
                        padding: '12px',
                        border: '1px solid #2e2e36',
                        boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset'
                    }}>
                        {/* Notch */}
                        <div className="flex justify-center mb-2">
                            <div style={{ width: '120px', height: '28px', backgroundColor: '#1a1a1f', borderRadius: '0 0 16px 16px', position: 'relative', zIndex: 10, marginTop: '-2px' }}>
                                <div className="flex items-center justify-center gap-2 pt-2">
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#232329' }}></div>
                                    <div style={{ width: '40px', height: '4px', borderRadius: '4px', backgroundColor: '#232329' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Screen */}
                        <div style={{
                            borderRadius: '28px',
                            overflow: 'hidden',
                            backgroundColor: bg,
                            minHeight: '600px',
                            position: 'relative'
                        }}>
                            <LayoutComponent
                                p={palette} symbol={symbol} ve={ve} brief={brief}
                                hovered={hoveredSection} setHovered={setHoveredSection}
                            />
                        </div>

                        {/* Home indicator */}
                        <div className="flex justify-center mt-2">
                            <div style={{ width: '36%', height: '4px', borderRadius: '4px', backgroundColor: '#232329' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hovered section info */}
            {hoveredSection && (
                <div className="mt-4 text-center fade">
                    <span className="tag">{hoveredSection}</span>
                </div>
            )}

            {/* Description */}
            {visual.description && (
                <div className="card p-4 sm:p-5 mt-4 enter enter-d2">
                    <div className="flex items-center gap-2 mb-3">
                        <Eye size={13} style={{ color: '#3f3f46' }} />
                        <span className="label">Visual Description</span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#71717a' }}>{visual.description}</p>
                </div>
            )}

            {visual.prompt && (
                <details className="mt-2 cursor-pointer">
                    <summary className="flex items-center gap-2 text-[11px] py-2 px-1" style={{ color: '#3f3f46' }}>
                        <Code2 size={11} /> View prompt
                    </summary>
                    <div className="p-3 sm:p-4 mt-1" style={{ background: '#131316', border: '1px solid #232329', borderRadius: '16px' }}>
                        <p className="text-[10px] sm:text-[11px] font-mono leading-relaxed break-words" style={{ color: '#3f3f46' }}>{visual.prompt}</p>
                    </div>
                </details>
            )}
        </div>
    )
}

// ============================================
// HELPER COMPONENTS
// ============================================

function Section({ id, hovered, setHovered, accent, children, className = '' }) {
    return (
        <div
            className={className}
            style={{
                outline: hovered === id ? `2px solid ${accent}` : '2px solid transparent',
                outlineOffset: '-2px', borderRadius: '6px', transition: 'outline 0.15s', cursor: 'default', position: 'relative'
            }}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
        >
            {hovered === id && (
                <div className="absolute -top-2 left-2 z-20 fade">
                    <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: accent, color: '#fff' }}>{id}</span>
                </div>
            )}
            {children}
        </div>
    )
}

function ImgPlaceholder({ w = '100%', h = '80px', color, label, rounded = '8px' }) {
    return (
        <div style={{ width: w, height: h, backgroundColor: `${color}15`, borderRadius: rounded, border: `1px dashed ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <div className="text-center">
                <div style={{ fontSize: '16px', opacity: 0.4 }}>{label || '🖼'}</div>
                <div style={{ fontSize: '7px', color: `${color}40`, marginTop: '2px' }}>image</div>
            </div>
        </div>
    )
}

function Bar({ w, h = '2px', color, opacity = 0.2, rounded = '4px', mt = '0' }) {
    return <div style={{ width: w, height: h, backgroundColor: color, opacity, borderRadius: rounded, marginTop: mt }}></div>
}

// ============================================
// LAYOUT: LANDING PAGE
// ============================================
function LandingLayout({ p, symbol, ve, brief, hovered, setHovered }) {
    return (
        <div className="p-4">
            <Section id="nav" hovered={hovered} setHovered={setHovered} accent={p.accent}>
                <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-1.5">
                        <span style={{ fontSize: '14px' }}>{symbol}</span>
                        <Bar w="36px" h="6px" color={p.text} opacity={0.5} />
                    </div>
                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: p.primary }}></div>
                </div>
            </Section>

            <Section id="hero" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-4">
                <div className="text-center py-6">
                    <div className="inline-block px-3 py-1 rounded-full mb-4" style={{ backgroundColor: `${p.accent}15`, border: `1px solid ${p.accent}30` }}>
                        <Bar w="50px" h="4px" color={p.accent} opacity={0.6} />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <Bar w="85%" h="10px" color={p.text} opacity={0.7} />
                        <Bar w="60%" h="10px" color={p.text} opacity={0.5} />
                    </div>
                    <div className="flex flex-col items-center gap-1 mt-3">
                        <Bar w="75%" h="4px" color={p.text} opacity={0.12} />
                        <Bar w="55%" h="4px" color={p.text} opacity={0.08} />
                    </div>
                    <div className="flex justify-center gap-2 mt-5">
                        <div style={{ width: '100px', height: '36px', borderRadius: '8px', backgroundColor: p.primary }}></div>
                        <div style={{ width: '100px', height: '36px', borderRadius: '8px', border: `1.5px solid ${p.text}20` }}></div>
                    </div>
                </div>
            </Section>

            <Section id="visual" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-4">
                <ImgPlaceholder h="140px" color={p.primary} label={symbol} rounded="12px" />
                {ve.heroImage && <p style={{ fontSize: '7px', color: `${p.text}30`, textAlign: 'center', marginTop: '4px' }}>{ve.heroImage}</p>}
            </Section>

            <Section id="features" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-6">
                <div className="grid grid-cols-2 gap-2">
                    {(ve.supportingImages || ['', '', '', '']).slice(0, 4).map((img, i) => (
                        <div key={i} className="p-3 rounded-xl" style={{ backgroundColor: `${p.text}05`, border: `1px solid ${p.text}06` }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '6px', backgroundColor: `${[p.primary, p.secondary, p.accent, p.primary][i]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: [p.primary, p.secondary, p.accent, p.primary][i], opacity: 0.6 }}></div>
                            </div>
                            <Bar w="70%" h="5px" color={p.text} opacity={0.2} mt="8px" />
                            <Bar w="100%" h="3px" color={p.text} opacity={0.06} mt="4px" />
                            <Bar w="80%" h="3px" color={p.text} opacity={0.04} mt="2px" />
                        </div>
                    ))}
                </div>
            </Section>

            <Section id="cta" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-6">
                <div className="p-4 rounded-xl text-center" style={{ backgroundColor: `${p.primary}10`, border: `1px solid ${p.primary}20` }}>
                    <Bar w="60%" h="6px" color={p.text} opacity={0.3} mt="0" />
                    <div className="flex justify-center mt-3">
                        <div style={{ width: '120px', height: '32px', borderRadius: '8px', backgroundColor: p.primary }}></div>
                    </div>
                </div>
            </Section>
        </div>
    )
}

// ============================================
// LAYOUT: ECOMMERCE
// ============================================
function EcommerceLayout({ p, symbol, ve, brief, hovered, setHovered }) {
    return (
        <div className="p-4">
            <Section id="header" hovered={hovered} setHovered={setHovered} accent={p.accent}>
                <div className="flex items-center justify-between py-2">
                    <span style={{ fontSize: '14px' }}>{symbol}</span>
                    <Bar w="80px" h="28px" color={p.text} opacity={0.08} rounded="8px" />
                    <div className="flex gap-2">
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: `${p.text}15` }}></div>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: `${p.primary}30` }}></div>
                    </div>
                </div>
            </Section>

            <Section id="categories" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-3">
                <div className="flex gap-2 overflow-hidden">
                    {['All', 'New', 'Sale', 'Top'].map((cat, i) => (
                        <div key={i} className="flex-shrink-0 px-3 py-1.5 rounded-full text-center" style={{
                            backgroundColor: i === 0 ? p.primary : `${p.text}08`,
                            border: i === 0 ? 'none' : `1px solid ${p.text}10`
                        }}>
                            <Bar w="24px" h="4px" color={i === 0 ? p.bg : p.text} opacity={i === 0 ? 0.8 : 0.3} />
                        </div>
                    ))}
                </div>
            </Section>

            <Section id="featured" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-4">
                <ImgPlaceholder h="160px" color={p.accent} label="🛍️" rounded="12px" />
                <div className="flex justify-between items-center mt-2">
                    <Bar w="60%" h="6px" color={p.text} opacity={0.3} />
                    <Bar w="50px" h="20px" color={p.primary} opacity={0.8} rounded="6px" />
                </div>
            </Section>

            <Section id="products" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-4">
                <div className="grid grid-cols-2 gap-2">
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} className="rounded-xl overflow-hidden" style={{ backgroundColor: `${p.text}04`, border: `1px solid ${p.text}06` }}>
                            <ImgPlaceholder h="100px" color={[p.primary, p.secondary, p.accent, p.primary][i]} label="📦" rounded="0" />
                            <div className="p-2.5">
                                <Bar w="80%" h="4px" color={p.text} opacity={0.25} />
                                <Bar w="50%" h="3px" color={p.text} opacity={0.1} mt="4px" />
                                <div className="flex justify-between items-center mt-2">
                                    <Bar w="35px" h="5px" color={p.primary} opacity={0.6} />
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: `${p.primary}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: p.primary, opacity: 0.6 }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section id="bottom-nav" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-4">
                <div className="flex justify-around py-3 rounded-xl" style={{ backgroundColor: `${p.text}05` }}>
                    {['🏠', '🔍', '❤️', '👤'].map((icon, i) => (
                        <div key={i} className="text-center">
                            <div style={{ fontSize: '14px', opacity: i === 0 ? 1 : 0.3 }}>{icon}</div>
                            <Bar w="20px" h="2px" color={i === 0 ? p.primary : p.text} opacity={i === 0 ? 0.6 : 0.1} mt="4px" />
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    )
}

// ============================================
// LAYOUT: DASHBOARD
// ============================================
function DashboardLayout({ p, symbol, ve, brief, hovered, setHovered }) {
    return (
        <div className="p-4">
            <Section id="header" hovered={hovered} setHovered={setHovered} accent={p.accent}>
                <div className="flex items-center justify-between py-2">
                    <div>
                        <Bar w="60px" h="3px" color={p.text} opacity={0.2} />
                        <Bar w="90px" h="7px" color={p.text} opacity={0.5} mt="4px" />
                    </div>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: p.primary }}></div>
                </div>
            </Section>

            <Section id="stats" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-4">
                <div className="grid grid-cols-2 gap-2">
                    {[p.primary, p.accent, p.secondary, p.primary].map((c, i) => (
                        <div key={i} className="p-3 rounded-xl" style={{ backgroundColor: `${p.text}05`, border: `1px solid ${p.text}06` }}>
                            <Bar w="40px" h="3px" color={p.text} opacity={0.15} />
                            <Bar w="55px" h="10px" color={p.text} opacity={0.5} mt="6px" />
                            <div className="flex items-center gap-1 mt-2">
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: c }}></div>
                                <Bar w="30px" h="3px" color={c} opacity={0.4} />
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section id="chart" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-3">
                <div className="p-3 rounded-xl" style={{ backgroundColor: `${p.text}05`, border: `1px solid ${p.text}06` }}>
                    <Bar w="60px" h="4px" color={p.text} opacity={0.2} />
                    <div className="flex items-end gap-1.5 mt-4" style={{ height: '80px' }}>
                        {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 65].map((h, i) => (
                            <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, backgroundColor: i === 6 ? p.primary : `${p.primary}30` }}></div>
                        ))}
                    </div>
                </div>
            </Section>

            <Section id="list" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-3">
                <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${p.text}06` }}>
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3 p-3" style={{ borderBottom: i < 3 ? `1px solid ${p.text}06` : 'none', backgroundColor: `${p.text}03` }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: `${[p.primary, p.accent, p.secondary, p.primary][i]}15` }}></div>
                            <div className="flex-1">
                                <Bar w="70%" h="4px" color={p.text} opacity={0.2} />
                                <Bar w="40%" h="3px" color={p.text} opacity={0.08} mt="3px" />
                            </div>
                            <Bar w="35px" h="4px" color={p.text} opacity={0.15} />
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    )
}

// ============================================
// LAYOUT: SOCIAL
// ============================================
function SocialLayout({ p, symbol, ve, brief, hovered, setHovered }) {
    return (
        <div className="p-4">
            <Section id="header" hovered={hovered} setHovered={setHovered} accent={p.accent}>
                <div className="flex items-center justify-between py-2">
                    <span style={{ fontSize: '16px' }}>{symbol}</span>
                    <div className="flex gap-3">
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: `${p.text}15` }}></div>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: `${p.text}15` }}></div>
                    </div>
                </div>
            </Section>

            <Section id="stories" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-3">
                <div className="flex gap-3 overflow-hidden">
                    {[p.primary, p.accent, p.secondary, p.primary, p.accent].map((c, i) => (
                        <div key={i} className="flex-shrink-0 text-center">
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: `2px solid ${i === 0 ? p.primary : `${p.text}15`}`, padding: '2px' }}>
                                <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: `${c}20` }}></div>
                            </div>
                            <Bar w="30px" h="2px" color={p.text} opacity={0.15} mt="4px" />
                        </div>
                    ))}
                </div>
            </Section>

            {[0, 1].map(post => (
                <Section key={post} id={`post-${post + 1}`} hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: `${[p.primary, p.accent][post]}20` }}></div>
                        <div>
                            <Bar w="60px" h="4px" color={p.text} opacity={0.3} />
                            <Bar w="40px" h="2px" color={p.text} opacity={0.1} mt="3px" />
                        </div>
                    </div>
                    <ImgPlaceholder h="200px" color={[p.primary, p.accent][post]} label={ve.supportingImages?.[post] ? '📸' : '🖼'} rounded="12px" />
                    <div className="flex gap-4 mt-2 py-1">
                        {['❤️', '💬', '↗️'].map((e, i) => (
                            <span key={i} style={{ fontSize: '14px', opacity: 0.4 }}>{e}</span>
                        ))}
                    </div>
                    <Bar w="50%" h="3px" color={p.text} opacity={0.15} mt="2px" />
                    <Bar w="80%" h="3px" color={p.text} opacity={0.08} mt="3px" />
                </Section>
            ))}
        </div>
    )
}

// ============================================
// LAYOUT: MEDIA (streaming/music)
// ============================================
function MediaLayout({ p, symbol, ve, brief, hovered, setHovered }) {
    return (
        <div className="p-4">
            <Section id="header" hovered={hovered} setHovered={setHovered} accent={p.accent}>
                <div className="flex items-center justify-between py-2">
                    <span style={{ fontSize: '16px' }}>{symbol}</span>
                    <Bar w="100px" h="28px" color={p.text} opacity={0.06} rounded="14px" />
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: `${p.text}15` }}></div>
                </div>
            </Section>

            <Section id="featured" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-4">
                <div className="rounded-2xl overflow-hidden relative" style={{ height: '180px', backgroundColor: `${p.primary}15` }}>
                    <div className="absolute inset-0 flex items-end p-4" style={{ background: `linear-gradient(transparent, ${p.bg})` }}>
                        <div>
                            <Bar w="100px" h="8px" color={p.text} opacity={0.7} />
                            <Bar w="60px" h="4px" color={p.text} opacity={0.3} mt="4px" />
                            <div className="mt-3 flex items-center gap-2">
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: p.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ color: p.bg, fontSize: '12px' }}>▶</span>
                                </div>
                                <Bar w="60px" h="3px" color={p.text} opacity={0.2} />
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            <Section id="list" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-4">
                <Bar w="80px" h="5px" color={p.text} opacity={0.3} />
                <div className="flex gap-2 mt-3 overflow-hidden">
                    {[p.primary, p.accent, p.secondary].map((c, i) => (
                        <div key={i} className="flex-shrink-0" style={{ width: '110px' }}>
                            <div style={{ width: '110px', height: '110px', borderRadius: '12px', backgroundColor: `${c}15` }}></div>
                            <Bar w="80px" h="4px" color={p.text} opacity={0.2} mt="6px" />
                            <Bar w="50px" h="3px" color={p.text} opacity={0.1} mt="3px" />
                        </div>
                    ))}
                </div>
            </Section>

            <Section id="player" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-4">
                <div className="p-3 rounded-xl flex items-center gap-3" style={{ backgroundColor: `${p.text}05`, border: `1px solid ${p.text}08` }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: `${p.primary}20` }}></div>
                    <div className="flex-1">
                        <Bar w="70%" h="4px" color={p.text} opacity={0.3} />
                        <Bar w="40%" h="3px" color={p.text} opacity={0.1} mt="3px" />
                        <div className="mt-2 rounded-full overflow-hidden" style={{ height: '3px', backgroundColor: `${p.text}10` }}>
                            <div style={{ width: '40%', height: '100%', backgroundColor: p.primary, borderRadius: '3px' }}></div>
                        </div>
                    </div>
                    <span style={{ fontSize: '16px', color: p.primary, opacity: 0.7 }}>▶</span>
                </div>
            </Section>
        </div>
    )
}

// ============================================
// LAYOUT: PORTFOLIO
// ============================================
function PortfolioLayout({ p, symbol, ve, brief, hovered, setHovered }) {
    return (
        <div className="p-4">
            <Section id="header" hovered={hovered} setHovered={setHovered} accent={p.accent}>
                <div className="text-center py-4">
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: `${p.primary}20`, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '18px' }}>{symbol}</span>
                    </div>
                    <Bar w="80px" h="7px" color={p.text} opacity={0.5} mt="8px" />
                    <div className="flex justify-center"><Bar w="120px" h="3px" color={p.text} opacity={0.15} mt="6px" /></div>
                </div>
            </Section>

            <Section id="gallery" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-2">
                <div className="space-y-2">
                    <ImgPlaceholder h="180px" color={p.primary} label="🎨" rounded="12px" />
                    <div className="grid grid-cols-2 gap-2">
                        <ImgPlaceholder h="120px" color={p.accent} label="📸" rounded="10px" />
                        <ImgPlaceholder h="120px" color={p.secondary} label="🎬" rounded="10px" />
                    </div>
                    <ImgPlaceholder h="100px" color={p.primary} label="✏️" rounded="10px" />
                </div>
            </Section>

            <Section id="about" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-4">
                <div className="text-center">
                    <Bar w="50%" h="5px" color={p.text} opacity={0.3} mt="0" />
                    <div className="flex flex-col items-center mt-2">
                        <Bar w="80%" h="3px" color={p.text} opacity={0.1} mt="3px" />
                        <Bar w="65%" h="3px" color={p.text} opacity={0.08} mt="3px" />
                    </div>
                    <div className="flex justify-center gap-3 mt-4">
                        {[0, 1, 2].map(i => <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: `${p.text}10` }}></div>)}
                    </div>
                </div>
            </Section>
        </div>
    )
}

// ============================================
// LAYOUT: BLOG
// ============================================
function BlogLayout({ p, symbol, ve, brief, hovered, setHovered }) {
    return (
        <div className="p-4">
            <Section id="header" hovered={hovered} setHovered={setHovered} accent={p.accent}>
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-1.5">
                        <span style={{ fontSize: '14px' }}>{symbol}</span>
                        <Bar w="50px" h="5px" color={p.text} opacity={0.4} />
                    </div>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: `${p.text}15` }}></div>
                </div>
            </Section>

            <Section id="featured-article" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-3">
                <ImgPlaceholder h="160px" color={p.primary} label="📰" rounded="12px" />
                <div className="mt-3">
                    <span className="tag" style={{ fontSize: '8px', padding: '2px 8px', backgroundColor: `${p.primary}15`, borderColor: `${p.primary}30`, color: p.primary }}>Featured</span>
                    <Bar w="90%" h="7px" color={p.text} opacity={0.5} mt="6px" />
                    <Bar w="70%" h="7px" color={p.text} opacity={0.35} mt="4px" />
                    <Bar w="100%" h="3px" color={p.text} opacity={0.08} mt="6px" />
                    <Bar w="85%" h="3px" color={p.text} opacity={0.06} mt="3px" />
                </div>
            </Section>

            <Section id="articles" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-5">
                {[0, 1, 2].map(i => (
                    <div key={i} className="flex gap-3 py-3" style={{ borderBottom: i < 2 ? `1px solid ${p.text}08` : 'none' }}>
                        <div style={{ width: '70px', height: '70px', borderRadius: '10px', backgroundColor: `${[p.accent, p.secondary, p.primary][i]}15`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '16px', opacity: 0.3 }}>{['📝', '🎙️', '📊'][i]}</span>
                        </div>
                        <div className="flex-1">
                            <Bar w="90%" h="5px" color={p.text} opacity={0.3} />
                            <Bar w="60%" h="5px" color={p.text} opacity={0.2} mt="4px" />
                            <Bar w="100%" h="3px" color={p.text} opacity={0.06} mt="6px" />
                            <div className="flex items-center gap-2 mt-2">
                                <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: `${p.text}10` }}></div>
                                <Bar w="40px" h="2px" color={p.text} opacity={0.1} />
                            </div>
                        </div>
                    </div>
                ))}
            </Section>
        </div>
    )
}

// ============================================
// LAYOUT: APP (utility/tool)
// ============================================
function AppLayout({ p, symbol, ve, brief, hovered, setHovered }) {
    return (
        <div className="p-4">
            <Section id="header" hovered={hovered} setHovered={setHovered} accent={p.accent}>
                <div className="py-2">
                    <Bar w="50px" h="3px" color={p.text} opacity={0.15} />
                    <Bar w="120px" h="8px" color={p.text} opacity={0.5} mt="4px" />
                </div>
            </Section>

            <Section id="search" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-3">
                <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: `${p.text}05`, border: `1px solid ${p.text}08` }}>
                    <span style={{ fontSize: '12px', opacity: 0.3 }}>🔍</span>
                    <Bar w="60%" h="4px" color={p.text} opacity={0.12} />
                </div>
            </Section>

            <Section id="actions" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-4">
                <div className="grid grid-cols-3 gap-3">
                    {[{ icon: '⚡', c: p.primary }, { icon: '📋', c: p.accent }, { icon: '⚙️', c: p.secondary }].map((item, i) => (
                        <div key={i} className="text-center p-4 rounded-xl" style={{ backgroundColor: `${item.c}08`, border: `1px solid ${item.c}15` }}>
                            <span style={{ fontSize: '20px' }}>{item.icon}</span>
                            <Bar w="80%" h="3px" color={p.text} opacity={0.2} mt="6px" />
                        </div>
                    ))}
                </div>
            </Section>

            <Section id="content" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-4">
                <div className="p-4 rounded-xl" style={{ backgroundColor: `${p.text}04`, border: `1px solid ${p.text}06` }}>
                    <div className="flex justify-between items-center mb-3">
                        <Bar w="80px" h="5px" color={p.text} opacity={0.3} />
                        <Bar w="40px" h="3px" color={p.primary} opacity={0.5} />
                    </div>
                    {[0, 1, 2].map(i => (
                        <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < 2 ? `1px solid ${p.text}06` : 'none' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: [p.primary, p.accent, p.secondary][i], opacity: 0.5 }}></div>
                            <Bar w="60%" h="4px" color={p.text} opacity={0.15} />
                            <div className="ml-auto">
                                <Bar w="24px" h="4px" color={p.text} opacity={0.1} />
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section id="bottom-bar" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-5">
                <div className="flex justify-around py-3">
                    {['🏠', '📊', '➕', '💬', '👤'].map((icon, i) => (
                        <div key={i} style={{ opacity: i === 0 ? 1 : 0.3, fontSize: '16px' }}>{icon}</div>
                    ))}
                </div>
            </Section>
        </div>
    )
}

// ============================================
// LAYOUT: SAAS
// ============================================
function SaasLayout({ p, symbol, ve, brief, hovered, setHovered }) {
    return (
        <div className="p-4">
            <Section id="nav" hovered={hovered} setHovered={setHovered} accent={p.accent}>
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-1.5">
                        <span style={{ fontSize: '12px' }}>{symbol}</span>
                        <Bar w="40px" h="5px" color={p.text} opacity={0.4} />
                    </div>
                    <div className="flex items-center gap-2">
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: `${p.text}15` }}></div>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: p.primary, opacity: 0.8 }}></div>
                    </div>
                </div>
            </Section>

            <Section id="hero" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-4">
                <div className="text-center py-4">
                    <div className="inline-block px-3 py-1 rounded-full mb-3" style={{ backgroundColor: `${p.accent}12`, border: `1px solid ${p.accent}25` }}>
                        <Bar w="60px" h="3px" color={p.accent} opacity={0.5} />
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                        <Bar w="90%" h="8px" color={p.text} opacity={0.6} />
                        <Bar w="65%" h="8px" color={p.text} opacity={0.4} />
                    </div>
                    <div className="flex flex-col items-center gap-1 mt-3">
                        <Bar w="80%" h="3px" color={p.text} opacity={0.1} />
                        <Bar w="60%" h="3px" color={p.text} opacity={0.07} />
                    </div>
                    <div className="flex justify-center gap-2 mt-4">
                        <div style={{ width: '90px', height: '32px', borderRadius: '8px', backgroundColor: p.primary }}></div>
                        <div style={{ width: '90px', height: '32px', borderRadius: '8px', border: `1.5px solid ${p.text}15` }}></div>
                    </div>
                </div>
            </Section>

            <Section id="preview" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-3">
                <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${p.text}08` }}>
                    <div style={{ height: '6px', backgroundColor: `${p.text}06`, display: 'flex', alignItems: 'center', padding: '0 6px', gap: '3px' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: `${p.text}15` }}></div>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: `${p.text}15` }}></div>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: `${p.text}15` }}></div>
                    </div>
                    <ImgPlaceholder h="140px" color={p.primary} label="💻" rounded="0" />
                </div>
            </Section>

            <Section id="features" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-4">
                {[{ icon: '🚀', c: p.primary }, { icon: '🔒', c: p.accent }, { icon: '📈', c: p.secondary }].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 py-3" style={{ borderBottom: i < 2 ? `1px solid ${p.text}06` : 'none' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: `${item.c}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontSize: '14px' }}>{item.icon}</span>
                        </div>
                        <div>
                            <Bar w="80px" h="5px" color={p.text} opacity={0.3} />
                            <Bar w="100%" h="3px" color={p.text} opacity={0.08} mt="4px" />
                            <Bar w="70%" h="3px" color={p.text} opacity={0.05} mt="3px" />
                        </div>
                    </div>
                ))}
            </Section>
        </div>
    )
}

export default VisualConcept