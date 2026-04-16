const { PrismaClient } = require("./src/generated/prisma");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
require('dotenv').config();

async function test() {
  console.log("Testing DB connection...");
  const url = process.env.DATABASE_URL;
  if (!url) {
      console.error("DATABASE_URL is missing!");
      process.exit(1);
  }
  console.log("Connecting to:", url.split('@')[1]); 

  const pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });
    
    console.log("Connection established. Querying...");
    const userCount = await prisma.user.count();
    console.log("SUCCESS! User count:", userCount);
    
    await prisma.$disconnect();
    await pool.end();
  } catch (err) {
    console.error("DB CONNECTION FAILED:", err);
    process.exit(1);
  }
}

test();
