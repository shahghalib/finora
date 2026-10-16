import {
  Car,
  Clapperboard,
  GraduationCap,
  HeartPulse,
  Home,
  ShoppingBag,
  Ticket,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from "lucide-react"

export interface CategoryPreset {
  icon: LucideIcon
  color: string
  background: string
}

export const CATEGORY_PRESETS: Record<string, CategoryPreset> = {
  Food: {
    icon: UtensilsCrossed,
    color: "#B7791F",
    background: "#FFF8EC",
  },

  Transport: {
    icon: Car,
    color: "#4355B9",
    background: "#EEF2FF",
  },

  Petrol: {
    icon: Car,
    color: "#16806A",
    background: "#EFFAF6",
  },

  Travelling: {
    icon: Car,
    color: "#2563A6",
    background: "#EEF6FC",
  },

  Rent: {
    icon: Home,
    color: "#475569",
    background: "#F1F5F9",
  },

  Entertainment: {
    icon: Clapperboard,
    color: "#9A6B2F",
    background: "#FAF5EC",
  },

  Shopping: {
    icon: ShoppingBag,
    color: "#667A3A",
    background: "#F3F6EA",
  },

  Health: {
    icon: HeartPulse,
    color: "#16806A",
    background: "#EFFAF6",
  },

  Education: {
    icon: GraduationCap,
    color: "#315E8C",
    background: "#EEF5FB",
  },

  Bills: {
    icon: Wallet,
    color: "#087F8C",
    background: "#ECFAFB",
  },

  Other: {
    icon: Ticket,
    color: "#64748B",
    background: "#F1F5F9",
  },
}

export function getCategoryPreset(
  categoryName: string
): CategoryPreset {
  return (
    CATEGORY_PRESETS[categoryName] ?? {
      icon: Ticket,
      color: "#64748B",
      background: "#F1F5F9",
    }
  )
}

export function getCategoryIcon(
  categoryName: string
): LucideIcon {
  return getCategoryPreset(categoryName).icon
}

export function getCategoryColor(
  categoryName: string
): string {
  return getCategoryPreset(categoryName).color
}

export function getCategoryBackground(
  categoryName: string
): string {
  return getCategoryPreset(categoryName).background
}

const AUTO_RULE_COUNTS: Record<string, number> = {
  Food: 7,
  Transport: 6,
  Petrol: 3,
  Travelling: 0,
  Entertainment: 4,
  Rent: 2,
}

export function getAutoRuleCount(categoryName: string): number {
  return AUTO_RULE_COUNTS[categoryName] ?? 0
}