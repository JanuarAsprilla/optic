import { api } from '@/lib/api'
import type { User, Role } from '@/lib/types'

interface Envelope<T> { success: boolean; data: T }

export const usersService = {
  list: () =>
    api.get<Envelope<User[]>>('/users').then((r) => r.data.data),

  setRole: (id: string, role: Role) =>
    api.patch<Envelope<User>>(`/users/${id}/role`, { role }).then((r) => r.data.data),

  remove: (id: string) =>
    api.delete(`/users/${id}`).then((r) => r.data),
}
