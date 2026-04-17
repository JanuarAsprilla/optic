// ── Dataset ───────────────────────────────────────────────────────────────────
export type ColumnType = 'string' | 'number' | 'date' | 'boolean'

export interface Column {
  key: string
  label: string
  type: ColumnType
}

export interface Dataset {
  id: string
  name: string
  description: string
  topic: string          // e.g. "Ventas", "RRHH", "Ambiental"
  color: string          // accent color for this dataset
  icon: string           // lucide icon name
  columns: Column[]
  rowCount: number
  lastUpdated: string
  status: 'published' | 'draft'
  createdAt: string
}

// ── Widget ────────────────────────────────────────────────────────────────────
export type WidgetType = 'kpi' | 'bar' | 'line' | 'pie' | 'area' | 'table' | 'text'

export type AggFn = 'sum' | 'avg' | 'count' | 'min' | 'max'

export interface KPIConfig {
  field: string
  agg: AggFn
  prefix?: string
  suffix?: string
  compareField?: string
  trendField?: string    // date field for sparkline
}

export interface ChartConfig {
  xField: string
  yField: string
  yAgg?: AggFn
  groupField?: string
  color?: string
  stack?: boolean
}

export interface TableConfig {
  columns: string[]
  pageSize?: number
  sortField?: string
  sortDir?: 'asc' | 'desc'
}

export interface TextConfig {
  content: string
}

export type WidgetConfig = KPIConfig | ChartConfig | TableConfig | TextConfig

export interface Widget {
  id: string
  title: string
  type: WidgetType
  config: WidgetConfig
  colSpan: 1 | 2 | 3 | 4   // out of 4-column grid
  rowSpan?: 1 | 2
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export interface Dashboard {
  id: string
  datasetId: string
  title: string
  description: string
  widgets: Widget[]
  filters?: FilterDef[]
  createdAt: string
  updatedAt: string
}

export interface FilterDef {
  field: string
  label: string
  type: 'select' | 'range' | 'date'
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export type Role = 'admin' | 'viewer'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
}
