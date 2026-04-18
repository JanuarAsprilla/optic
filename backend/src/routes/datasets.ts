import { Router, Request, Response } from 'express'
import fs from 'fs'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { parseFile } from '../lib/parser.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = Router()

// GET /api/datasets
router.get('/', authenticate, async (req: Request, res: Response) => {
  const status = req.query['status'] as string | undefined
  const topic  = req.query['topic']  as string | undefined
  const q      = req.query['q']      as string | undefined

  const datasets = await prisma.dataset.findMany({
    where: {
      ...(status && { status: status.toUpperCase() as 'PUBLISHED' | 'DRAFT' }),
      ...(topic  && { topic: { contains: topic, mode: 'insensitive' } }),
      ...(q && {
        OR: [
          { name:  { contains: q, mode: 'insensitive' } },
          { topic: { contains: q, mode: 'insensitive' } },
        ],
      }),
    },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true, name: true, description: true, topic: true, color: true,
      icon: true, status: true, rowCount: true, columns: true,
      createdAt: true, updatedAt: true,
    },
  })

  res.json({ success: true, data: datasets })
})

// GET /api/datasets/:id
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  const id = req.params['id'] as string

  const ds = await prisma.dataset.findUnique({
    where: { id },
    include: { dashboards: true },
  })
  if (!ds) {
    res.status(404).json({ success: false, error: 'Dataset no encontrado' })
    return
  }
  res.json({ success: true, data: ds })
})

// GET /api/datasets/:id/rows
router.get('/:id/rows', authenticate, async (req: Request, res: Response) => {
  const id    = req.params['id'] as string
  const page  = Math.max(0, Number(req.query['page']  ?? 0))
  const limit = Math.min(500, Math.max(1, Number(req.query['limit'] ?? 100)))

  const [rows, total] = await Promise.all([
    prisma.dataRow.findMany({
      where: { datasetId: id },
      skip: page * limit,
      take: limit,
      select: { id: true, data: true },
    }),
    prisma.dataRow.count({ where: { datasetId: id } }),
  ])

  res.json({
    success: true,
    data: rows.map(r => r.data),
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
  })
})

// POST /api/datasets/upload
router.post(
  '/upload',
  authenticate,
  requireAdmin,
  upload.single('file'),
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'Archivo requerido' })
      return
    }

    try {
      const parsed = parseFile(req.file.path)
      res.json({
        success: true,
        data: {
          fileKey: req.file.filename,
          columns: parsed.columns,
          rowCount: parsed.rowCount,
          sample: parsed.rows.slice(0, 5),
        },
      })
    } catch {
      fs.unlinkSync(req.file.path)
      res.status(422).json({ success: false, error: 'No se pudo procesar el archivo' })
    }
  },
)

// POST /api/datasets
router.post('/', authenticate, requireAdmin, async (req: Request, res: Response) => {
  const { name, description, topic, color, icon, status, columns, fileKey, rows } = req.body as {
    name: string; description?: string; topic: string
    color?: string; icon?: string; status?: 'PUBLISHED' | 'DRAFT'
    columns: object; fileKey?: string; rows?: Record<string, unknown>[]
  }

  if (!name || !topic || !columns) {
    res.status(400).json({ success: false, error: 'name, topic y columns son requeridos' })
    return
  }

  const dataset = await prisma.dataset.create({
    data: {
      name,
      description: description ?? '',
      topic,
      color: color ?? '#6366F1',
      icon: icon ?? 'Database',
      status: status ?? 'DRAFT',
      columns,
      rowCount: rows?.length ?? 0,
      fileKey,
      ownerId: req.user!.userId,
    },
  })

  if (rows && rows.length > 0) {
    for (let i = 0; i < rows.length; i += 500) {
      await prisma.dataRow.createMany({
        data: rows.slice(i, i + 500).map(r => ({ datasetId: dataset.id, data: r as Prisma.InputJsonValue })),
      })
    }
  }

  res.status(201).json({ success: true, data: dataset })
})

// PATCH /api/datasets/:id
router.patch('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  const id = req.params['id'] as string
  const { name, description, topic, color, icon, status } = req.body as {
    name?: string; description?: string; topic?: string
    color?: string; icon?: string; status?: 'PUBLISHED' | 'DRAFT'
  }

  const ds = await prisma.dataset.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(topic && { topic }),
      ...(color && { color }),
      ...(icon && { icon }),
      ...(status && { status }),
    },
  })

  res.json({ success: true, data: ds })
})

// DELETE /api/datasets/:id
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  const id = req.params['id'] as string
  await prisma.dataset.delete({ where: { id } })
  res.json({ success: true })
})

export default router
