import { NextResponse } from "next/server"

import type { Locale } from "@/lib/copy"

const OPENROUTER_MODEL = "deepseek/deepseek-v3.2-exp"

type ExplainRequest = {
  name?: string
  context?: string
  locale?: Locale
}

function extractContent(message: any): string | undefined {
  if (!message) return undefined

  const tryExtract = (value: any): string | undefined => {
    if (!value) return undefined
    if (typeof value === "string") return value
    if (typeof value?.text === "string") return value.text
    if (Array.isArray(value)) {
      return value
        .map((part) => tryExtract(part))
        .filter(Boolean)
        .join("\n")
    }
    if (typeof value === "object" && Array.isArray(value.content)) {
      return value.content
        .map((part: any) => tryExtract(part))
        .filter(Boolean)
        .join("\n")
    }
    if (typeof value?.content === "string") return value.content
    return undefined
  }

  return (
    tryExtract(message) ||
    tryExtract(message.content) ||
    tryExtract(message?.[0]) ||
    tryExtract(message?.message) ||
    tryExtract(message?.delta)
  )
}

function extractJson(content: string) {
  try {
    return JSON.parse(content)
  } catch {
    const match = content.match(/\{[\s\S]*\}/)
    if (match) {
      try {
        return JSON.parse(match[0])
      } catch {
        return null
      }
    }
    return null
  }
}

export async function POST(req: Request) {
  const body = (await req.json()) as ExplainRequest
  if (!body.name) {
    return NextResponse.json({ error: "请输入中文名" }, { status: 400 })
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "缺少 OPENROUTER_API_KEY" }, { status: 500 })
  }

  const referer = process.env.OPENROUTER_SITE_URL
  const siteTitle = process.env.OPENROUTER_SITE_NAME
  const locale: Locale = body.locale === "zh" ? "zh" : "en"
  const localeInstruction =
    locale === "zh"
      ? "解释字段（pinyin 可带声调；meaning/phonetics/structure/culture/wuxing）全部使用简体中文，名字保持中文。"
      : "Use English for meaning/phonetics/structure/culture/wuxing; keep the Chinese name in Chinese characters. Pinyin can include tone marks."

  const messages = [
    {
      role: "system",
      content: [
        "你是一位精通中文姓名学、音韵学、诗词文化、八字五行基础的姓名解读专家。",
        "只输出 JSON 对象，绝对不要输出推理、<think>、解释或 Markdown。不要写步骤，不要写多余文字。",
        'JSON 模板：{"name":"李白","pinyin":"Lǐ Bái","meaning":"描述名字含义","phonetics":"音律和平仄解读","structure":"字形结构与书写美感","culture":"引用诗词/典故的出处与原文","wuxing":"五行属性与补益说明"}',
        localeInstruction,
      ].join("\n"),
    },
    {
      role: "user",
      content: [
        `名字: ${body.name}`,
        body.context ? `补充说明: ${body.context}` : null,
        `输出语言: ${locale === "zh" ? "中文" : "English"}`,
      ]
        .filter(Boolean)
        .join("\n"),
    },
  ]

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        ...(referer ? { "HTTP-Referer": referer } : {}),
        ...(siteTitle ? { "X-Title": siteTitle } : {}),
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages,
        temperature: 0.4,
        max_tokens: 900,
        response_format: { type: "json_object" },
        stop: ["<think>", "</think>"],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: "解读失败", details: errorText }, { status: response.status })
    }

    const data = await response.json()
    const choice = data?.choices?.[0]
    const message = choice?.message ?? choice
    const content = extractContent(message) || (typeof message?.reasoning === "string" ? message.reasoning : undefined)

    if (!content) {
      console.error("explain-name missing content", {
        rawChoice: choice,
        rawMessage: message,
      })
      return NextResponse.json({ error: "未获取到模型输出", debug: { choice } }, { status: 500 })
    }

    const parsed = extractJson(content)
    if (!parsed) {
      console.error("explain-name parse failed", { rawContent: content })
      return NextResponse.json({ error: "解析模型输出失败", raw: content }, { status: 500 })
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error("explain-name error", error)
    return NextResponse.json({ error: "请求模型失败" }, { status: 500 })
  }
}
