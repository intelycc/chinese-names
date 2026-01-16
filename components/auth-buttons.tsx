import type { User } from "@supabase/supabase-js"

import { signInWithGoogle, signOut } from "@/app/actions/auth"
import type { Locale } from "@/lib/copy"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"

function getUserLabel(user: User | null) {
  if (!user) return ""
  return (
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email ||
    "User"
  )
}

export async function AuthButtons({ locale }: { locale: Locale }) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null
  }

  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const copy =
    locale === "zh"
      ? { signIn: "使用 Google 登录", signOut: "退出登录", greeting: "你好" }
      : { signIn: "Sign in with Google", signOut: "Sign out", greeting: "Hi" }

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <>
          <span className="hidden text-sm text-muted-foreground sm:inline-flex">
            {copy.greeting}，{getUserLabel(user)}
          </span>
          <form action={signOut}>
            <Button variant="outline" size="sm" type="submit">
              {copy.signOut}
            </Button>
          </form>
        </>
      ) : (
        <form action={signInWithGoogle}>
          <Button variant="outline" size="sm" type="submit">
            {copy.signIn}
          </Button>
        </form>
      )}
    </div>
  )
}
