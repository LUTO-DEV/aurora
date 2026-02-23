function Header() {
    return (
        <header className="pt-16 pb-12 text-center px-5">
            <div className="flex items-center justify-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.07] flex items-center justify-center border border-white/10">
                    <span className="text-base">✦</span>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-white/90">AURORA</h1>
            </div>
            <p className="text-white/30 text-sm font-light max-w-sm mx-auto">
                AI Design Partner — think before you design.
            </p>
        </header>
    )
}

export default Header