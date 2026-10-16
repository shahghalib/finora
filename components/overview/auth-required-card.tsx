import Link from "next/link"
import { KeyRound } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AuthRequiredCard() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <div className="bg-muted flex size-12 items-center justify-center rounded-full">
          <KeyRound className="text-muted-foreground size-5" />
        </div>
        <div className="space-y-1">
          <p className="font-medium">You&apos;re not signed in</p>
          <p className="text-muted-foreground max-w-sm text-sm">
            Sign in to see your dashboard.
          </p>
        </div>
        <Link href="/login" className={cn(buttonVariants(), "mt-2")}>
          Sign in
        </Link>
      </CardContent>
    </Card>
  )
}
