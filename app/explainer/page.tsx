import React from "react"
import Link from "next/link"

import { explainerCopy, type Locale } from "@/lib/copy"
import { NameExplainer } from "@/components/name-explainer"

export default function ExplainerPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = React.use(searchParams)
  const localeParam = Array.isArray(params?.lang) ? params.lang[0] : params?.lang
  const locale: Locale = localeParam === "zh" ? "zh" : "en"
  const t = explainerCopy[locale]

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
            <p className="text-sm uppercase tracking-wide text-primary font-semibold">AI Chinese Name Explainer</p>
            <h1 className="text-3xl md:text-4xl font-bold">
              {locale === "zh" ? "输入中文名，获取含义解读" : "Enter your Chinese name for a full explanation"}
            </h1>
            <p className="text-muted-foreground">
              {locale === "zh"
                ? "支持读音、含义、字形、文化出处与五行解读，保持名字为中文，解析语言随页面切换。"
                : "Get pronunciation, meaning, structure, cultural references, and Wuxing insights. Name stays in Chinese; explanation follows the page language."}
            </p>
          </div>
          <NameExplainer locale={locale} />
        </div>
      </main>
    </div>
  )
}
