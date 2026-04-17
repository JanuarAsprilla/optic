import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Database, LayoutDashboard, Users, FileUp, TrendingUp, ArrowRight, Activity } from 'lucide-react'
import { DATASETS, DASHBOARDS } from '@/lib/mockData'

const QUICK_ACTIONS = [
  { icon: FileUp,          label: 'Cargar dataset', sub: 'CSV / Excel',         to: '/admin/datasets/new',  color: '#6366F1' },
  { icon: LayoutDashboard, label: 'Nuevo dashboard', sub: 'Configurar widgets',  to: '/admin/datasets',      color: '#22D3A5' },
  { icon: Users,           label: 'Gestionar usuarios', sub: 'Roles y accesos',  to: '/admin/users',         color: '#F59E0B' },
]

const RECENT_ACTIVITY = [
  { label: 'Dataset "Ventas 2024" actualizado',       time: 'Hace 2h',  type: 'update' },
  { label: 'Dashboard "Comercial" publicado',          time: 'Hace 5h',  type: 'publish' },
  { label: 'Nuevo dataset "Finanzas Q1" creado',       time: 'Ayer',     type: 'create' },
  { label: '12,480 registros importados correctamente',time: 'Ayer',     type: 'import' },
  { label: 'Usuario "María Torres" agregada',          time: 'Hace 3d',  type: 'user' },
]

const TYPE_COLOR: Record<string, string> = {
  update: '#6366F1', publish: '#22D3A5', create: '#F59E0B',
  import: '#22D3EE', user: '#A78BFA',
}

export default function AdminHome() {
  const totalRows = DATASETS.reduce((s, d) => s + d.rowCount, 0)

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-[1200px] mx-auto">

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Database,         label: 'Total datasets',  value: DATASETS.length,                 color: '#6366F1' },
          { icon: LayoutDashboard,  label: 'Dashboards',      value: DASHBOARDS.length,               color: '#22D3A5' },
          { icon: TrendingUp,       label: 'Registros totales',value: totalRows.toLocaleString('es-CO'),color: '#F59E0B' },
          { icon: Users,            label: 'Usuarios activos', value: 8,                              color: '#A78BFA' },
        ].map(({ icon: Icon, label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-4 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
              <Icon className="w-4 h-4" style={{ color }} />
            </div>
            <div>
              <p className="text-xl font-bold text-[var(--color-text)] font-mono leading-none">{value}</p>
              <p className="text-[0.65rem] text-[var(--color-muted)] mt-0.5">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">

        {/* Quick actions */}
        <div className="space-y-4">
          <h2 className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">Acciones rápidas</h2>
          <div className="grid gap-3">
            {QUICK_ACTIONS.map(({ icon: Icon, label, sub, to, color }, i) => (
              <motion.div
                key={to}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 + 0.1 }}
              >
                <Link
                  to={to}
                  className="group glass rounded-xl p-4 flex items-center gap-4 no-underline hover:border-[rgba(255,255,255,0.1)] transition-all duration-200 block"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[var(--color-text)]">{label}</p>
                    <p className="text-[0.7rem] text-[var(--color-muted)]">{sub}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--color-muted)] group-hover:text-[var(--color-text)] group-hover:translate-x-0.5 transition-all" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Datasets table */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">Datasets recientes</h2>
              <Link to="/admin/datasets" className="text-[0.72rem] text-indigo-400 hover:text-indigo-300 no-underline flex items-center gap-1">
                Ver todos <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="glass rounded-xl overflow-hidden">
              <table className="w-full text-[0.75rem]">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.06)]">
                    {['Dataset', 'Filas', 'Estado', 'Actualizado'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[var(--color-muted)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DATASETS.slice(0, 4).map((ds, i) => (
                    <motion.tr
                      key={ds.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 + 0.2 }}
                      className="border-b border-[rgba(255,255,255,0.04)] hover:bg-white/[0.025] transition-colors"
                    >
                      <td className="px-4 py-2.5">
                        <Link to={`/admin/datasets/${ds.id}`} className="font-medium text-[var(--color-text)] no-underline hover:text-indigo-400 transition-colors">
                          {ds.name}
                        </Link>
                        <p className="text-[0.65rem] text-[var(--color-muted)]">{ds.topic}</p>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-[var(--color-muted)]">{ds.rowCount.toLocaleString('es-CO')}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-[0.6rem] font-bold uppercase px-2 py-0.5 rounded-full ${
                          ds.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {ds.status === 'published' ? 'Publicado' : 'Borrador'}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[var(--color-muted)]">{ds.lastUpdated}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Activity feed */}
        <div>
          <h2 className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)] mb-3">
            Actividad reciente
          </h2>
          <div className="glass rounded-xl p-4 space-y-0">
            {RECENT_ACTIVITY.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 + 0.15 }}
                className="flex gap-3 py-3 border-b border-[rgba(255,255,255,0.04)] last:border-0"
              >
                <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `${TYPE_COLOR[item.type]}15` }}>
                  <Activity className="w-2.5 h-2.5" style={{ color: TYPE_COLOR[item.type] }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.75rem] text-[var(--color-text)] leading-snug">{item.label}</p>
                  <p className="text-[0.65rem] text-[var(--color-muted)] mt-0.5">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
