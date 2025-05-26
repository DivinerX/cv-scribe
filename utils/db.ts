import { Pool } from 'pg';

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Helper function to execute SQL queries
export async function query(text: string, params?: any[]) {
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

// Initialize database tables if they don't exist
export async function initializeDatabase() {
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

// Helper function to get a user by email
export async function getUserByEmail(email: string) {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

// Helper function to get a user by ID
export async function getUserById(id: number) {
  const result = await query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
}

// Helper function to get a profile by user ID
export async function getProfileByUserId(userId: number) {
  const result = await query('SELECT * FROM profiles WHERE user_id = $1', [userId]);
  return result.rows[0];
}

// Helper function to create or update a profile
export async function upsertProfile(userId: number, profileData: any) {
  const { name, email, phone, location, birthday, github, linkedin, website, education, skills, projects, experience } = profileData;

  // Check if profile exists
  const existingProfile = await getProfileByUserId(userId);

  if (existingProfile) {
    // Update existing profile
    const result = await query(
      `UPDATE profiles SET
        name = $1,
        email = $2,
        phone = $3,
        location = $4,
        birthday = $5,
        github = $6,
        linkedin = $7,
        website = $8,
        education = $9,
        skills = $10,
        projects = $11,
        experience = $12,
        updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $13
        RETURNING *`,
      [name, email, phone, location, birthday, github, linkedin, website, education, skills, projects, experience, userId]
    );
    return result.rows[0];
  } else {
    // Create new profile
    const result = await query(
      `INSERT INTO profiles (
        user_id, name, email, phone, location, birthday, github, linkedin, website, education, skills, projects, experience
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [userId, name, email, phone, location, birthday, github, linkedin, website, education, skills, projects, experience]
    );
    return result.rows[0];
  }
}

// Helper function to update profile status
export async function updateProfileStatus(userId: number, status: string) {
  const result = await query(
    'UPDATE profiles SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 RETURNING *',
    [status, userId]
  );
  return result.rows[0];
}

// Helper function to get all users with their profiles
export async function getAllUsersWithProfiles() {
  const result = await query(`
    SELECT u.*, p.*
    FROM users u
    LEFT JOIN profiles p ON u.id = p.user_id
  `);
  return result.rows;
}

// Helper function to clean up expired sessions
export async function cleanupExpiredSessions() {
  const result = await query('DELETE FROM sessions WHERE expires < NOW()');
  console.log(`Cleaned up ${result.rowCount} expired sessions`);
  return result.rowCount;
}

// Helper function to get active sessions count for a user
export async function getActiveSessionsCount(userId: number) {
  const result = await query(
    'SELECT COUNT(*) as count FROM sessions WHERE "userId" = $1 AND expires > NOW()',
    [userId]
  );
  return parseInt(result.rows[0].count);
}

// Helper function to revoke all sessions for a user
export async function revokeAllUserSessions(userId: number) {
  const result = await query('DELETE FROM sessions WHERE "userId" = $1', [userId]);
  console.log(`Revoked ${result.rowCount} sessions for user ${userId}`);
  return result.rowCount;
}
