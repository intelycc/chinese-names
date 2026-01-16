"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { createServerSupabaseClient } from "@/lib/supabase/server"

async function getSiteUrl() {
  const headersList = await headers()
  const origin = headersList.get("origin")
  if (origin) return origin
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  const protocol = headersList.get("x-forwarded-proto") ?? "http"
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host")
  if (host) return `${protocol}://${host}`
  return "http://localhost:3000"
}

async function getReturnPath() {
  const headersList = await headers()
  const referer = headersList.get("referer")
  if (!referer) return "/"
  const refererUrl = new URL(referer)
  const path = `${refererUrl.pathname}${refererUrl.search}`
  if (path.startsWith("/auth")) return "/"
  return path || "/"
}

export async function signInWithGoogle() {
  let supabase
  try {
    supabase = await createServerSupabaseClient()
  } catch (error) {
    console.error("Missing Supabase configuration for sign-in", error)
    return redirect("/auth/error")
  }
  const siteUrl = await getSiteUrl()
  const callbackUrl = new URL("/auth/callback", siteUrl)
  const returnPath = await getReturnPath()

  if (returnPath) {
    callbackUrl.searchParams.set("next", returnPath)
  }

  const {
    data: { url },
    error,
  } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl.toString(),
    },
  })

  if (error) {
    console.error("Failed to start Google sign-in", error)
    return redirect("/auth/error")
  }

  if (url) {
    return redirect(url)
  }

  return redirect("/")
}

export async function signOut() {
  let supabase
  try {
    supabase = await createServerSupabaseClient()
  } catch (error) {
    console.error("Missing Supabase configuration for sign-out", error)
    return redirect("/")
  }
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Failed to sign out", error)
  }

  return redirect("/")
}
