"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export interface BoardHeaderProps {
  title?: string
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  className?: string
  children?: React.ReactNode
}

export function BoardHeader({
  title,
  searchPlaceholder = "Search tasks...",
  onSearch,
  className,
  children,
}: BoardHeaderProps) {
  const [query, setQuery] = React.useState("")

  React.useEffect(() => {
    onSearch?.(query)
  }, [query, onSearch])

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)}>
      {title && (
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      )}
      <div className="flex flex-1 items-center gap-2">
        {onSearch && (
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
