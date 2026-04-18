import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body as {
    name: string; email: string; password: string; role?: 'ADMIN' | 'VIEWER'
  }

  if (!name || !email || !password) {
    res.status(400).json({ success: false, error: 'Nombre, email y contraseña son requeridos' })
    return
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    res.status(409).json({ success: false, error: 'El email ya está registrado' })
    return
  }

  const hashed = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: role ?? 'VIEWER' },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })

  res.status(201).json({ success: true, data: user })
})

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string }

  if (!email || !password) {
    res.status(400).json({ success: false, error: 'Email y contraseña son requeridos' })
    return
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    res.status(401).json({ success: false, error: 'Credenciales inválidas' })
    return
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    res.status(401).json({ success: false, error: 'Credenciales inválidas' })
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = (jwt.sign as any)(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' },
  ) as string

  res.json({
    success: true,
    data: {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role.toLowerCase() },
    },
  })
})

// GET /api/auth/me
router.get('/me', authenticate, async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  })
  if (!user) { res.status(404).json({ success: false, error: 'Usuario no encontrado' }); return }
  res.json({ success: true, data: { ...user, role: user.role.toLowerCase() } })
})

export default router
