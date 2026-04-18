import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/lib/types'
import { authService, type LoginPayload, type RegisterPayload } from '@/lib/services/auth'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  login: (data: LoginPayload) => Promise<void>
  register: (data: RegisterPayload) => Promise<void>
  logout: () => void
  clearError: () => void
  hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (data) => {
        set({ loading: true, error: null })
        try {
          const res = await authService.login(data)
          localStorage.setItem('optic_token', res.token)
          set({ user: res.user, token: res.token, loading: false })
        } catch (err: unknown) {
          const msg = (err as { response?: { data?: { error?: string } } })
            ?.response?.data?.error ?? 'Error al iniciar sesión'
          set({ loading: false, error: msg })
          throw err
        }
      },

      register: async (data) => {
        set({ loading: true, error: null })
        try {
          const res = await authService.register(data)
          localStorage.setItem('optic_token', res.token)
          set({ user: res.user, token: res.token, loading: false })
        } catch (err: unknown) {
          const msg = (err as { response?: { data?: { error?: string } } })
            ?.response?.data?.error ?? 'Error al registrarse'
          set({ loading: false, error: msg })
          throw err
        }
      },

      logout: () => {
        localStorage.removeItem('optic_token')
        set({ user: null, token: null })
      },

      clearError: () => set({ error: null }),

      hydrate: async () => {
        const { token } = get()
        if (!token) return
        try {
          const user = await authService.me()
          set({ user })
        } catch {
          localStorage.removeItem('optic_token')
          set({ user: null, token: null })
        }
      },
    }),
    {
      name: 'optic_auth',
      partialize: (s) => ({ token: s.token, user: s.user }),
    },
  ),
)
