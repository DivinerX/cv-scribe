import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    OPENAI_API_KEY: z.string().min(5),
    DATABASE_URL: z.string().min(5),
    GOOGLE_CLIENT_ID: z.string().min(5),
    GOOGLE_CLIENT_SECRET: z.string().min(5),
    NEXTAUTH_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(5)
  },
  client: {
    // No client-side environment variables needed
  },
  runtimeEnv: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET
  },
});