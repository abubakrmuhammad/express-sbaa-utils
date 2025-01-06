import consola from "consola";
import { PrismaClient } from "@prisma/client";
import { env } from "@/env";

/**
 * Global instance of PrismaClient for database operations
 *
 * Configured to log different levels based on `NODE_ENV`:
 * - Development: info, warn, error
 * - Production: error only
 */
export const db = new PrismaClient({
  log:
    env.NODE_ENV === "development"
      ? ["info", "warn", "error"]
      : ["error"],
});

/**
 * Tests the database connection by attempting to connect
 *
 * If the connection fails, the process will exit with code `1`
 * If successful, logs a success message
 */
export async function testDbConnection() {
  try {
    await db.$connect();
    consola.success("Database connection successful");
  } catch (error) {
    consola.error("Database connection failed", error);

    consola.info("Exiting process");
    process.exit(1);
  }
}

