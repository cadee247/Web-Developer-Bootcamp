import NextAuth from "next-auth";
import type { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../db/client";
import bcrypt from "bcryptjs";

// Secret for JWT
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "randomfallbacksecret";

// Define a User type that NextAuth expects
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
      ): Promise<MyUser | null> {
        if (!credentials?.email || !credentials?.password) return null;

        // Fetch user from database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        // Verify password
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        // ✅ Return only what NextAuth expects, id as string
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
