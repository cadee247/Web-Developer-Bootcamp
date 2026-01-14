import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { prisma } from "../../server/db";
import authOptions from "./auth/[...nextauth]";

// Import the type for your session
import type { Session } from "next-auth";

// Define the Task type
type Task = {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
  createdAt: Date;
};

type ResponseData = Task[] | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const session = (await getServerSession(req, res, authOptions)) as Session | null;

  if (!session?.user?.email) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  if (req.method === "GET") {
    const tasks = await prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        completed: true,
        userId: true,
        createdAt: true,
      },
    });
    return res.status(200).json(tasks);
  }

  if (req.method === "POST") {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title required" });

    const newTask = await prisma.task.create({
      data: { title, userId: user.id },
      select: {
        id: true,
        title: true,
        completed: true,
        userId: true,
        createdAt: true,
      },
    });
    return res.status(201).json([newTask]);

  }

  return res.status(405).end();
}
