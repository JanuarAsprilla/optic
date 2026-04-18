import { useState, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft, Upload, FileSpreadsheet, X, Check, AlertCircle,
  FileText, ChevronRight, Loader2,
} from 'lucide-react'
import { datasetsService } from '@/lib/services/datasets'

type Step = 'upload' | 'preview' | 'configure' | 'done'

interface ParsedColumn {
  name: string
  sample: string
  type: 'string' | 'number' | 'date'
}

const TOPICS = [
  'Ventas', 'RRHH', 'Ambiental', 'Finanzas', 'Operaciones',
  'Marketing', 'Salud', 'Educación', 'Logística', 'Otro',
]

const ACCENT_COLORS = [
  '#6366F1', '#22D3A5', '#F59E0B', '#A78BFA',
  '#F43F5E', '#22D3EE', '#FB923C', '#34D399',
]

export default function DatasetNew() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>('upload')
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [columns, setColumns] = useState<ParsedColumn[]>([])
  const [form, setForm] = useState({
    name: '',
    topic: 'Ventas',
    description: '',
    color: '#6366F1',
  })

  const handleFile = useCallback((f: File) => {
    if (!f.name.match(/\.(csv|xlsx|xls)$/i)) return
    setFile(f)
    setForm(prev => ({ ...prev, name: f.name.replace(/\.[^.]+$/, '') }))
    // Simulate parsing
    setLoading(true)
    setTimeout(() => {
      setColumns([
        { name: 'fecha', sample: '2024-01-15', type: 'date' },
        { name: 'producto', sample: 'Laptop Pro X', type: 'string' },
        { name: 'categoria', sample: 'Electrónica', type: 'string' },
        { name: 'cantidad', sample: '24', type: 'number' },
        { name: 'precio', sample: '1250000', type: 'number' },
        { name: 'region', sample: 'Pacífico', type: 'string' },
        { name: 'vendedor', sample: 'Carlos Ruiz', type: 'string' },
        { name: 'descuento', sample: '0.05', type: 'number' },
      ])
      setLoading(false)
      setStep('preview')
    }, 1200)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [handleFile])

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true)
    setUploadError(null)
    try {
      await datasetsService.upload(file, { name: form.name, topic: form.topic, description: form.description, color: form.color })
      await qc.invalidateQueries({ queryKey: ['datasets'] })
      setStep('done')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Error al subir el archivo'
      setUploadError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-[860px] mx-auto space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[0.72rem] text-[var(--color-muted)]">
        <Link to="/admin/datasets" className="hover:text-[var(--color-text)] no-underline transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" />Datasets
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[var(--color-text)]">Nuevo dataset</span>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0">
        {(['upload', 'preview', 'configure'] as const).map((s, i) => {
          const done = ['upload', 'preview', 'configure', 'done'].indexOf(step) > i
          const active = step === s
          return (
            <div key={s} className="flex items-center">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[0.72rem] font-medium transition-colors ${
                active ? 'text-indigo-400' : done ? 'text-emerald-400' : 'text-[var(--color-muted)]'
              }`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] font-bold border ${
                  active ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400' :
                  done ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' :
                  'border-[rgba(255,255,255,0.1)] text-[var(--color-muted)]'
                }`}>
                  {done ? <Check className="w-2.5 h-2.5" /> : i + 1}
                </div>
                {{ upload: 'Archivo', preview: 'Vista previa', configure: 'Configurar' }[s]}
              </div>
              {i < 2 && <div className="w-8 h-px bg-[rgba(255,255,255,0.07)]" />}
            </div>
          )
        })}
      </div>

      <AnimatePresence mode="wait">

        {/* STEP 1: Upload */}
        {step === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden"
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />

            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`glass rounded-2xl p-16 flex flex-col items-center justify-center gap-5 cursor-pointer transition-all duration-200 ${
                dragging
                  ? 'border-indigo-500/50 bg-indigo-500/5'
                  : 'hover:border-[rgba(255,255,255,0.12)] hover:bg-white/[0.02]'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Upload className="w-7 h-7 text-indigo-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-[var(--color-text)] mb-1">
                  Arrastra tu archivo aquí
                </p>
                <p className="text-[0.72rem] text-[var(--color-muted)]">
                  o haz clic para seleccionar · CSV, XLSX, XLS
                </p>
              </div>
              <div className="flex items-center gap-3">
                {['.csv', '.xlsx', '.xls'].map(ext => (
                  <span key={ext} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.04] border border-[rgba(255,255,255,0.07)] text-[0.65rem] text-[var(--color-muted)]">
                    <FileSpreadsheet className="w-3 h-3" />{ext}
                  </span>
                ))}
              </div>
            </div>

            {loading && (
              <div className="flex items-center gap-3 mt-4 text-[0.75rem] text-[var(--color-muted)]">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                Analizando archivo…
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 2: Preview */}
        {step === 'preview' && file && (
          <motion.div key="preview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">

            {/* File info */}
            <div className="glass rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.82rem] font-semibold text-[var(--color-text)] truncate">{file.name}</p>
                <p className="text-[0.65rem] text-[var(--color-muted)]">
                  {(file.size / 1024).toFixed(1)} KB · {columns.length} columnas detectadas
                </p>
              </div>
              <button onClick={() => { setFile(null); setStep('upload') }}
                className="w-7 h-7 rounded-lg hover:bg-white/[0.06] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Columns table */}
            <div className="glass rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
                <h3 className="text-[0.72rem] font-bold uppercase tracking-[0.12em] text-[var(--color-muted)]">
                  Columnas detectadas
                </h3>
              </div>
              <table className="w-full text-[0.75rem]">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.06)]">
                    {['Columna', 'Tipo', 'Muestra'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[var(--color-muted)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {columns.map((col, i) => (
                    <motion.tr key={col.name}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      className="border-b border-[rgba(255,255,255,0.04)] last:border-0 hover:bg-white/[0.02]">
                      <td className="px-4 py-2.5 font-mono text-[var(--color-text)]">{col.name}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-[0.65rem] font-bold uppercase px-2 py-0.5 rounded-full ${
                          col.type === 'number' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                          col.type === 'date' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-[rgba(255,255,255,0.05)] text-[var(--color-muted)] border border-[rgba(255,255,255,0.08)]'
                        }`}>
                          {col.type}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[var(--color-muted)] font-mono">{col.sample}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[0.72rem] text-amber-400">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Se detectaron <strong>~4,200</strong> filas en el archivo</span>
              </div>
              <button onClick={() => setStep('configure')}
                className="flex items-center gap-2 h-9 px-5 rounded-lg text-[0.8rem] font-semibold text-white transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #6366F1, #7C3AED)', boxShadow: '0 2px 16px rgba(99,102,241,0.25)' }}>
                Continuar <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Configure */}
        {step === 'configure' && (
          <motion.div key="configure" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
            <div className="glass rounded-2xl p-6 space-y-5">

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.72rem] font-semibold text-[var(--color-muted)] uppercase tracking-[0.1em] mb-2">
                    Nombre del dataset
                  </label>
                  <input
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 h-9 rounded-lg bg-white/[0.04] border border-[rgba(255,255,255,0.08)] text-[0.82rem] text-[var(--color-text)] outline-none focus:border-indigo-500/40 transition-colors"
                    placeholder="ej. Ventas 2024"
                  />
                </div>
                <div>
                  <label className="block text-[0.72rem] font-semibold text-[var(--color-muted)] uppercase tracking-[0.1em] mb-2">
                    Temática
                  </label>
                  <select
                    value={form.topic}
                    onChange={e => setForm(p => ({ ...p, topic: e.target.value }))}
                    className="w-full px-3 h-9 rounded-lg bg-[#0D0E1B] border border-[rgba(255,255,255,0.08)] text-[0.82rem] text-[var(--color-text)] outline-none focus:border-indigo-500/40 transition-colors"
                  >
                    {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[0.72rem] font-semibold text-[var(--color-muted)] uppercase tracking-[0.1em] mb-2">
                  Descripción
                </label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-[rgba(255,255,255,0.08)] text-[0.82rem] text-[var(--color-text)] outline-none focus:border-indigo-500/40 transition-colors resize-none"
                  placeholder="Breve descripción del contenido y propósito de este dataset…"
                />
              </div>

              <div>
                <label className="block text-[0.72rem] font-semibold text-[var(--color-muted)] uppercase tracking-[0.1em] mb-3">
                  Color de acento
                </label>
                <div className="flex items-center gap-2">
                  {ACCENT_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setForm(p => ({ ...p, color: c }))}
                      className="w-7 h-7 rounded-full transition-transform hover:scale-110 relative"
                      style={{ background: c }}
                    >
                      {form.color === c && (
                        <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview pill */}
              <div className="pt-2 border-t border-[rgba(255,255,255,0.06)]">
                <p className="text-[0.65rem] font-semibold text-[var(--color-muted)] uppercase tracking-[0.1em] mb-3">Vista previa de la tarjeta</p>
                <div className="rounded-xl overflow-hidden border border-[rgba(255,255,255,0.07)] max-w-[280px]">
                  <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${form.color}, transparent)` }} />
                  <div className="p-4 bg-white/[0.03]">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: `${form.color}15`, border: `1px solid ${form.color}25` }}>
                        <FileSpreadsheet className="w-3.5 h-3.5" style={{ color: form.color }} />
                      </div>
                      <div>
                        <p className="text-[0.8rem] font-bold text-[var(--color-text)]">{form.name || 'Nombre del dataset'}</p>
                        <span className="text-[0.6rem] px-1.5 py-0.5 rounded bg-white/[0.04] text-[var(--color-muted)]">{form.topic}</span>
                      </div>
                    </div>
                    <p className="text-[0.68rem] text-[var(--color-muted)] line-clamp-2">{form.description || 'Sin descripción'}</p>
                  </div>
                </div>
              </div>
            </div>

            {uploadError && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                <AlertCircle size={14} className="shrink-0" />{uploadError}
              </div>
            )}

            <div className="flex items-center justify-between">
              <button onClick={() => setStep('preview')}
                className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-[0.8rem] font-medium border border-[rgba(255,255,255,0.08)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-white/[0.04] transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />Atrás
              </button>
              <button onClick={handleSubmit} disabled={!form.name || loading}
                className="flex items-center gap-2 h-9 px-5 rounded-lg text-[0.8rem] font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #6366F1, #7C3AED)', boxShadow: '0 2px 16px rgba(99,102,241,0.25)' }}>
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                {loading ? 'Importando…' : 'Importar dataset'}
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: Done */}
        {step === 'done' && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-16 flex flex-col items-center justify-center gap-5 text-center">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
              className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <Check className="w-7 h-7 text-emerald-400" />
            </motion.div>
            <div>
              <h2 className="text-lg font-bold text-[var(--color-text)] mb-1">Dataset importado</h2>
              <p className="text-[0.75rem] text-[var(--color-muted)]">
                <strong className="text-[var(--color-text)]">{form.name}</strong> está listo para configurar dashboards
              </p>
            </div>
            <div className="flex gap-3 mt-2">
              <Link to="/admin/datasets"
                className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-[0.8rem] font-medium border border-[rgba(255,255,255,0.08)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-white/[0.04] no-underline transition-colors">
                Ver datasets
              </Link>
              <Link to="/admin/datasets/new"
                onClick={() => { setStep('upload'); setFile(null); setColumns([]); setUploadError(null) }}
                className="flex items-center gap-1.5 h-9 px-5 rounded-lg text-[0.8rem] font-semibold text-white no-underline transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #6366F1, #7C3AED)', boxShadow: '0 2px 16px rgba(99,102,241,0.25)' }}>
                Importar otro
              </Link>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
