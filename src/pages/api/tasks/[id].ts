// Import helper to retrieve the current authenticated session from NextAuth
import { getServerSession } from "next-auth/next";

// Import NextAuth configuration options
import authOptions from "../auth/[...nextauth]";

// Import Prisma client instance for database queries
import { prisma } from "../../../server/db";

// Default export: API route handler for task deletion
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
  if (!user) return res.status(401).json({ error: "User not found" });

  // Handle DELETE requests for removing tasks
  if (req.method === "DELETE") {
    // Extract task ID from query parameters and convert to number
    const taskId = Number(req.query.id);

    // Validate task ID (must be a valid number)
    if (!taskId) return res.status(400).json({ error: "Invalid task ID" });

    // Delete the task belonging to the authenticated user
    await prisma.task.deleteMany({
      where: { id: taskId, userId: user.id },
    });

    // Return 204 No Content on successful deletion
    return res.status(204).end();
  }

  // If request method is not DELETE, return 405 Method Not Allowed
  return res.status(405).end();
}