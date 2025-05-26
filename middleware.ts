import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const sessionToken = request.cookies.get('session-token')?.value

  // Protected routes that require authentication
  const protectedPaths = ['/dashboard', '/profile', '/resume', '/interview', '/admin']
  const isProtectedPath = protectedPaths.some(protectedPath =>
    path === protectedPath || path.startsWith(`${protectedPath}/`)
  )

  // Auth routes that should redirect to dashboard if already authenticated
  const authRoutes = ['/signin']
  const isAuthRoute = authRoutes.includes(path)

  // If accessing a protected route without a session token, redirect to signin
  if (isProtectedPath && !sessionToken) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // If accessing auth routes with a session token, redirect to dashboard
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth (auth API routes)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
