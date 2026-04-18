import app from './app.js'
import { prisma } from './lib/prisma.js'

const PORT = Number(process.env.PORT ?? 4000)

async function main() {
  await prisma.$connect()
  console.log('✓ Conectado a la base de datos')

  app.listen(PORT, () => {
    console.log(`✓ Servidor corriendo en http://localhost:${PORT}`)
    console.log(`  NODE_ENV: ${process.env.NODE_ENV ?? 'development'}`)
  })
}

main().catch(err => {
  console.error('Error al iniciar el servidor:', err)
  process.exit(1)
})
