import { PanelLeftClose, Trash2, Clock } from 'lucide-react'
import useStore from '../store'

function Sidebar() {
    const { sidebarOpen, toggleSidebar, projects, loadProject, deleteProject } = useStore()

    return (
        <>
            {/* Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 fade" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={toggleSidebar}></div>
            )}

            {/* Panel */}
            <div className="fixed top-0 left-0 h-full z-50 transition-transform duration-300" style={{
                width: '320px',
                backgroundColor: '#0c0c0f',
                borderRight: '1px solid #232329',
                transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
            }}>
                <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid #232329' }}>
                    <div className="flex items-center gap-2">
                        <Clock size={14} style={{ color: '#71717a' }} />
                        <span className="text-sm font-medium" style={{ color: '#e4e4e7' }}>Saved Projects</span>
                    </div>
                    <button onClick={toggleSidebar} className="p-1.5 rounded-lg transition-colors" style={{ color: '#71717a' }} onMouseEnter={e => e.target.style.backgroundColor = '#1a1a1f'} onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>
                        <PanelLeftClose size={16} />
                    </button>
                </div>

                <div className="p-3 overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}>
                    {projects.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-xs" style={{ color: '#3f3f46' }}>No saved projects yet</p>
                            <p className="text-[10px] mt-1" style={{ color: '#27272a' }}>Analyze a design goal and save it</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {projects.map(p => (
                                <div key={p.id} className="group rounded-xl p-3 cursor-pointer transition-all" style={{ border: '1px solid transparent' }}
                                    onClick={() => loadProject(p.id)}
                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#131316'; e.currentTarget.style.borderColor = '#232329' }}
                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-medium truncate" style={{ color: '#e4e4e7' }}>
                                                {p.brief?.projectTitle || 'Untitled'}
                                            </p>
                                            <p className="text-[10px] mt-0.5 truncate" style={{ color: '#3f3f46' }}>
                                                {p.prompt?.substring(0, 60)}...
                                            </p>
                                            <p className="text-[9px] mt-1.5" style={{ color: '#27272a' }}>
                                                {new Date(p.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteProject(p.id) }}
                                            className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all"
                                            style={{ color: '#3f3f46' }}
                                            onMouseEnter={e => e.target.style.color = '#ef4444'}
                                            onMouseLeave={e => e.target.style.color = '#3f3f46'}
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>

                                    {/* Mini color preview */}
                                    {p.brief?.colorPalette && (
                                        <div className="flex gap-1 mt-2">
                                            {p.brief.colorPalette.map((c, i) => (
                                                <div key={i} className="w-4 h-2 rounded-sm" style={{ backgroundColor: c.hex }}></div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Sidebar