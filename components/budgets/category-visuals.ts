import {
  Car,
  Clapperboard,
  Home,
  ShoppingBag,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react"

export interface CategoryVisual {
  icon: LucideIcon
  iconBg: string
  iconColor: string
  barColor: string
  isFixed: boolean
}

const DEFAULT_VISUAL: CategoryVisual = {
  icon: ShoppingBag,
  iconBg: "bg-[#F0EFEB]",
  iconColor: "text-[#5F625F]",
  barColor: "bg-[#5F625F]",
  isFixed: false,
}

const CATEGORY_VISUALS: Record<string, CategoryVisual> = {
  Food: {
    icon: UtensilsCrossed,
    iconBg: "bg-[#F7EED7]",
    iconColor: "text-[#B7791F]",
    barColor: "bg-[#C98A24]",
    isFixed: false,
  },

  Transport: {
    icon: Car,
    iconBg: "bg-[#E8EEF7]",
    iconColor: "text-[#4F6B95]",
    barColor: "bg-[#4F6B95]",
    isFixed: false,
  },

  Entertainment: {
    icon: Clapperboard,
    iconBg: "bg-[#EEE8F4]",
    iconColor: "text-[#765A8F]",
    barColor: "bg-[#765A8F]",
    isFixed: false,
  },

  Rent: {
    icon: Home,
    iconBg: "bg-[#E3F1EB]",
    iconColor: "text-[#4F8A72]",
    barColor: "bg-[#4F8A72]",
    isFixed: true,
  },

  Shopping: {
    icon: ShoppingBag,
    iconBg: "bg-[#F1E8E6]",
    iconColor: "text-[#98675C]",
    barColor: "bg-[#98675C]",
    isFixed: false,
  },
}

export function getCategoryVisual(categoryName: string): CategoryVisual {
  return CATEGORY_VISUALS[categoryName] ?? DEFAULT_VISUAL
}