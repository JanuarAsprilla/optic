import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Settings, Download, RefreshCw, Filter } from 'lucide-react'
import { DASHBOARDS, DATASETS, MONTHLY_REVENUE, REGION_SALES, PRODUCT_MIX, SALES_ROWS } from '@/lib/mockData'
import KPIWidget from '@/components/widgets/KPIWidget'
import ChartWidget from '@/components/widgets/ChartWidget'
import TableWidget from '@/components/widgets/TableWidget'

const SPAN_MAP: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
}

// Mock KPI values
const KPI_VALUES: Record<string, { value: number; trend: number }> = {
  w1: { value: 863000, trend: 12.4 },
  w2: { value: 12480,  trend: 8.1  },
  w3: { value: 1840,   trend: 5.6  },
  w4: { value: 46900,  trend: -2.3 },
}

export default function DashboardView() {
  const { id } = useParams<{ id: string }>()
  const dash = DASHBOARDS.find(d => d.id === id)
  const ds   = dash ? DATASETS.find(d => d.id === dash.datasetId) : null

  if (!dash) return (
    <div className="flex items-center justify-center h-full text-[var(--color-muted)] text-sm">
      Dashboard no encontrado
    </div>
  )

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link to="/" className="inline-flex items-center gap-1.5 text-[0.72rem] text-[var(--color-muted)] hover:text-[var(--color-text)] no-underline transition-colors mb-2">
            <ArrowLeft className="w-3 h-3" />Volver
          </Link>
          <h1 className="text-lg font-bold text-[var(--color-text)]">{dash.title}</h1>
          <p className="text-sm text-[var(--color-muted)]">{dash.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.75rem] font-medium border border-[rgba(255,255,255,0.08)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-white/[0.04] transition-colors">
            <Filter className="w-3.5 h-3.5" />Filtrar
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.75rem] font-medium border border-[rgba(255,255,255,0.08)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-white/[0.04] transition-colors">
            <Download className="w-3.5 h-3.5" />Exportar
          </button>
          <Link
            to={`/admin/datasets/${dash.datasetId}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.75rem] font-medium bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 hover:bg-indigo-500/20 transition-colors no-underline"
          >
            <Settings className="w-3.5 h-3.5" />Configurar
          </Link>
        </div>
      </motion.div>

      {/* Widget grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dash.widgets.map((widget, i) => (
          <div key={widget.id} className={SPAN_MAP[widget.colSpan] ?? 'col-span-1'}>

            {widget.type === 'kpi' && (
              <KPIWidget
                title={widget.title}
                value={KPI_VALUES[widget.id]?.value ?? 0}
                trend={KPI_VALUES[widget.id]?.trend}
                prefix={(widget.config as any).prefix}
                suffix={(widget.config as any).suffix}
                color={ds?.color}
                index={i}
              />
            )}

            {(widget.type === 'bar' || widget.type === 'line' || widget.type === 'area') && (
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="glass rounded-xl p-5"
              >
                <h3 className="text-[0.75rem] font-semibold text-[var(--color-muted)] mb-4">{widget.title}</h3>
                <ChartWidget
                  type={widget.id === 'w5' ? 'line' : 'bar'}
                  data={widget.id === 'w5' ? MONTHLY_REVENUE : REGION_SALES}
                  xKey={widget.id === 'w5' ? 'mes' : 'region'}
                  yKeys={widget.id === 'w5' ? ['ingresos', 'costo'] : ['ventas']}
                  height={220}
                  index={i}
                />
              </motion.div>
            )}

            {widget.type === 'pie' && (
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="glass rounded-xl p-5"
              >
                <h3 className="text-[0.75rem] font-semibold text-[var(--color-muted)] mb-4">{widget.title}</h3>
                <ChartWidget
                  type="pie"
                  data={PRODUCT_MIX}
                  xKey="name"
                  yKeys={['value']}
                  height={220}
                  index={i}
                />
              </motion.div>
            )}

            {widget.type === 'table' && (
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="glass rounded-xl p-5"
              >
                <h3 className="text-[0.75rem] font-semibold text-[var(--color-muted)] mb-4">{widget.title}</h3>
                <TableWidget
                  columns={(widget.config as any).columns ?? []}
                  rows={SALES_ROWS}
                  pageSize={(widget.config as any).pageSize}
                />
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Footer timestamp */}
      <div className="flex items-center gap-2 text-[0.65rem] text-[var(--color-muted)]">
        <RefreshCw className="w-3 h-3" />
        Última actualización: {new Date().toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
        {ds && (
          <span className="ml-2 px-2 py-0.5 rounded-full text-[0.6rem] font-medium border"
            style={{ color: ds.color, borderColor: `${ds.color}30`, background: `${ds.color}10` }}>
            {ds.name}
          </span>
        )}
      </div>
    </div>
  )
}
