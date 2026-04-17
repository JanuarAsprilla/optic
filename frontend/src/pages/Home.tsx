import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Database, ArrowRight, TrendingUp,
  Users, Leaf, DollarSign, Clock, Eye, BarChart2,
} from 'lucide-react'
import { DATASETS, DASHBOARDS } from '@/lib/mockData'
import { fmtDate } from '@/lib/utils'

const ICON_MAP: Record<string, any> = {
  TrendingUp, Users, Leaf, DollarSign, BarChart2,
}

const STATUS_CHIP = {
  published: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  draft:     'bg-amber-500/10 text-amber-400 border border-amber-500/20',
}

export default function Home() {
  return (
    <div className="p-6 lg:p-8 space-y-10 max-w-[1400px] mx-auto">

      {/* Hero strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0D0E1B 0%, #111226 60%, #0D0E1B 100%)', border: '1px solid rgba(99,102,241,0.15)' }}
      >
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #818CF8 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)' }} />

        <div className="relative px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="flex-1">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-indigo-400/70 mb-2">
              Plataforma activa · Optic Dashboard
            </p>
            <h2 className="text-xl font-bold text-white mb-1.5">
              Bienvenido a tu centro de datos
            </h2>
            <p className="text-sm text-white/45 max-w-md">
              Carga bases de datos de cualquier temática, configura visualizaciones y comparte dashboards interactivos.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <div className="text-center">
              <p className="text-2xl font-bold text-white font-mono">{DATASETS.length}</p>
              <p className="text-[0.65rem] text-white/40 uppercase tracking-wider">Datasets</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white font-mono">{DASHBOARDS.length}</p>
              <p className="text-[0.65rem] text-white/40 uppercase tracking-wider">Dashboards</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white font-mono">
                {DATASETS.reduce((s, d) => s + d.rowCount, 0).toLocaleString('es-CO')}
              </p>
              <p className="text-[0.65rem] text-white/40 uppercase tracking-wider">Registros</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dashboards section */}
      {DASHBOARDS.length > 0 && (
        <section>
          <SectionHeader icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboards publicados" to="/explorar" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {DASHBOARDS.map((dash, i) => {
              const ds = DATASETS.find(d => d.id === dash.datasetId)
              return (
                <motion.div
                  key={dash.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={`/dashboard/${dash.id}`}
                    className="group glass rounded-xl p-5 flex flex-col gap-4 no-underline hover:border-[rgba(99,102,241,0.3)] transition-all duration-200 hover:-translate-y-0.5 block"
                  >
                    {/* Icon + title */}
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${ds?.color ?? '#6366F1'}18`, border: `1px solid ${ds?.color ?? '#6366F1'}25` }}>
                        <BarChart2 className="w-5 h-5" style={{ color: ds?.color ?? '#6366F1' }} />
                      </div>
                      <Eye className="w-4 h-4 text-[var(--color-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--color-text)] mb-1">{dash.title}</h3>
                      <p className="text-[0.72rem] text-[var(--color-muted)] line-clamp-2">{dash.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-[rgba(255,255,255,0.05)]">
                      <span className="text-[0.65rem] text-[var(--color-muted)] flex items-center gap-1">
                        <Clock className="w-3 h-3" />{fmtDate(dash.updatedAt)}
                      </span>
                      <span className="text-[0.65rem] font-semibold text-indigo-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Abrir <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </section>
      )}

      {/* Datasets section */}
      <section>
        <SectionHeader icon={<Database className="w-4 h-4" />} label="Datasets disponibles" to="/admin/datasets" actionLabel="Gestionar" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
          {DATASETS.map((ds, i) => {
            const Icon = ICON_MAP[ds.icon] ?? BarChart2
            return (
              <motion.div
                key={ds.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={`/admin/datasets/${ds.id}`}
                  className="group glass rounded-xl p-4 flex flex-col gap-3 no-underline hover:border-[rgba(255,255,255,0.12)] transition-all duration-200 block"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${ds.color}15`, border: `1px solid ${ds.color}25` }}>
                      <Icon className="w-4 h-4" style={{ color: ds.color }} />
                    </div>
                    <span className={`text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${STATUS_CHIP[ds.status]}`}>
                      {ds.status === 'published' ? 'Publicado' : 'Borrador'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-[0.82rem] font-bold text-[var(--color-text)] mb-0.5">{ds.name}</h4>
                    <p className="text-[0.7rem] text-[var(--color-muted)] line-clamp-2">{ds.description}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-[rgba(255,255,255,0.05)]">
                    <span className="text-[0.65rem] text-[var(--color-muted)] font-mono">
                      {ds.rowCount.toLocaleString('es-CO')} filas
                    </span>
                    <span className="text-[0.65rem] px-1.5 py-0.5 rounded bg-white/[0.04] text-[var(--color-muted)]">
                      {ds.topic}
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function SectionHeader({ icon, label, to, actionLabel = 'Ver todos' }: {
  icon: React.ReactNode; label: string; to: string; actionLabel?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-[var(--color-text)]">
        <span className="text-[var(--color-muted)]">{icon}</span>
        <h2 className="text-sm font-semibold">{label}</h2>
      </div>
      <Link
        to={to}
        className="text-[0.72rem] font-semibold text-[var(--color-muted)] hover:text-indigo-400 no-underline transition-colors flex items-center gap-1"
      >
        {actionLabel} <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  )
}
