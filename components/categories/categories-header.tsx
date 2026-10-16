"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { PageHeader } from "@/components/page-shell"
import { CreateCategoryDialog } from "./create-category-dialog"

interface CategoriesHeaderProps {
  existingCategories: string[]
}

export function CategoriesHeader({
  existingCategories,
}: CategoriesHeaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <PageHeader
        title="Categories"
        description="Organize and manage your spending categories."
        actions={
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            Create Category
          </button>
        }
      />

      {dialogOpen && (
        <CreateCategoryDialog
          onClose={() => setDialogOpen(false)}
          existingCategories={existingCategories}
        />
      )}
    </>
  )
}
