// This script migrates the database from NextAuth to our custom auth system
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

async function migrateDatabase() {
  console.log('Starting migration to custom auth system...');

  try {
    // 1. Update sessions table structure if needed
    console.log('Updating sessions table...');
    
    // Add created_at column if it doesn't exist
    await query(`
      ALTER TABLE sessions 
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    `);

    // Create indexes for better performance
    console.log('Creating indexes...');
    
    await query(`
      CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions("sessionToken")
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires)
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions("userId")
    `);

    // 2. Clean up expired sessions
    console.log('Cleaning up expired sessions...');
    const expiredResult = await query('DELETE FROM sessions WHERE expires < NOW()');
    console.log(`Removed ${expiredResult.rowCount} expired sessions`);

    // 3. Optional: Remove NextAuth-specific tables (commented out for safety)
    // Uncomment these if you're sure you want to remove the old tables
    /*
    console.log('Removing old NextAuth tables...');
    
    await query('DROP TABLE IF EXISTS accounts CASCADE');
    console.log('Dropped accounts table');
    
    await query('DROP TABLE IF EXISTS verification_token CASCADE');
    console.log('Dropped verification_token table');
    */

    // 4. Ensure users table has all required columns
    console.log('Updating users table...');
    
    // Make sure image column exists
    await query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS image VARCHAR(255)
    `);

    // 5. Create indexes on users table for better performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);

    // 6. Create indexes on profiles table
    await query(`
      CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id)
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status)
    `);

    console.log('Migration completed successfully!');
    
    // Show some stats
    const userCount = await query('SELECT COUNT(*) as count FROM users');
    const sessionCount = await query('SELECT COUNT(*) as count FROM sessions WHERE expires > NOW()');
    const profileCount = await query('SELECT COUNT(*) as count FROM profiles');
    
    console.log('\nDatabase Statistics:');
    console.log(`- Users: ${userCount.rows[0].count}`);
    console.log(`- Active Sessions: ${sessionCount.rows[0].count}`);
    console.log(`- Profiles: ${profileCount.rows[0].count}`);

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

async function main() {
  try {
    await migrateDatabase();
    console.log('\nMigration completed successfully!');
    console.log('Your database is now ready for the custom auth system.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();
