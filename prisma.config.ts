import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Digunakan oleh CLI/Migration. Wajib Direct Connection untuk Neon (tanpa -pooler)
    url: process.env.DIRECT_URL,
  },
});
