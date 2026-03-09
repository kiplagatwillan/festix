import { PrismaClient } from "@prisma/client";

/**
 * @desc Initialize Prisma Client as a Singleton.
 * In development, Prisma handles hot-reloads; in production,
 * it maintains a single connection pool.
 */
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
});

export default prisma;
