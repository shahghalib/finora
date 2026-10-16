import { Sparkles } from "lucide-react"

import { InsightCard, type Insight } from "./insight-card"

export function AiInsightsPanel({
  insights,
}: {
  insights: Insight[]
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">AI Insights</h3>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-1">
        {insights.length === 0 ? (
          <p className="text-sm text-muted-foreground sm:col-span-2 xl:col-span-1">
            No notable patterns yet — check back after a few more transactions.
          </p>
        ) : (
          insights.map((insight, i) => <InsightCard key={i} insight={insight} />)
        )}
      </div>
    </div>
  )
}
