"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { KanbanBoard } from "./board"
import { BoardHeader } from "./board-header"
import { AddTaskDialog } from "./add-task-dialog"
import { TaskDetail } from "./task-detail"
import type {
  FivFoldKanbanColumn,
  FivFoldKanbanTask,
  KanbanKitProps,
} from "./types"

export type {
  TaskPriority,
  FivFoldKanbanAssignee,
  FivFoldKanbanLabel,
  FivFoldKanbanTask,
  FivFoldKanbanColumn,
  KanbanKitProps,
} from "./types"

export function KanbanKit({
  className,
  columns: initialColumns,
  onColumnsChange,
  availableLabels,
  showPriority = true,
  showAssignee = true,
  showDueDate = true,
  showTimeTracking = false,
  showLabels = true,
  showAttachments = true,
  showComments = true,
  emptyStateText,
  onTaskClick,
  onAddTask,
  mobileLayout = "stack",
  boardTitle,
  searchPlaceholder,
  onSearch,
  portalContainer,
  forceLayout,
}: KanbanKitProps) {
  const [columns, setColumns] = React.useState(initialColumns)
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)
  const [isMobileViewport, setIsMobileViewport] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(max-width: 639px)")
    const handler = () => setIsMobileViewport(mq.matches)
    handler()
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const effectiveForceLayout =
    forceLayout ?? (isMobileViewport ? "mobile" : "desktop")
  const [addDialogColumn, setAddDialogColumn] = React.useState<FivFoldKanbanColumn | null>(null)
  const [detailTask, setDetailTask] = React.useState<FivFoldKanbanTask | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)

  React.useEffect(() => {
    setColumns(initialColumns)
  }, [initialColumns])

  const updateColumns = (updated: FivFoldKanbanColumn[]) => {
    setColumns(updated)
    onColumnsChange?.(updated)
  }

  const handleAddTaskClick = (columnId: string) => {
    if (onAddTask) {
      onAddTask(columnId)
      return
    }
    const col = columns.find((c) => c.id === columnId)
    if (col) {
      setAddDialogColumn(col)
      setAddDialogOpen(true)
    }
  }

  const handleTaskClick = (task: FivFoldKanbanTask) => {
    if (onTaskClick) {
      onTaskClick(task)
      return
    }
    setDetailTask(task)
    setDetailOpen(true)
  }

  const handleAddTaskSubmit = (partial: Partial<FivFoldKanbanTask>) => {
    if (!addDialogColumn) return
    const taskId = `KAN-${String(columns.flatMap((c) => c.tasks).length + 1).padStart(3, "0")}`
    const task: FivFoldKanbanTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      taskId,
      title: partial.title ?? "",
      description: partial.description,
      status: addDialogColumn.id,
      priority: partial.priority ?? "medium",
      assignee: partial.assignee,
      dueDate: partial.dueDate,
      estimatedHours: partial.estimatedHours,
      actualHours: partial.actualHours,
      labels: partial.labels,
      storyPoints: partial.storyPoints,
      attachments: partial.attachments,
      comments: partial.comments,
      createdAt: partial.createdAt ?? new Date().toISOString(),
      updatedAt: partial.updatedAt ?? new Date().toISOString(),
    }
    const updated = columns.map((col) =>
      col.id === addDialogColumn.id
        ? { ...col, tasks: [...col.tasks, task] }
        : col
    )
    updateColumns(updated)
    setAddDialogColumn(null)
    setAddDialogOpen(false)
  }

  const sharedProps = {
    showPriority,
    showAssignee,
    showDueDate,
    showTimeTracking,
    showLabels,
    showAttachments,
    showComments,
    emptyStateText,
    onTaskClick: handleTaskClick,
    onAddTask: handleAddTaskClick,
  }

  return (
    <div className={cn("flex h-full flex-col gap-3", className)}>
      {(boardTitle || onSearch) && (
        <BoardHeader
          title={boardTitle}
          searchPlaceholder={searchPlaceholder}
          onSearch={onSearch}
        />
      )}
      <KanbanBoard
        columns={columns}
        onColumnsChange={updateColumns}
        mobileLayout={mobileLayout}
        sharedProps={sharedProps}
      />
      <AddTaskDialog
        open={addDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open)
          if (!open) setAddDialogColumn(null)
        }}
        columnId={addDialogColumn?.id ?? ""}
        columnTitle={addDialogColumn?.title ?? ""}
        onSubmit={handleAddTaskSubmit}
        availableLabels={availableLabels}
        container={portalContainer}
        forceLayout={effectiveForceLayout}
      />
      <TaskDetail
        task={detailTask}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        container={portalContainer}
        forceLayout={effectiveForceLayout}
      />
    </div>
  )
}
