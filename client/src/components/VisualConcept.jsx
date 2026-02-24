import { Eye, Code2, Monitor, Tablet, Smartphone } from 'lucide-react'
import { useState, useEffect } from 'react'

function VisualConcept({ visual, brief }) {
    const [hovered, setHovered] = useState(null)
    const [device, setDevice] = useState('mobile')
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const check = () => {
            const m = window.innerWidth < 640
            setIsMobile(m)
            if (m) setDevice('mobile')
        }
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    if (!visual) return null

    const c = visual.colors || []
    const bg = c.find(x => x.name === 'Background')?.hex || '#111'
    const primary = c[0]?.hex || '#555'
    const secondary = c[1]?.hex || '#444'
    const accent = c[2]?.hex || '#666'
    const text = c.find(x => x.name === 'Text')?.hex || '#eee'
    const type = brief?.projectType || 'landing'
    const sub = brief?.projectSubType || ''
    const ve = brief?.visualElements || {}
    const mc = brief?.mockupContent || {}
    const symbol = ve.brandSymbol || '✦'
    const title = brief?.projectTitle || 'Project'
    const tokens = brief?.designTokens || {}
    const radius = tokens.borderRadius || '12px'

    const palette = { bg, primary, secondary, accent, text, radius }

    const Renderer = pickLayout(type, sub)

    return (
        <div className="mt-10 sm:mt-14 enter">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="label mb-1">Visual Concept</p>
                    <h3 className="text-sm sm:text-base font-semibold" style={{ color: '#e4e4e7' }}>
                        Live Preview
                    </h3>
                </div>
                <div className="flex items-center gap-1.5">
                    {!isMobile && (
                        <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #232329' }}>
                            {[
                                { id: 'mobile', icon: <Smartphone size={12} /> },
                                { id: 'tablet', icon: <Tablet size={12} /> },
                                { id: 'desktop', icon: <Monitor size={12} /> }
                            ].map(d => (
                                <button key={d.id} onClick={() => setDevice(d.id)}
                                    className="p-1.5 sm:p-2 transition-all"
                                    style={{ backgroundColor: device === d.id ? '#1a1a1f' : 'transparent', color: device === d.id ? '#e4e4e7' : '#3f3f46' }}>
                                    {d.icon}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="flex gap-1 ml-1">
                        <span className="tag">{type}</span>
                        {sub && <span className="tag">{sub}</span>}
                    </div>
                </div>
            </div>

            <div className="flex justify-center enter enter-d1">
                {device === 'mobile' ? (
                    <PhoneFrame bg={bg}>
                        <Renderer p={palette} s={symbol} ve={ve} mc={mc} h={hovered} sh={setHovered} d="mobile" />
                    </PhoneFrame>
                ) : device === 'tablet' ? (
                    <TabletFrame bg={bg}>
                        <Renderer p={palette} s={symbol} ve={ve} mc={mc} h={hovered} sh={setHovered} d="tablet" />
                    </TabletFrame>
                ) : (
                    <BrowserFrame bg={bg} title={title}>
                        <Renderer p={palette} s={symbol} ve={ve} mc={mc} h={hovered} sh={setHovered} d="desktop" />
                    </BrowserFrame>
                )}
            </div>

            {hovered && (
                <div className="mt-3 text-center fade">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px]"
                        style={{ backgroundColor: '#131316', border: '1px solid #232329', color: '#e4e4e7' }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }}></div>
                        {hovered}
                    </span>
                </div>
            )}

            {visual.description && (
                <div className="card p-4 sm:p-5 mt-4 enter enter-d2">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <Eye size={13} style={{ color: '#3f3f46' }} />
                        <span className="label">AI Description</span>
                    </div>
                    <p className="text-[11px] sm:text-sm leading-relaxed" style={{ color: '#71717a' }}>{visual.description}</p>
                </div>
            )}

            {visual.prompt && (
                <details className="mt-2 cursor-pointer">
                    <summary className="flex items-center gap-2 text-[10px] sm:text-[11px] py-2 px-1" style={{ color: '#3f3f46' }}>
                        <Code2 size={11} /> View prompt
                    </summary>
                    <div className="p-3 mt-1" style={{ background: '#131316', border: '1px solid #232329', borderRadius: '16px' }}>
                        <p className="text-[10px] font-mono leading-relaxed break-all" style={{ color: '#3f3f46' }}>{visual.prompt}</p>
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
            <div style={{ background: 'linear-gradient(145deg, #1e1e24, #141418)', borderRadius: '44px', padding: '14px 10px', border: '1px solid #2a2a32', boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.02)' }}>
                <div className="flex justify-center" style={{ marginBottom: '6px' }}>
                    <div style={{ width: '100px', height: '24px', backgroundColor: '#141418', borderRadius: '0 0 14px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '-4px', position: 'relative', zIndex: 5 }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#232329' }}></div>
                        <div style={{ width: '32px', height: '3px', borderRadius: '3px', backgroundColor: '#232329' }}></div>
                    </div>
                </div>
                <div style={{ borderRadius: '32px', overflow: 'hidden', overflowY: 'auto', backgroundColor: bg, minHeight: '620px', maxHeight: '720px' }}>
                    {children}
                </div>
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
            <div style={{ background: 'linear-gradient(145deg, #1e1e24, #141418)', borderRadius: '28px', padding: '16px 12px', border: '1px solid #2a2a32', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
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
            <div style={{ background: '#141418', borderRadius: '16px', border: '1px solid #2a2a32', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
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
// SHARED UI PRIMITIVES — Colors actually applied
// ============================================

function Sec({ id, h: hovered, sh, accent, children, className = '' }) {
    const active = hovered === id
    return (
        <div className={className} style={{ outline: active ? `2px solid ${accent}` : '2px solid transparent', outlineOffset: '-2px', borderRadius: '10px', transition: 'outline 0.15s', cursor: 'default', position: 'relative' }}
            onMouseEnter={() => sh(id)} onMouseLeave={() => sh(null)}>
            {children}
        </div>
    )
}

function Placeholder({ w = '100%', h = '120px', color, hint, icon = '📷', r = '12px' }) {
    return (
        <div className="group relative overflow-hidden" style={{ width: w, height: h, borderRadius: r, background: `linear-gradient(145deg, ${color}10, ${color}20)`, border: `1px solid ${color}18` }}>
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 50%, ${color}08 100%)` }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: `${color}10`, border: `1.5px dashed ${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', opacity: 0.4 }}>{icon}</div>
            </div>
            {hint && (
                <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: `linear-gradient(transparent, ${color}95)` }}>
                    <span className="text-white text-[9px] font-medium leading-tight">{hint}</span>
                </div>
            )}
            <div style={{ position: 'absolute', top: '6px', left: '6px', width: '10px', height: '10px', borderTop: `1.5px solid ${color}20`, borderLeft: `1.5px solid ${color}20`, borderRadius: '2px 0 0 0' }}></div>
            <div style={{ position: 'absolute', bottom: '6px', right: '6px', width: '10px', height: '10px', borderBottom: `1.5px solid ${color}20`, borderRight: `1.5px solid ${color}20`, borderRadius: '0 0 2px 0' }}></div>
        </div>
    )
}

// Text that actually uses the palette text color
function T({ children, color, size = '10px', weight = '600', o = 1 }) {
    return <span style={{ fontSize: size, fontWeight: weight, color: color, opacity: o, letterSpacing: '-0.01em' }}>{children}</span>
}

// Button that actually uses primary color
function PrimaryBtn({ p, text, w = 'auto', h = '36px' }) {
    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', height: h, width: w, borderRadius: p.radius, backgroundColor: p.primary, boxShadow: `0 2px 12px ${p.primary}30`, cursor: 'default' }}>
            <T color={p.bg} size="11px" weight="600">{text}</T>
        </div>
    )
}

function GhostBtn({ p, text, w = 'auto', h = '36px' }) {
    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px', height: h, width: w, borderRadius: p.radius, border: `1.5px solid ${p.text}18`, cursor: 'default' }}>
            <T color={p.text} size="11px" weight="500" o={0.6}>{text}</T>
        </div>
    )
}

function Card({ p, children, padding = '14px' }) {
    return (
        <div style={{ backgroundColor: `${p.secondary}15`, border: `1px solid ${p.text}08`, borderRadius: p.radius, padding, transition: 'border-color 0.2s' }}>
            {children}
        </div>
    )
}

function IconBox({ color, icon, size = '36px', r = '10px' }) {
    return (
        <div style={{ width: size, height: size, borderRadius: r, background: `linear-gradient(135deg, ${color}15, ${color}28)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: parseInt(size) / 2.2 + 'px' }}>
            {icon}
        </div>
    )
}

function NavItem({ p, label, active = false }) {
    return (
        <T color={p.text} size="10px" weight={active ? '600' : '400'} o={active ? 0.9 : 0.35}>{label}</T>
    )
}

function StatBlock({ p, number, label, color }) {
    return (
        <div className="text-center">
            <T color={color || p.text} size="16px" weight="700" o={0.8}>{number}</T>
            <div style={{ marginTop: '2px' }}><T color={p.text} size="9px" weight="400" o={0.3}>{label}</T></div>
        </div>
    )
}

function Divider({ color, mt = '0', mb = '0' }) {
    return <div style={{ height: '1px', backgroundColor: `${color}08`, marginTop: mt, marginBottom: mb }}></div>
}

function ProgressBar({ color, bg, percent = 40, h = '4px', r = '99px' }) {
    return (
        <div style={{ height: h, backgroundColor: `${bg}12`, borderRadius: r, overflow: 'hidden' }}>
            <div style={{ width: `${percent}%`, height: '100%', backgroundColor: color, borderRadius: r }}></div>
        </div>
    )
}

function TabBar({ p, items, active = 0 }) {
    return (
        <div className="flex justify-around py-3 rounded-2xl" style={{ backgroundColor: `${p.text}04`, border: `1px solid ${p.text}06` }}>
            {items.map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                    <span style={{ fontSize: '16px', opacity: i === active ? 1 : 0.25 }}>{item.icon}</span>
                    {i === active && <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: p.primary }}></div>}
                </div>
            ))}
        </div>
    )
}

// ============================================
// LAYOUT PICKER — matches type + subtype
// ============================================
function pickLayout(type, sub) {
    const map = {
        landing: LandingLayout,
        ecommerce: EcommerceLayout,
        dashboard: DashboardLayout,
        social: SocialLayout,
        media: MediaLayout,
        portfolio: PortfolioLayout,
        blog: BlogLayout,
        app: AppLayout,
    }
    return map[type] || LandingLayout
}

// ============================================
// LANDING LAYOUT
// ============================================
function LandingLayout({ p, s, ve, mc, h, sh, d }) {
    const wide = d !== 'mobile'
    return (
        <div className={wide ? 'p-6 sm:p-8' : 'p-4'}>
            <Sec id="Navigation" h={h} sh={sh} accent={p.accent}>
                <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                        <IconBox color={p.primary} icon={s} size="28px" r="8px" />
                        <T color={p.text} size="12px" weight="700" o={0.8}>{mc.navItems?.[0] || 'Brand'}</T>
                    </div>
                    {wide && (
                        <div className="flex items-center gap-5">
                            {mc.navItems?.slice(1).map((n, i) => <NavItem key={i} p={p} label={n} />)}
                        </div>
                    )}
                    <PrimaryBtn p={p} text={mc.ctaText || 'Get Started'} h="30px" />
                </div>
            </Sec>

            <Sec id="Hero" h={h} sh={sh} accent={p.accent} className="mt-6">
                <div className={wide ? 'flex items-center gap-8 py-8' : 'text-center py-6'}>
                    <div className={wide ? 'flex-1' : ''}>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4" style={{ backgroundColor: `${p.accent}12`, border: `1px solid ${p.accent}20` }}>
                            <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: p.accent }}></div>
                            <T color={p.accent} size="9px" weight="500">New Release</T>
                        </div>
                        <div>
                            <T color={p.text} size={wide ? '28px' : '22px'} weight="800">{mc.heroHeadline || 'Build Something Great'}</T>
                        </div>
                        <div style={{ marginTop: '10px', maxWidth: '320px', ...(wide ? {} : { margin: '10px auto 0' }) }}>
                            <T color={p.text} size="12px" weight="400" o={0.45}>{mc.heroSubtext || 'The platform for modern teams'}</T>
                        </div>
                        <div className={`flex gap-2.5 mt-5 ${wide ? '' : 'justify-center'}`}>
                            <PrimaryBtn p={p} text={mc.ctaText || 'Get Started'} />
                            <GhostBtn p={p} text={mc.secondaryCta || 'Learn More'} />
                        </div>
                    </div>
                    {wide && (
                        <div className="flex-1">
                            <Placeholder h="220px" color={p.primary} hint={ve.heroImage} icon={s} />
                        </div>
                    )}
                </div>
            </Sec>

            {!wide && (
                <Sec id="Hero Visual" h={h} sh={sh} accent={p.accent} className="mt-4">
                    <Placeholder h="160px" color={p.primary} hint={ve.heroImage} icon={s} />
                </Sec>
            )}

            <Sec id="Social Proof" h={h} sh={sh} accent={p.accent} className="mt-8">
                <div className="py-4 rounded-2xl" style={{ backgroundColor: `${p.primary}06`, border: `1px solid ${p.primary}10` }}>
                    <div className={`flex ${wide ? 'justify-around' : 'justify-between px-4'}`}>
                        {(mc.statNumbers || ['10K+', '4.9★', '99%']).map((n, i) => (
                            <StatBlock key={i} p={p} number={n} label={mc.statLabels?.[i] || ''} color={i === 0 ? p.primary : undefined} />
                        ))}
                    </div>
                </div>
            </Sec>

            <Sec id="Features" h={h} sh={sh} accent={p.accent} className="mt-8">
                <div className="text-center mb-5">
                    <T color={p.text} size="16px" weight="700" o={0.7}>Why choose us</T>
                </div>
                <div className={`grid gap-3 ${wide ? 'grid-cols-3' : 'grid-cols-1'}`}>
                    {(mc.featureNames || ['Fast', 'Secure', 'Simple']).map((name, i) => {
                        const colors = [p.primary, p.accent, p.secondary]
                        return (
                            <Card key={i} p={p}>
                                <IconBox color={colors[i]} icon={['⚡', '🔒', '✨'][i]} />
                                <div style={{ marginTop: '12px' }}>
                                    <T color={p.text} size="13px" weight="600">{name}</T>
                                </div>
                                <div style={{ marginTop: '6px' }}>
                                    <T color={p.text} size="10px" weight="400" o={0.35}>{ve.supportingImages?.[i] || 'Feature description here'}</T>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </Sec>

            <Sec id="CTA Section" h={h} sh={sh} accent={p.accent} className="mt-8">
                <div className="text-center py-6 rounded-2xl" style={{ background: `linear-gradient(135deg, ${p.primary}08, ${p.accent}06)`, border: `1px solid ${p.primary}12` }}>
                    <T color={p.text} size="16px" weight="700" o={0.6}>Ready to start?</T>
                    <div style={{ marginTop: '4px' }}><T color={p.text} size="11px" weight="400" o={0.3}>Join thousands of happy users</T></div>
                    <div className="flex justify-center mt-4">
                        <PrimaryBtn p={p} text={mc.ctaText || 'Get Started'} w="140px" />
                    </div>
                </div>
            </Sec>

            <Sec id="Footer" h={h} sh={sh} accent={p.accent} className="mt-8">
                <Divider color={p.text} mb="12px" />
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-1.5">
                        <span style={{ fontSize: '10px' }}>{s}</span>
                        <T color={p.text} size="10px" weight="500" o={0.3}>© 2025</T>
                    </div>
                    <div className="flex gap-2">
                        {['●', '●', '●'].map((x, i) => (
                            <div key={i} style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: `${p.text}08` }}></div>
                        ))}
                    </div>
                </div>
            </Sec>
        </div>
    )
}

// ============================================
// ECOMMERCE LAYOUT
// ============================================
function EcommerceLayout({ p, s, ve, mc, h, sh, d }) {
    const wide = d !== 'mobile'
    const sub = mc.featureNames || ['Trending', 'New In', 'Sale']
    return (
        <div className={wide ? 'p-6' : 'p-4'}>
            <Sec id="Header" h={h} sh={sh} accent={p.accent}>
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                        <span style={{ fontSize: '16px' }}>{s}</span>
                        <T color={p.text} size="13px" weight="700">{mc.navItems?.[0] || 'Shop'}</T>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 mx-2" style={{ maxWidth: '140px' }}>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ backgroundColor: `${p.text}05`, border: `1px solid ${p.text}08` }}>
                                <T color={p.text} size="10px" weight="400" o={0.25}>Search...</T>
                            </div>
                        </div>
                        <div className="relative">
                            <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: `${p.text}06`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <T color={p.text} size="12px" o={0.4}>🛒</T>
                            </div>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: p.accent, position: 'absolute', top: '-2px', right: '-2px', border: `2px solid ${p.bg}` }}></div>
                        </div>
                    </div>
                </div>
            </Sec>

            <Sec id="Categories" h={h} sh={sh} accent={p.accent} className="mt-3">
                <div className="flex gap-2 overflow-hidden">
                    {['All', ...sub].map((cat, i) => (
                        <div key={i} className="flex-shrink-0 px-4 py-2 rounded-xl" style={{
                            backgroundColor: i === 0 ? p.primary : `${p.text}04`,
                            border: i === 0 ? 'none' : `1px solid ${p.text}08`,
                            boxShadow: i === 0 ? `0 2px 8px ${p.primary}25` : 'none'
                        }}>
                            <T color={i === 0 ? p.bg : p.text} size="10px" weight={i === 0 ? '600' : '500'} o={i === 0 ? 1 : 0.4}>{cat}</T>
                        </div>
                    ))}
                </div>
            </Sec>

            <Sec id="Featured" h={h} sh={sh} accent={p.accent} className="mt-4">
                <div className="rounded-2xl overflow-hidden relative">
                    <Placeholder h={wide ? '220px' : '180px'} color={p.accent} hint={ve.heroImage || 'Featured product photo'} icon="🛍️" r="16px" />
                    <div className="absolute bottom-0 left-0 right-0 p-4" style={{ background: `linear-gradient(transparent, ${p.bg}f0)` }}>
                        <div className="flex items-end justify-between">
                            <div>
                                <T color={p.text} size="15px" weight="700">{mc.heroHeadline || 'New Collection'}</T>
                                <div style={{ marginTop: '3px' }}><T color={p.text} size="11px" weight="400" o={0.5}>{mc.heroSubtext || 'Explore the latest'}</T></div>
                            </div>
                            <PrimaryBtn p={p} text="Shop" h="32px" />
                        </div>
                    </div>
                </div>
            </Sec>

            <Sec id="Products" h={h} sh={sh} accent={p.accent} className="mt-4">
                <div className={`grid gap-2.5 ${wide ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    {[0, 1, 2, 3].slice(0, wide ? 3 : 4).map(i => {
                        const colors = [p.primary, p.secondary, p.accent, p.primary]
                        return (
                            <div key={i} className="rounded-2xl overflow-hidden" style={{ backgroundColor: `${p.text}03`, border: `1px solid ${p.text}06` }}>
                                <Placeholder h="115px" color={colors[i]} hint={ve.supportingImages?.[i]} icon="📦" r="0" />
                                <div className="p-3">
                                    <T color={p.text} size="11px" weight="600" o={0.7}>{sub[i] || `Product ${i + 1}`}</T>
                                    <div style={{ marginTop: '4px' }}><T color={p.text} size="9px" weight="400" o={0.3}>Premium quality</T></div>
                                    <div className="flex items-center justify-between" style={{ marginTop: '8px' }}>
                                        <T color={p.primary} size="13px" weight="700">$49</T>
                                        <div style={{ width: '26px', height: '26px', borderRadius: '8px', backgroundColor: `${p.primary}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <T color={p.primary} size="14px" weight="400">+</T>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Sec>

            {!wide && (
                <Sec id="Tab Bar" h={h} sh={sh} accent={p.accent} className="mt-5">
                    <TabBar p={p} items={[{ icon: '🏠' }, { icon: '🔍' }, { icon: '❤️' }, { icon: '👤' }]} />
                </Sec>
            )}
        </div>
    )
}

// ============================================
// DASHBOARD LAYOUT
// ============================================
function DashboardLayout({ p, s, ve, mc, h, sh, d }) {
    const wide = d !== 'mobile'
    return (
        <div className={wide ? 'p-6' : 'p-4'}>
            <Sec id="Header" h={h} sh={sh} accent={p.accent}>
                <div className="flex items-center justify-between py-2">
                    <div>
                        <T color={p.text} size="10px" weight="400" o={0.3}>Welcome back</T>
                        <div style={{ marginTop: '3px' }}><T color={p.text} size="16px" weight="700">{mc.heroHeadline || 'Dashboard'}</T></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: `${p.text}06`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <T color={p.text} size="12px" o={0.3}>🔔</T>
                        </div>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `linear-gradient(135deg, ${p.primary}30, ${p.accent}30)` }}></div>
                    </div>
                </div>
            </Sec>

            <Sec id="Stats" h={h} sh={sh} accent={p.accent} className="mt-4">
                <div className={`grid gap-2 ${wide ? 'grid-cols-4' : 'grid-cols-2'}`}>
                    {[
                        { icon: '📈', color: p.primary, n: mc.statNumbers?.[0] || '12.4K', l: mc.statLabels?.[0] || 'Revenue' },
                        { icon: '💰', color: p.accent, n: mc.statNumbers?.[1] || '$48K', l: mc.statLabels?.[1] || 'Profit' },
                        { icon: '👥', color: p.secondary, n: mc.statNumbers?.[2] || '2,847', l: mc.statLabels?.[2] || 'Users' },
                        { icon: '⚡', color: p.primary, n: '94%', l: 'Growth' }
                    ].map((stat, i) => (
                        <Card key={i} p={p} padding="12px">
                            <div className="flex items-center justify-between">
                                <T color={p.text} size="9px" weight="500" o={0.3}>{stat.l}</T>
                                <T color={stat.color} size="14px">{stat.icon}</T>
                            </div>
                            <div style={{ marginTop: '8px' }}><T color={p.text} size="18px" weight="800" o={0.8}>{stat.n}</T></div>
                            <div className="flex items-center gap-1.5" style={{ marginTop: '6px' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: stat.color }}></div>
                                <T color={stat.color} size="9px" weight="500">+12.5%</T>
                            </div>
                        </Card>
                    ))}
                </div>
            </Sec>

            <Sec id="Chart" h={h} sh={sh} accent={p.accent} className="mt-3">
                <Card p={p}>
                    <div className="flex items-center justify-between mb-4">
                        <T color={p.text} size="12px" weight="600" o={0.6}>Revenue Overview</T>
                        <div className="flex gap-1">
                            {['D', 'W', 'M', 'Y'].map((t, i) => (
                                <div key={i} className="px-2 py-0.5 rounded-md" style={{
                                    backgroundColor: i === 2 ? `${p.primary}15` : 'transparent',
                                }}>
                                    <T color={i === 2 ? p.primary : p.text} size="9px" weight="500" o={i === 2 ? 0.8 : 0.2}>{t}</T>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-end gap-1" style={{ height: '100px' }}>
                        {[35, 50, 40, 75, 55, 70, 95, 60, 80, 45, 88, 65, 72, 90].map((val, i) => (
                            <div key={i} className="flex-1" style={{
                                height: `${val}%`,
                                backgroundColor: i === 6 || i === 13 ? p.primary : `${p.primary}18`,
                                borderRadius: '3px 3px 1px 1px',
                                boxShadow: (i === 6 || i === 13) ? `0 2px 8px ${p.primary}30` : 'none'
                            }}></div>
                        ))}
                    </div>
                </Card>
            </Sec>

            <Sec id="Activity" h={h} sh={sh} accent={p.accent} className="mt-3">
                <Card p={p} padding="0">
                    <div className="px-3 py-2.5 flex items-center justify-between" style={{ borderBottom: `1px solid ${p.text}06` }}>
                        <T color={p.text} size="11px" weight="600" o={0.5}>Recent Activity</T>
                        <T color={p.primary} size="9px" weight="500">View All</T>
                    </div>
                    {[
                        { icon: '📊', color: p.primary, title: 'New report generated' },
                        { icon: '🔔', color: p.accent, title: 'Alert threshold reached' },
                        { icon: '💳', color: p.secondary, title: 'Payment processed' },
                        { icon: '📁', color: p.primary, title: 'File uploaded' }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2.5" style={{ borderBottom: i < 3 ? `1px solid ${p.text}04` : 'none' }}>
                            <IconBox color={item.color} icon={item.icon} size="32px" r="8px" />
                            <div className="flex-1">
                                <T color={p.text} size="10px" weight="500" o={0.6}>{item.title}</T>
                                <div style={{ marginTop: '2px' }}><T color={p.text} size="9px" weight="400" o={0.2}>2 hours ago</T></div>
                            </div>
                            <T color={p.text} size="9px" weight="400" o={0.2}>$420</T>
                        </div>
                    ))}
                </Card>
            </Sec>
        </div>
    )
}

// ============================================
// SOCIAL LAYOUT
// ============================================
function SocialLayout({ p, s, ve, mc, h, sh, d }) {
    const wide = d !== 'mobile'
    return (
        <div className={wide ? 'p-6' : 'p-4'}>
            <Sec id="Header" h={h} sh={sh} accent={p.accent}>
                <div className="flex items-center justify-between py-2">
                    <T color={p.text} size="16px" weight="800">{s}</T>
                    <div className="flex gap-2">
                        {['💬', '🔔'].map((icon, i) => (
                            <div key={i} style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: `${p.text}06`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <T color={p.text} size="12px" o={0.3}>{icon}</T>
                            </div>
                        ))}
                    </div>
                </div>
            </Sec>

            <Sec id="Stories" h={h} sh={sh} accent={p.accent} className="mt-3">
                <div className="flex gap-3 overflow-hidden">
                    {[{ yours: true }, ...[0, 1, 2, 3].map(i => ({ yours: false }))].map((item, i) => (
                        <div key={i} className="flex-shrink-0 text-center">
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '50%', padding: '2.5px',
                                background: i === 0 ? `linear-gradient(135deg, ${p.primary}, ${p.accent})` : i < 3 ? `linear-gradient(135deg, ${p.accent}60, ${p.primary}60)` : `${p.text}12`
                            }}>
                                <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: p.bg, padding: '2px' }}>
                                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: `linear-gradient(135deg, ${[p.primary, p.accent, p.secondary, p.primary, p.accent][i]}15, ${[p.primary, p.accent, p.secondary, p.primary, p.accent][i]}25)` }}></div>
                                </div>
                            </div>
                            <div style={{ marginTop: '4px' }}><T color={p.text} size="8px" weight="500" o={0.3}>{i === 0 ? 'You' : 'User'}</T></div>
                        </div>
                    ))}
                </div>
            </Sec>

            {[0, 1].map(idx => (
                <Sec key={idx} id={`Post ${idx + 1}`} h={h} sh={sh} accent={p.accent} className="mt-5">
                    <div className="flex items-center gap-2.5 mb-3">
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: `linear-gradient(135deg, ${[p.primary, p.accent][idx]}20, ${[p.primary, p.accent][idx]}35)` }}></div>
                        <div>
                            <T color={p.text} size="11px" weight="600" o={0.7}>{mc.featureNames?.[idx] || `User ${idx + 1}`}</T>
                            <div style={{ marginTop: '1px' }}><T color={p.text} size="9px" weight="400" o={0.25}>2h ago</T></div>
                        </div>
                        <div className="ml-auto"><T color={p.text} size="12px" o={0.2}>•••</T></div>
                    </div>
                    <Placeholder h={wide ? '280px' : '220px'} color={[p.primary, p.accent][idx]} hint={ve.supportingImages?.[idx]} icon="📸" r="14px" />
                    <div className="flex items-center justify-between mt-2.5 py-1.5">
                        <div className="flex gap-4">
                            {[{ e: '❤️', n: '2.4K' }, { e: '💬', n: '128' }, { e: '↗️', n: '' }].map((action, i) => (
                                <div key={i} className="flex items-center gap-1">
                                    <span style={{ fontSize: '16px', opacity: 0.4 }}>{action.e}</span>
                                    {action.n && <T color={p.text} size="10px" weight="500" o={0.3}>{action.n}</T>}
                                </div>
                            ))}
                        </div>
                        <span style={{ fontSize: '16px', opacity: 0.2 }}>🔖</span>
                    </div>
                    <T color={p.text} size="10px" weight="600" o={0.5}>{mc.heroSubtext || 'Living my best life ✨'}</T>
                </Sec>
            ))}
        </div>
    )
}

// ============================================
// MEDIA LAYOUT
// ============================================
function MediaLayout({ p, s, ve, mc, h, sh, d }) {
    const wide = d !== 'mobile'
    return (
        <div className={wide ? 'p-6' : 'p-4'}>
            <Sec id="Header" h={h} sh={sh} accent={p.accent}>
                <div className="flex items-center justify-between py-2">
                    <T color={p.text} size="16px" weight="800">{s}</T>
                    <div className="flex-1 mx-4 max-w-[160px]">
                        <div className="px-3 py-1.5 rounded-full" style={{ backgroundColor: `${p.text}06`, border: `1px solid ${p.text}08` }}>
                            <T color={p.text} size="9px" weight="400" o={0.25}>Search...</T>
                        </div>
                    </div>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `linear-gradient(135deg, ${p.primary}30, ${p.accent}30)` }}></div>
                </div>
            </Sec>

            <Sec id="Now Playing" h={h} sh={sh} accent={p.accent} className="mt-4">
                <div className="rounded-2xl overflow-hidden relative" style={{ height: wide ? '260px' : '200px' }}>
                    <Placeholder h="100%" color={p.primary} hint={ve.heroImage || 'Album art / Video thumbnail'} icon="🎵" r="16px" />
                    <div className="absolute inset-0 flex items-end p-4" style={{ background: `linear-gradient(transparent 30%, ${p.bg}f0)` }}>
                        <div className="flex-1">
                            <T color={p.text} size="16px" weight="700">{mc.heroHeadline || 'Now Playing'}</T>
                            <div style={{ marginTop: '3px' }}><T color={p.text} size="11px" weight="400" o={0.5}>{mc.heroSubtext || 'Artist Name'}</T></div>
                            <div className="flex items-center gap-3 mt-4">
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: p.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 20px ${p.primary}40` }}>
                                    <span style={{ color: p.bg, fontSize: '14px', marginLeft: '2px' }}>▶</span>
                                </div>
                                <div className="flex-1">
                                    <ProgressBar color={p.primary} bg={p.text} percent={35} />
                                    <div className="flex justify-between mt-1">
                                        <T color={p.text} size="8px" weight="400" o={0.3}>1:24</T>
                                        <T color={p.text} size="8px" weight="400" o={0.3}>3:45</T>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Sec>

            <Sec id="Trending" h={h} sh={sh} accent={p.accent} className="mt-5">
                <T color={p.text} size="14px" weight="700" o={0.6}>{mc.featureNames?.[0] || 'Trending'}</T>
                <div className="flex gap-3 mt-3 overflow-hidden">
                    {[p.accent, p.secondary, p.primary].map((c, i) => (
                        <div key={i} className="flex-shrink-0" style={{ width: wide ? '150px' : '110px' }}>
                            <Placeholder h={wide ? '150px' : '110px'} color={c} hint={ve.supportingImages?.[i]} icon="🎧" r="14px" />
                            <div style={{ marginTop: '6px' }}>
                                <T color={p.text} size="10px" weight="600" o={0.6}>{mc.featureNames?.[i] || `Track ${i + 1}`}</T>
                            </div>
                            <div style={{ marginTop: '2px' }}><T color={p.text} size="9px" weight="400" o={0.25}>Artist</T></div>
                        </div>
                    ))}
                </div>
            </Sec>

            <Sec id="Player Bar" h={h} sh={sh} accent={p.accent} className="mt-5">
                <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ backgroundColor: `${p.text}05`, border: `1px solid ${p.text}08` }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `linear-gradient(135deg, ${p.primary}20, ${p.accent}20)` }}></div>
                    <div className="flex-1">
                        <T color={p.text} size="10px" weight="600" o={0.6}>Current Track</T>
                        <div style={{ marginTop: '3px' }}><ProgressBar color={p.primary} bg={p.text} percent={62} h="3px" /></div>
                    </div>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: `${p.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: p.primary, fontSize: '12px' }}>▶</span>
                    </div>
                </div>
            </Sec>
        </div>
    )
}

// ============================================
// PORTFOLIO LAYOUT
// ============================================
function PortfolioLayout({ p, s, ve, mc, h, sh, d }) {
    const wide = d !== 'mobile'
    return (
        <div className={wide ? 'p-6' : 'p-4'}>
            <Sec id="Profile" h={h} sh={sh} accent={p.accent}>
                <div className="text-center py-6">
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto', background: `linear-gradient(135deg, ${p.primary}25, ${p.accent}25)`, border: `2.5px solid ${p.primary}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '24px' }}>{s}</span>
                    </div>
                    <div style={{ marginTop: '12px' }}><T color={p.text} size="18px" weight="700">{mc.heroHeadline || 'Creative Studio'}</T></div>
                    <div style={{ marginTop: '4px' }}><T color={p.text} size="11px" weight="400" o={0.4}>{mc.heroSubtext || 'Design & Development'}</T></div>
                    <div className="flex justify-center gap-2 mt-4">
                        <PrimaryBtn p={p} text={mc.ctaText || 'Hire Me'} h="32px" />
                        <GhostBtn p={p} text="About" h="32px" />
                    </div>
                </div>
            </Sec>

            <Sec id="Gallery" h={h} sh={sh} accent={p.accent} className="mt-2">
                <Placeholder h={wide ? '240px' : '180px'} color={p.primary} hint={ve.heroImage || 'Featured project showcase'} icon="🎨" r="16px" />
                <div className={`grid gap-2 mt-2 ${wide ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    {[p.accent, p.secondary, ...(wide ? [p.primary] : [])].map((c, i) => (
                        <Placeholder key={i} h={wide ? '140px' : '110px'} color={c} hint={ve.supportingImages?.[i]} icon={['📸', '🎬', '✏️'][i]} r="12px" />
                    ))}
                </div>
            </Sec>

            <Sec id="Services" h={h} sh={sh} accent={p.accent} className="mt-5">
                <div className="text-center mb-3"><T color={p.text} size="13px" weight="700" o={0.5}>Services</T></div>
                {(mc.featureNames || ['Design', 'Development', 'Strategy']).map((name, i) => (
                    <div key={i} className="flex items-center gap-3 py-3" style={{ borderBottom: i < 2 ? `1px solid ${p.text}06` : 'none' }}>
                        <IconBox color={[p.primary, p.accent, p.secondary][i]} icon={['🎨', '💻', '📐'][i]} size="36px" />
                        <div className="flex-1">
                            <T color={p.text} size="11px" weight="600" o={0.7}>{name}</T>
                            <div style={{ marginTop: '2px' }}><T color={p.text} size="9px" weight="400" o={0.25}>{ve.supportingImages?.[i] || 'Service description'}</T></div>
                        </div>
                        <T color={p.primary} size="10px" weight="500">→</T>
                    </div>
                ))}
            </Sec>

            <Sec id="Contact" h={h} sh={sh} accent={p.accent} className="mt-5">
                <div className="text-center p-5 rounded-2xl" style={{ background: `linear-gradient(135deg, ${p.primary}08, ${p.accent}06)`, border: `1px solid ${p.primary}12` }}>
                    <T color={p.text} size="14px" weight="700" o={0.5}>Let's work together</T>
                    <div className="flex justify-center mt-3"><PrimaryBtn p={p} text="Get in Touch" /></div>
                </div>
            </Sec>
        </div>
    )
}

// ============================================
// BLOG LAYOUT
// ============================================
function BlogLayout({ p, s, ve, mc, h, sh, d }) {
    const wide = d !== 'mobile'
    return (
        <div className={wide ? 'p-6' : 'p-4'}>
            <Sec id="Header" h={h} sh={sh} accent={p.accent}>
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                        <span style={{ fontSize: '14px' }}>{s}</span>
                        <T color={p.text} size="13px" weight="700">{mc.navItems?.[0] || 'Blog'}</T>
                    </div>
                    <div className="flex items-center gap-3">
                        {wide && mc.navItems?.slice(1, 3).map((n, i) => <NavItem key={i} p={p} label={n} />)}
                        <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: `linear-gradient(135deg, ${p.primary}25, ${p.accent}25)` }}></div>
                    </div>
                </div>
            </Sec>

            <Sec id="Featured Article" h={h} sh={sh} accent={p.accent} className="mt-4">
                <Placeholder h={wide ? '220px' : '170px'} color={p.primary} hint={ve.heroImage || 'Featured article cover image'} icon="📰" r="16px" />
                <div style={{ marginTop: '12px' }}>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md" style={{ backgroundColor: `${p.primary}12` }}>
                        <T color={p.primary} size="9px" weight="600">Featured</T>
                    </div>
                    <div style={{ marginTop: '8px' }}><T color={p.text} size="17px" weight="700" o={0.8}>{mc.heroHeadline || 'Article Title Here'}</T></div>
                    <div style={{ marginTop: '6px' }}><T color={p.text} size="11px" weight="400" o={0.35}>{mc.heroSubtext || 'Article excerpt goes here with a short description...'}</T></div>
                    <div className="flex items-center gap-2" style={{ marginTop: '10px' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: `linear-gradient(135deg, ${p.accent}25, ${p.accent}40)` }}></div>
                        <T color={p.text} size="9px" weight="500" o={0.35}>Author Name</T>
                        <T color={p.text} size="9px" weight="400" o={0.2}>· 5 min read</T>
                    </div>
                </div>
            </Sec>

            <Sec id="Articles" h={h} sh={sh} accent={p.accent} className="mt-6">
                <div className="flex items-center justify-between mb-3">
                    <T color={p.text} size="13px" weight="700" o={0.5}>Latest</T>
                    <T color={p.primary} size="10px" weight="500">See All</T>
                </div>
                {[0, 1, 2].map(i => (
                    <div key={i} className="flex gap-3 py-3" style={{ borderBottom: i < 2 ? `1px solid ${p.text}06` : 'none' }}>
                        <Placeholder w="80px" h="80px" color={[p.accent, p.secondary, p.primary][i]} hint={ve.supportingImages?.[i]} icon={['📝', '🎙️', '📊'][i]} r="12px" />
                        <div className="flex-1 py-0.5">
                            <T color={p.text} size="11px" weight="600" o={0.7}>{mc.featureNames?.[i] || `Article ${i + 1}`}</T>
                            <div style={{ marginTop: '4px' }}><T color={p.text} size="9px" weight="400" o={0.25}>Quick description of the article content...</T></div>
                            <div className="flex items-center gap-2" style={{ marginTop: '6px' }}>
                                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: `linear-gradient(135deg, ${[p.accent, p.secondary, p.primary][i]}25, ${[p.accent, p.secondary, p.primary][i]}40)` }}></div>
                                <T color={p.text} size="8px" weight="500" o={0.25}>Author · 3 min</T>
                            </div>
                        </div>
                    </div>
                ))}
            </Sec>
        </div>
    )
}

// ============================================
// APP LAYOUT
// ============================================
function AppLayout({ p, s, ve, mc, h, sh, d }) {
    const wide = d !== 'mobile'
    return (
        <div className={wide ? 'p-6' : 'p-4'}>
            <Sec id="Header" h={h} sh={sh} accent={p.accent}>
                <div className="py-2">
                    <T color={p.text} size="10px" weight="400" o={0.25}>Good morning</T>
                    <div style={{ marginTop: '3px' }}><T color={p.text} size="18px" weight="800">{mc.heroHeadline || 'Dashboard'}</T></div>
                </div>
            </Sec>

            <Sec id="Search" h={h} sh={sh} accent={p.accent} className="mt-3">
                <div className="flex items-center gap-2 px-3.5 py-3 rounded-2xl" style={{ backgroundColor: `${p.text}04`, border: `1px solid ${p.text}08` }}>
                    <T color={p.text} size="12px" o={0.25}>🔍</T>
                    <T color={p.text} size="11px" weight="400" o={0.2}>Search anything...</T>
                </div>
            </Sec>

            <Sec id="Quick Actions" h={h} sh={sh} accent={p.accent} className="mt-4">
                <div className={`grid gap-3 ${wide ? 'grid-cols-4' : 'grid-cols-3'}`}>
                    {[
                        { icon: '⚡', c: p.primary, name: mc.featureNames?.[0] || 'Quick' },
                        { icon: '📋', c: p.accent, name: mc.featureNames?.[1] || 'Tasks' },
                        { icon: '⚙️', c: p.secondary, name: mc.featureNames?.[2] || 'Settings' },
                        ...(wide ? [{ icon: '📊', c: p.primary, name: 'Reports' }] : [])
                    ].map((action, i) => (
                        <div key={i} className="text-center p-4 rounded-2xl" style={{ background: `linear-gradient(145deg, ${action.c}06, ${action.c}14)`, border: `1px solid ${action.c}12` }}>
                            <span style={{ fontSize: '24px' }}>{action.icon}</span>
                            <div style={{ marginTop: '8px' }}><T color={p.text} size="10px" weight="500" o={0.5}>{action.name}</T></div>
                        </div>
                    ))}
                </div>
            </Sec>

            <Sec id="Progress" h={h} sh={sh} accent={p.accent} className="mt-4">
                <Card p={p}>
                    <div className="flex items-center justify-between mb-3">
                        <T color={p.text} size="12px" weight="600" o={0.6}>Your Progress</T>
                        <T color={p.primary} size="10px" weight="500">75%</T>
                    </div>
                    <ProgressBar color={p.primary} bg={p.text} percent={75} h="6px" r="3px" />
                    <div style={{ marginTop: '6px' }}><T color={p.text} size="9px" weight="400" o={0.25}>3 of 4 goals completed this week</T></div>
                </Card>
            </Sec>

            <Sec id="Content" h={h} sh={sh} accent={p.accent} className="mt-3">
                <Card p={p} padding="0">
                    <div className="px-3.5 py-2.5 flex items-center justify-between" style={{ borderBottom: `1px solid ${p.text}06` }}>
                        <T color={p.text} size="11px" weight="600" o={0.5}>Recent</T>
                        <T color={p.primary} size="9px" weight="500">View All</T>
                    </div>
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3 px-3.5 py-2.5" style={{ borderTop: i > 0 ? `1px solid ${p.text}04` : 'none' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: [p.primary, p.accent, p.secondary, p.primary][i], opacity: 0.5 }}></div>
                            <div className="flex-1">
                                <T color={p.text} size="10px" weight="500" o={0.5}>{['Meeting notes', 'Design review', 'Code push', 'Bug fix'][i]}</T>
                            </div>
                            <T color={p.text} size="9px" weight="400" o={0.2}>{['2h', '5h', '1d', '2d'][i]}</T>
                        </div>
                    ))}
                </Card>
            </Sec>

            {!wide && (
                <Sec id="Tab Bar" h={h} sh={sh} accent={p.accent} className="mt-5">
                    <TabBar p={p} items={[{ icon: '🏠' }, { icon: '📊' }, { icon: '➕' }, { icon: '💬' }, { icon: '👤' }]} />
                </Sec>
            )}
        </div>
    )
}

export default VisualConcept