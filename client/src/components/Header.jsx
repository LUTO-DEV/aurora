import { Menu } from 'lucide-react'
import useStore from '../store'

function Header({ step }) {
    const { toggleSidebar, projects } = useStore()
    const steps = ['Define', 'Analyze', 'Visualize']

    return (
        <header className="pt-8 sm:pt-12 pb-8 sm:pb-12 px-5">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        {/* Sidebar toggle */}
                        <button onClick={toggleSidebar} className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors" style={{ background: '#131316', border: '1px solid #232329' }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = '#2e2e36'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = '#232329'}>
                            <Menu size={14} style={{ color: '#71717a' }} />
                            {projects.length > 0 && (
                                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ backgroundColor: '#e4e4e7', color: '#09090b' }}>
                                    {projects.length}
                                </div>
                            )}
                        </button>

                        <div>
                            <h1 className="text-base font-semibold tracking-tight flex items-center gap-1.5" style={{ color: '#e4e4e7' }}>
                                <span>✦</span> Aurora
                            </h1>
                            <p className="text-[10px] tracking-wider uppercase" style={{ color: '#3f3f46' }}>Design Partner</p>
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="flex items-center gap-1.5">
                        {steps.map((s, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                                <div className="h-6 px-2.5 rounded-full flex items-center gap-1.5 text-[10px] font-medium tracking-wide transition-all duration-500" style={{
                                    backgroundColor: step > i ? '#e4e4e7' : step === i + 1 ? '#1a1a1f' : 'transparent',
                                    border: step === i + 1 ? '1px solid #232329' : '1px solid transparent',
                                    color: step > i ? '#09090b' : step === i + 1 ? '#71717a' : '#3f3f46'
                                }}>
                                    {step > i ? (
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    ) : (
                                        <span className="opacity-50">{i + 1}</span>
                                    )}
                                    <span className="hidden sm:inline">{s}</span>
                                </div>
                                {i < 2 && <div className="w-4 h-px" style={{ backgroundColor: step > i + 1 ? '#71717a' : '#232329' }}></div>}
                            </div>
                        ))}
                    </div>
                </div>

                {step === 0 && (
                    <div className="text-center enter">
                        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight gradient-text">
                            Think before you design.
                        </h2>
                        <p className="text-sm mt-3 max-w-md mx-auto font-light leading-relaxed" style={{ color: '#71717a' }}>
                            Aurora analyzes your design goal, builds a strategic brief, and generates a visual concept — like a creative director would.
                        </p>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header