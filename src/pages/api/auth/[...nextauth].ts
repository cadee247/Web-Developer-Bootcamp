// src/pages/api/auth/[...nextauth].ts

// Import NextAuth core library for authentication handling
import NextAuth from "next-auth";

// Import the Credentials provider (username/password style login)
import CredentialsProvider from "next-auth/providers/credentials";

// Import Prisma client instance for database queries
import { prisma } from "../../../server/db";

// Import bcrypt for secure password hashing and comparison
import bcrypt from "bcryptjs";

// Define NextAuth configuration options
export const authOptions = {
  // Configure authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials", // Label for the provider
      credentials: {
        email: { label: "Email", type: "text" },       // Email input field
        password: { label: "Password", type: "password" }, // Password input field
      },
      // Custom authorization logic for validating user credentials
      async authorize(credentials) {
        // Ensure both email and password are provided
        if (!credentials?.email || !credentials?.password) return null;

        // Look up user by email in the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // If no user is found, deny access
        if (!user) return null;

        // Compare provided password with hashed password in DB
        const valid = await bcrypt.compare(credentials.password, user.password);

        // If password is invalid, deny access
        if (!valid) return null;

        // If valid, return the user object (this becomes part of the session)
        return user;
      },
    }),
  ],

  // Configure session handling
  session: {
    strategy: "jwt", // Use JSON Web Tokens instead of database sessions
  },

  // Custom pages for authentication flow
  pages: {
    signIn: "/login", // Redirect users to custom login page
  },
};

// Export NextAuth with the defined options
export default NextAuth(authOptions);