"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { FivFoldKanbanColumn } from "./types"

export interface ColumnHeaderProps {
  column: FivFoldKanbanColumn
  taskCount: number
  onAddTask?: () => void
}

export function ColumnHeader({ column, taskCount, onAddTask }: ColumnHeaderProps) {
  const isAtCapacity = column.maxTasks !== undefined && taskCount >= column.maxTasks

  const accentColor = column.color ?? "hsl(var(--primary))"

  return (
    <div
      className="flex items-center justify-between gap-2 rounded-t-lg px-4 py-3"
      style={{
        backgroundColor: accentColor.startsWith("#")
          ? `${accentColor}0d`
          : `color-mix(in srgb, ${accentColor} 5%, transparent)`,
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
        <Badge
          variant={isAtCapacity ? "destructive" : "secondary"}
          className="h-5 min-w-[20px] justify-center px-1.5 text-xs"
        >
          {taskCount}
          {column.maxTasks !== undefined ? `/${column.maxTasks}` : ""}
        </Badge>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
        onClick={onAddTask}
        disabled={isAtCapacity}
        aria-label={`Add task to ${column.title}`}
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
