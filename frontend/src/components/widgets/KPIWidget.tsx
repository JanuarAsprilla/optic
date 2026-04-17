import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { motion } from 'framer-motion'
import { fmt } from '@/lib/utils'

interface Props {
  title: string
  value: number
  prefix?: string
  suffix?: string
  trend?: number          // % change
  trendLabel?: string
  color?: string
  index?: number
}

export default function KPIWidget({
  title, value, prefix = '', suffix = '',
  trend, trendLabel = 'vs mes anterior', color = '#6366F1', index = 0,
}: Props) {
  const isUp   = trend !== undefined && trend > 0
  const isDown = trend !== undefined && trend < 0
  const isFlat = trend !== undefined && trend === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-xl p-5 flex flex-col gap-4 hover:border-[rgba(255,255,255,0.10)] transition-colors duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <p className="text-[0.72rem] font-medium text-[var(--color-muted)] uppercase tracking-[0.12em] leading-tight">
          {title}
        </p>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: color }} />
        </div>
      </div>

      {/* Value */}
      <div>
        <p className="text-3xl font-bold text-[var(--color-text)] leading-none tracking-tight font-mono">
          {prefix}{fmt(value)}{suffix}
        </p>
      </div>

      {/* Trend */}
      {trend !== undefined && (
        <div className="flex items-center gap-1.5 mt-auto">
          <span className={`inline-flex items-center gap-1 text-[0.7rem] font-semibold px-2 py-0.5 rounded-full ${
            isUp   ? 'bg-emerald-500/10 text-emerald-400' :
            isDown ? 'bg-red-500/10 text-red-400' :
                     'bg-white/5 text-[var(--color-muted)]'
          }`}>
            {isUp   && <TrendingUp  className="w-3 h-3" />}
            {isDown && <TrendingDown className="w-3 h-3" />}
            {isFlat && <Minus       className="w-3 h-3" />}
            {Math.abs(trend).toFixed(1)}%
          </span>
          <span className="text-[0.65rem] text-[var(--color-muted)]">{trendLabel}</span>
        </div>
      )}
    </motion.div>
  )
}
