import { useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props {
  columns: string[]
  rows: Record<string, any>[]
  pageSize?: number
}

export default function TableWidget({ columns, rows, pageSize = 8 }: Props) {
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(null)

  const sorted = sort
    ? [...rows].sort((a, b) => {
        const av = a[sort.key]; const bv = b[sort.key]
        const cmp = av < bv ? -1 : av > bv ? 1 : 0
        return sort.dir === 'asc' ? cmp : -cmp
      })
    : rows

  const totalPages = Math.ceil(sorted.length / pageSize)
  const page_rows   = sorted.slice(page * pageSize, (page + 1) * pageSize)

  const toggleSort = (key: string) => {
    setSort(prev =>
      prev?.key === key
        ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' }
    )
    setPage(0)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.06)]">
        <table className="w-full text-[0.75rem] border-collapse">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.06)]">
              {columns.map(col => (
                <th
                  key={col}
                  onClick={() => toggleSort(col)}
                  className="px-4 py-2.5 text-left font-semibold text-[var(--color-muted)] uppercase tracking-[0.08em] whitespace-nowrap cursor-pointer select-none hover:text-[var(--color-text)] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    {col}
                    {sort?.key === col
                      ? sort.dir === 'asc'
                        ? <ChevronUp className="w-3 h-3 text-indigo-400" />
                        : <ChevronDown className="w-3 h-3 text-indigo-400" />
                      : <ChevronsUpDown className="w-3 h-3 opacity-30" />
                    }
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {page_rows.map((row, ri) => (
              <motion.tr
                key={ri}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: ri * 0.03 }}
                className="border-b border-[rgba(255,255,255,0.04)] hover:bg-white/[0.025] transition-colors"
              >
                {columns.map(col => (
                  <td key={col} className="px-4 py-2.5 text-[var(--color-text)] whitespace-nowrap">
                    {typeof row[col] === 'number'
                      ? row[col].toLocaleString('es-CO')
                      : row[col] ?? '—'}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-[0.7rem] text-[var(--color-muted)]">
          <span>{rows.length} registros · página {page + 1} de {totalPages}</span>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-7 h-7 rounded-lg text-[0.7rem] font-medium transition-colors ${
                  page === i
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'hover:bg-white/[0.05] text-[var(--color-muted)]'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
