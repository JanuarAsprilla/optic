import type { Dataset, Dashboard, Widget } from './types'

// ── Sample datasets ───────────────────────────────────────────────────────────
export const DATASETS: Dataset[] = [
  {
    id: 'ds-ventas',
    name: 'Ventas 2024',
    description: 'Registro de ventas por región, producto y representante comercial.',
    topic: 'Comercial',
    color: '#6366F1',
    icon: 'TrendingUp',
    rowCount: 12480,
    lastUpdated: '2024-04-15',
    status: 'published',
    createdAt: '2024-01-10',
    columns: [
      { key: 'fecha', label: 'Fecha', type: 'date' },
      { key: 'region', label: 'Región', type: 'string' },
      { key: 'producto', label: 'Producto', type: 'string' },
      { key: 'representante', label: 'Representante', type: 'string' },
      { key: 'unidades', label: 'Unidades', type: 'number' },
      { key: 'ingresos', label: 'Ingresos ($)', type: 'number' },
      { key: 'costo', label: 'Costo ($)', type: 'number' },
    ],
  },
  {
    id: 'ds-rrhh',
    name: 'Recursos Humanos',
    description: 'Datos del personal activo: nómina, departamentos, evaluaciones.',
    topic: 'RRHH',
    color: '#22D3A5',
    icon: 'Users',
    rowCount: 340,
    lastUpdated: '2024-04-10',
    status: 'published',
    createdAt: '2024-02-01',
    columns: [
      { key: 'nombre', label: 'Nombre', type: 'string' },
      { key: 'departamento', label: 'Departamento', type: 'string' },
      { key: 'cargo', label: 'Cargo', type: 'string' },
      { key: 'salario', label: 'Salario', type: 'number' },
      { key: 'ingreso', label: 'Fecha Ingreso', type: 'date' },
      { key: 'desempeno', label: 'Desempeño', type: 'number' },
    ],
  },
  {
    id: 'ds-ambiental',
    name: 'Monitoreo Ambiental',
    description: 'Variables ambientales: temperatura, precipitación, calidad del aire.',
    topic: 'Ambiental',
    color: '#F59E0B',
    icon: 'Leaf',
    rowCount: 87600,
    lastUpdated: '2024-04-16',
    status: 'published',
    createdAt: '2023-06-15',
    columns: [
      { key: 'timestamp', label: 'Timestamp', type: 'date' },
      { key: 'estacion', label: 'Estación', type: 'string' },
      { key: 'temperatura', label: 'Temperatura (°C)', type: 'number' },
      { key: 'humedad', label: 'Humedad (%)', type: 'number' },
      { key: 'pm25', label: 'PM2.5', type: 'number' },
      { key: 'precipitacion', label: 'Precipitación (mm)', type: 'number' },
    ],
  },
  {
    id: 'ds-finanzas',
    name: 'Finanzas Q1 2024',
    description: 'Balance general, ingresos y gastos del primer trimestre.',
    topic: 'Finanzas',
    color: '#A78BFA',
    icon: 'DollarSign',
    rowCount: 2400,
    lastUpdated: '2024-03-31',
    status: 'draft',
    createdAt: '2024-03-01',
    columns: [
      { key: 'fecha', label: 'Fecha', type: 'date' },
      { key: 'categoria', label: 'Categoría', type: 'string' },
      { key: 'concepto', label: 'Concepto', type: 'string' },
      { key: 'monto', label: 'Monto', type: 'number' },
      { key: 'tipo', label: 'Tipo', type: 'string' },
    ],
  },
]

// ── Chart data helpers ────────────────────────────────────────────────────────
export const MONTHLY_REVENUE = [
  { mes: 'Ene', ingresos: 48000, costo: 31000 },
  { mes: 'Feb', ingresos: 52000, costo: 34000 },
  { mes: 'Mar', ingresos: 61000, costo: 38000 },
  { mes: 'Abr', ingresos: 55000, costo: 35000 },
  { mes: 'May', ingresos: 67000, costo: 41000 },
  { mes: 'Jun', ingresos: 73000, costo: 44000 },
  { mes: 'Jul', ingresos: 69000, costo: 43000 },
  { mes: 'Ago', ingresos: 78000, costo: 47000 },
  { mes: 'Sep', ingresos: 84000, costo: 51000 },
  { mes: 'Oct', ingresos: 91000, costo: 54000 },
  { mes: 'Nov', ingresos: 88000, costo: 53000 },
  { mes: 'Dic', ingresos: 97000, costo: 58000 },
]

