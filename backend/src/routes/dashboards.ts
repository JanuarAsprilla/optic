import { Router, Request, Response } from 'express'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'

const router = Router()

// GET /api/dashboards
router.get('/', authenticate, async (_req: Request, res: Response) => {
  const dashboards = await prisma.dashboard.findMany({
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true, title: true, description: true, widgets: true,
      datasetId: true, createdAt: true, updatedAt: true,
    },
  })
  res.json({ success: true, data: dashboards })
})

// GET /api/dashboards/:id
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  const id = req.params['id'] as string

  const dash = await prisma.dashboard.findUnique({
    where: { id },
    include: { dataset: { select: { id: true, name: true, color: true, columns: true } } },
  })
  if (!dash) {
    res.status(404).json({ success: false, error: 'Dashboard no encontrado' })
    return
  }
  res.json({ success: true, data: dash })
})

// POST /api/dashboards
router.post('/', authenticate, requireAdmin, async (req: Request, res: Response) => {
  const { title, description, datasetId, widgets, filters } = req.body as {
    title: string; description?: string; datasetId: string
    widgets: object; filters?: object | null
  }

  if (!title || !datasetId || !widgets) {
    res.status(400).json({ success: false, error: 'title, datasetId y widgets son requeridos' })
    return
  }

  const dataset = await prisma.dataset.findUnique({ where: { id: datasetId } })
  if (!dataset) {
    res.status(404).json({ success: false, error: 'Dataset no encontrado' })
    return
  }

  const dash = await prisma.dashboard.create({
    data: {
      title,
      description: description ?? '',
      datasetId,
      widgets,
      filters: filters !== undefined ? (filters as Prisma.InputJsonValue) : Prisma.JsonNull,
      ownerId: req.user!.userId,
    },
  })

  res.status(201).json({ success: true, data: dash })
})

// PATCH /api/dashboards/:id
router.patch('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  const id = req.params['id'] as string
  const { title, description, widgets, filters } = req.body as {
    title?: string; description?: string; widgets?: object; filters?: object | null
  }

  const updateData: Record<string, unknown> = {}
  if (title) updateData['title'] = title
  if (description !== undefined) updateData['description'] = description
  if (widgets) updateData['widgets'] = widgets
  if (filters !== undefined) updateData['filters'] = filters ?? null

  const dash = await prisma.dashboard.update({
    where: { id },
    data: updateData,
  })

  res.json({ success: true, data: dash })
})

// DELETE /api/dashboards/:id
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  const id = req.params['id'] as string
  await prisma.dashboard.delete({ where: { id } })
  res.json({ success: true })
})

export default router
