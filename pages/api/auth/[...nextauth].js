import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from '../../../lib/dbConnect'
import User from '../../../models/User'
import bcrypt from 'bcryptjs'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        await dbConnect()

        try {
          const user = await User.findOne({ email: credentials.email })
          
          if (!user || !user.isVerified) {
            return null
          }

          const isPasswordMatch = await bcrypt.compare(credentials.password, user.password)
          
          if (!isPasswordMatch) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})