export const REGION_SALES = [
  { region: 'Bogotá', ventas: 312000 },
  { region: 'Medellín', ventas: 245000 },
  { region: 'Cali', ventas: 187000 },
  { region: 'Barranquilla', ventas: 143000 },
  { region: 'Cartagena', ventas: 98000 },
  { region: 'Bucaramanga', ventas: 76000 },
]

export const PRODUCT_MIX = [
  { name: 'Producto A', value: 35 },
  { name: 'Producto B', value: 28 },
  { name: 'Producto C', value: 18 },
  { name: 'Producto D', value: 12 },
  { name: 'Otros', value: 7 },
]

export const TEMP_SERIES = Array.from({ length: 30 }, (_, i) => ({
  dia: `${i + 1}`,
  temperatura: 18 + Math.sin(i * 0.3) * 6 + Math.random() * 3,
  humedad: 65 + Math.cos(i * 0.2) * 15 + Math.random() * 5,
}))

export const DEPT_HEADCOUNT = [
  { departamento: 'Tecnología', personas: 78 },
  { departamento: 'Ventas', personas: 64 },
  { departamento: 'Operaciones', personas: 52 },
  { departamento: 'Marketing', personas: 34 },
  { departamento: 'Finanzas', personas: 28 },
  { departamento: 'RRHH', personas: 18 },
  { departamento: 'Legal', personas: 12 },
]

// Table preview rows
export const SALES_ROWS = [
  { fecha: '2024-04-15', region: 'Bogotá', producto: 'Producto A', representante: 'Ana García', unidades: 24, ingresos: 12480, costo: 7800 },
  { fecha: '2024-04-15', region: 'Medellín', producto: 'Producto B', representante: 'Carlos López', unidades: 18, ingresos: 9360, costo: 5940 },
  { fecha: '2024-04-14', region: 'Cali', producto: 'Producto A', representante: 'María Torres', unidades: 31, ingresos: 16120, costo: 9920 },
  { fecha: '2024-04-14', region: 'Barranquilla', producto: 'Producto C', representante: 'Jorge Ruiz', unidades: 12, ingresos: 6240, costo: 3840 },
  { fecha: '2024-04-13', region: 'Bogotá', producto: 'Producto B', representante: 'Ana García', unidades: 27, ingresos: 14040, costo: 8640 },
  { fecha: '2024-04-13', region: 'Cartagena', producto: 'Producto D', representante: 'Paula Mora', unidades: 9, ingresos: 4680, costo: 2880 },
  { fecha: '2024-04-12', region: 'Medellín', producto: 'Producto A', representante: 'Carlos López', unidades: 33, ingresos: 17160, costo: 10560 },
  { fecha: '2024-04-12', region: 'Cali', producto: 'Producto C', representante: 'María Torres', unidades: 15, ingresos: 7800, costo: 4800 },
]

// ── Dashboard configs ─────────────────────────────────────────────────────────
export const DASHBOARDS: Dashboard[] = [
  {
    id: 'dash-ventas',
    datasetId: 'ds-ventas',
    title: 'Dashboard Comercial',
    description: 'Visión ejecutiva de ventas e ingresos 2024.',
    createdAt: '2024-01-15',
    updatedAt: '2024-04-15',
    widgets: [
      { id: 'w1', title: 'Ingresos Totales', type: 'kpi', colSpan: 1, config: { field: 'ingresos', agg: 'sum', prefix: '$', suffix: '' } },
      { id: 'w2', title: 'Unidades Vendidas', type: 'kpi', colSpan: 1, config: { field: 'unidades', agg: 'sum', prefix: '', suffix: '' } },
      { id: 'w3', title: 'Nro. Transacciones', type: 'kpi', colSpan: 1, config: { field: 'fecha', agg: 'count', prefix: '', suffix: '' } },
      { id: 'w4', title: 'Margen Promedio', type: 'kpi', colSpan: 1, config: { field: 'ingresos', agg: 'avg', prefix: '$', suffix: '' } },
      { id: 'w5', title: 'Ingresos vs Costos Mensual', type: 'line', colSpan: 2, config: { xField: 'mes', yField: 'ingresos', groupField: 'costo' } },
      { id: 'w6', title: 'Ventas por Región', type: 'bar', colSpan: 2, config: { xField: 'region', yField: 'ventas' } },
      { id: 'w7', title: 'Mix de Productos', type: 'pie', colSpan: 1, config: { xField: 'name', yField: 'value' } },
      { id: 'w8', title: 'Últimas Transacciones', type: 'table', colSpan: 3, config: { columns: ['fecha', 'region', 'producto', 'representante', 'unidades', 'ingresos'], pageSize: 8 } },
    ] as Widget[],
  },
]
