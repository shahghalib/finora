"use client"

import { useState } from "react"
import {
  X,
  UtensilsCrossed,
  Car,
  House,
  ReceiptText,
  Clapperboard,
  ShoppingBag,
  HeartPulse,
  GraduationCap,
  Plane,
  Lightbulb,
  Wallet,
  CircleEllipsis,
  Loader2,
} from "lucide-react"

import { useCreateCategory } from "@/hooks/use-categories-data"

interface CreateCategoryDialogProps {
  onClose: () => void
  existingCategories: string[]
}

interface CategoryOption {
  name: string
  icon: typeof UtensilsCrossed
  color: string
  background: string
  border: string
}

const categoryOptions: CategoryOption[] = [
  {
    name: "Food",
    icon: UtensilsCrossed,
    color: "#B7791F",
    background: "#FFF8EC",
    border: "#F3E2C5",
  },
  {
    name: "Transport",
    icon: Car,
    color: "#4355B9",
    background: "#EEF2FF",
    border: "#DDE5FF",
  },
  {
    name: "Petrol",
    icon: Car,
    color: "#16806A",
    background: "#EFFAF6",
    border: "#D7EEE7",
  },
  {
    name: "Travelling",
    icon: Plane,
    color: "#2563A6",
    background: "#EEF6FC",
    border: "#D8EAFE",
  },
  {
    name: "Rent",
    icon: House,
    color: "#475569",
    background: "#F1F5F9",
    border: "#E2E8F0",
  },
  {
    name: "Bills",
    icon: ReceiptText,
    color: "#087F8C",
    background: "#ECFAFB",
    border: "#D3EEEE",
  },
  {
    name: "Entertainment",
    icon: Clapperboard,
    color: "#9A6B2F",
    background: "#FAF5EC",
    border: "#F3E7D1",
  },
  {
    name: "Shopping",
    icon: ShoppingBag,
    color: "#667A3A",
    background: "#F3F6EA",
    border: "#E1E8CF",
  },
  {
    name: "Health",
    icon: HeartPulse,
    color: "#16806A",
    background: "#EFFAF6",
    border: "#D7EEE7",
  },
  {
    name: "Education",
    icon: GraduationCap,
    color: "#315E8C",
    background: "#EEF5FB",
    border: "#D8E7F5",
  },
  {
    name: "Utilities",
    icon: Lightbulb,
    color: "#087F8C",
    background: "#ECFAFB",
    border: "#D3EEEE",
  },
  {
    name: "Savings",
    icon: Wallet,
    color: "#16806A",
    background: "#EFFAF6",
    border: "#D7EEE7",
  },
  {
    name: "Other",
    icon: CircleEllipsis,
    color: "#64748B",
    background: "#F1F5F9",
    border: "#E2E8F0",
  },
]

const colorOptions = [
  {
    name: "Amber",
    value: "#B7791F",
    background: "#FFF8EC",
    border: "#F3E2C5",
  },
  {
    name: "Indigo",
    value: "#4355B9",
    background: "#EEF2FF",
    border: "#DDE5FF",
  },
  {
    name: "Green",
    value: "#16806A",
    background: "#EFFAF6",
    border: "#D7EEE7",
  },
  {
    name: "Blue",
    value: "#2563A6",
    background: "#EEF6FC",
    border: "#D8EAFE",
  },
  {
    name: "Slate",
    value: "#475569",
    background: "#F1F5F9",
    border: "#E2E8F0",
  },
  {
    name: "Gold",
    value: "#9A6B2F",
    background: "#FAF5EC",
    border: "#F3E7D1",
  },
  {
    name: "Olive",
    value: "#667A3A",
    background: "#F3F6EA",
    border: "#E1E8CF",
  },
  {
    name: "Teal",
    value: "#087F8C",
    background: "#ECFAFB",
    border: "#D3EEEE",
  },
  {
    name: "Navy",
    value: "#113160",
    background: "#EEF3F9",
    border: "#D7E1ED",
  },
]

const otherCategory =
  categoryOptions.find((item) => item.name === "Other") ??
  categoryOptions[categoryOptions.length - 1]

