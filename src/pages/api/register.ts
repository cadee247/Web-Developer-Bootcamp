// src/pages/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db";
import bcrypt from "bcryptjs";

// Define the shape of the response
type ResponseData =
  | { message: string; userId?: number }
  | { error: string };

// Default export: API route handler for user registration
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow POST requests; reject others with 405 Method Not Allowed
  if (req.method !== "POST") return res.status(405).end();

  // Extract name, email, and password from request body
  const { name, email, password } = req.body;

  // Validate required fields: email and password must be provided
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Check if a user with the same email already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ error: "User already exists" });
  }

  // Hash the password with bcrypt (salt rounds = 10)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user record in the database
  const user = await prisma.user.create({
    data: {
      name,                // Optional name field
      email,               // Unique email address
      password: hashedPassword, // Securely hashed password
    },
  });

  // Respond with success message and newly created user ID
  return res.status(201).json({ message: "User created", userId: user.id });
}
