import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { pool } from '@/lib/db';
import { FieldPacket, RowDataPacket } from 'mysql2';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [credentials?.email]) as [RowDataPacket[], FieldPacket[]];
        
        if (rows.length === 0) {
          throw new Error('No user found with this email');
        }

        const user = rows[0];
        const isValid = await bcrypt.compare(credentials?.password ?? '', user.password);

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
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl;
    },
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
