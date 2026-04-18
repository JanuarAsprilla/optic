import * as XLSX from 'xlsx'
import { parse as parseCsv } from 'csv-parse/sync'
import path from 'path'
import fs from 'fs'

export interface ParsedColumn {
  key: string
  label: string
  type: 'string' | 'number' | 'date' | 'boolean'
}

export interface ParseResult {
  columns: ParsedColumn[]
  rows: Record<string, unknown>[]
  rowCount: number
}

export function parseFile(filePath: string): ParseResult {
  const ext = path.extname(filePath).toLowerCase()

  let rawRows: Record<string, unknown>[]

  if (ext === '.csv') {
    const content = fs.readFileSync(filePath, 'utf-8')
    rawRows = parseCsv(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, unknown>[]
  } else {
    // xlsx / xls
    const workbook = XLSX.readFile(filePath)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    rawRows = XLSX.utils.sheet_to_json(sheet, { defval: null }) as Record<string, unknown>[]
  }

  if (rawRows.length === 0) {
    return { columns: [], rows: [], rowCount: 0 }
  }

  const columns = inferColumns(rawRows.slice(0, 100))

  return { columns, rows: rawRows, rowCount: rawRows.length }
}

function inferColumns(sample: Record<string, unknown>[]): ParsedColumn[] {
  const keys = Object.keys(sample[0])
  return keys.map(key => {
    const values = sample.map(r => r[key]).filter(v => v != null && v !== '')
    return {
      key: sanitizeKey(key),
      label: key,
      type: inferType(values),
    }
  })
}

function sanitizeKey(raw: string): string {
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
}

function inferType(values: unknown[]): ParsedColumn['type'] {
  if (values.length === 0) return 'string'

  const boolCount = values.filter(v =>
    v === true || v === false || v === 'true' || v === 'false'
  ).length
  if (boolCount / values.length > 0.8) return 'boolean'

  const numCount = values.filter(v => !isNaN(Number(v))).length
  if (numCount / values.length > 0.8) return 'number'

  const dateCount = values.filter(v => {
    const d = new Date(String(v))
    return !isNaN(d.getTime())
  }).length
  if (dateCount / values.length > 0.8) return 'date'

  return 'string'
}
