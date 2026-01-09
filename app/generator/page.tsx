import React from "react"
import Link from "next/link"

import { generatorCopy, type Locale } from "@/lib/copy"
import { NameGenerator } from "@/components/name-generator"

export default function GeneratorPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = React.use(searchParams)
  const localeParam = Array.isArray(params?.lang) ? params.lang[0] : params?.lang
  const locale: Locale = localeParam === "zh" ? "zh" : "en"
  const t = generatorCopy[locale]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={{ pathname: "/", query: { lang: locale } }}>
            <span className="text-sm text-muted-foreground hover:text-primary transition-colors">{t.backHome}</span>
          </Link>
          <Link href={{ pathname: "/", query: { lang: locale } }} className="font-semibold">
            ChineseNames.ai
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-3 text-center">
            <p className="text-sm uppercase tracking-wide text-primary font-semibold">AI Chinese Name Generator</p>
            <h1 className="text-3xl md:text-4xl font-bold">
              {locale === "zh" ? "输入偏好，生成中文名方案" : "Input preferences to generate Chinese names"}
            </h1>
            <p className="text-muted-foreground">
              {locale === "zh"
                ? "支持姓氏、性别、出生时辰、父母期望、避讳字、单/双字偏好，输出推荐名单与音律、字形、文化、五行解析。"
                : "Supports surname, gender, birth datetime, parental wishes, avoid list, and name length, with recommendations plus phonetics, structure, culture, and Wuxing analysis."}
            </p>
          </div>
          <NameGenerator locale={locale} />
        </div>
      </main>
    </div>
  )
}
