# Custom Authentication System

This application uses a custom Google OAuth authentication system instead of NextAuth.js for better control and simplicity.

## Architecture

### Database Tables

1. **users** - Stores user information from Google OAuth
   - `id` (Primary Key)
   - `email` (Unique)
   - `name`
   - `image` (Profile picture URL)
   - `created_at`

2. **profiles** - Extended user profile information
   - `id` (Primary Key)
   - `user_id` (Foreign Key to users)
   - `status` ('allowed', 'not_allowed') - Controls access
   - Profile fields (phone, location, education, etc.)

3. **sessions** - Custom session management
   - `id` (Primary Key)
   - `userId` (Foreign Key to users)
   - `sessionToken` (Unique session identifier)
   - `expires` (Session expiration timestamp)
   - `created_at`

### API Routes

- `GET /api/auth/google` - Initiates Google OAuth flow
- `GET /api/auth/callback/google` - Handles OAuth callback
- `GET /api/auth/me` - Returns current user information
- `POST /api/auth/logout` - Logs out user and clears session

### Authentication Flow

1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. Google redirects back to `/api/auth/callback/google`
4. System creates/updates user in database
5. Creates session and sets secure HTTP-only cookie
6. Redirects to dashboard (if approved) or not_allowed page

## Usage

### Client-Side

```tsx
import { useUser } from '@/components/user-provider'

function MyComponent() {
  const { user, isLoading, logout } = useUser()
  
  if (isLoading) return <div>Loading...</div>
  if (!user) return <div>Not authenticated</div>
  
  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Server-Side (API Routes)

```tsx
import { getCurrentSession } from '@/lib/auth'

export async function GET() {
  const session = await getCurrentSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Use session.user.id, session.user.email, etc.
  return NextResponse.json({ data: 'Protected data' })
}
```

## Database Management

### Migration
```bash
pnpm migrate-auth
```

### Session Cleanup
```bash
pnpm cleanup-sessions
```

### Initialize Database
```bash
pnpm init-db
```

## Security Features

- **HTTP-only cookies** - Session tokens not accessible via JavaScript
- **Secure cookies** - HTTPS-only in production
- **Session expiration** - 30-day expiration with automatic cleanup
- **CSRF protection** - State parameter validation in OAuth flow
- **Database indexes** - Optimized queries for session lookups

## Environment Variables

Required environment variables:

```env
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret
```

## Admin Features

- Users with email `sittnerkalid@gmail.com` are automatically admins
- New users default to `not_allowed` status
- Admins can approve/reject users via the admin panel

## Maintenance

The system includes automatic session cleanup, but you can also run manual cleanup:

```bash
# Clean up expired sessions
pnpm cleanup-sessions

# View session statistics
node -e "
const { query } = require('./utils/db');
query('SELECT COUNT(*) FROM sessions WHERE expires > NOW()').then(r => 
  console.log('Active sessions:', r.rows[0].count)
);
"
```
