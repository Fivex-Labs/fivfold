"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, ChevronDown } from "lucide-react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { ColumnHeader } from "./column-header"
import { SortableTaskCard, TaskCard } from "./task-card"
import type { FivFoldKanbanColumn, FivFoldKanbanTask } from "./types"
import type { TaskCardProps } from "./task-card"

export interface KanbanColumnProps {
  column: FivFoldKanbanColumn
  tasks: FivFoldKanbanTask[]
  showPriority: boolean
  showAssignee: boolean
  showDueDate: boolean
  showTimeTracking: boolean
  showLabels: boolean
  showAttachments: boolean
  showComments: boolean
  onTaskClick?: (task: FivFoldKanbanTask) => void
  onAddTask?: () => void
  emptyStateText?: string
}

export function KanbanColumn({
  column,
  tasks,
  showPriority,
  showAssignee,
  showDueDate,
  showTimeTracking,
  showLabels,
  showAttachments,
  showComments,
  onTaskClick,
  onAddTask,
  emptyStateText,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  const sharedTaskProps: Omit<TaskCardProps, "task" | "isDragging"> = {
    showPriority,
    showAssignee,
    showDueDate,
    showTimeTracking,
    showLabels,
    showAttachments,
    showComments,
    onClick: undefined,
  }

  return (
    <div
      className="flex w-72 shrink-0 flex-col rounded-lg border border-border bg-muted/40 sm:w-80"
      style={column.color ? { borderTopColor: column.color, borderTopWidth: 2 } : undefined}
    >
      <ColumnHeader
        column={column}
        taskCount={tasks.length}
        onAddTask={onAddTask}
      />

      {column.description && (
        <p className="px-4 pb-2 text-xs text-muted-foreground">{column.description}</p>
      )}

      <Separator />

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 overflow-hidden transition-colors",
          isOver && "bg-accent/20"
        )}
      >
        <ScrollArea className="h-full max-h-[calc(100vh-220px)]">
          <div className="flex flex-col gap-2 p-3">
            <SortableContext
              items={tasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <p className="text-xs">{emptyStateText ?? "No tasks"}</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <SortableTaskCard
                    key={task.id}
                    id={task.id}
                    task={task}
                    {...sharedTaskProps}
                    onClick={() => onTaskClick?.(task)}
                  />
                ))
              )}
            </SortableContext>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export interface MobileColumnProps extends KanbanColumnProps {}

export function MobileColumn({
  column,
  tasks,
  showPriority,
  showAssignee,
  showDueDate,
  showTimeTracking,
  showLabels,
  showAttachments,
  showComments,
  onTaskClick,
  onAddTask,
  emptyStateText,
}: MobileColumnProps) {
  const [expanded, setExpanded] = React.useState(true)

  return (
    <div
      className="rounded-lg border border-border bg-muted/40"
      style={column.color ? { borderTopColor: column.color, borderTopWidth: 2 } : undefined}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">{column.title}</h3>
          <Badge variant="secondary" className="h-5 min-w-[20px] justify-center px-1.5 text-xs">
            {tasks.length}
          </Badge>
        </div>
        <ChevronDown
          className={cn("h-4 w-4 text-muted-foreground transition-transform", expanded && "rotate-180")}
        />
      </button>
      {expanded && (
        <div className="px-3 pb-3">
          <Separator className="mb-2" />
          {tasks.length === 0 ? (
            <p className="py-4 text-center text-xs text-muted-foreground">{emptyStateText ?? "No tasks"}</p>
          ) : (
            <div className="flex flex-col gap-2">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  showPriority={showPriority}
                  showAssignee={showAssignee}
                  showDueDate={showDueDate}
                  showTimeTracking={showTimeTracking}
                  showLabels={showLabels}
                  showAttachments={showAttachments}
                  showComments={showComments}
                  onClick={() => onTaskClick?.(task)}
                />
              ))}
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 w-full text-xs text-muted-foreground"
            onClick={() => onAddTask?.()}
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Add task
          </Button>
        </div>
      )}
    </div>
  )
}
