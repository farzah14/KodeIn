// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "@prisma/config";

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing. Put it in .env (root).');
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
