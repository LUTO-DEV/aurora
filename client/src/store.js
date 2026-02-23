import { create } from 'zustand'

// Zustand store - manages all app state + saves projects to localStorage
const useStore = create((set, get) => ({
    // Current session
    brief: null,
    visual: null,
    loading: false,
    visualLoading: false,
    error: null,
    step: 0,
    sidebarOpen: false,

    // Saved projects from localStorage
    projects: JSON.parse(localStorage.getItem('aurora_projects') || '[]'),

    // Actions
    setBrief: (brief) => set({ brief }),
    setVisual: (visual) => set({ visual }),
    setLoading: (loading) => set({ loading }),
    setVisualLoading: (visualLoading) => set({ visualLoading }),
    setError: (error) => set({ error }),
    setStep: (step) => set({ step }),
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

    reset: () => set({
        brief: null, visual: null, error: null,
        loading: false, visualLoading: false, step: 0
    }),

    // Save current brief as a project
    saveProject: (prompt) => {
        const { brief, visual, projects } = get()
        if (!brief) return

        const project = {
            id: Date.now().toString(),
            prompt,
            brief,
            visual,
            createdAt: new Date().toISOString()
        }

        const updated = [project, ...projects].slice(0, 20) // Keep max 20
        localStorage.setItem('aurora_projects', JSON.stringify(updated))
        set({ projects: updated })
        return project.id
    },

    // Load a saved project
    loadProject: (id) => {
        const { projects } = get()
        const project = projects.find(p => p.id === id)
        if (project) {
            set({
                brief: project.brief,
                visual: project.visual,
                step: project.visual ? 3 : 2,
                sidebarOpen: false
            })
        }
    },

    // Delete a saved project
    deleteProject: (id) => {
        const { projects } = get()
        const updated = projects.filter(p => p.id !== id)
        localStorage.setItem('aurora_projects', JSON.stringify(updated))
        set({ projects: updated })
    }
}))

export default useStore