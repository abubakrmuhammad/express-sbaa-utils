import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

/**
 * Typed environment variables parsed from `.env` files
 *
 * Uses `zod` for schema validation
 */
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url().optional(),
    PORT: z.coerce.number(),
    NODE_ENV: z.enum(["development", "production", "test"]),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});
