import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import { prisma } from "./db/client";
import type { Session } from "next-auth";
import { initTRPC } from "@trpc/server";

// Context type
export const createContext = async ({
  req,
  res,
}: {
  req: any;
  res: any;
}) => {
  const session: Session | null = await getServerSession(req, res, authOptions);
  return { session, prisma };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize tRPC with context
const t = initTRPC.context<Context>().create();

// Export helpers
export const createTRPCRouter = t.router;

// Protected procedure: ensures user is logged in
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new Error("Not authenticated");
  }

  return next({
    ctx: {
      session: ctx.session,
      prisma: ctx.prisma,
    },
  });
});
