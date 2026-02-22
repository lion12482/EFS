import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  WEB_BASE_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_DIR: z.string().default(".data")
});

export const env = envSchema.parse(process.env);
