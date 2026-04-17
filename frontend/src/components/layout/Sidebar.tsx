import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Database, Settings, ChevronRight,
  Layers, Users, BarChart2, FileUp, HelpCircle, X,
} from 'lucide-react'
import { useAppStore } from '@/stores/appStore'
import { cn } from '@/lib/utils'

const NAV = [
  {
    label: 'Plataforma',
    items: [
      { to: '/',           icon: LayoutDashboard, label: 'Dashboards' },
      { to: '/datasets',   icon: Database,         label: 'Datasets' },
      { to: '/explorar',   icon: BarChart2,        label: 'Explorar' },
    ],
  },
  {
    label: 'Administración',
    items: [
      { to: '/admin',             icon: Layers,  label: 'Resumen Admin' },
      { to: '/admin/datasets',    icon: Database, label: 'Gestionar Datos' },
      { to: '/admin/datasets/new',icon: FileUp,   label: 'Cargar Dataset' },
      { to: '/admin/users',       icon: Users,    label: 'Usuarios' },
      { to: '/admin/settings',    icon: Settings, label: 'Configuración' },
    ],
  },
]

interface Props { mobile?: boolean; onClose?: () => void }

export default function Sidebar({ mobile, onClose }: Props) {
  const { user } = useAppStore()
  const location = useLocation()

  return (
    <aside className={cn(
      'flex flex-col h-full',
      'bg-[#0A0B17] border-r border-[rgba(255,255,255,0.05)]',
      mobile ? 'w-full' : 'w-[var(--sidebar-w)]',
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between h-[var(--topbar-h)] px-5 border-b border-[rgba(255,255,255,0.05)] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <span className="text-[10px] font-black text-white tracking-tight">OP</span>
          </div>
          <span className="text-sm font-bold text-white tracking-tight">Optic</span>
        </div>
        {mobile && (
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-[var(--color-muted)] transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {NAV.map((group) => (
          <div key={group.label}>
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)] px-2 mb-1.5">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ to, icon: Icon, label }) => {
                const active = to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(to)
                return (
                  <li key={to}>
                    <NavLink
                      to={to}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[0.82rem] font-medium transition-all duration-150 no-underline group relative',
                        active
                          ? 'bg-indigo-500/15 text-indigo-400'
                          : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-white/[0.04]',
                      )}
                    >
                      {active && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
                          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                        />
                      )}
                      <Icon className={cn('w-3.5 h-3.5 shrink-0 relative z-10', active ? 'text-indigo-400' : 'text-[var(--color-muted)] group-hover:text-[var(--color-text)]')} />
                      <span className="relative z-10">{label}</span>
                      {active && <ChevronRight className="w-3 h-3 ml-auto relative z-10 text-indigo-400/60" />}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 p-3 border-t border-[rgba(255,255,255,0.05)]">
        <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/[0.04] transition-colors group">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 text-[10px] font-bold text-white">
            {user?.name?.[0] ?? 'A'}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-[0.75rem] font-semibold text-[var(--color-text)] truncate">{user?.name}</p>
            <p className="text-[0.65rem] text-[var(--color-muted)] truncate">{user?.email}</p>
          </div>
          <HelpCircle className="w-3.5 h-3.5 text-[var(--color-muted)] group-hover:text-[var(--color-text)] transition-colors shrink-0" />
        </button>
      </div>
    </aside>
  )
}
