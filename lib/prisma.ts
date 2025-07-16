import { PrismaClient, Prisma } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined
}

function createPrismaClient() {
  // Determine log levels based on environment variables
  let devLogs: Prisma.LogLevel[] = ['error']; // Default fallback
  
  if (process.env.NODE_ENV === 'development') {
    if (process.env.PRISMA_LOG_LEVEL === 'verbose') {
      devLogs = ['query', 'warn', 'error'];
      console.log('🔍 Prisma logging: VERBOSE mode (queries + warnings + errors)');
    } else {
      // 'basic' or any other value = no queries, just warnings and errors
      devLogs = ['warn', 'error'];
      console.log('🎯 Prisma logging: BASIC mode (warnings + errors only)');
    }
  } else {
    console.log('🛡️ Prisma logging: PRODUCTION mode (errors only)');
  }

  return new PrismaClient({
    log: devLogs,
  }).$extends(withAccelerate())
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
