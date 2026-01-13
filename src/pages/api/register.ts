// src/pages/register.ts

// Import Prisma client instance for database queries
import { prisma } from "../../server/db";

// Import bcrypt for secure password hashing
import bcrypt from "bcryptjs";

// Default export: API route handler for user registration
export default async function handler(req, res) {
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
    // Conflict: user already registered with this email
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