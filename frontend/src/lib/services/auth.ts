import { api } from '@/lib/api'
import type { User } from '@/lib/types'

export interface LoginPayload { email: string; password: string }
export interface RegisterPayload { name: string; email: string; password: string }
export interface AuthResponse { token: string; user: User }

interface Envelope<T> { success: boolean; data: T }

export const authService = {
  login: (data: LoginPayload) =>
    api.post<Envelope<AuthResponse>>('/auth/login', data).then((r) => r.data.data),

  register: (data: RegisterPayload) =>
    api.post<Envelope<AuthResponse>>('/auth/register', data).then((r) => r.data.data),

  me: () =>
    api.get<Envelope<User>>('/auth/me').then((r) => r.data.data),
}
