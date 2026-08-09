import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

declare global {
  var prismaV7: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  if (process.env.NEXT_PHASE !== "phase-production-build") {
    throw new Error("DATABASE_URL environment variable is missing.");
  }
}

function createPrismaClient() {
  const pool = new pg.Pool({
    connectionString,
    // pg defaults to 0 = wait forever; without this a dead/rotated
    // database makes every request hang instead of failing fast.
    connectionTimeoutMillis: 5000,
  });
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = (globalThis as unknown as { prismaV7: PrismaClient | undefined }).prismaV7 || createPrismaClient();

if (process.env.NODE_ENV !== "production") (globalThis as unknown as { prismaV7: PrismaClient | undefined }).prismaV7 = prisma;
