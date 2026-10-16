import { AlertTriangle } from "lucide-react"

import { ApiError } from "@/lib/api-client"
import { Card, CardContent } from "@/components/ui/card"

export function ErrorCard({ error }: { error: unknown }) {
  const message =
    error instanceof ApiError
      ? error.status === 401
        ? "Your session has expired. Please sign in again."
        : error.message
      : "Couldn't reach the backend. Is it running and is NEXT_PUBLIC_API_URL set correctly?"

  return (
    <Card>
      <CardContent className="flex items-start gap-3 py-6">
        <AlertTriangle className="text-destructive mt-0.5 size-5 shrink-0" />
        <p className="text-sm">{message}</p>
      </CardContent>
    </Card>
  )
}