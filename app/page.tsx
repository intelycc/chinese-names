import Link from "next/link"
import React from "react"
import type { Locale } from "@/lib/copy"
import { homeCopy } from "@/lib/copy"
import { AuthButtons } from "@/components/auth-buttons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BookOpen, Users, Crown, History, User, UserCheck } from "lucide-react"

export default function HomePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = React.use(searchParams)
  const localeParam = Array.isArray(params?.lang) ? params?.lang[0] : params?.lang
  const locale: Locale = localeParam === "zh" ? "zh" : "en"
  const t = homeCopy[locale]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-primary via-accent to-secondary rounded-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              NameMe.online
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href={`/?lang=${locale}#generator`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t.navGenerator}
            </Link>
            <Link href={`/?lang=${locale}#explainer`} className="text-sm text-muted-foreground hover:text-secondary transition-colors">
              {t.navExplainer}
            </Link>
            <Link href={`/?lang=${locale}#examples`} className="text-sm text-muted-foreground hover:text-accent transition-colors">
              {t.navExamples}
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <AuthButtons locale={locale} />
            <LocaleSwitch locale={locale} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge
            variant="secondary"
            className="mb-4 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 border-primary/30"
          >
            {t.heroBadge}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            {t.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Main Tools */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <Card
            id="generator"
            className="border-2 hover:border-primary transition-all hover:shadow-xl hover:shadow-primary/20 bg-gradient-to-br from-card via-card to-primary/5"
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg">
                  <Sparkles className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">{t.generatorTitle}</CardTitle>
              </div>
              <CardDescription className="text-base">{t.generatorDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={{ pathname: "/generator", query: { lang: locale } }}>
                <Button
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg"
                  size="lg"
                >
                  {t.generatorBtn}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card
            id="explainer"
            className="border-2 hover:border-secondary transition-all hover:shadow-xl hover:shadow-secondary/20 bg-gradient-to-br from-card via-card to-secondary/5"
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-secondary to-tertiary rounded-xl shadow-lg">
                  <BookOpen className="h-6 w-6 text-secondary-foreground" />
                </div>
                <CardTitle className="text-2xl">{t.explainerTitle}</CardTitle>
              </div>
              <CardDescription className="text-base">{t.explainerDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={{ pathname: "/explainer", query: { lang: locale } }}>
                <Button
                  className="w-full bg-gradient-to-r from-secondary to-tertiary hover:from-secondary/90 hover:to-tertiary/90 shadow-lg"
                  size="lg"
                >
                  {t.explainerBtn}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Popular Names Section */}
      <section
        id="examples"
        className="container mx-auto px-4 py-12 md:py-20 border-t border-border bg-gradient-to-b from-transparent to-primary/5"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
              <Users className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t.popularNames}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {popularNames.map((name, index) => (
              <NameCard key={index} {...name} accentColor="primary" />
            ))}
          </div>
        </div>
      </section>

      {/* Ancient Names Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 border-t border-border bg-gradient-to-b from-transparent to-accent/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-accent to-quaternary rounded-lg">
              <History className="h-7 w-7 text-accent-foreground" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-quaternary bg-clip-text text-transparent">
              {t.ancientNames}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ancientNames.map((name, index) => (
              <NameCard key={index} {...name} accentColor="accent" />
            ))}
          </div>
        </div>
      </section>

      {/* Family Names Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 border-t border-border bg-gradient-to-b from-transparent to-tertiary/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-tertiary to-quinary rounded-lg">
              <Crown className="h-7 w-7 text-tertiary-foreground" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-tertiary to-quinary bg-clip-text text-transparent">
              {t.familyNames}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {familyNames.map((name, index) => (
              <NameCard key={index} {...name} accentColor="tertiary" />
            ))}
          </div>
        </div>
      </section>

      {/* Male Names Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 border-t border-border bg-gradient-to-b from-transparent to-secondary/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-secondary to-quaternary rounded-lg">
              <User className="h-7 w-7 text-secondary-foreground" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-secondary to-quaternary bg-clip-text text-transparent">
              {t.maleNames}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {maleNames.map((name, index) => (
              <NameCard key={index} {...name} accentColor="secondary" />
            ))}
          </div>
        </div>
      </section>

      {/* Female Names Section */}
      <section className="container mx-auto px-4 py-12 md:py-20 border-t border-border bg-gradient-to-b from-transparent to-quaternary/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-quaternary to-accent rounded-lg">
              <UserCheck className="h-7 w-7 text-quaternary-foreground" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-quaternary to-accent bg-clip-text text-transparent">
              {t.femaleNames}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {femaleNames.map((name, index) => (
              <NameCard key={index} {...name} accentColor="quaternary" />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20 bg-card/50">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2026 NameMe.online - AI Chinese Names Generator & Meaning Explainer</p>
        </div>
      </footer>
    </div>
  )
}

function LocaleSwitch({ locale }: { locale: Locale }) {
  return (
    <div className="flex items-center gap-2">
      <Link href={{ pathname: "/", query: { lang: "en" } }}>
        <Button variant={locale === "en" ? "default" : "outline"} size="sm">
          English
        </Button>
      </Link>
      <Link href={{ pathname: "/", query: { lang: "zh" } }}>
        <Button variant={locale === "zh" ? "default" : "outline"} size="sm">
          中文
        </Button>
      </Link>
    </div>
  )
}

function NameCard({
  chinese,
  pinyin,
  meaning,
  description,
  accentColor = "primary",
}: {
  chinese: string
  pinyin: string
  meaning: string
  description: string
  accentColor?: string
}) {
  const colorMap: Record<string, string> = {
    primary: "hover:border-primary/70 hover:shadow-primary/10",
    secondary: "hover:border-secondary/70 hover:shadow-secondary/10",
    accent: "hover:border-accent/70 hover:shadow-accent/10",
    tertiary: "hover:border-tertiary/70 hover:shadow-tertiary/10",
    quaternary: "hover:border-quaternary/70 hover:shadow-quaternary/10",
  }

  return (
    <Card className={`transition-all hover:shadow-lg ${colorMap[accentColor] || colorMap.primary} group`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="text-4xl font-bold group-hover:scale-110 transition-transform">{chinese}</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm font-medium text-muted-foreground">
            Pinyin <span className="text-foreground ml-1 font-semibold">{pinyin}</span>
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            Meaning <span className="text-foreground ml-1 font-semibold">{meaning}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}

const popularNames = [
  {
    chinese: "李阳",
    pinyin: "Lǐ Yáng",
    meaning: "Sunny",
    description: "Li is a common surname, while Yang means sun or sunlight, suggesting brightness and positivity.",
  },
  {
    chinese: "王芳",
    pinyin: "Wáng Fāng",
    meaning: "Fragrant",
    description:
      "Wang is one of the most common surnames in China, and Fang means fragrant or virtuous, often used for girls.",
  },
  {
    chinese: "张明",
    pinyin: "Zhāng Míng",
    meaning: "Bright",
    description:
      "Zhang is a popular surname, and Ming means bright or clear, implying intelligence and clarity of thought.",
  },
  {
    chinese: "刘洋",
    pinyin: "Liú Yáng",
    meaning: "Ocean",
    description: "Liu is a common surname, and Yang here means ocean, suggesting breadth and depth of character.",
  },
  {
    chinese: "陈静",
    pinyin: "Chén Jìng",
    meaning: "Quiet",
    description:
      "Chen is a frequent surname, and Jing means quiet or peaceful, often chosen for its calming connotations.",
  },
  {
    chinese: "黄伟",
    pinyin: "Huáng Wěi",
    meaning: "Great",
    description:
      "Huang is a common surname meaning yellow, and Wei means great or extraordinary, suggesting impressive qualities.",
  },
  {
    chinese: "杨秀英",
    pinyin: "Yáng Xiùyīng",
    meaning: "Elegant Hero",
    description:
      "Yang is a common surname, Xiu means elegant, and Ying means hero or flower, creating a name that suggests refined strength.",
  },
  {
    chinese: "周婷",
    pinyin: "Zhōu Tíng",
    meaning: "Graceful",
    description:
      "Zhou is a common surname, and Ting means graceful or slender, often used for girls to convey beauty and elegance.",
  },
]

const ancientNames = [
  {
    chinese: "司马",
    pinyin: "Sī Mǎ",
    meaning: "In Charge of Horses",
    description:
      "An ancient surname originating from an official title in charge of cavalry, famously borne by the historian Sima Qian.",
  },
  {
    chinese: "貂蝉",
    pinyin: "Diāo Chán",
    meaning: "Sable Cicada",
    description: "A legendary beauty from the Three Kingdoms period, known for her role in political intrigue.",
  },
  {
    chinese: "诸葛亮",
    pinyin: "Zhūgě Liàng",
    meaning: "Liang of the Zhuge clan",
    description:
      "A renowned strategist and statesman during the Three Kingdoms period, known for his wisdom and inventions.",
  },
  {
    chinese: "屈原",
    pinyin: "Qū Yuán",
    meaning: "Original Qu",
    description:
      "A patriotic poet and minister from the Warring States period, known for his literary works and tragic loyalty.",
  },
  {
    chinese: "王羲之",
    pinyin: "Wáng Xīzhī",
    meaning: "Wang of Great Virtue",
    description: "A famous calligrapher from the Eastern Jin Dynasty, often referred to as the 'Sage of Calligraphy'.",
  },
  {
    chinese: "武则天",
    pinyin: "Wǔ Zétiān",
    meaning: "Heaven's Law",
    description:
      "The only female emperor in Chinese history, who ruled during the Tang Dynasty and established her own Zhou Dynasty.",
  },
  {
    chinese: "李白",
    pinyin: "Lǐ Bái",
    meaning: "White Li",
    description:
      "A renowned poet of the Tang Dynasty, known for his romantic, imaginative verses and free-spirited lifestyle.",
  },
  {
    chinese: "花木兰",
    pinyin: "Huā Mùlán",
    meaning: "Magnolia",
    description:
      "A legendary female warrior who disguised herself as a man to take her father's place in the army, symbol of filial piety and bravery.",
  },
]

const familyNames = [
  {
    chinese: "李",
    pinyin: "Lǐ",
    meaning: "Plum",
    description:
      "One of the most common surnames in China, historically associated with the ruling Tang Dynasty. It often implies a connection to nature.",
  },
  {
    chinese: "王",
    pinyin: "Wáng",
    meaning: "King",
    description: "Another extremely common surname, literally meaning 'king' or 'monarch'. It suggests noble lineage.",
  },
  {
    chinese: "张",
    pinyin: "Zhāng",
    meaning: "To stretch",
    description:
      "A very popular surname that originally referred to bowmakers. It's associated with craftsmanship and skill.",
  },
  {
    chinese: "刘",
    pinyin: "Liú",
    meaning: "To kill",
    description:
      "A common surname with ancient origins, possibly related to ancient sacrificial practices. It's associated with strength and decisiveness.",
  },
  {
    chinese: "陈",
    pinyin: "Chén",
    meaning: "To exhibit",
    description:
      "A widespread surname that originated from the state of Chen in ancient China. It often implies a sense of display or prominence.",
  },
  {
    chinese: "杨",
    pinyin: "Yáng",
    meaning: "Poplar",
    description:
      "A common surname that refers to the poplar tree. It suggests resilience and growth, much like the hardy poplar.",
  },
  {
    chinese: "黄",
    pinyin: "Huáng",
    meaning: "Yellow",
    description:
      "A popular surname that also means 'yellow', one of the five elemental colors in Chinese philosophy. It's associated with the earth and emperor.",
  },
  {
    chinese: "赵",
    pinyin: "Zhào",
    meaning: "To surpass",
    description:
      "A common surname with royal connotations, as it was the imperial surname of the Song Dynasty. It implies excellence and achievement.",
  },
]

const maleNames = [
  {
    chinese: "志强",
    pinyin: "Zhì Qiáng",
    meaning: "Ambitious and Strong",
    description:
      "A name that embodies strength and determination, often given to boys with the hope they will grow up to be resilient and successful.",
  },
  {
    chinese: "家豪",
    pinyin: "Jiā Háo",
    meaning: "Family Hero",
    description:
      "This name suggests the wish for the child to bring honor and success to the family, combining 'family' (家) with 'heroic' or 'grand' (豪).",
  },
  {
    chinese: "文龙",
    pinyin: "Wén Lóng",
    meaning: "Cultured Dragon",
    description:
      "Combines 'culture' or 'literature' (文) with 'dragon' (龙), symbolizing wisdom and power in Chinese culture.",
  },
  {
    chinese: "思远",
    pinyin: "Sī Yuǎn",
    meaning: "Thinking Far",
    description: "Implies a person with foresight and the ability to think deeply about the future.",
  },
  {
    chinese: "建国",
    pinyin: "Jiàn Guó",
    meaning: "Building the Nation",
    description:
      "A patriotic name often given to boys born around the founding of the People's Republic of China, expressing hope for the country's future.",
  },
  {
    chinese: "天宇",
    pinyin: "Tiān Yǔ",
    meaning: "Sky and Universe",
    description:
      "Combines 'sky' or 'heaven' (天) with 'universe' (宇), suggesting boundless potential and grand aspirations.",
  },
  {
    chinese: "子明",
    pinyin: "Zǐ Míng",
    meaning: "Bright Child",
    description:
      "The character 子 (zǐ) is often used in male names, combined with 明 (míng) meaning 'bright', hoping for a child with a bright future.",
  },
  {
    chinese: "雨泽",
    pinyin: "Yǔ Zé",
    meaning: "Rain and Blessing",
    description: "Combines 'rain' (雨) with 'blessing' or 'moistening' (泽), implying nourishment and good fortune.",
  },
]

const femaleNames = [
  {
    chinese: "美玲",
    pinyin: "Měi Líng",
    meaning: "Beautiful and Graceful",
    description:
      "A name that combines 'beauty' (美) with 'graceful' or 'delicate' (玲), often given to girls with the hope they will embody elegance and charm.",
  },
  {
    chinese: "静宜",
    pinyin: "Jìng Yí",
    meaning: "Quiet and Gentle",
    description:
      "This name suggests a calm and gentle personality, with 'quiet' (静) and 'appropriate' or 'suitable' (宜) reflecting tranquility and kindness.",
  },
  {
    chinese: "芳华",
    pinyin: "Fāng Huá",
    meaning: "Fragrant Blossom",
    description:
      "Combines 'fragrance' (芳) with 'blossom' or 'splendid' (华), symbolizing beauty and elegance in full bloom.",
  },
  {
    chinese: "雪儿",
    pinyin: "Xuě Ér",
    meaning: "Snow Child",
    description:
      "Implying purity and freshness, this name combines 'snow' (雪) with 'child' (儿), often given to girls with the hope of a pure and bright future.",
  },
  {
    chinese: "涵蓉",
    pinyin: "Hán Róng",
    meaning: "Gentle Lotus",
    description:
      "Combines 'contain' or 'embrace' (涵) with 'lotus' (蓉), symbolizing elegance and inner beauty like the lotus flower.",
  },
  {
    chinese: "怡然",
    pinyin: "Yí Rán",
    meaning: "Pleasant and Calm",
    description:
      "This name suggests a person with a serene and pleasant demeanor, with 'pleasant' (怡) and 'calm' (然) reflecting peace and ease.",
  },
  {
    chinese: "晶莹",
    pinyin: "Jīng Yīng",
    meaning: "Bright and Lustrous",
    description:
      "Combines 'crystal' or 'bright' (晶) with 'lustrous' or 'gleaming' (莹), often given to girls with the hope of a radiant and shining personality.",
  },
  {
    chinese: "梅花",
    pinyin: "Méi Huā",
    meaning: "Plum Blossom",
    description:
      "Combines 'plum' (梅) with 'blossom' (花), symbolizing resilience and beauty, as the plum blossom is a symbol of perseverance and elegance.",
  },
]
