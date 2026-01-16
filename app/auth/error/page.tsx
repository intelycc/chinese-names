import Link from "next/link"
import { AlertTriangle } from "lucide-react"

import { signInWithGoogle } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md space-y-5 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Authentication error</h1>
          <p className="text-sm text-muted-foreground">
            Google 登录出错，请重试或稍后再试。We could not complete the Google sign-in request.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <form action={signInWithGoogle}>
            <Button size="sm" type="submit">
              Try again
            </Button>
          </form>
          <Link href="/">
            <Button size="sm" variant="outline">
              Back to home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
