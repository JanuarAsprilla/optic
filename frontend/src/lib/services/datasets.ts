import { api } from '@/lib/api'
import type { Dataset, Column } from '@/lib/types'

export interface DatasetAPI {
  id: string
  name: string
  description: string
  topic: string
  color: string
  icon: string
  columns: Column[]
  rowCount: number
  lastUpdated: string
  status: 'published' | 'draft'
  createdAt: string
}

export interface DatasetsPage {
  data: DatasetAPI[]
  total: number
  page: number
  limit: number
}

export interface RowsPage {
  data: Record<string, unknown>[]
  total: number
  page: number
  limit: number
}

interface Envelope<T> { success: boolean; data: T }

export const datasetsService = {
  list: (page = 1, limit = 20) =>
    api.get<Envelope<DatasetsPage>>('/datasets', { params: { page, limit } }).then((r) => r.data.data),

  get: (id: string) =>
    api.get<Envelope<DatasetAPI>>(`/datasets/${id}`).then((r) => r.data.data),

  rows: (id: string, page = 1, limit = 50) =>
    api.get<Envelope<RowsPage>>(`/datasets/${id}/rows`, { params: { page, limit } }).then((r) => r.data.data),

  upload: (file: File, meta: Partial<Dataset>) => {
    const form = new FormData()
    form.append('file', file)
    form.append('name', meta.name ?? file.name)
    if (meta.topic) form.append('topic', meta.topic)
    if (meta.description) form.append('description', meta.description)
    if (meta.color) form.append('color', meta.color)
    return api.post<Envelope<DatasetAPI>>('/datasets', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data.data)
  },

  update: (id: string, patch: Partial<Dataset>) =>
    api.patch<Envelope<DatasetAPI>>(`/datasets/${id}`, patch).then((r) => r.data.data),

  remove: (id: string) =>
    api.delete(`/datasets/${id}`).then((r) => r.data),
}
