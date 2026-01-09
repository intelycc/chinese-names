'use client'

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { BookOpen, Info, Languages } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { explainerCopy, type Locale } from "@/lib/copy"

type Explanation = {
  name?: string
  pinyin?: string
  meaning?: string
  phonetics?: string
  structure?: string
  culture?: string
  wuxing?: string
}

type NameExplainerProps = {
  locale: Locale
  onLocaleChange?: (locale: Locale) => void
}

export function NameExplainer({ locale, onLocaleChange }: NameExplainerProps) {
  const [name, setName] = useState("")
  const [context, setContext] = useState("")
  const [explanation, setExplanation] = useState<Explanation | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const t = explainerCopy[locale]
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleLocaleChange = (code: Locale) => {
    if (onLocaleChange) {
      onLocaleChange(code)
      return
    }
    const params = new URLSearchParams(searchParams)
    params.set("lang", code)
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) {
      setError(t.requiredName)
      return
    }

    setIsLoading(true)
    setError(null)
    setExplanation(null)

    try {
      const response = await fetch("/api/explain-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          context: context || undefined,
          locale,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.error || "Failed to explain name")
      }

      setExplanation(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to explain name")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                <BookOpen className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">{t.title}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-1">
                {(["en", "zh"] as const).map((code) => (
                  <Button
                    key={code}
                    type="button"
                    size="sm"
                    variant={locale === code ? "default" : "outline"}
                    onClick={() => handleLocaleChange(code)}
                  >
                    {code === "en" ? "English" : "中文"}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <CardDescription>{t.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">{t.name}</Label>
              <Input
                id="name"
                placeholder={t.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">{t.context}</Label>
              <Textarea
                id="context"
                placeholder={t.contextPlaceholder}
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>

            {error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>{t.info}</span>
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? `${t.submit}...` : t.submit}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setName("")
                  setContext("")
                  setExplanation(null)
                  setError(null)
                }}
              >
                {t.reset}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {explanation && (
        <Card className="border-secondary/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-secondary/10 text-secondary-foreground">
                <BookOpen className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg">{t.results}</CardTitle>
            </div>
            {explanation.name && (
              <CardDescription className="text-base font-semibold text-foreground">{explanation.name}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {explanation.pinyin && <InfoRow label={t.pinyin} value={explanation.pinyin} />}
            {explanation.meaning && <InfoRow label={t.meaning} value={explanation.meaning} />}
            {explanation.phonetics && <InfoRow label={t.phonetics} value={explanation.phonetics} />}
            {explanation.structure && <InfoRow label={t.structure} value={explanation.structure} />}
            {explanation.culture && <InfoRow label={t.culture} value={explanation.culture} />}
            {explanation.wuxing && <InfoRow label={t.wuxing} value={explanation.wuxing} />}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 rounded-lg border border-border/60 bg-card/50 p-3">
      <div className="text-sm font-semibold">{label}</div>
      <p className="text-sm text-muted-foreground leading-relaxed">{value}</p>
    </div>
  )
}
