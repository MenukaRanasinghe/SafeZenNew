import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { pool } from '@/lib/db';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const [rows] = await pool.execute(
          'SELECT * FROM users WHERE email = ?',
          [credentials.email]
        );

        if (rows.length === 0) {
          throw new Error('No user found with this email');
        }

        const user = rows[0];
        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (isValid) {
          return { id: user.id, email: user.email, role: user.role };
        } else {
          throw new Error('Invalid credentials');
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async redirect({ url, baseUrl, token }) {
      console.log('Redirect Callback:', { url, baseUrl, token });
      if (token) {
        switch (token.role) {
          case 'Admin':
            return `${baseUrl}/admin`;
          case 'Leader':
            return `${baseUrl}/leader`;
          case 'Member':
            return `${baseUrl}/member`;
          default:
            return `${baseUrl}/`;
        }
      }
      return baseUrl;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.email = token.email;
      }
      console.log('Session Callback:', session);
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.email = user.email;
      }
      console.log('JWT Callback:', token);
      return token;
    },
  },
});

export { handler as GET, handler as POST };
