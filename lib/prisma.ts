// import { PrismaClient } from '@prisma/client'

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }

// export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Demo mode - export a mock prisma object
export const prisma = {
  user: {
    findUnique: () => null,
    create: () => null,
  },
  note: {
    findMany: () => [],
    create: () => null,
    update: () => null,
    delete: () => null,
  }
}
