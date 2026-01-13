// Import the PrismaClient class from the generated Prisma client package.
// This gives us access to the database through strongly-typed queries.
import { PrismaClient } from "@prisma/client";

// Create a single instance of PrismaClient.
// This instance will be used throughout the app to interact with the database.
// Best practice: avoid creating multiple instances to prevent connection issues.
export const prisma = new PrismaClient();