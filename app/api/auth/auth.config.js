// app/api/auth/auth.config.js

import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "../../../lib/mongodb";
import AdminUser from "../../../models/AdminUser";
import bcrypt from "bcryptjs";
export const dynamic = 'force-dynamic'; 
if (process.env.NODE_ENV === 'development') {
  console.log('Auth configuration loaded');
  console.log('Base URL:', process.env.NEXTAUTH_URL);
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide both email and password');
        }

        try {
          await connectMongoDB();

          const email = credentials.email.toLowerCase().trim();
          console.log("Attempting authentication for:", email);

          const adminUser = await AdminUser.findOne({ email }).select('+password');
          
          if (!adminUser) {
            console.log("No admin user found for email:", email);
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            adminUser.password
          );

          if (!passwordMatch) {
            console.log("Password mismatch for user:", email);
            return null;
          }

          const userObject = adminUser.toObject();
          delete userObject.password;

          return {
            ...userObject,
            id: userObject._id.toString(),
            role: "AdminUser",
            email: userObject.email,
          };

        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error('An error occurred during authentication');
        }
      }
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl;
    }
  },
  pages: {
    signIn: "/",
    error: '/auth/error',
    signOut: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};