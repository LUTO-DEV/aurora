import { Menu } from 'lucide-react'
import useStore from '../store'

function Header({ step }) {
    const { toggleSidebar, projects } = useStore()
    const steps = ['Define', 'Analyze', 'Visualize']

    return (
        <header className="pt-6 sm:pt-12 pb-6 sm:pb-12 px-4 sm:px-5">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6 sm:mb-10">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button onClick={toggleSidebar} className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors" style={{ background: '#131316', border: '1px solid #232329' }}>
                            <Menu size={14} style={{ color: '#71717a' }} />
                            {projects.length > 0 && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full flex items-center justify-center text-[7px] sm:text-[8px] font-bold" style={{ backgroundColor: '#e4e4e7', color: '#09090b' }}>
                                    {projects.length}
                                </div>
                            )}
                        </button>
                        <div>
                            <h1 className="text-sm sm:text-base font-semibold tracking-tight flex items-center gap-1.5" style={{ color: '#e4e4e7' }}>
                                <span>✦</span> Aurora
                            </h1>
                            <p className="text-[8px] sm:text-[10px] tracking-wider uppercase" style={{ color: '#3f3f46' }}>Design Partner</p>
                        </div>
                    </div>

                    {/* Steps — simplified on mobile */}
                    <div className="flex items-center gap-1">
                        {steps.map((s, i) => (
                            <div key={i} className="flex items-center gap-1">
                                <div className="h-5 sm:h-6 px-1.5 sm:px-2.5 rounded-full flex items-center gap-1 text-[9px] sm:text-[10px] font-medium transition-all duration-500" style={{
                                    backgroundColor: step > i ? '#e4e4e7' : step === i + 1 ? '#1a1a1f' : 'transparent',
                                    border: step === i + 1 ? '1px solid #232329' : '1px solid transparent',
                                    color: step > i ? '#09090b' : step === i + 1 ? '#71717a' : '#3f3f46'
                                }}>
                                    {step > i ? (
                                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    ) : (
                                        <span className="opacity-50">{i + 1}</span>
                                    )}
                                    <span className="hidden sm:inline">{s}</span>
                                </div>
                                {i < 2 && <div className="w-2 sm:w-4 h-px" style={{ backgroundColor: step > i + 1 ? '#71717a' : '#232329' }}></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header