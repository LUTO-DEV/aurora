function LoadingState({ text }) {
    return (
        <div className="mt-16 mb-8 text-center fade">
            <div className="inline-flex flex-col items-center gap-4">
                <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map(i => (
                        <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                                backgroundColor: '#71717a',
                                animation: 'float 1.4s ease-in-out infinite',
                                animationDelay: `${i * 0.15}s`
                            }}
                        ></div>
                    ))}
                </div>
                <p className="text-xs tracking-wide" style={{ color: '#3f3f46' }}>{text}</p>
            </div>
        </div>
    )
}

export default LoadingState