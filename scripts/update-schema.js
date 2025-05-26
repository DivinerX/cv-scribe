// This script updates the database schema to match the column names expected by the PgAdapter
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

async function updateSchema() {
  try {
    // Update accounts table
    await query(`
      ALTER TABLE accounts 
      RENAME COLUMN user_id TO "userId";
    `);
    
    await query(`
      ALTER TABLE accounts 
      RENAME COLUMN provider_account_id TO "providerAccountId";
    `);
    
    // Update sessions table
    await query(`
      ALTER TABLE sessions 
      RENAME COLUMN user_id TO "userId";
    `);
    
    await query(`
      ALTER TABLE sessions 
      RENAME COLUMN session_token TO "sessionToken";
    `);
    
    // Update users table
    await query(`
      ALTER TABLE users 
      RENAME COLUMN email_verified TO "emailVerified";
    `);
    
    // Rename verification_tokens table to verification_token if it exists
    await query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'verification_tokens'
        ) THEN
          ALTER TABLE verification_tokens RENAME TO verification_token;
        END IF;
      END $$;
    `);
    
    console.log('Database schema updated successfully');
  } catch (error) {
    console.error('Error updating database schema:', error);
    throw error;
  }
}

async function main() {
  try {
    await updateSchema();
    console.log('Schema update completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating schema:', error);
    process.exit(1);
  }
}

main();
