import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Database, LayoutDashboard, Table2, Settings,
  Plus, Trash2, Eye, Save, TrendingUp,
  BarChart2, PieChart, LineChart, Hash, AlignLeft, Calendar,
  GripVertical, X, Check, Loader2,
} from 'lucide-react'
import { DATASETS, DASHBOARDS } from '@/lib/mockData'
import type { Widget, WidgetType } from '@/lib/types'

type Tab = 'schema' | 'dashboard' | 'settings'

const WIDGET_TYPES: { type: WidgetType; icon: React.ElementType; label: string; desc: string }[] = [
  { type: 'kpi',   icon: Hash,          label: 'KPI',         desc: 'Métrica con tendencia' },
  { type: 'bar',   icon: BarChart2,      label: 'Barras',      desc: 'Comparación por categoría' },
  { type: 'line',  icon: LineChart,      label: 'Línea',       desc: 'Tendencia en el tiempo' },
  { type: 'area',  icon: TrendingUp,     label: 'Área',        desc: 'Volumen a lo largo del tiempo' },
  { type: 'pie',   icon: PieChart,       label: 'Pastel',      desc: 'Distribución proporcional' },
  { type: 'table', icon: Table2,         label: 'Tabla',       desc: 'Datos tabulares con paginación' },
]

const TYPE_ICON: Record<string, React.ElementType> = {
  number: Hash, string: AlignLeft, date: Calendar, boolean: Check,
}

