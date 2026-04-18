import { api } from '@/lib/api'
import type { User, Role } from '@/lib/types'

export const usersService = {
  list: () =>
    api.get<User[]>('/users').then((r) => r.data),

  setRole: (id: string, role: Role) =>
    api.patch<User>(`/users/${id}/role`, { role }).then((r) => r.data),

  remove: (id: string) =>
    api.delete(`/users/${id}`).then((r) => r.data),
}
