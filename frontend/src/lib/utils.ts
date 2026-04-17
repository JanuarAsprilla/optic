import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fmt(value: number, prefix = '', suffix = ''): string {
  if (value >= 1_000_000) return `${prefix}${(value / 1_000_000).toFixed(1)}M${suffix}`
  if (value >= 1_000) return `${prefix}${(value / 1_000).toFixed(1)}K${suffix}`
  return `${prefix}${value.toLocaleString('es-CO')}${suffix}`
}

export function fmtDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function pct(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export const CHART_COLORS = [
  '#6366F1', '#22D3EE', '#F59E0B', '#10B981',
  '#A78BFA', '#FB923C', '#F43F5E', '#3B82F6',
]
