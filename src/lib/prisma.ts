import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Inisialisasi standar Prisma Client. 
// Prisma akan otomatis menentukan adapter / provider berdasarkan DATABASE_URL di .env
export const prisma = 
  (globalThis as unknown as { prismaV7: PrismaClient | undefined }).prismaV7 || 
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") (globalThis as unknown as { prismaV7: PrismaClient | undefined }).prismaV7 = prisma;
