import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // migrate/generate CLI akan pakai DIRECT_URL (direct)
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
