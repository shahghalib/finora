"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { useCategoriesPageData } from "@/hooks/use-categories-data"
import { PageContainer } from "@/components/page-shell"
import { CategoriesHeader } from "./categories-header"
import { CategoriesSummaryCard } from "./categories-summary-card"
import { CategoryCard } from "./category-card"
import { CreateCategoryDialog } from "./create-category-dialog"

export function CategoriesView() {
  const { rows, loading, error } = useCategoriesPageData()
  const [createOpen, setCreateOpen] = useState(false)

  const existingCategories = rows.map((row) => row.name)

  if (loading) {
    return (
      <PageContainer>
        <div className="h-12 w-56 animate-pulse rounded-lg bg-muted" />

        <div className="mt-8 h-24 animate-pulse rounded-xl bg-muted" />

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-[260px] animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <p className="text-sm text-destructive">
          Couldn&apos;t load categories: {error}
        </p>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <CategoriesHeader
        existingCategories={existingCategories}
      />

      <div className="mb-6">
        <CategoriesSummaryCard rows={rows} />
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No categories yet — create your first one to get started.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <CategoryCard
              key={row.id}
              row={row}
            />
          ))}

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex min-h-[280px] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#C4C6D0] text-[#44474f] transition-colors hover:border-[#113160] hover:text-[#113160]"
          >
            <Plus className="h-6 w-6" />

            <span className="text-sm font-bold">
              Create New Category
            </span>
          </button>
        </div>
      )}

      {createOpen && (
        <CreateCategoryDialog
          onClose={() => setCreateOpen(false)}
          existingCategories={existingCategories}
        />
      )}
    </PageContainer>
  )
}