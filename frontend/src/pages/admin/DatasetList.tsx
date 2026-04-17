import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus, Search, Database, BarChart2, TrendingUp,
  Users, Leaf, DollarSign, Settings, Eye,
} from 'lucide-react'
import { DATASETS } from '@/lib/mockData'
import type { Dataset } from '@/lib/types'

const ICON_MAP: Record<string, any> = {
  TrendingUp, Users, Leaf, DollarSign, BarChart2, Database,
}

export default function DatasetList() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  const filtered = DATASETS.filter(ds => {
    const q = query.toLowerCase()
    const matchSearch = !q || ds.name.toLowerCase().includes(q) || ds.topic.toLowerCase().includes(q)
    const matchStatus = filter === 'all' || ds.status === filter
    return matchSearch && matchStatus
  })

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-muted)]" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar datasets..."
            className="w-full pl-9 pr-4 h-9 rounded-lg bg-white/[0.04] border border-[rgba(255,255,255,0.08)] text-[0.82rem] text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none focus:border-indigo-500/40 transition-colors"
          />
        </div>
        <div className="flex rounded-lg overflow-hidden border border-[rgba(255,255,255,0.08)] shrink-0">
          {(['all', 'published', 'draft'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 h-9 text-[0.75rem] font-medium transition-colors ${
                filter === f
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-white/[0.04]'
              }`}
            >
              {{ all: 'Todos', published: 'Publicados', draft: 'Borradores' }[f]}
            </button>
          ))}
        </div>
        <Link
          to="/admin/datasets/new"
          className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-[0.8rem] font-semibold text-white no-underline transition-all hover:brightness-110 shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366F1, #7C3AED)', boxShadow: '0 2px 16px rgba(99,102,241,0.25)' }}
        >
          <Plus className="w-3.5 h-3.5" />Nuevo dataset
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((ds, i) => (
          <DatasetCard key={ds.id} dataset={ds} index={i} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center text-[var(--color-muted)]">
            <Database className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No se encontraron datasets</p>
          </div>
        )}
      </div>
    </div>
  )
}

function DatasetCard({ dataset: ds, index }: { dataset: Dataset; index: number }) {
  const Icon = ICON_MAP[ds.icon] ?? BarChart2

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-xl overflow-hidden hover:border-[rgba(255,255,255,0.1)] transition-all duration-200 group"
    >
      {/* Top accent */}
      <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${ds.color}, transparent)` }} />

      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${ds.color}15`, border: `1px solid ${ds.color}25` }}>
              <Icon className="w-4 h-4" style={{ color: ds.color }} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[var(--color-text)]">{ds.name}</h3>
              <span className="text-[0.65rem] px-1.5 py-0.5 rounded bg-white/[0.04] text-[var(--color-muted)]">{ds.topic}</span>
            </div>
          </div>
          <span className={`text-[0.6rem] font-bold uppercase px-2 py-0.5 rounded-full ${
            ds.status === 'published'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}>
            {ds.status === 'published' ? 'Publicado' : 'Borrador'}
          </span>
        </div>

        {/* Description */}
        <p className="text-[0.72rem] text-[var(--color-muted)] leading-relaxed line-clamp-2">{ds.description}</p>

        {/* Meta */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-[rgba(255,255,255,0.05)]">
          <div>
            <p className="text-[0.65rem] text-[var(--color-muted)] mb-0.5">Filas</p>
            <p className="text-[0.8rem] font-bold text-[var(--color-text)] font-mono">{ds.rowCount.toLocaleString('es-CO')}</p>
          </div>
          <div>
            <p className="text-[0.65rem] text-[var(--color-muted)] mb-0.5">Columnas</p>
            <p className="text-[0.8rem] font-bold text-[var(--color-text)] font-mono">{ds.columns.length}</p>
          </div>
          <div>
            <p className="text-[0.65rem] text-[var(--color-muted)] mb-0.5">Actualizado</p>
            <p className="text-[0.72rem] text-[var(--color-text)]">{ds.lastUpdated}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to={`/dashboard/dash-${ds.id.split('-')[1]}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[0.75rem] font-medium border border-[rgba(255,255,255,0.08)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-white/[0.04] no-underline transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />Vista previa
          </Link>
          <Link
            to={`/admin/datasets/${ds.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[0.75rem] font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/15 no-underline transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />Configurar
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
