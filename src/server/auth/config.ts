import { PrismaAdapter } from "@auth/prisma-adapter";
import type { DefaultSession, AuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

import { prisma } from "~/server/db"; // ✅ corrected export

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authConfig: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  adapter: PrismaAdapter(prisma), // ✅ use prisma here
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
};
