import { Eye, Code2, Monitor, Tablet, Smartphone } from 'lucide-react'
import { useState, useEffect } from 'react'

function VisualConcept({ visual, brief }) {
    const [hoveredSection, setHoveredSection] = useState(null)
    const [device, setDevice] = useState('mobile')
    const [isMobile, setIsMobile] = useState(false)

    // Auto-detect screen size
    useEffect(() => {
        const check = () => {
            const mobile = window.innerWidth < 640
            setIsMobile(mobile)
            if (mobile) setDevice('mobile')
        }
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

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
    const title = brief?.projectTitle || 'Project'

    const p = { bg, primary, secondary, accent, text }

    const deviceWidths = {
        mobile: '375px',
        tablet: '580px',
        desktop: '100%'
    }

    const Renderer = layoutMap[type] || LandingMockup

    return (
        <div className="mt-10 sm:mt-14 enter">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="label mb-1">Visual Concept</p>
                    <h3 className="text-sm sm:text-base font-semibold" style={{ color: '#e4e4e7' }}>
                        {type.charAt(0).toUpperCase() + type.slice(1)} Preview
                    </h3>
                </div>
                <div className="flex items-center gap-1">
                    {/* Device switcher — hidden on mobile */}
                    {!isMobile && (
                        <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #232329' }}>
                            {[
                                { id: 'mobile', icon: <Smartphone size={12} /> },
                                { id: 'tablet', icon: <Tablet size={12} /> },
                                { id: 'desktop', icon: <Monitor size={12} /> }
                            ].map(d => (
                                <button key={d.id} onClick={() => setDevice(d.id)}
                                    className="p-1.5 sm:p-2 transition-all"
                                    style={{
                                        backgroundColor: device === d.id ? '#1a1a1f' : 'transparent',
                                        color: device === d.id ? '#e4e4e7' : '#3f3f46'
                                    }}>
                                    {d.icon}
                                </button>
                            ))}
                        </div>
                    )}
                    <span className="tag ml-2">{type}</span>
                </div>
            </div>

            {/* Device Frame */}
            <div className="flex justify-center enter enter-d1">
                {device === 'mobile' ? (
                    <PhoneFrame bg={bg}>
                        <Renderer p={p} symbol={symbol} ve={ve} brief={brief} title={title}
                            hovered={hoveredSection} setHovered={setHoveredSection} device="mobile" />
                    </PhoneFrame>
                ) : device === 'tablet' ? (
                    <TabletFrame bg={bg}>
                        <Renderer p={p} symbol={symbol} ve={ve} brief={brief} title={title}
                            hovered={hoveredSection} setHovered={setHoveredSection} device="tablet" />
                    </TabletFrame>
                ) : (
                    <BrowserFrame bg={bg} title={title}>
                        <Renderer p={p} symbol={symbol} ve={ve} brief={brief} title={title}
                            hovered={hoveredSection} setHovered={setHoveredSection} device="desktop" />
                    </BrowserFrame>
                )}
            </div>

            {/* Hover info */}
            {hoveredSection && (
                <div className="mt-3 text-center fade">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px]"
                        style={{ backgroundColor: '#131316', border: '1px solid #232329', color: '#e4e4e7' }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }}></div>
                        {hoveredSection}
                    </span>
                </div>
            )}

            {/* Description */}
            {visual.description && (
                <div className="card p-4 sm:p-5 mt-4 enter enter-d2">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <Eye size={13} style={{ color: '#3f3f46' }} />
                        <span className="label">Visual Description</span>
                    </div>
                    <p className="text-[11px] sm:text-sm leading-relaxed" style={{ color: '#71717a' }}>{visual.description}</p>
                </div>
            )}

            {visual.prompt && (
                <details className="mt-2 cursor-pointer">
                    <summary className="flex items-center gap-2 text-[10px] sm:text-[11px] py-2 px-1" style={{ color: '#3f3f46' }}>
                        <Code2 size={11} /> View prompt
                    </summary>
                    <div className="p-3 sm:p-4 mt-1" style={{ background: '#131316', border: '1px solid #232329', borderRadius: '16px' }}>
                        <p className="text-[10px] sm:text-[11px] font-mono leading-relaxed break-all" style={{ color: '#3f3f46' }}>{visual.prompt}</p>
                    </div>
                </details>
            )}
        </div>
    )
}

// ============================================
// DEVICE FRAMES
// ============================================

