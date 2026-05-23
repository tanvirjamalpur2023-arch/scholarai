import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // If DATABASE_AUTH_TOKEN is set, use Turso/libsql adapter (for Vercel deployment)
  // Otherwise, use standard PrismaClient with local SQLite (for development)
  const authToken = process.env.DATABASE_AUTH_TOKEN

  if (authToken) {
    // Dynamic import for Turso adapter (only used in production/Vercel)
    try {
      const { PrismaLibSql } = require('@prisma/adapter-libsql')
      const { createClient } = require('@libsql/client')

      const libsql = createClient({
        url: process.env.DATABASE_URL!,
        authToken,
      })

      const adapter = new PrismaLibSql(libsql)

      return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query'] : [],
      })
    } catch (error) {
      console.error('Failed to initialize Turso adapter, falling back to standard client:', error)
    }
  }

  // Standard PrismaClient for local SQLite development
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
