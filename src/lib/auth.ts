import NextAuth, { type DefaultSession } from 'next-auth'
import { PrismaAdapter }                 from '@auth/prisma-adapter'
import Credentials                       from 'next-auth/providers/credentials'
import bcrypt                            from 'bcryptjs'
import { z }                             from 'zod'
import { prisma }                        from '@/lib/prisma'

// ─── Extend session types ────────────────────
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
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn:  '/login',
    signOut: '/login',
    error:   '/login',
  },
  providers: [
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
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id
        token.role = user.role ?? 'USER'
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id   = token.id   as string
        session.user.role = token.role as string
      }
      return session
    },
  },
})
  
