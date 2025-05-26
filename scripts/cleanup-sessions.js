// Script to manually clean up expired sessions
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function query(text, params) {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
}

async function cleanupSessions() {
  try {
    console.log('Starting session cleanup...');
    
    // Show current session count
    const beforeCount = await query('SELECT COUNT(*) as count FROM sessions');
    console.log(`Total sessions before cleanup: ${beforeCount.rows[0].count}`);
    
    const expiredCount = await query('SELECT COUNT(*) as count FROM sessions WHERE expires < NOW()');
    console.log(`Expired sessions to be removed: ${expiredCount.rows[0].count}`);
    
    // Remove expired sessions
    const result = await query('DELETE FROM sessions WHERE expires < NOW()');
    console.log(`Successfully removed ${result.rowCount} expired sessions`);
    
    // Show final count
    const afterCount = await query('SELECT COUNT(*) as count FROM sessions');
    console.log(`Total sessions after cleanup: ${afterCount.rows[0].count}`);
    
  } catch (error) {
    console.error('Session cleanup failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

cleanupSessions()
  .then(() => {
    console.log('Session cleanup completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Session cleanup failed:', error);
    process.exit(1);
  });
