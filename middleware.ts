import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

// Use only the edge-compatible config — no bcrypt, no Prisma, no native modules.
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  // Block unauthenticated calls to all API routes except the auth endpoints.
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
