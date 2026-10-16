"use client"

interface MiniTrendBarsProps {
  /** Spend per month, oldest to newest. Only the most recent bar is highlighted. */
  values: number[]
  /** Tailwind bg-* class applied to the most recent (rightmost) bar. */
  highlightColor: string
}

export function MiniTrendBars({ values, highlightColor }: MiniTrendBarsProps) {
  const max = Math.max(...values, 1)

  return (
    <div className="flex h-6 items-end gap-1">
      {values.map((value, index) => {
        const isLast = index === values.length - 1
        const heightPct = Math.max(10, Math.round((value / max) * 100))
        return (
          <div
            key={index}
            className={`w-1.5 rounded-sm ${isLast ? highlightColor : "bg-muted"}`}
            style={{ height: `${heightPct}%` }}
          />
        )
      })}
    </div>
  )
}