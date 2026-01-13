// Import helper to retrieve the current authenticated session from NextAuth
import { getServerSession } from "next-auth/next";

// Import NextAuth configuration options
import authOptions from "./auth/[...nextauth]";

// Import Prisma client instance for database queries
import { prisma } from "../../server/db"; // Ensure this path points correctly to your Prisma client

// Default export: API route handler for task management (GET and POST)
export default async function handler(req, res) {
  // Retrieve the current session using NextAuth
  const session = await getServerSession(req, res, authOptions);

  // If no session or no user email is found, return 401 Unauthorized
  if (!session?.user?.email) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // Look up the user in the database by their email
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // If user does not exist in DB, return 401 Unauthorized
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  // Handle GET requests: fetch all tasks for the authenticated user
  if (req.method === "GET") {
    const tasks = await prisma.task.findMany({
      where: { userId: user.id },          // Only tasks belonging to this user
      orderBy: { createdAt: "desc" },      // Sort tasks by newest first
    });
    return res.status(200).json(tasks);    // Return tasks as JSON
  }

  // Handle POST requests: create a new task for the authenticated user
  if (req.method === "POST") {
    const { title } = req.body;

    // Validate required field: title must be provided
    if (!title) return res.status(400).json({ error: "Title required" });

    // Create a new task linked to the authenticated user
    const newTask = await prisma.task.create({
      data: {
        title,          // Task title from request body
        userId: user.id // Associate task with current user
      },
    });

    // Return the newly created task with 201 Created status
    return res.status(201).json(newTask);
  }

  // If request method is not GET or POST, return 405 Method Not Allowed
  return res.status(405).end();
}