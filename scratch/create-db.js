/* eslint-disable */
const { Client } = require('pg');

const config = {
  user: 'Farzah',
  password: 'farzah123',
  host: 'localhost',
  database: 'postgres',
  port: 5432
};

async function createDb() {
  const client = new Client(config);
  try {
    await client.connect();
    console.log("Connected to postgres database.");
    
    // Check if 'kodein' exists
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname='kodein'");
    if (res.rowCount === 0) {
      console.log("Creating database 'kodein'...");
      await client.query("CREATE DATABASE kodein;");
      console.log("Database 'kodein' created successfully!");
    } else {
      console.log("Database 'kodein' already exists.");
    }
  } catch (err) {
    console.error("Error creating database:", err);
  } finally {
    await client.end();
  }
}

createDb();
