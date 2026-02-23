function Toast({ message }) {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 fade">
            <div className="px-4 py-2 rounded-full text-xs font-medium" style={{
                backgroundColor: '#e4e4e7', color: '#09090b',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
            }}>
                {message}
            </div>
        </div>
    )
}

export default Toast