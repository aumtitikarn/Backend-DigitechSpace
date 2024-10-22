import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "../../../../lib/mongodb";
import AdminUser from "../../../../models/AdminUser"; // Ensure correct import
import bcrypt from "bcryptjs";

const authOption = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
      
        try {
          await connectMongoDB();
      
          // Debugging: Log the email and query result
          console.log("Querying for:", email);
      
          // Fetch user from AdminUser collection
          const adminUser = await AdminUser.findOne({ email });
      
          // Debugging: Log fetched adminUser
          console.log("Fetched adminUser:", adminUser);
      
          if (adminUser) {
            // Compare provided password with hashed password
            const passwordMatch = await bcrypt.compare(password, adminUser.password);
            if (passwordMatch) {
              return { ...adminUser.toObject(), role: "AdminUser" };
            } else {
              console.log("Password does not match.");
            }
          } else {
            console.log("No adminUser found.");
          }
      
          return null; // Return null if no match
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      }
      
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOption);
export { handler as GET, handler as POST };
