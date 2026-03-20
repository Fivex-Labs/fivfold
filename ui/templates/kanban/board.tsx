"use client"

import { cn } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { TooltipProvider } from "@/components/ui/tooltip"
import { KanbanColumn, MobileColumn } from "./column"
import { DragProvider } from "./drag-provider"
import type { FivFoldKanbanColumn, FivFoldKanbanTask } from "./types"
import type { TaskCardProps } from "./task-card"

export interface KanbanBoardProps {
  className?: string
  columns: FivFoldKanbanColumn[]
  onColumnsChange: (columns: FivFoldKanbanColumn[]) => void
  mobileLayout?: "scroll" | "stack"
  sharedProps: {
    showPriority: boolean
    showAssignee: boolean
    showDueDate: boolean
    showTimeTracking: boolean
    showLabels: boolean
    showAttachments: boolean
    showComments: boolean
    emptyStateText?: string
    onTaskClick?: (task: FivFoldKanbanTask) => void
    onAddTask?: (columnId: string) => void
  }
}

export function KanbanBoard({
  className,
  columns,
  onColumnsChange,
  mobileLayout = "stack",
  sharedProps,
}: KanbanBoardProps) {
  const sharedTaskProps: Omit<TaskCardProps, "task" | "isDragging"> = {
    showPriority: sharedProps.showPriority,
    showAssignee: sharedProps.showAssignee,
    showDueDate: sharedProps.showDueDate,
    showTimeTracking: sharedProps.showTimeTracking,
    showLabels: sharedProps.showLabels,
    showAttachments: sharedProps.showAttachments,
    showComments: sharedProps.showComments,
  }

  return (
    <TooltipProvider>
      <div className={cn("flex h-full flex-col", className)}>
        <div className="hidden sm:block h-full">
          <DragProvider
            columns={columns}
            onColumnsChange={onColumnsChange}
            sharedTaskProps={sharedTaskProps}
          >
            <ScrollArea className="h-full w-full">
              <div className="flex gap-3 p-4">
                {columns.map((column) => (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    tasks={column.tasks}
                    {...sharedProps}
                    onAddTask={() => sharedProps.onAddTask?.(column.id)}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </DragProvider>
        </div>

        <div className="block sm:hidden">
          {mobileLayout === "stack" ? (
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-3 p-3">
                {columns.map((column) => (
                  <MobileColumn
                    key={column.id}
                    column={column}
                    tasks={column.tasks}
                    {...sharedProps}
                    onAddTask={() => sharedProps.onAddTask?.(column.id)}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <DragProvider
              columns={columns}
              onColumnsChange={onColumnsChange}
              sharedTaskProps={sharedTaskProps}
            >
              <ScrollArea className="h-full w-full">
                <div className="flex gap-3 p-3">
                  {columns.map((column) => (
                    <KanbanColumn
                      key={column.id}
                      column={column}
                      tasks={column.tasks}
                      {...sharedProps}
                      onAddTask={() => sharedProps.onAddTask?.(column.id)}
                    />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </DragProvider>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
