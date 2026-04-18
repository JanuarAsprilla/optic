import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()

// GET /api/users
router.get('/', authenticate, requireAdmin, async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })
  res.json({ success: true, data: users })
})

// PATCH /api/users/:id/role
router.patch('/:id/role', authenticate, requireAdmin, async (req: Request, res: Response) => {
  const id   = req.params['id'] as string
  const role = req.body['role'] as string

  if (!['ADMIN', 'VIEWER'].includes(role)) {
    res.status(400).json({ success: false, error: 'Role inválido' })
    return
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role: role as 'ADMIN' | 'VIEWER' },
    select: { id: true, name: true, email: true, role: true },
  })

  res.json({ success: true, data: user })
})

// DELETE /api/users/:id
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  const id = req.params['id'] as string

  if (id === req.user!.userId) {
    res.status(400).json({ success: false, error: 'No puedes eliminarte a ti mismo' })
    return
  }
  await prisma.user.delete({ where: { id } })
  res.json({ success: true })
})

export default router
