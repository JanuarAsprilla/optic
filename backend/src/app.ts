import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'

import authRouter from './routes/auth.js'
import datasetsRouter from './routes/datasets.js'
import dashboardsRouter from './routes/dashboards.js'
import usersRouter from './routes/users.js'

const app = express()

// ── Security & logging ────────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN ?? '*',
  credentials: true,
}))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Static uploads ────────────────────────────────────────────────────────────
const uploadDir = path.resolve(process.env.UPLOAD_DIR ?? 'uploads')
app.use('/uploads', express.static(uploadDir))

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter)
app.use('/api/datasets', datasetsRouter)
app.use('/api/dashboards', dashboardsRouter)
app.use('/api/users', usersRouter)

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Ruta no encontrada' })
})

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ success: false, error: 'Error interno del servidor' })
})

export default app