export function CreateCategoryDialog({
  onClose,
  existingCategories,
}: CreateCategoryDialogProps) {
  const [categoryName, setCategoryName] = useState("")
  const [selectedIcon, setSelectedIcon] =
    useState<CategoryOption>(otherCategory)

  const [selectedColor, setSelectedColor] = useState(
    colorOptions.find((color) => color.name === "Slate") ??
      colorOptions[0]
  )

  const [error, setError] = useState("")

  const createCategory = useCreateCategory()

  const findCategory = (name: string) => {
    return categoryOptions.find(
      (item) =>
        item.name.toLowerCase() ===
        name.trim().toLowerCase()
    )
  }

  const applyCategory = (name: string) => {
    const category = findCategory(name)

    if (!category) {
      setSelectedIcon(otherCategory)

      setSelectedColor(
        colorOptions.find(
          (color) => color.name === "Slate"
        ) ?? colorOptions[0]
      )

      return
    }

    setSelectedIcon(category)

    const matchingColor = colorOptions.find(
      (color) =>
        color.value.toLowerCase() ===
        category.color.toLowerCase()
    )

    if (matchingColor) {
      setSelectedColor(matchingColor)
    }
  }

  const handleNameChange = (value: string) => {
    setCategoryName(value)

    // Remove the error as soon as the user starts changing the name.
    setError("")

    applyCategory(value)
  }

  const handleIconSelect = (category: CategoryOption) => {
    setSelectedIcon(category)

    const matchingColor = colorOptions.find(
      (color) =>
        color.value.toLowerCase() ===
        category.color.toLowerCase()
    )

    if (matchingColor) {
      setSelectedColor(matchingColor)
    }
  }

  const handleCreate = async () => {
    const trimmedName = categoryName.trim()

    if (!trimmedName) {
      setError("Please enter a category name.")
      return
    }

    // Frontend duplicate check.
    // Case-insensitive comparison.
    const alreadyExists = existingCategories.some(
      (name) =>
        name.trim().toLowerCase() ===
        trimmedName.toLowerCase()
    )

    if (alreadyExists) {
      setError("Category already exists.")
      return
    }

    const formattedName =
      trimmedName.charAt(0).toUpperCase() +
      trimmedName.slice(1)

    try {
      setError("")

      await createCategory.mutateAsync(formattedName)

      onClose()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not create category. Please try again."
      )
    }
  }

  const SelectedIcon = selectedIcon.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#14213D]/35 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90dvh] w-full max-w-[540px] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">

        {/* Header */}
        <div className="flex flex-shrink-0 items-start justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#14213D]">
              Create Category
            </h2>

            <p className="mt-1 text-sm text-[#64748B]">
              Add a category to organize your spending.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F5F4EF] hover:text-[#14213D]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 overflow-y-auto px-6 py-5">
          <div className="space-y-5">

            {/* Category Name */}
            <div>
              <label
                htmlFor="category-name"
                className="mb-2 block text-sm font-semibold text-[#14213D]"
              >
                Category Name
              </label>

              <input
                id="category-name"
                type="text"
                value={categoryName}
                onChange={(event) =>
                  handleNameChange(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault()
                    handleCreate()
                  }
                }}
                placeholder="e.g. Groceries"
                className={`h-11 w-full rounded-lg border bg-white px-3.5 text-sm text-[#14213D] outline-none transition-all placeholder:text-[#94A3B8] focus:ring-2 ${
                  error
                    ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/10"
                    : "border-[#DCE3EC] focus:border-[#4355B9] focus:ring-[#4355B9]/10"
                }`}
              />

              {/* Error message inside dialog */}
              {error ? (
                <p className="mt-1.5 text-xs font-medium text-[#DC2626]">
                  {error}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-[#94A3B8]">
                  Predefined categories automatically get their
                  matching icon and color.
                </p>
              )}
            </div>

            {/* Icon Selection */}
            <div>
              <p className="mb-3 text-sm font-semibold text-[#14213D]">
                Choose Icon
              </p>

              <div className="grid grid-cols-6 gap-2">
                {categoryOptions.map((category) => {
                  const Icon = category.icon

                  const isSelected =
                    selectedIcon.name === category.name

                  return (
                    <button
                      key={category.name}
                      type="button"
                      title={category.name}
                      onClick={() =>
                        handleIconSelect(category)
                      }
                      className={`flex h-11 items-center justify-center rounded-lg border transition-all ${
                        isSelected
                          ? "ring-2 ring-offset-1"
                          : "hover:scale-[1.02]"
                      }`}
                      style={{
                        color: category.color,
                        backgroundColor:
                          category.background,
                        borderColor: isSelected
                          ? category.color
                          : category.border,
                        ...(isSelected
                          ? {
                              boxShadow: `0 0 0 1px ${category.color}`,
                            }
                          : {}),
                      }}
                    >
                      <Icon
                        className="h-5 w-5"
                        strokeWidth={1.8}
                      />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <p className="mb-3 text-sm font-semibold text-[#14213D]">
                Category Color
              </p>

              <div className="flex flex-wrap gap-3">
                {colorOptions.map((color) => {
                  const isSelected =
                    selectedColor.name === color.name

                  return (
                    <button
                      key={color.name}
                      type="button"
                      title={color.name}
                      onClick={() =>
                        setSelectedColor(color)
                      }
                      className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                        isSelected
                          ? "ring-2 ring-offset-2"
                          : "hover:scale-105"
                      }`}
                      style={{
                        backgroundColor: color.value,
                        ...(isSelected
                          ? {
                              outline: `2px solid ${color.value}`,
                              outlineOffset: "2px",
                            }
                          : {}),
                      }}
                    >
                      {isSelected && (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Preview */}
            <div>
              <p className="mb-3 text-sm font-semibold text-[#14213D]">
                Preview
              </p>

              <div className="rounded-xl border border-border bg-[#F8FAFC] p-3.5">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor:
                        selectedColor.background,
                      color: selectedColor.value,
                      border: `1px solid ${selectedColor.border}`,
                    }}
                  >
                    <SelectedIcon
                      className="h-5 w-5"
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#14213D]">
                      {categoryName.trim() ||
                        "Category Name"}
                    </p>

                    <p className="mt-0.5 text-xs text-[#64748B]">
                      Custom spending category
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-border bg-[#FCFCFB] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-border bg-white px-4 text-sm font-medium text-[#44474F] transition-colors hover:bg-[#F5F4EF]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleCreate}
            disabled={
              !categoryName.trim() ||
              createCategory.isPending
            }
            className="flex h-10 items-center gap-2 rounded-lg bg-[#113160] px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#001c42] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createCategory.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            {createCategory.isPending
              ? "Creating..."
              : "Create Category"}
          </button>
        </div>
      </div>
    </div>
  )
}