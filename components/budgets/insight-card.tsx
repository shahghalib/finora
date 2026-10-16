import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"

export type InsightType =
  | "exceeded"
  | "alert"
  | "savings"
  | "chronic"

export interface Insight {
  type: InsightType
  title: string
  message: string
}

const STYLES: Record<
  InsightType,
  {
    container: string
    icon: LucideIcon
    iconColor: string
    titleColor: string
  }
> = {
  exceeded: {
    container: "border-destructive/30 bg-destructive/5",
    icon: AlertTriangle,
    iconColor: "text-destructive",
    titleColor: "text-destructive",
  },

  chronic: {
    container: "border-destructive/30 bg-destructive/5",
    icon: AlertTriangle,
    iconColor: "text-destructive",
    titleColor: "text-destructive",
  },

  alert: {
    container: "border-amber-300/60 bg-amber-50",
    icon: TrendingUp,
    iconColor: "text-amber-600",
    titleColor: "text-amber-700",
  },

  savings: {
    container: "border-emerald-300/60 bg-emerald-50",
    icon: TrendingDown,
    iconColor: "text-emerald-600",
    titleColor: "text-emerald-700",
  },
}

export function InsightCard({
  insight,
}: {
  insight: Insight
}) {
  const style = STYLES[insight.type]
  const Icon = style.icon

  return (
    <div className={`rounded-lg border p-3 ${style.container}`}>
      <div className={`flex items-start gap-2 text-sm font-semibold ${style.titleColor}`}>
        <Icon className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{insight.title}</span>
      </div>
      <p className="mt-1 pl-6 text-xs leading-relaxed text-foreground/75">{insight.message}</p>
    </div>
  )
}
