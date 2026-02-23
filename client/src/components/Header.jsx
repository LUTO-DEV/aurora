function Header({ step }) {
    const steps = ['Define', 'Analyze', 'Visualize']

    return (
        <header className="pt-12 sm:pt-16 pb-10 sm:pb-14 px-5">
            <div className="max-w-3xl mx-auto">
                {/* Logo */}
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-9 h-9 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center">
                                <span className="text-sm">✦</span>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-base font-semibold tracking-tight text-[var(--color-text)]">Aurora</h1>
                            <p className="text-[10px] text-[var(--color-text-faint)] tracking-wider uppercase">Design Partner</p>
                        </div>
                    </div>

                    {/* Step indicator */}
                    <div className="flex items-center gap-1.5">
                        {steps.map((s, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                                <div className={`h-6 px-2.5 rounded-full flex items-center gap-1.5 text-[10px] font-medium tracking-wide transition-all duration-500 ${step > i
                                        ? 'bg-[var(--color-text)] text-[var(--color-bg)]'
                                        : step === i + 1
                                            ? 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)] border border-[var(--color-border)]'
                                            : 'text-[var(--color-text-faint)]'
                                    }`}>
                                    {step > i ? (
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    ) : (
                                        <span className="opacity-50">{i + 1}</span>
                                    )}
                                    <span className="hidden sm:inline">{s}</span>
                                </div>
                                {i < 2 && <div className={`w-4 h-px transition-colors duration-500 ${step > i + 1 ? 'bg-[var(--color-text-muted)]' : 'bg-[var(--color-border)]'}`}></div>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Headline */}
                {step === 0 && (
                    <div className="text-center enter">
                        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight gradient-text leading-tight">
                            Think before you design.
                        </h2>
                        <p className="text-[var(--color-text-muted)] text-sm mt-3 max-w-md mx-auto font-light leading-relaxed">
                            Aurora analyzes your design goal, builds a strategic brief, and generates a visual concept — like a creative director would.
                        </p>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header