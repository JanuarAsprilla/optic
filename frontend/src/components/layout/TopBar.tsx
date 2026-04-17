import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, Search, Bell, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/stores/appStore'

const ROUTE_LABELS: Record<string, string> = {
  '/':                   'Dashboards',
  '/datasets':           'Datasets',
  '/explorar':           'Explorar datos',
  '/admin':              'Administración',
  '/admin/datasets':     'Gestionar datasets',
  '/admin/datasets/new': 'Cargar dataset',
  '/admin/users':        'Usuarios',
  '/admin/settings':     'Configuración',
}

interface Props { onMenuClick: () => void }

export default function TopBar({ onMenuClick }: Props) {
  const { pathname } = useLocation()
  const { user } = useAppStore()
  const [searchOpen, setSearchOpen] = useState(false)

  const label = Object.entries(ROUTE_LABELS)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([k]) => pathname === k || pathname.startsWith(k + '/'))?.[1] ?? 'Optic'

  return (
    <header className="h-[var(--topbar-h)] flex items-center px-4 gap-3 border-b border-[rgba(255,255,255,0.05)] bg-[#0A0B17]/80 backdrop-blur-md sticky top-0 z-20 shrink-0">
      {/* Mobile menu */}
      <button onClick={onMenuClick} className="lg:hidden p-1.5 rounded-lg hover:bg-white/[0.06] text-[var(--color-muted)] transition-colors">
        <Menu className="w-4 h-4" />
      </button>

      {/* Page title */}
      <h1 className="text-sm font-semibold text-[var(--color-text)] flex-1 min-w-0 truncate">
        {label}
      </h1>

      {/* Search */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <input
              autoFocus
              onBlur={() => setSearchOpen(false)}
              placeholder="Buscar datasets..."
              className="w-full h-8 bg-white/[0.06] border border-[rgba(255,255,255,0.08)] rounded-lg px-3 text-xs text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none focus:border-indigo-500/50 transition-colors"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setSearchOpen(v => !v)}
        className="p-1.5 rounded-lg hover:bg-white/[0.06] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
      >
        <Search className="w-4 h-4" />
      </button>

      <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors relative">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-indigo-500" />
      </button>

      {user?.role === 'admin' && (
        <a href="/admin/datasets/new"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.75rem] font-semibold text-white no-underline transition-all hover:brightness-110 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #6366F1, #7C3AED)', boxShadow: '0 2px 16px rgba(99,102,241,0.3)' }}
        >
          <Plus className="w-3.5 h-3.5" />Nuevo dataset
        </a>
      )}
    </header>
  )
}
