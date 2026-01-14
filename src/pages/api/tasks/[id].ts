import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth"; // import Session type
import authOptions from "../auth/[...nextauth]";
import { prisma } from "../../../server/db";

// Define response type
type ResponseData = { error: string } | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Tell TypeScript the session will match NextAuth Session
  const session = (await getServerSession(req, res, authOptions)) as Session | null;

  // Now TypeScript knows session.user exists
  if (!session?.user?.email) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  if (req.method === "DELETE") {
    const taskId = Number(req.query.id);
    if (!taskId) return res.status(400).json({ error: "Invalid task ID" });

    await prisma.task.deleteMany({
      where: { id: taskId, userId: user.id },
    });

    return res.status(200).json({ message: "Task deleted" });
  }

  return res.status(405).end();
}