function PhoneFrame({ bg, children }) {
    return (
        <div style={{ width: '100%', maxWidth: '375px' }}>
            <div style={{
                background: 'linear-gradient(145deg, #1e1e24, #141418)',
                borderRadius: '44px',
                padding: '14px 10px',
                border: '1px solid #2a2a32',
                boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02) inset'
            }}>
                {/* Notch */}
                <div className="flex justify-center" style={{ marginBottom: '6px' }}>
                    <div style={{
                        width: '100px', height: '24px', backgroundColor: '#141418',
                        borderRadius: '0 0 14px 14px', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: '6px', marginTop: '-4px', position: 'relative', zIndex: 5
                    }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#232329' }}></div>
                        <div style={{ width: '32px', height: '3px', borderRadius: '3px', backgroundColor: '#232329' }}></div>
                    </div>
                </div>

                {/* Screen */}
                <div style={{
                    borderRadius: '32px', overflow: 'hidden', overflowY: 'auto',
                    backgroundColor: bg, minHeight: '620px', maxHeight: '700px'
                }}>
                    {children}
                </div>

                {/* Home bar */}
                <div className="flex justify-center" style={{ marginTop: '8px' }}>
                    <div style={{ width: '34%', height: '4px', borderRadius: '4px', backgroundColor: '#2a2a32' }}></div>
                </div>
            </div>
        </div>
    )
}

function TabletFrame({ bg, children }) {
    return (
        <div style={{ width: '100%', maxWidth: '620px' }}>
            <div style={{
                background: 'linear-gradient(145deg, #1e1e24, #141418)',
                borderRadius: '28px', padding: '16px 12px',
                border: '1px solid #2a2a32',
                boxShadow: '0 30px 80px rgba(0,0,0,0.5)'
            }}>
                <div className="flex justify-center mb-2">
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#232329' }}></div>
                </div>
                <div style={{ borderRadius: '16px', overflow: 'hidden', overflowY: 'auto', backgroundColor: bg, minHeight: '500px', maxHeight: '650px' }}>
                    {children}
                </div>
                <div className="flex justify-center mt-2">
                    <div style={{ width: '20%', height: '4px', borderRadius: '4px', backgroundColor: '#2a2a32' }}></div>
                </div>
            </div>
        </div>
    )
}

function BrowserFrame({ bg, title, children }) {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return (
        <div style={{ width: '100%' }}>
            <div style={{
                background: '#141418', borderRadius: '16px',
                border: '1px solid #2a2a32', overflow: 'hidden',
                boxShadow: '0 30px 80px rgba(0,0,0,0.5)'
            }}>
                {/* Chrome */}
                <div className="flex items-center gap-3 px-4 py-2.5" style={{ backgroundColor: '#1a1a1f', borderBottom: '1px solid #232329' }}>
                    <div className="flex gap-1.5">
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff5f57' }}></div>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#febc2e' }}></div>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#28c840' }}></div>
                    </div>
                    <div className="flex-1">
                        <div className="max-w-xs mx-auto px-3 py-1 rounded-md" style={{ backgroundColor: '#0c0c0f' }}>
                            <span className="text-[10px] font-mono" style={{ color: '#3f3f46' }}>{slug}.com</span>
                        </div>
                    </div>
                </div>

                <div style={{ backgroundColor: bg, minHeight: '450px', maxHeight: '600px', overflowY: 'auto' }}>
                    {children}
                </div>
            </div>
        </div>
    )
}

// ============================================
// SHARED HELPERS
// ============================================

function S({ id, hovered, setHovered, accent, children, className = '' }) {
    const active = hovered === id
    return (
        <div className={className}
            style={{
                outline: active ? `2px solid ${accent}` : '2px solid transparent',
                outlineOffset: '-2px', borderRadius: '8px', transition: 'outline 0.15s ease', cursor: 'default', position: 'relative'
            }}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}>
            {children}
        </div>
    )
}

function Img({ w = '100%', h = '120px', color, hint, rounded = '12px', icon = '📷' }) {
    return (
        <div className="group relative overflow-hidden" style={{
            width: w, height: h, borderRadius: rounded,
            background: `linear-gradient(135deg, ${color}08 0%, ${color}18 100%)`,
            border: `1px solid ${color}15`
        }}>
            {/* Gradient overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(180deg, transparent 40%, ${color}10 100%)`
            }}></div>

            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    backgroundColor: `${color}12`, border: `1px dashed ${color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', opacity: 0.5
                }}>{icon}</div>
            </div>

            {/* Hover hint */}
            {hint && (
                <div className="absolute inset-0 flex items-end p-2.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(transparent, ${color}90)` }}>
                    <span className="text-white text-[9px] font-medium leading-tight">{hint}</span>
                </div>
            )}

            {/* Corner lines for "placeholder" feel */}
            <div style={{ position: 'absolute', top: '8px', left: '8px', width: '12px', height: '12px', borderTop: `1px solid ${color}25`, borderLeft: `1px solid ${color}25`, borderRadius: '2px 0 0 0' }}></div>
            <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '12px', height: '12px', borderBottom: `1px solid ${color}25`, borderRight: `1px solid ${color}25`, borderRadius: '0 0 2px 0' }}></div>
        </div>
    )
}

