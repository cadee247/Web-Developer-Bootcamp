// src/server/db.ts
import { PrismaClient } from "@prisma/client";

// Create a global variable to store the Prisma client instance
// This prevents multiple instances from being created during development
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Export a single Prisma client instance
// If one already exists (in globalForPrisma), reuse it
// Otherwise, create a new PrismaClient with logging enabled for queries and errors
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ["query", "error"] });

// In development mode, store the Prisma client in the global object
// This ensures hot-reloading doesn't create multiple instances
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;