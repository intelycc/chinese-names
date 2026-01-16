import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables.")
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        try {
          cookieStore.set({
            name,
            value,
            ...(options as CookieOptions),
            path: options?.path ?? "/",
          })
        } catch (error) {
          console.error("Unable to set Supabase cookie", error)
        }
      },
      remove(name, options) {
        try {
          cookieStore.set({
            name,
            value: "",
            ...(options as CookieOptions),
            path: options?.path ?? "/",
          })
        } catch (error) {
          console.error("Unable to remove Supabase cookie", error)
        }
      },
    },
  })
}
