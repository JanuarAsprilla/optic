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

export const dashboardsService = {
  list: () =>
    api.get<DashboardAPI[]>('/dashboards').then((r) => r.data),

  get: (id: string) =>
    api.get<DashboardAPI>(`/dashboards/${id}`).then((r) => r.data),

  create: (data: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<DashboardAPI>('/dashboards', data).then((r) => r.data),

  update: (id: string, patch: { title?: string; description?: string; widgets?: Widget[] }) =>
    api.patch<DashboardAPI>(`/dashboards/${id}`, patch).then((r) => r.data),

  remove: (id: string) =>
    api.delete(`/dashboards/${id}`).then((r) => r.data),
}