function B({ w, h = '3px', color, o = 0.2, r = '99px', mt = '0' }) {
    return <div style={{ width: w, height: h, backgroundColor: color, opacity: o, borderRadius: r, marginTop: mt }}></div>
}

function Btn({ color, bg, w = '100px', h = '36px', r = '10px' }) {
    return <div style={{ width: w, height: h, borderRadius: r, backgroundColor: bg, boxShadow: `0 2px 8px ${bg}30` }}></div>
}

function BtnOutline({ color, w = '100px', h = '36px', r = '10px' }) {
    return <div style={{ width: w, height: h, borderRadius: r, border: `1.5px solid ${color}20` }}></div>
}

function Avatar({ size = '32px', color }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%',
            background: `linear-gradient(135deg, ${color}25, ${color}40)`
        }}></div>
    )
}

function Tag({ color, w = '50px' }) {
    return (
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${color}10`, border: `1px solid ${color}20` }}>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: color, opacity: 0.6 }}></div>
            <B w={w} h="3px" color={color} o={0.4} />
        </div>
    )
}

function NavDots({ color, count = 3 }) {
    return (
        <div className="flex items-center gap-3">
            {Array(count).fill(0).map((_, i) => <B key={i} w="28px" h="3px" color={color} o={0.15} />)}
        </div>
    )
}

// ============================================
// LANDING PAGE
// ============================================
function LandingMockup({ p, symbol, ve, brief, title, hovered, setHovered, device }) {
    const isWide = device !== 'mobile'
    return (
        <div className={isWide ? 'p-6 sm:p-8' : 'p-4'}>
            <S id="Navigation" hovered={hovered} setHovered={setHovered} accent={p.accent}>
                <div className="flex items-center justify-between py-3 px-1">
                    <div className="flex items-center gap-2">
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: p.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '12px', color: p.bg }}>{symbol}</span>
                        </div>
                        <B w="50px" h="5px" color={p.text} o={0.5} />
                    </div>
                    {isWide && <NavDots color={p.text} />}
                    <Btn color={p.bg} bg={p.primary} w="72px" h="28px" r="8px" />
                </div>
            </S>

            <S id="Hero Section" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-6">
                <div className={isWide ? 'flex items-center gap-8 py-6' : 'text-center py-6'}>
                    <div className={isWide ? 'flex-1' : ''}>
                        <Tag color={p.accent} w="60px" />
                        <div className={`flex flex-col ${isWide ? 'items-start' : 'items-center'} gap-2 mt-4`}>
                            <B w={isWide ? '280px' : '85%'} h="10px" color={p.text} o={0.7} />
                            <B w={isWide ? '200px' : '60%'} h="10px" color={p.text} o={0.5} />
                        </div>
                        <div className={`flex flex-col ${isWide ? 'items-start' : 'items-center'} gap-1.5 mt-4`}>
                            <B w={isWide ? '240px' : '75%'} h="4px" color={p.text} o={0.12} />
                            <B w={isWide ? '180px' : '55%'} h="4px" color={p.text} o={0.08} />
                        </div>
                        <div className={`flex ${isWide ? '' : 'justify-center'} gap-2.5 mt-5`}>
                            <Btn bg={p.primary} w="110px" h="38px" />
                            <BtnOutline color={p.text} w="100px" h="38px" />
                        </div>
                    </div>
                    {isWide && (
                        <div className="flex-1">
                            <Img h="200px" color={p.primary} hint={ve.heroImage} icon={symbol} />
                        </div>
                    )}
                </div>
            </S>

            {!isWide && (
                <S id="Hero Image" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-4">
                    <Img h="160px" color={p.primary} hint={ve.heroImage} icon={symbol} />
                </S>
            )}

            <S id="Features" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-8">
                <div className="flex justify-center mb-4"><B w="80px" h="5px" color={p.text} o={0.3} /></div>
                <div className={`grid gap-3 ${isWide ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    {(ve.supportingImages || ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4']).slice(0, isWide ? 3 : 4).map((img, i) => {
                        const c = [p.primary, p.accent, p.secondary, p.primary][i]
                        return (
                            <div key={i} className="p-3.5 rounded-2xl" style={{ backgroundColor: `${p.text}04`, border: `1px solid ${p.text}06` }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: `linear-gradient(135deg, ${c}15, ${c}25)`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <div style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: c, opacity: 0.5 }}></div>
                                </div>
                                <B w="75%" h="5px" color={p.text} o={0.22} mt="10px" />
                                <B w="100%" h="3px" color={p.text} o={0.06} mt="6px" />
                                <B w="85%" h="3px" color={p.text} o={0.04} mt="3px" />
                            </div>
                        )
                    })}
                </div>
            </S>

            <S id="Social Proof" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-8">
                <div className="p-4 rounded-2xl" style={{ backgroundColor: `${p.primary}06`, border: `1px solid ${p.primary}10` }}>
                    <div className={`flex ${isWide ? 'justify-around' : 'justify-between'} items-center`}>
                        {[{ n: '10K+', l: 'Users' }, { n: '4.9', l: 'Rating' }, { n: '99%', l: 'Uptime' }, ...(isWide ? [{ n: '50+', l: 'Countries' }] : [])].map((s, i) => (
                            <div key={i} className="text-center">
                                <B w="32px" h="8px" color={p.text} o={0.4} />
                                <B w="28px" h="3px" color={p.text} o={0.12} mt="4px" />
                            </div>
                        ))}
                    </div>
                </div>
            </S>

            <S id="CTA Section" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-8">
                <div className="text-center p-5 rounded-2xl" style={{ background: `linear-gradient(135deg, ${p.primary}10, ${p.accent}08)`, border: `1px solid ${p.primary}15` }}>
                    <B w="60%" h="7px" color={p.text} o={0.35} />
                    <div className="flex justify-center mt-1"><B w="45%" h="4px" color={p.text} o={0.12} mt="4px" /></div>
                    <div className="flex justify-center mt-4">
                        <Btn bg={p.primary} w="130px" h="38px" />
                    </div>
                </div>
            </S>

            <S id="Footer" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-8">
                <div className="py-4 flex items-center justify-between" style={{ borderTop: `1px solid ${p.text}06` }}>
                    <div className="flex items-center gap-1.5">
                        <span style={{ fontSize: '10px' }}>{symbol}</span>
                        <B w="40px" h="3px" color={p.text} o={0.15} />
                    </div>
                    <div className="flex gap-2">
                        {[0, 1, 2].map(i => (
                            <div key={i} style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: `${p.text}08` }}></div>
                        ))}
                    </div>
                </div>
            </S>
        </div>
    )
}

