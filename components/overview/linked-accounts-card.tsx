"use client"

import { useState } from "react"
import { Landmark, Link2, Wallet, CreditCard } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog"
import { useAccounts, useCreateAccount } from "@/hooks/use-transactions-data"

const TYPE_META: Record<string, { icon: typeof Wallet; bg: string }> = {
  cash: { icon: Wallet, bg: "bg-emerald-50 text-emerald-700" },
  card: { icon: CreditCard, bg: "bg-blue-50 text-blue-700" },
  bank: { icon: Landmark, bg: "bg-purple-50 text-purple-700" },
}

export function LinkedAccountsCard() {
  const { data: accounts = [], isLoading } = useAccounts()
  const createAccount = useCreateAccount()

  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [type, setType] = useState<"cash" | "card" | "bank" | "">("")

  const handleCreate = async () => {
    if (!name.trim() || !type) return
    await createAccount.mutateAsync({ name: name.trim(), type })
    setName("")
    setType("")
    setOpen(false)
  }

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-full flex-col gap-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="card-title">Linked Accounts</h3>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger >
              <button
                type="button"
                className="text-primary hover:bg-muted flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
              >
                <Link2 className="size-3.5" />
                Link Account
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Link a New Account</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Account name</label>
                  <Input
                    placeholder="e.g. HBL Checking"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Account type</label>
                  <Select
                    items={[
                      { value: "cash", label: "Cash" },
                      { value: "card", label: "Card" },
                      { value: "bank", label: "Bank" },
                    ]}
                    value={type}
                    onValueChange={(v) => {
                      if (v) setType(v as "cash" | "card" | "bank")
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="bank">Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  disabled={!name.trim() || !type || createAccount.isPending}
                  onClick={handleCreate}
                >
                  {createAccount.isPending ? "Linking..." : "Link Account"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {accounts.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
            <div className="bg-muted mb-3 flex size-10 items-center justify-center rounded-full">
              <Landmark className="text-muted-foreground size-4.5" />
            </div>
            <p className="text-muted-foreground text-sm">No accounts linked yet.</p>
          </div>
        ) : (
          <div className="min-h-55 space-y-3 ">
            {accounts.slice(-3).reverse().map((account) => {
              const meta = TYPE_META[account.type] ?? TYPE_META.cash
              const Icon = meta.icon
              return (
                <div
                  key={account.id}
                  className="border-border flex items-center gap-3 rounded-xl border p-3"
                >
                  <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${meta.bg}`}>
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-medium">{account.name}</p>
                    <p className="text-muted-foreground text-xs capitalize">{account.type}</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 shrink-0 rounded-full px-2.5 py-1 text-xs font-medium">
                    Active
                  </span>
                </div>
              )
            })
            }
          </div>
        )}
      </CardContent>
    </Card>
  )
}