import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { prisma } from './lib/prisma.js'

async function main() {
  const password = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@optic.app' },
    update: {},
    create: {
      name: 'Admin Optic',
      email: 'admin@optic.app',
      password,
      role: 'ADMIN',
    },
  })

  console.log('✓ Usuario admin creado:', admin.email)
  console.log('  Contraseña: admin123  (cámbiala en producción)')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
