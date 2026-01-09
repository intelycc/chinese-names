'use client'

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Sparkles, Wand2, Info, Languages } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { generatorCopy, type Locale } from "@/lib/copy"

type Suggestion = {
  name: string
  pinyin?: string
  meaning?: string
  rationale?: string
}

type Analysis = {
  phonetics?: string
  structure?: string
  culture?: string
  wuxing?: string
}

const expectationOptions = ["知书达理", "平安顺遂", "气宇轩昂", "才情出众", "坚韧勇敢", "温润儒雅"]

type NameGeneratorProps = {
  locale: Locale
  onLocaleChange?: (locale: Locale) => void
}

export function NameGenerator({ locale, onLocaleChange }: NameGeneratorProps) {
  const [surname, setSurname] = useState("")
  const [gender, setGender] = useState<"male" | "female">("male")
  const [birthDateTime, setBirthDateTime] = useState("")
  const [expectations, setExpectations] = useState<string[]>([])
  const [avoidChars, setAvoidChars] = useState("")
  const [nameLengthPreference, setNameLengthPreference] = useState<"single" | "double">("double")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const t = generatorCopy[locale]
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

  const selectedExpectations = useMemo(() => new Set(expectations), [expectations])

  const toggleExpectation = (item: string) => {
    setExpectations((prev) => (prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!surname.trim()) {
      setError(t.requiredSurname)
      return
    }
    if (!gender) {
      setError(t.requiredGender)
      return
    }

    setIsLoading(true)
    setError(null)
    setSuggestions([])
    setAnalysis(null)

    try {
      const response = await fetch("/api/generate-names", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          surname,
          gender,
          birthDateTime: birthDateTime || undefined,
          expectations,
          avoidChars: avoidChars || undefined,
          nameLengthPreference,
          locale,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "生成失败，请稍后再试")
      }

      setSuggestions(data?.suggestions || [])
      setAnalysis(data?.analysis || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请稍后重试")
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
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Wand2 className="h-5 w-5" />
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
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="surname">{t.surname}</Label>
                <Input
                  id="surname"
                  placeholder={t.surnamePlaceholder}
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>{t.gender}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "male", label: t.genderMale },
                    { value: "female", label: t.genderFemale },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={gender === option.value ? "default" : "outline"}
                      onClick={() => setGender(option.value as "male" | "female")}
                      className="w-full"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth">{t.birth}</Label>
                <Input
                  id="birth"
                  type="datetime-local"
                  value={birthDateTime}
                  onChange={(e) => setBirthDateTime(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">{t.birthHint}</p>
              </div>
              <div className="space-y-2">
                <Label>{t.length}</Label>
                <RadioGroup
                  value={nameLengthPreference}
                  onValueChange={(value) => setNameLengthPreference(value as "single" | "double")}
                  className="flex gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="single" id="single" />
                    <Label htmlFor="single">{t.single}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="double" id="double" />
                    <Label htmlFor="double">{t.double}</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t.expectationsLabel}</Label>
              <div className="flex flex-wrap gap-2">
                {expectationOptions.map((item) => {
                  const isActive = selectedExpectations.has(item)
                  return (
                    <Button
                      key={item}
                      type="button"
                      variant={isActive ? "default" : "outline"}
                      onClick={() => toggleExpectation(item)}
                      size="sm"
                      className={cn(
                        "rounded-full",
                        isActive ? "bg-primary text-primary-foreground" : "bg-background",
                      )}
                    >
                      {item}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avoid">{t.avoid}</Label>
              <Textarea
                id="avoid"
                placeholder={t.avoidPlaceholder}
                value={avoidChars}
                onChange={(e) => setAvoidChars(e.target.value)}
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
                <Sparkles className="h-4 w-4 mr-2" />
                {isLoading ? `${t.submit}...` : t.submit}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSurname("")
                  setGender("male")
                  setBirthDateTime("")
                  setExpectations([])
                  setAvoidChars("")
                  setNameLengthPreference("double")
                  setSuggestions([])
                  setAnalysis(null)
                  setError(null)
                }}
              >
                {t.reset}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {(suggestions.length > 0 || analysis) && (
        <div className="space-y-4">
          {suggestions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-semibold">{t.recommendations}</h3>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {suggestions.map((item, index) => (
                  <Card key={`${item.name}-${index}`} className="border-primary/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{item.name}</CardTitle>
                        <Badge variant="secondary">
                          {t.recommendationBadge} {index + 1}
                        </Badge>
                      </div>
                      <CardDescription className="space-y-1 text-sm">
                        {item.pinyin && <div>{locale === "zh" ? "拼音：" : "Pinyin: "}{item.pinyin}</div>}
                        {item.meaning && <div>{locale === "zh" ? "寓意：" : "Meaning: "}{item.meaning}</div>}
                      </CardDescription>
                    </CardHeader>
                    {item.rationale && (
                      <CardContent className="text-sm text-muted-foreground">{item.rationale}</CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {analysis && (
            <Card className="border-accent/30">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-accent/10 text-accent-foreground">
                    <Wand2 className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-lg">{t.analysis}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                <AnalysisItem title={t.phonetics} body={analysis.phonetics} />
                <AnalysisItem title={t.structure} body={analysis.structure} />
                <AnalysisItem title={t.culture} body={analysis.culture} />
                <AnalysisItem title={t.wuxing} body={analysis.wuxing} />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

function AnalysisItem({ title, body }: { title: string; body?: string }) {
  if (!body) return null
  return (
    <div className="space-y-1 rounded-lg border border-border/60 bg-card/50 p-3">
      <div className="text-sm font-semibold">{title}</div>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  )
}
