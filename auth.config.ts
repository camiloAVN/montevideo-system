import type { NextAuthConfig } from "next-auth"

// Edge-compatible auth config — no bcrypt, no Prisma, no native modules.
// Used by middleware.ts. The full config (with adapter + Credentials provider) lives in auth.ts.
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
    updateAge: 60 * 60,
  },
  cookies: {
    sessionToken: {
      options: {
        httpOnly: true,
        sameSite: 'strict' as const,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
        token.iat = Math.floor(Date.now() / 1000)
      }
      const tokenAge = Math.floor(Date.now() / 1000) - ((token.iat as number) || 0)
      if (tokenAge > 24 * 60 * 60) {
        return { ...token, expired: true }
      }
      return token
    },
    async session({ session, token }) {
      if (token.expired) {
        return { ...session, user: undefined, expires: new Date(0).toISOString() }
      }
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string | null
        session.user.image = token.picture as string | null
      }
      return session
    },
    async signIn({ user }) {
      if (!user?.email) return false
      return true
    },
  },
  events: {
    async signIn({ user }) {
      console.info(`[AUTH] Sign in event: ${user.email}`)
    },
    async signOut(message) {
      if ('token' in message) {
        console.info(`[AUTH] Sign out event: ${message.token?.email}`)
      }
    },
  },
  providers: [],
}
