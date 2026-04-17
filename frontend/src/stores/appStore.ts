import { create } from 'zustand'
import type { User } from '@/lib/types'

interface AppState {
  user: User | null
  sidebarOpen: boolean
  setUser: (u: User | null) => void
  toggleSidebar: () => void
  setSidebarOpen: (v: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: {
    id: 'u1',
    name: 'Administrador',
    email: 'admin@optic.io',
    role: 'admin',
  },
  sidebarOpen: true,
  setUser: (user) => set({ user }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}))
