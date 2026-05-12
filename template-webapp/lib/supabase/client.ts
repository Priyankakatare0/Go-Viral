import { createBrowserClient } from "@supabase/ssr"
import { getPublicSupabaseEnv } from "@/lib/env/public"

const { url, anonKey } = getPublicSupabaseEnv()

export const supabase = createBrowserClient(
  url,
  anonKey,
)
