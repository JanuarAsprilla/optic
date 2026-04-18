import { api } from '@/lib/api'
import type { Dashboard, Widget } from '@/lib/types'

export interface DashboardAPI {
  id: string
  title: string
  description: string
  datasetId: string
  widgets: Widget[]
  filters?: unknown
  createdAt: string
  updatedAt: string
}

interface Envelope<T> { success: boolean; data: T }

export const dashboardsService = {
  list: () =>
    api.get<Envelope<DashboardAPI[]>>('/dashboards').then((r) => r.data.data),

  get: (id: string) =>
    api.get<Envelope<DashboardAPI>>(`/dashboards/${id}`).then((r) => r.data.data),

  create: (data: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Envelope<DashboardAPI>>('/dashboards', data).then((r) => r.data.data),

  update: (id: string, patch: { title?: string; description?: string; widgets?: Widget[] }) =>
    api.patch<Envelope<DashboardAPI>>(`/dashboards/${id}`, patch).then((r) => r.data.data),

  remove: (id: string) =>
    api.delete(`/dashboards/${id}`).then((r) => r.data),
}
