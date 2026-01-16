import { NextResponse } from "next/server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error_description") ?? requestUrl.searchParams.get("error")
  const next = requestUrl.searchParams.get("next") ?? "/"
  const nextPath = next.startsWith("http") ? "/" : next
  const nextUrl = new URL(nextPath, requestUrl.origin)

  if (error) {
    console.error("Supabase auth callback error", error)
    return NextResponse.redirect(new URL("/auth/error", requestUrl.origin))
  }

  if (code) {
    try {
      const supabase = await createServerSupabaseClient()
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error("Error exchanging Supabase auth code", exchangeError)
        return NextResponse.redirect(new URL("/auth/error", requestUrl.origin))
      }
    } catch (clientError) {
      console.error("Error creating Supabase server client", clientError)
      return NextResponse.redirect(new URL("/auth/error", requestUrl.origin))
    }
  }

  return NextResponse.redirect(nextUrl)
}
