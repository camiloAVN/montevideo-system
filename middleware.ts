import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  // Block unauthenticated calls to all API routes except the auth endpoints.
  // Individual routes also call canViewModule(), but this catches any route
  // that might accidentally omit that check.
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    if (!isLoggedIn) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
  }

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard') && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.url))
  }

  // Redirect authenticated users away from login page
  if (pathname === '/login' && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', req.url))
  }
})

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/api/:path*'],
}
