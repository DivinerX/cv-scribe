import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    SERVICE_ROLE_KEY: z.string().min(5),
    OPENAI_KEY: z.string().min(5)
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().min(5),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(5)
  },
  runtimeEnv: {
    SERVICE_ROLE_KEY: process.env.SERVICE_ROLE_KEY,
    OPENAI_KEY: process.env.OPENAI_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  },
});