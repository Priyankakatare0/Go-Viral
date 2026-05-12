import "server-only"

import { createClient } from "@supabase/supabase-js"
import { getServerSupabaseEnv } from "@/lib/env/server"

// Admin client with service role/secret key for privileged operations
// WARNING: This should ONLY be used in server-side code, never exposed to client
export function createAdminClient() {
  const { url, serviceRoleKey } = getServerSupabaseEnv()

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