// ============================================
// ECOMMERCE
// ============================================
function EcommerceMockup({ p, symbol, ve, brief, title, hovered, setHovered, device }) {
    const isWide = device !== 'mobile'
    return (
        <div className={isWide ? 'p-6' : 'p-4'}>
            <S id="Header" hovered={hovered} setHovered={setHovered} accent={p.accent}>
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                        <span style={{ fontSize: '14px' }}>{symbol}</span>
                        <B w="50px" h="5px" color={p.text} o={0.4} />
                    </div>
                    <div className="flex-1 mx-4 max-w-[160px]">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ backgroundColor: `${p.text}06`, border: `1px solid ${p.text}08` }}>
                            <span style={{ fontSize: '10px', opacity: 0.3 }}>🔍</span>
                            <B w="60px" h="3px" color={p.text} o={0.12} />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Avatar size="24px" color={p.text} />
                        <div className="relative">
                            <div style={{ width: '24px', height: '24px', borderRadius: '8px', backgroundColor: `${p.text}08`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '10px', opacity: 0.4 }}>🛒</span>
                            </div>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: p.accent, position: 'absolute', top: '-2px', right: '-2px' }}></div>
                        </div>
                    </div>
                </div>
            </S>

            <S id="Categories" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-3">
                <div className="flex gap-2 overflow-hidden pb-1">
                    {['All', 'New', 'Popular', 'Sale'].map((c, i) => (
                        <div key={i} className="flex-shrink-0 px-4 py-2 rounded-xl" style={{
                            backgroundColor: i === 0 ? p.primary : `${p.text}06`,
                            border: i === 0 ? 'none' : `1px solid ${p.text}08`
                        }}>
                            <B w="30px" h="4px" color={i === 0 ? p.bg : p.text} o={i === 0 ? 0.8 : 0.3} />
                        </div>
                    ))}
                </div>
            </S>

            <S id="Featured Product" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-4">
                <div className="rounded-2xl overflow-hidden relative">
                    <Img h={isWide ? '220px' : '180px'} color={p.accent} hint={ve.heroImage || 'Featured product photo'} icon="🛍️" rounded="16px" />
                    <div className="absolute bottom-0 left-0 right-0 p-3" style={{ background: `linear-gradient(transparent, ${p.bg}ee)` }}>
                        <div className="flex items-end justify-between">
                            <div>
                                <B w="100px" h="7px" color={p.text} o={0.7} />
                                <B w="60px" h="4px" color={p.text} o={0.3} mt="4px" />
                            </div>
                            <Btn bg={p.primary} w="80px" h="32px" r="10px" />
                        </div>
                    </div>
                </div>
            </S>

            <S id="Product Grid" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-4">
                <div className={`grid gap-2.5 ${isWide ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    {[0, 1, 2, 3].slice(0, isWide ? 3 : 4).map(i => {
                        const c = [p.primary, p.secondary, p.accent, p.primary][i]
                        return (
                            <div key={i} className="rounded-2xl overflow-hidden" style={{ backgroundColor: `${p.text}03`, border: `1px solid ${p.text}06` }}>
                                <Img h="110px" color={c} hint={ve.supportingImages?.[i]} icon="📦" rounded="0" />
                                <div className="p-2.5">
                                    <B w="80%" h="4px" color={p.text} o={0.25} />
                                    <B w="50%" h="3px" color={p.text} o={0.1} mt="4px" />
                                    <div className="flex items-center justify-between mt-2.5">
                                        <B w="40px" h="6px" color={p.primary} o={0.6} />
                                        <div style={{ width: '22px', height: '22px', borderRadius: '8px', backgroundColor: `${p.primary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontSize: '8px', opacity: 0.5 }}>+</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </S>

            {!isWide && (
                <S id="Tab Bar" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-6">
                    <div className="flex justify-around py-3 rounded-2xl" style={{ backgroundColor: `${p.text}04`, border: `1px solid ${p.text}06` }}>
                        {[{ e: '🏠', a: true }, { e: '🔍', a: false }, { e: '❤️', a: false }, { e: '👤', a: false }].map((t, i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <span style={{ fontSize: '14px', opacity: t.a ? 1 : 0.25 }}>{t.e}</span>
                                {t.a && <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: p.primary }}></div>}
                            </div>
                        ))}
                    </div>
                </S>
            )}
        </div>
    )
}

