// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import { authOptions } from "../auth.config";

// Create and export handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// Export config for dynamic API route
export const dynamic = 'force-dynamic';