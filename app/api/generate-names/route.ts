import { NextResponse } from "next/server"

const OPENROUTER_MODEL = "deepseek/deepseek-v3.2-exp"

type NameRequest = {
  surname?: string
  gender?: string
  birthDateTime?: string
  expectations?: string[]
  avoidChars?: string
  nameLengthPreference?: "single" | "double"
  locale?: "en" | "zh"
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
  const body = (await req.json()) as NameRequest
  if (!body.surname || !body.gender) {
    return NextResponse.json({ error: "姓氏与性别为必填项" }, { status: 400 })
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ error: "缺少 OPENROUTER_API_KEY" }, { status: 500 })
  }

  const referer = process.env.OPENROUTER_SITE_URL
  const siteTitle = process.env.OPENROUTER_SITE_NAME
  const locale = body.locale === "zh" ? "zh" : "en"
  const localeInstruction =
    locale === "zh"
      ? "解释类字段（pinyin 可用带声调拼音；meaning、rationale、analysis 下四个字段）全部使用简体中文；名字本身保持中文汉字。"
      : "Use English for meaning, rationale, and analysis fields; keep the Chinese names in Chinese characters. Pinyin can include tone marks."

  const messages = [
    {
      role: "system",
      content:
        [
          "你是一位精通中文姓名学、音韵学、诗词文化、八字五行基础的起名顾问。",
          "只输出 JSON 对象，绝对不要输出推理、<think>、解释或 Markdown。不要写步骤，不要写多余文字。",
          "保持精简，总共不超过 4 个名字建议；每个建议字段 name/pinyin/meaning/rationale 必填，analysis 下 phonetics/structure/culture/wuxing 必填。",
          'JSON 模板：{"suggestions":[{"name":"李清和","pinyin":"Lǐ Qīnghé","meaning":"清澈和顺","rationale":"结合父母期望和平顺的音韵"}],"analysis":{"phonetics":"描述平仄与顺口性","structure":"描述字形结构与书写","culture":"引用经典原文与出处","wuxing":"说明补充的五行及理由"}}',
          localeInstruction,
        ].join("\n"),
    },
    {
      role: "user",
      content: [
        `姓氏: ${body.surname}`,
        `性别: ${body.gender}`,
        body.birthDateTime ? `出生日期时辰: ${body.birthDateTime}` : null,
        body.expectations?.length ? `父母期望: ${body.expectations.join("、")}` : null,
        body.avoidChars ? `避讳字: ${body.avoidChars}` : null,
        body.nameLengthPreference ? `字数偏好: ${body.nameLengthPreference === "single" ? "单字" : "双字"}` : null,
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
        temperature: 0.6,
        max_tokens: 1500,
        response_format: { type: "json_object" },
        stop: ["<think>", "</think>"],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: "生成失败", details: errorText }, { status: response.status })
    }

    const data = await response.json()
    const choice = data?.choices?.[0]
    const message = choice?.message ?? choice

    const content = extractContent(message) || (typeof message?.reasoning === "string" ? message.reasoning : undefined)

    if (!content) {
      console.error("generate-names missing content", {
        rawChoice: choice,
        rawMessage: message,
      })
      return NextResponse.json({ error: "未获取到模型输出", debug: { choice } }, { status: 500 })
    }

    const parsed = extractJson(content)
    if (!parsed) {
      console.error("generate-names parse failed", { rawContent: content })
      return NextResponse.json({ error: "解析模型输出失败", raw: content }, { status: 500 })
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error("generate-names error", error)
    return NextResponse.json({ error: "请求模型失败" }, { status: 500 })
  }
}
