import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Gunakan SQLite lokal jika Neon kuota habis
    url: "file:./dev.db",
  },
});