// ============================================
// DASHBOARD
// ============================================
function DashboardMockup({ p, symbol, ve, brief, title, hovered, setHovered, device }) {
    const isWide = device !== 'mobile'
    return (
        <div className={isWide ? 'p-6' : 'p-4'}>
            <S id="Header" hovered={hovered} setHovered={setHovered} accent={p.accent}>
                <div className="flex items-center justify-between py-2">
                    <div>
                        <B w="60px" h="3px" color={p.text} o={0.15} />
                        <B w="100px" h="8px" color={p.text} o={0.5} mt="4px" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="px-2.5 py-1 rounded-lg" style={{ backgroundColor: `${p.text}06`, border: `1px solid ${p.text}08` }}>
                            <span style={{ fontSize: '9px', opacity: 0.3 }}>🔍</span>
                        </div>
                        <Avatar size="28px" color={p.primary} />
                    </div>
                </div>
            </S>

            <S id="Stats Overview" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-4">
                <div className={`grid gap-2 ${isWide ? 'grid-cols-4' : 'grid-cols-2'}`}>
                    {[
                        { c: p.primary, icon: '📈', v: '12.4K' },
                        { c: p.accent, icon: '💰', v: '$48.2K' },
                        { c: p.secondary, icon: '👥', v: '2,847' },
                        { c: p.primary, icon: '⚡', v: '94.2%' }
                    ].map((s, i) => (
                        <div key={i} className="p-3 rounded-xl" style={{ backgroundColor: `${p.text}04`, border: `1px solid ${p.text}06` }}>
                            <div className="flex items-center justify-between">
                                <B w="40px" h="3px" color={p.text} o={0.15} />
                                <span style={{ fontSize: '12px', opacity: 0.3 }}>{s.icon}</span>
                            </div>
                            <B w="60px" h="10px" color={p.text} o={0.5} mt="8px" />
                            <div className="flex items-center gap-1 mt-2">
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: s.c, opacity: 0.6 }}></div>
                                <B w="30px" h="3px" color={s.c} o={0.4} />
                            </div>
                        </div>
                    ))}
                </div>
            </S>

            <S id="Chart" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-3">
                <div className="p-4 rounded-xl" style={{ backgroundColor: `${p.text}04`, border: `1px solid ${p.text}06` }}>
                    <div className="flex items-center justify-between mb-4">
                        <B w="70px" h="5px" color={p.text} o={0.25} />
                        <div className="flex gap-1.5">
                            {['D', 'W', 'M', 'Y'].map((t, i) => (
                                <div key={i} className="px-2 py-0.5 rounded-md" style={{
                                    backgroundColor: i === 2 ? `${p.primary}15` : 'transparent',
                                    fontSize: '8px', color: i === 2 ? p.primary : `${p.text}30`
                                }}>{t}</div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-end gap-1" style={{ height: '100px' }}>
                        {[35, 50, 40, 75, 55, 70, 90, 60, 80, 45, 85, 65, 72, 88].map((h, i) => (
                            <div key={i} className="flex-1 rounded-sm" style={{
                                height: `${h}%`,
                                backgroundColor: i === 6 || i === 13 ? p.primary : `${p.primary}20`,
                                borderRadius: '3px 3px 0 0'
                            }}></div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2">
                        {['J', 'F', 'M', 'A', 'M', 'J', 'J'].map((m, i) => (
                            <span key={i} style={{ fontSize: '7px', color: `${p.text}20` }}>{m}</span>
                        ))}
                    </div>
                </div>
            </S>

            <S id="Recent Activity" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-3">
                <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${p.text}06` }}>
                    <div className="px-3 py-2.5 flex items-center justify-between" style={{ backgroundColor: `${p.text}04` }}>
                        <B w="80px" h="4px" color={p.text} o={0.25} />
                        <B w="40px" h="3px" color={p.primary} o={0.4} />
                    </div>
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2.5" style={{ borderTop: `1px solid ${p.text}05`, backgroundColor: `${p.text}02` }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: `${[p.primary, p.accent, p.secondary, p.primary][i]}10`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '12px', opacity: 0.4 }}>{['📊', '🔔', '💳', '📁'][i]}</span>
                            </div>
                            <div className="flex-1">
                                <B w="65%" h="4px" color={p.text} o={0.2} />
                                <B w="40%" h="3px" color={p.text} o={0.08} mt="3px" />
                            </div>
                            <B w="35px" h="3px" color={p.text} o={0.12} />
                        </div>
                    ))}
                </div>
            </S>
        </div>
    )
}

// ============================================
// SOCIAL / MEDIA / PORTFOLIO / BLOG / APP / SAAS
// (Compact versions - same quality pattern)
// ============================================
function SocialMockup({ p, symbol, ve, brief, title, hovered, setHovered, device }) {
    const isWide = device !== 'mobile'
    return (
        <div className={isWide ? 'p-6' : 'p-4'}>
            <S id="Header" hovered={hovered} setHovered={setHovered} accent={p.accent}>
                <div className="flex items-center justify-between py-2">
                    <span style={{ fontSize: '16px' }}>{symbol}</span>
                    <div className="flex gap-2">
                        <div style={{ width: '22px', height: '22px', borderRadius: '8px', backgroundColor: `${p.text}08` }}><span style={{ fontSize: '10px', opacity: 0.3, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>💬</span></div>
                        <div style={{ width: '22px', height: '22px', borderRadius: '8px', backgroundColor: `${p.text}08` }}><span style={{ fontSize: '10px', opacity: 0.3, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>🔔</span></div>
                    </div>
                </div>
            </S>

            <S id="Stories" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-3">
                <div className="flex gap-3 overflow-hidden pb-1">
                    {[p.primary, p.accent, p.secondary, p.primary, p.accent].map((c, i) => (
                        <div key={i} className="flex-shrink-0 text-center">
                            <div style={{ width: '52px', height: '52px', borderRadius: '50%', padding: '2px', background: i === 0 ? `linear-gradient(135deg, ${p.primary}, ${p.accent})` : `${p.text}15` }}>
                                <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: p.bg, padding: '2px' }}>
                                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: `${c}15` }}></div>
                                </div>
                            </div>
                            <B w="28px" h="2px" color={p.text} o={0.12} mt="4px" />
                        </div>
                    ))}
                </div>
            </S>

            {[0, 1].map(idx => (
                <S key={idx} id={`Post ${idx + 1}`} hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-4">
                    <div className="flex items-center gap-2.5 mb-2.5">
                        <Avatar size="30px" color={[p.primary, p.accent][idx]} />
                        <div>
                            <B w="60px" h="4px" color={p.text} o={0.35} />
                            <B w="35px" h="2px" color={p.text} o={0.1} mt="3px" />
                        </div>
                        <div className="ml-auto" style={{ fontSize: '10px', opacity: 0.2 }}>•••</div>
                    </div>
                    <Img h={isWide ? '260px' : '200px'} color={[p.primary, p.accent][idx]} hint={ve.supportingImages?.[idx]} icon="📸" rounded="14px" />
                    <div className="flex items-center gap-4 mt-2.5 py-1">
                        {['❤️', '💬', '↗️', '🔖'].map((e, i) => (
                            <span key={i} style={{ fontSize: '15px', opacity: i === 3 ? 0.2 : 0.35, marginLeft: i === 3 ? 'auto' : '0' }}>{e}</span>
                        ))}
                    </div>
                    <B w="50px" h="4px" color={p.text} o={0.3} mt="2px" />
                    <B w="90%" h="3px" color={p.text} o={0.1} mt="4px" />
                    <B w="60%" h="3px" color={p.text} o={0.06} mt="2px" />
                </S>
            ))}
        </div>
    )
}

function MediaMockup({ p, symbol, ve, brief, title, hovered, setHovered, device }) {
    const isWide = device !== 'mobile'
    return (
        <div className={isWide ? 'p-6' : 'p-4'}>
            <S id="Header" hovered={hovered} setHovered={setHovered} accent={p.accent}>
                <div className="flex items-center justify-between py-2">
                    <span style={{ fontSize: '16px' }}>{symbol}</span>
                    <div className="flex-1 mx-4 max-w-[140px]">
                        <div className="px-3 py-1.5 rounded-full" style={{ backgroundColor: `${p.text}06` }}>
                            <B w="60px" h="3px" color={p.text} o={0.15} />
                        </div>
                    </div>
                    <Avatar size="24px" color={p.primary} />
                </div>
            </S>

            <S id="Now Playing" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-4">
                <div className="rounded-2xl overflow-hidden relative" style={{ height: isWide ? '240px' : '200px' }}>
                    <Img h="100%" color={p.primary} hint={ve.heroImage || 'Album art / Thumbnail'} icon="🎵" rounded="16px" />
                    <div className="absolute inset-0 flex items-end p-4" style={{ background: `linear-gradient(transparent 30%, ${p.bg}ee)` }}>
                        <div className="flex-1">
                            <B w="120px" h="8px" color={p.text} o={0.8} />
                            <B w="70px" h="4px" color={p.text} o={0.3} mt="4px" />
                            <div className="flex items-center gap-3 mt-4">
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: p.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 15px ${p.primary}40` }}>
                                    <span style={{ color: p.bg, fontSize: '14px', marginLeft: '2px' }}>▶</span>
                                </div>
                                <div className="flex-1">
                                    <div className="rounded-full overflow-hidden" style={{ height: '3px', backgroundColor: `${p.text}15` }}>
                                        <div style={{ width: '35%', height: '100%', backgroundColor: p.primary, borderRadius: '3px' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </S>

            <S id="Trending" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-5">
                <B w="80px" h="5px" color={p.text} o={0.3} />
                <div className="flex gap-2.5 mt-3 overflow-hidden">
                    {[p.accent, p.secondary, p.primary].map((c, i) => (
                        <div key={i} className="flex-shrink-0" style={{ width: isWide ? '140px' : '105px' }}>
                            <Img h={isWide ? '140px' : '105px'} color={c} hint={ve.supportingImages?.[i]} icon="🎧" rounded="12px" />
                            <B w="80%" h="4px" color={p.text} o={0.25} mt="6px" />
                            <B w="55%" h="3px" color={p.text} o={0.1} mt="3px" />
                        </div>
                    ))}
                </div>
            </S>
        </div>
    )
}

function PortfolioMockup({ p, symbol, ve, brief, title, hovered, setHovered, device }) {
    const isWide = device !== 'mobile'
    return (
        <div className={isWide ? 'p-6' : 'p-4'}>
            <S id="Profile" hovered={hovered} setHovered={setHovered} accent={p.accent}>
                <div className="text-center py-6">
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto', background: `linear-gradient(135deg, ${p.primary}20, ${p.accent}20)`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${p.primary}30` }}>
                        <span style={{ fontSize: '22px' }}>{symbol}</span>
                    </div>
                    <B w="90px" h="7px" color={p.text} o={0.6} mt="10px" />
                    <div className="flex justify-center"><B w="140px" h="3px" color={p.text} o={0.15} mt="6px" /></div>
                    <div className="flex justify-center gap-2 mt-4">
                        {[0, 1, 2].map(i => <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: `${p.text}08` }}></div>)}
                    </div>
                </div>
            </S>

            <S id="Gallery" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-2">
                <Img h={isWide ? '220px' : '180px'} color={p.primary} hint={ve.heroImage || 'Featured project'} icon="🎨" rounded="16px" />
                <div className={`grid gap-2 mt-2 ${isWide ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    {[p.accent, p.secondary, p.primary].slice(0, isWide ? 3 : 2).map((c, i) => (
                        <Img key={i} h={isWide ? '130px' : '110px'} color={c} hint={ve.supportingImages?.[i]} icon={['📸', '🎬', '✏️'][i]} rounded="12px" />
                    ))}
                </div>
            </S>

            <S id="Contact" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-5">
                <div className="text-center p-4 rounded-2xl" style={{ backgroundColor: `${p.primary}06`, border: `1px solid ${p.primary}12` }}>
                    <B w="70%" h="5px" color={p.text} o={0.25} />
                    <div className="flex justify-center mt-3"><Btn bg={p.primary} w="120px" h="34px" /></div>
                </div>
            </S>
        </div>
    )
}

function BlogMockup({ p, symbol, ve, brief, title, hovered, setHovered, device }) {
    const isWide = device !== 'mobile'
    return (
        <div className={isWide ? 'p-6' : 'p-4'}>
            <S id="Header" hovered={hovered} setHovered={setHovered} accent={p.accent}>
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                        <span style={{ fontSize: '14px' }}>{symbol}</span>
                        <B w="50px" h="5px" color={p.text} o={0.5} />
                    </div>
                    <Avatar size="24px" color={p.primary} />
                </div>
            </S>

            <S id="Featured Article" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-3">
                <Img h={isWide ? '200px' : '160px'} color={p.primary} hint={ve.heroImage || 'Featured article cover'} icon="📰" rounded="16px" />
                <div className="mt-3">
                    <Tag color={p.primary} w="45px" />
                    <B w="95%" h="8px" color={p.text} o={0.5} mt="8px" />
                    <B w="70%" h="8px" color={p.text} o={0.35} mt="4px" />
                    <B w="100%" h="3px" color={p.text} o={0.08} mt="8px" />
                    <B w="85%" h="3px" color={p.text} o={0.06} mt="3px" />
                    <div className="flex items-center gap-2 mt-3">
                        <Avatar size="18px" color={p.accent} />
                        <B w="50px" h="3px" color={p.text} o={0.15} />
                        <B w="35px" h="3px" color={p.text} o={0.08} />
                    </div>
                </div>
            </S>

            <S id="Article List" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-5">
                {[0, 1, 2].map(i => (
                    <div key={i} className="flex gap-3 py-3" style={{ borderBottom: i < 2 ? `1px solid ${p.text}06` : 'none' }}>
                        <Img w="75px" h="75px" color={[p.accent, p.secondary, p.primary][i]} hint={ve.supportingImages?.[i]} icon={['📝', '🎙️', '📊'][i]} rounded="12px" />
                        <div className="flex-1 py-0.5">
                            <B w="90%" h="5px" color={p.text} o={0.3} />
                            <B w="65%" h="5px" color={p.text} o={0.2} mt="4px" />
                            <B w="100%" h="3px" color={p.text} o={0.06} mt="6px" />
                            <div className="flex items-center gap-2 mt-2.5">
                                <Avatar size="14px" color={[p.accent, p.secondary, p.primary][i]} />
                                <B w="40px" h="2px" color={p.text} o={0.12} />
                            </div>
                        </div>
                    </div>
                ))}
            </S>
        </div>
    )
}

function AppMockup({ p, symbol, ve, brief, title, hovered, setHovered, device }) {
    const isWide = device !== 'mobile'
    return (
        <div className={isWide ? 'p-6' : 'p-4'}>
            <S id="Header" hovered={hovered} setHovered={setHovered} accent={p.accent}>
                <div className="py-2">
                    <B w="50px" h="3px" color={p.text} o={0.12} />
                    <B w="130px" h="8px" color={p.text} o={0.5} mt="4px" />
                </div>
            </S>

            <S id="Search" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-3">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ backgroundColor: `${p.text}05`, border: `1px solid ${p.text}08` }}>
                    <span style={{ fontSize: '12px', opacity: 0.25 }}>🔍</span>
                    <B w="60%" h="3px" color={p.text} o={0.1} />
                </div>
            </S>

            <S id="Quick Actions" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-4">
                <div className={`grid gap-3 ${isWide ? 'grid-cols-4' : 'grid-cols-3'}`}>
                    {[{ i: '⚡', c: p.primary }, { i: '📋', c: p.accent }, { i: '⚙️', c: p.secondary }, ...(isWide ? [{ i: '📊', c: p.primary }] : [])].map((a, idx) => (
                        <div key={idx} className="text-center p-4 rounded-xl" style={{ background: `linear-gradient(135deg, ${a.c}06, ${a.c}12)`, border: `1px solid ${a.c}12` }}>
                            <span style={{ fontSize: '22px' }}>{a.i}</span>
                            <B w="80%" h="3px" color={p.text} o={0.15} mt="6px" />
                        </div>
                    ))}
                </div>
            </S>

            <S id="Content" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-4">
                <div className="p-4 rounded-xl" style={{ backgroundColor: `${p.text}03`, border: `1px solid ${p.text}06` }}>
                    <div className="flex justify-between items-center mb-3">
                        <B w="80px" h="5px" color={p.text} o={0.3} />
                        <B w="40px" h="3px" color={p.primary} o={0.5} />
                    </div>
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3 py-2.5" style={{ borderTop: i > 0 ? `1px solid ${p.text}05` : 'none' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: [p.primary, p.accent, p.secondary, p.primary][i], opacity: 0.4 }}></div>
                            <B w="55%" h="4px" color={p.text} o={0.15} />
                            <div className="ml-auto"><B w="30px" h="3px" color={p.text} o={0.08} /></div>
                        </div>
                    ))}
                </div>
            </S>

            {!isWide && (
                <S id="Tab Bar" hovered={hovered} setHovered={setHovered} accent={p.accent} className="mt-5">
                    <div className="flex justify-around py-3">
                        {['🏠', '📊', '➕', '💬', '👤'].map((e, i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <span style={{ fontSize: '16px', opacity: i === 0 ? 1 : 0.25 }}>{e}</span>
                                {i === 0 && <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: p.primary }}></div>}
                            </div>
                        ))}
                    </div>
                </S>
            )}
        </div>
    )
}

function SaasMockup(props) { return <LandingMockup {...props} /> }

const layoutMap = {
    landing: LandingMockup,
    ecommerce: EcommerceMockup,
    dashboard: DashboardMockup,
    social: SocialMockup,
    media: MediaMockup,
    portfolio: PortfolioMockup,
    blog: BlogMockup,
    app: AppMockup,
    saas: SaasMockup,
}

export default VisualConcept