export default function DatasetDetail() {
  const { id } = useParams<{ id: string }>()
  const ds = DATASETS.find(d => d.id === id)
  const dash = DASHBOARDS.find(d => d.datasetId === id)

  const [tab, setTab] = useState<Tab>('schema')
  const [widgets, setWidgets] = useState<Widget[]>(dash?.widgets ?? [])
  const [showAddWidget, setShowAddWidget] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!ds) return (
    <div className="flex items-center justify-center h-full text-[var(--color-muted)] text-sm">
      Dataset no encontrado
    </div>
  )

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 900)
  }

  const addWidget = (type: WidgetType) => {
    const id = `w${Date.now()}`
    const newWidget: Widget = {
      id,
      title: { kpi: 'Nueva KPI', bar: 'Gráfica de Barras', line: 'Gráfica de Línea', area: 'Gráfica de Área', pie: 'Gráfica de Pastel', table: 'Tabla de Datos', text: 'Texto' }[type],
      type,
      colSpan: type === 'table' ? 3 : type === 'kpi' ? 1 : 2,
      config: type === 'kpi'
        ? { field: ds.columns[0]?.key ?? '', agg: 'sum', prefix: '', suffix: '' }
        : type === 'table'
        ? { columns: ds.columns.slice(0, 5).map(c => c.key), pageSize: 8 }
        : { xField: ds.columns.find(c => c.type === 'string')?.key ?? '', yField: ds.columns.find(c => c.type === 'number')?.key ?? '' },
    }
    setWidgets(prev => [...prev, newWidget])
    setShowAddWidget(false)
  }

  const removeWidget = (wid: string) => setWidgets(prev => prev.filter(w => w.id !== wid))

  return (
    <div className="p-6 lg:p-8 max-w-[1100px] mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link to="/admin/datasets" className="inline-flex items-center gap-1.5 text-[0.72rem] text-[var(--color-muted)] hover:text-[var(--color-text)] no-underline transition-colors mb-2">
            <ArrowLeft className="w-3 h-3" />Datasets
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${ds.color}15`, border: `1px solid ${ds.color}25` }}>
              <Database className="w-5 h-5" style={{ color: ds.color }} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--color-text)] leading-tight">{ds.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[0.65rem] px-1.5 py-0.5 rounded bg-white/[0.04] text-[var(--color-muted)]">{ds.topic}</span>
                <span className={`text-[0.6rem] font-bold uppercase px-2 py-0.5 rounded-full ${
                  ds.status === 'published'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {ds.status === 'published' ? 'Publicado' : 'Borrador'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {dash && (
            <Link to={`/dashboard/${dash.id}`}
              className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-[0.75rem] font-medium border border-[rgba(255,255,255,0.08)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-white/[0.04] no-underline transition-colors">
              <Eye className="w-3.5 h-3.5" />Vista previa
            </Link>
          )}
          <button onClick={handleSave}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-[0.75rem] font-semibold text-white transition-all hover:brightness-110"
            style={{ background: saved ? 'linear-gradient(135deg, #22D3A5, #10B981)' : 'linear-gradient(135deg, #6366F1, #7C3AED)', boxShadow: '0 2px 12px rgba(99,102,241,0.2)' }}>
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? 'Guardando…' : saved ? 'Guardado' : 'Guardar cambios'}
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Filas totales', value: ds.rowCount.toLocaleString('es-CO') },
          { label: 'Columnas', value: ds.columns.length },
          { label: 'Widgets activos', value: widgets.length },
        ].map(({ label, value }) => (
          <div key={label} className="glass rounded-xl px-4 py-3 flex items-center gap-3">
            <div>
              <p className="text-lg font-bold text-[var(--color-text)] font-mono leading-none">{value}</p>
              <p className="text-[0.65rem] text-[var(--color-muted)] mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[rgba(255,255,255,0.06)]">
        {([
          { key: 'schema',    icon: Table2,         label: 'Esquema' },
          { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { key: 'settings',  icon: Settings,        label: 'Configuración' },
        ] as const).map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-[0.78rem] font-medium border-b-2 transition-colors -mb-px ${
              tab === key
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* TAB: Schema */}
        {tab === 'schema' && (
          <motion.div key="schema" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="glass rounded-xl overflow-hidden">
              <table className="w-full text-[0.75rem]">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.06)]">
                    {['Campo', 'Etiqueta', 'Tipo', 'Uso en widgets'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[var(--color-muted)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ds.columns.map((col, i) => {
                    const TypeIcon = TYPE_ICON[col.type] ?? AlignLeft
                    const usedIn = widgets.filter(w => {
                      const cfg = w.config as any
                      return cfg.field === col.key || cfg.xField === col.key || cfg.yField === col.key || (cfg.columns ?? []).includes(col.key)
                    })
                    return (
                      <motion.tr
                        key={col.key}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-3 font-mono text-[0.72rem] text-[var(--color-text)]">{col.key}</td>
                        <td className="px-4 py-3 text-[var(--color-text)]">{col.label}</td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1.5 text-[var(--color-muted)]">
                            <TypeIcon className="w-3 h-3" />
                            <span className={`text-[0.65rem] font-bold uppercase px-2 py-0.5 rounded-full ${
                              col.type === 'number' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                              col.type === 'date' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              col.type === 'boolean' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              'bg-[rgba(255,255,255,0.05)] text-[var(--color-muted)] border border-[rgba(255,255,255,0.08)]'
                            }`}>
                              {col.type}
                            </span>
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {usedIn.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {usedIn.map(w => (
                                <span key={w.id} className="text-[0.6rem] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
                                  {w.title}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[0.65rem] text-[var(--color-muted)] opacity-50">—</span>
                          )}
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB: Dashboard */}
        {tab === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">

            {/* Widget list */}
            <div className="space-y-2">
              {widgets.length === 0 && (
                <div className="glass rounded-xl py-16 flex flex-col items-center gap-3 text-[var(--color-muted)]">
                  <LayoutDashboard className="w-7 h-7 opacity-30" />
                  <p className="text-[0.8rem]">No hay widgets configurados</p>
                </div>
              )}
              {widgets.map((w, i) => {
                const WIcon = WIDGET_TYPES.find(t => t.type === w.type)?.icon ?? BarChart2
                return (
                  <motion.div
                    key={w.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="glass rounded-xl p-4 flex items-center gap-3 group"
                  >
                    <GripVertical className="w-4 h-4 text-[var(--color-muted)] opacity-30 cursor-grab shrink-0" />
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${ds.color}12`, border: `1px solid ${ds.color}20` }}>
                      <WIcon className="w-4 h-4" style={{ color: ds.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.82rem] font-semibold text-[var(--color-text)]">{w.title}</p>
                      <p className="text-[0.65rem] text-[var(--color-muted)]">
                        {WIDGET_TYPES.find(t => t.type === w.type)?.label} · {w.colSpan === 1 ? '¼' : w.colSpan === 2 ? '½' : w.colSpan === 3 ? '¾' : 'completo'} de ancho
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {([1, 2, 3, 4] as const).map(n => (
                        <button
                          key={n}
                          title={`${n}/4 columnas`}
                          className={`text-[0.6rem] w-6 h-6 rounded font-bold transition-colors ${
                            w.colSpan === n
                              ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                              : 'text-[var(--color-muted)] hover:bg-white/[0.06]'
                          }`}
                          onClick={() => setWidgets(prev => prev.map(x => x.id === w.id ? { ...x, colSpan: n } : x))}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => removeWidget(w.id)}
                      className="w-7 h-7 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-[var(--color-muted)] hover:text-red-400 flex items-center justify-center transition-all shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )
              })}
            </div>

            {/* Add widget */}
            <button
              onClick={() => setShowAddWidget(true)}
              className="w-full glass rounded-xl p-4 flex items-center justify-center gap-2 text-[0.78rem] font-medium text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-[rgba(255,255,255,0.12)] hover:bg-white/[0.02] transition-all border-dashed">
              <Plus className="w-4 h-4" />Agregar widget
            </button>
          </motion.div>
        )}

        {/* TAB: Settings */}
        {tab === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="glass rounded-2xl p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.72rem] font-semibold text-[var(--color-muted)] uppercase tracking-[0.1em] mb-2">Nombre</label>
                  <input defaultValue={ds.name}
                    className="w-full px-3 h-9 rounded-lg bg-white/[0.04] border border-[rgba(255,255,255,0.08)] text-[0.82rem] text-[var(--color-text)] outline-none focus:border-indigo-500/40 transition-colors" />
                </div>
                <div>
                  <label className="block text-[0.72rem] font-semibold text-[var(--color-muted)] uppercase tracking-[0.1em] mb-2">Temática</label>
                  <input defaultValue={ds.topic}
                    className="w-full px-3 h-9 rounded-lg bg-white/[0.04] border border-[rgba(255,255,255,0.08)] text-[0.82rem] text-[var(--color-text)] outline-none focus:border-indigo-500/40 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[0.72rem] font-semibold text-[var(--color-muted)] uppercase tracking-[0.1em] mb-2">Descripción</label>
                <textarea defaultValue={ds.description} rows={3}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-[rgba(255,255,255,0.08)] text-[0.82rem] text-[var(--color-text)] outline-none focus:border-indigo-500/40 transition-colors resize-none" />
              </div>
              <div>
                <label className="block text-[0.72rem] font-semibold text-[var(--color-muted)] uppercase tracking-[0.1em] mb-2">Estado</label>
                <div className="flex gap-2">
                  {(['published', 'draft'] as const).map(s => (
                    <button key={s} className={`px-4 h-8 rounded-lg text-[0.72rem] font-medium transition-colors border ${
                      ds.status === s
                        ? s === 'published'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                        : 'border-[rgba(255,255,255,0.08)] text-[var(--color-muted)] hover:bg-white/[0.04]'
                    }`}>
                      {s === 'published' ? 'Publicado' : 'Borrador'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                <div>
                  <p className="text-[0.75rem] font-semibold text-red-400">Zona de peligro</p>
                  <p className="text-[0.65rem] text-[var(--color-muted)] mt-0.5">Esta acción no se puede deshacer</p>
                </div>
                <button className="flex items-center gap-1.5 h-8 px-4 rounded-lg text-[0.72rem] font-medium bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/15 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />Eliminar dataset
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Add widget modal */}
      <AnimatePresence>
        {showAddWidget && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddWidget(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 8 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-[rgba(255,255,255,0.08)] overflow-hidden"
              style={{ background: '#0D0E1B' }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.06)]">
                <h2 className="text-[0.88rem] font-bold text-[var(--color-text)]">Agregar widget</h2>
                <button onClick={() => setShowAddWidget(false)}
                  className="w-7 h-7 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-4 grid grid-cols-2 gap-2">
                {WIDGET_TYPES.map(({ type, icon: Icon, label, desc }) => (
                  <button
                    key={type}
                    onClick={() => addWidget(type)}
                    className="p-4 rounded-xl text-left border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.15)] hover:bg-white/[0.04] transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                      style={{ background: `${ds.color}12`, border: `1px solid ${ds.color}20` }}>
                      <Icon className="w-4 h-4" style={{ color: ds.color }} />
                    </div>
                    <p className="text-[0.8rem] font-semibold text-[var(--color-text)]">{label}</p>
                    <p className="text-[0.65rem] text-[var(--color-muted)] mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
