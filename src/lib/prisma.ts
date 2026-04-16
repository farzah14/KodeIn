import { PrismaClient } from "@/generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const dbPath = path.join(process.cwd(), "prisma/dev.db");
  console.log("Initializing Prisma with SQLite at:", dbPath);
  
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
  
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

// Gunakan key berbeda (prismaV7) untuk memastikan tidak ambil instance lama dari cache global
export const prisma = (global as any).prismaV7 ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") (global as any).prismaV7 = prisma;
