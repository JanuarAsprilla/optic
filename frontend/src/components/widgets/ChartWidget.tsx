import { motion } from 'framer-motion'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { CHART_COLORS } from '@/lib/utils'

// ── Custom tooltip ─────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-2 rounded-xl px-3 py-2.5 text-[0.72rem] shadow-2xl shadow-black/40 min-w-[120px]">
      <p className="font-semibold text-[var(--color-text)] mb-1.5">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-[var(--color-muted)]">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-semibold text-[var(--color-text)]">
            {typeof p.value === 'number' ? p.value.toLocaleString('es-CO') : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ── Axis tick ─────────────────────────────────────────────────────────────────
const TICK_STYLE = { fill: '#5E6080', fontSize: 11, fontFamily: 'inherit' }
const GRID_COLOR = 'rgba(255,255,255,0.04)'

// ── Chart variants ────────────────────────────────────────────────────────────
interface Props {
  type: 'bar' | 'line' | 'area' | 'pie'
  data: any[]
  xKey?: string
  yKeys?: string[]
  colors?: string[]
  height?: number
  index?: number
}

export default function ChartWidget({
  type, data, xKey = 'name', yKeys = ['value'],
  colors = CHART_COLORS, height = 260, index = 0,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {type === 'bar' ? (
          <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
            <CartesianGrid vertical={false} stroke={GRID_COLOR} />
            <XAxis dataKey={xKey} tick={TICK_STYLE} axisLine={false} tickLine={false} />
            <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            {yKeys.map((k, i) => (
              <Bar key={k} dataKey={k} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} maxBarSize={40} />
            ))}
          </BarChart>
        ) : type === 'line' ? (
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
            <CartesianGrid stroke={GRID_COLOR} />
            <XAxis dataKey={xKey} tick={TICK_STYLE} axisLine={false} tickLine={false} />
            <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            {yKeys.map((k, i) => (
              <Line key={k} type="monotone" dataKey={k} stroke={colors[i % colors.length]}
                strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
            ))}
          </LineChart>
        ) : type === 'area' ? (
          <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
            <defs>
              {yKeys.map((k, i) => (
                <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={colors[i % colors.length]} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={colors[i % colors.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke={GRID_COLOR} />
            <XAxis dataKey={xKey} tick={TICK_STYLE} axisLine={false} tickLine={false} />
            <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<CustomTooltip />} />
            {yKeys.map((k, i) => (
              <Area key={k} type="monotone" dataKey={k}
                stroke={colors[i % colors.length]} strokeWidth={2}
                fill={`url(#grad-${k})`} dot={false} />
            ))}
          </AreaChart>
        ) : (
          /* Pie / Donut */
          <PieChart>
            <Pie data={data} dataKey={yKeys[0]} nameKey={xKey}
              cx="50%" cy="50%" innerRadius="55%" outerRadius="80%"
              paddingAngle={3} strokeWidth={0}>
              {data.map((_: any, i: number) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" iconSize={8} />
          </PieChart>
        )}
      </ResponsiveContainer>
    </motion.div>
  )
}
