import { PanelLeftClose, Trash2, Clock, ArrowRight } from 'lucide-react'
import useStore from '../store'

function Sidebar({ onAnalyze }) {
    const { sidebarOpen, toggleSidebar, projects, loadProject, deleteProject } = useStore()

    const handleLoad = (id) => {
        loadProject(id)
    }

    return (
        <>
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 fade" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={toggleSidebar}></div>
            )}

            <div className="fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-out" style={{
                width: '340px',
                backgroundColor: '#0c0c0f',
                borderRight: '1px solid #1a1a1f',
                transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
            }}>
                <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid #1a1a1f' }}>
                    <div className="flex items-center gap-2">
                        <Clock size={14} style={{ color: '#71717a' }} />
                        <span className="text-sm font-medium" style={{ color: '#e4e4e7' }}>Projects</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#1a1a1f', color: '#3f3f46' }}>{projects.length}</span>
                    </div>
                    <button onClick={toggleSidebar} className="p-1.5 rounded-lg transition-colors" style={{ color: '#71717a' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1a1a1f'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <PanelLeftClose size={16} />
                    </button>
                </div>

                <div className="p-3 overflow-y-auto" style={{ height: 'calc(100% - 65px)' }}>
                    {projects.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: '#131316', border: '1px solid #232329' }}>
                                <span style={{ color: '#3f3f46' }}>✦</span>
                            </div>
                            <p className="text-xs font-medium" style={{ color: '#3f3f46' }}>No projects yet</p>
                            <p className="text-[11px] mt-1 leading-relaxed" style={{ color: '#27272a' }}>Analyze a design goal and click Save to keep it here</p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {projects.map(p => (
                                <div key={p.id} className="group rounded-xl p-3.5 cursor-pointer transition-all"
                                    style={{ border: '1px solid transparent' }}
                                    onClick={() => handleLoad(p.id)}
                                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#131316'; e.currentTarget.style.borderColor = '#232329' }}
                                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}>
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-medium truncate" style={{ color: '#e4e4e7' }}>
                                                {p.brief?.projectTitle || 'Untitled'}
                                            </p>
                                            <p className="text-[10px] mt-0.5 truncate" style={{ color: '#3f3f46' }}>
                                                {p.prompt?.substring(0, 50)}...
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={(e) => { e.stopPropagation(); deleteProject(p.id) }}
                                                className="p-1 rounded transition-all" style={{ color: '#3f3f46' }}
                                                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                                onMouseLeave={e => e.currentTarget.style.color = '#3f3f46'}>
                                                <Trash2 size={12} />
                                            </button>
                                            <ArrowRight size={12} style={{ color: '#3f3f46' }} />
                                        </div>
                                    </div>

                                    {p.brief?.colorPalette && (
                                        <div className="flex gap-1 mt-2.5">
                                            {p.brief.colorPalette.map((c, i) => (
                                                <div key={i} className="h-1.5 rounded-full flex-1" style={{ backgroundColor: c.hex }}></div>
                                            ))}
                                        </div>
                                    )}

                                    <p className="text-[9px] mt-2" style={{ color: '#27272a' }}>
                                        {new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
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