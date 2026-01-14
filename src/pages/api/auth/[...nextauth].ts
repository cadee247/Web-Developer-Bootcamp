// src/pages/api/auth/[...nextauth].ts

import NextAuth from "next-auth";
import type { AuthOptions, User } from "next-auth"; // type-only import
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../server/db";
import bcrypt from "bcryptjs";

// Secret for JWT signing
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "randomfallbacksecret";

// ✅ Define a type that matches what NextAuth expects
interface MyUser extends User {
  id: string; // id must be string
  name: string | null;
  email: string | null;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
async authorize(
  credentials: Record<"email" | "password", string> | undefined
): Promise<User | null> {
  if (!credentials?.email || !credentials?.password) return null;

  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });
  if (!user) return null;

  const valid = await bcrypt.compare(credentials.password, user.password);
  if (!valid) return null;

  // Return a new object that matches NextAuth's User type
  return {
    id: user.id.toString(), // ✅ convert number to string
    name: user.name,
    email: user.email,
  };
}

    }),
  ],
  session: {
    strategy: "jwt", // literal type is fine
  },
  pages: {
    signIn: "/login",
  },
  secret: NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
