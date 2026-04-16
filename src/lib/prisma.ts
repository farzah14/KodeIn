import { PrismaClient } from "@/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const dbPath = path.join(process.cwd(), "prisma/dev.db");
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
  
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = (globalThis as unknown as { prismaV7: PrismaClient | undefined }).prismaV7 || createPrismaClient();

if (process.env.NODE_ENV !== "production") (globalThis as unknown as { prismaV7: PrismaClient | undefined }).prismaV7 = prisma;
