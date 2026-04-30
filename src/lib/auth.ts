// src/lib/auth.ts
// ─────────────────────────────────────────────
// NextAuth v5 (Auth.js) configuration.
// Supports:
//   • Email/password (Credentials provider + bcrypt)
//   • Google OAuth  (add GOOGLE_CLIENT_ID/SECRET to .env)
//
// The Prisma adapter writes sessions and accounts to
// the `users` Postgres schema automatically.
// ─────────────────────────────────────────────

import NextAuth, { type DefaultSession } from 'next-auth'
import { PrismaAdapter }                 from '@auth/prisma-adapter'
import Credentials                       from 'next-auth/providers/credentials'
import Google                            from 'next-auth/providers/google'
import bcrypt                            from 'bcryptjs'
import { z }                             from 'zod'
import { prisma }                        from '@/lib/prisma'

// ─── Extend session types ────────────────────
// Add `id` and `role` to the session user so
// Server Components can read them without an
// extra database round-trip.

declare module 'next-auth' {
  interface Session {
    user: { id: string; role: string } & DefaultSession['user']
  }
  interface User {
    role: string
  }
}

// ─── Auth config ─────────────────────────────

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: 'jwt',   // JWT is required when using Credentials provider
    maxAge:   60 * 60 * 24 * 30,   // 30 days
  },

  pages: {
    signIn:  '/login',
    signOut: '/login',
    error:   '/login',
  },

  providers: [

    // ── Credentials (email + password) ───────
    Credentials({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = z.object({
          email:    z.string().email(),
          password: z.string().min(8),
        }).safeParse(credentials)

        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where:  { email: parsed.data.email },
          select: { id: true, email: true, passwordHash: true, role: true, firstName: true, lastName: true },
        })

        if (!user || !user.passwordHash) return null

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash)
        if (!valid) return null

        return {
          id:    user.id,
          email: user.email,
          name:  [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email,
          role:  user.role,
        }
      },
    }),

    // ── Google OAuth ─────────────────────────
    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    // Inject id + role into the JWT on sign-in
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id
        token.role = user.role ?? 'CUSTOMER'
      }
      return token
    },

    // Expose id + role on the session object
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id   = token.id   as string
        session.user.role = token.role as string
      }
      return session
    },
  },
})