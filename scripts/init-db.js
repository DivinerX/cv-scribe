// This script initializes the database tables
const { Pool } = require('pg');
require('dotenv').config();

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
}

async function initializeDatabase() {
  // Create users table if it doesn't exist
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE NOT NULL,
      "emailVerified" TIMESTAMP,
      image VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create profiles table if it doesn't exist
  await query(`
    CREATE TABLE IF NOT EXISTS profiles (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(50),
      location VARCHAR(255),
      birthday VARCHAR(50),
      github VARCHAR(255),
      linkedin VARCHAR(255),
      website VARCHAR(255),
      education TEXT,
      skills TEXT,
      projects TEXT,
      experience TEXT,
      status VARCHAR(50) DEFAULT 'not_allowed',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create sessions table for our custom auth system
  await query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY,
      "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires TIMESTAMP WITH TIME ZONE NOT NULL,
      "sessionToken" VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create index on sessionToken for faster lookups
  await query(`
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions("sessionToken")
  `);

  // Create index on expires for cleanup queries
  await query(`
    CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires)
  `);

  // Drop old NextAuth tables if they exist (optional cleanup)
  await query(`
    DROP TABLE IF EXISTS accounts CASCADE
  `);

  await query(`
    DROP TABLE IF EXISTS verification_token CASCADE
  `);

  console.log('Database initialized');
}

async function main() {
  try {
    await initializeDatabase();
    console.log('Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

main();
