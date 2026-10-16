import {
  Car,
  Clapperboard,
  GraduationCap,
  HeartPulse,
  Home,
  ShoppingBag,
  Utensils,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react"

interface CategoryStyle {
  icon: LucideIcon
  bg: string
  fg: string
  bar: string
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  food: {
    icon: Utensils,
    bg: "bg-[#F7EED7]",
    fg: "text-[#B7791F]",
    bar: "bg-[#C98A24]",
  },

  dining: {
    icon: Utensils,
    bg: "bg-[#F7EED7]",
    fg: "text-[#B7791F]",
    bar: "bg-[#C98A24]",
  },

  transport: {
    icon: Car,
    bg: "bg-[#E8EEF7]",
    fg: "text-[#4F6B95]",
    bar: "bg-[#4F6B95]",
  },

  travel: {
    icon: Car,
    bg: "bg-[#E8EEF7]",
    fg: "text-[#4F6B95]",
    bar: "bg-[#4F6B95]",
  },

  entertainment: {
    icon: Clapperboard,
    bg: "bg-[#EEE8F4]",
    fg: "text-[#765A8F]",
    bar: "bg-[#765A8F]",
  },

  rent: {
    icon: Home,
    bg: "bg-[#E3F1EB]",
    fg: "text-[#4F8A72]",
    bar: "bg-[#4F8A72]",
  },

  housing: {
    icon: Home,
    bg: "bg-[#E3F1EB]",
    fg: "text-[#4F8A72]",
    bar: "bg-[#4F8A72]",
  },

  shopping: {
    icon: ShoppingBag,
    bg: "bg-[#F1E8E6]",
    fg: "text-[#98675C]",
    bar: "bg-[#98675C]",
  },

  health: {
    icon: HeartPulse,
    bg: "bg-rose-100",
    fg: "text-rose-600",
    bar: "bg-rose-500",
  },

  education: {
    icon: GraduationCap,
    bg: "bg-cyan-100",
    fg: "text-cyan-600",
    bar: "bg-cyan-500",
  },

  utilities: {
    icon: Zap,
    bg: "bg-amber-100",
    fg: "text-amber-600",
    bar: "bg-amber-500",
  },
}

const FALLBACK_STYLE: CategoryStyle = {
  icon: Wallet,
  bg: "bg-neutral-100",
  fg: "text-neutral-600",
  bar: "bg-neutral-500",
}

export function getCategoryStyle(categoryName: string): CategoryStyle {
  const key = categoryName.toLowerCase()

  const match = Object.entries(CATEGORY_STYLES).find(([keyword]) =>
    key.includes(keyword),
  )

  return match ? match[1] : FALLBACK_STYLE
}

/** All-lowercase keywords that mean "this row is money coming in, not spend". */
const INCOME_KEYWORDS = ["income", "salary", "deposit", "refund", "payroll"]

export function isIncomeCategory(categoryName: string): boolean {
  const key = categoryName.toLowerCase()

  return INCOME_KEYWORDS.some((keyword) => key.includes(keyword))
}