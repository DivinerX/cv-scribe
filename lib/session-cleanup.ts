import { cleanupExpiredSessions } from '@/utils/db'

// Function to clean up expired sessions
export async function performSessionCleanup() {
  try {
    const deletedCount = await cleanupExpiredSessions()
    console.log(`Session cleanup completed. Removed ${deletedCount} expired sessions.`)
    return deletedCount
  } catch (error) {
    console.error('Session cleanup failed:', error)
    throw error
  }
}

// Function to schedule periodic cleanup (call this in your app startup)
export function scheduleSessionCleanup() {
  // Clean up expired sessions every hour
  const CLEANUP_INTERVAL = 60 * 60 * 1000 // 1 hour in milliseconds
  
  setInterval(async () => {
    try {
      await performSessionCleanup()
    } catch (error) {
      console.error('Scheduled session cleanup failed:', error)
    }
  }, CLEANUP_INTERVAL)
  
  console.log('Session cleanup scheduled to run every hour')
}

// Function to clean up sessions for a specific user (useful for logout all devices)
export async function cleanupUserSessions(userId: number) {
  try {
    const { revokeAllUserSessions } = await import('@/utils/db')
    const deletedCount = await revokeAllUserSessions(userId)
    console.log(`Revoked ${deletedCount} sessions for user ${userId}`)
    return deletedCount
  } catch (error) {
    console.error(`Failed to cleanup sessions for user ${userId}:`, error)
    throw error
  }
}
