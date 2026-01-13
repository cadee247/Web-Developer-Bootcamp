// src/server/auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../db/client";
import bcrypt from "bcryptjs";

// NextAuth configuration options
export const authOptions = {
  providers: [
    // Credentials provider allows login with email + password
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },       // login form field for email
        password: { label: "Password", type: "password" }, // login form field for password
      },
      async authorize(credentials) {
        // Ensure both email and password are provided
        if (!credentials?.email || !credentials?.password) return null;

        // Look up user in database by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // If no user found, return null (login fails)
        if (!user) return null;

        // Compare provided password with hashed password in DB
        const isValid = await bcrypt.compare(credentials.password, user.password);

        // If password is invalid, return null (login fails)
        if (!isValid) return null;

        // If valid, return user object (login succeeds)
        return user;
      },
    }),
  ],

  // Use JWT-based sessions instead of database sessions
  session: { strategy: "jwt" },

  // Custom sign-in page route
  pages: { signIn: "/login" },
};

// Export configuration for NextAuth
export default authOptions;