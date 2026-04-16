const { PrismaClient } = require("./src/generated/prisma");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const Database = require("better-sqlite3");
const path = require("path");

function test() {
  try {
    const dbPath = path.join(process.cwd(), "prisma/dev.db");
    console.log("DB Path:", dbPath);
    const db = new Database(dbPath);
    const adapter = new PrismaBetterSqlite3(db);
    const prisma = new PrismaClient({ adapter });
    console.log("Prisma client created successfully");
  } catch (e) {
    console.error("Error creating Prisma client:", e);
  }
}

test();
