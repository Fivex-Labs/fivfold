"use client"

import * as React from "react"
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  rectIntersection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { TaskCard } from "./task-card"
import type { FivFoldKanbanColumn, FivFoldKanbanTask } from "./types"
import type { TaskCardProps } from "./task-card"

export interface DragProviderProps {
  children: React.ReactNode
  columns: FivFoldKanbanColumn[]
  onColumnsChange: (columns: FivFoldKanbanColumn[]) => void
  sharedTaskProps: Omit<TaskCardProps, "task" | "isDragging">
}

export function DragProvider({
  children,
  columns,
  onColumnsChange,
  sharedTaskProps,
}: DragProviderProps) {
  const [activeTask, setActiveTask] = React.useState<FivFoldKanbanTask | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const findColumnByTaskId = (taskId: string): FivFoldKanbanColumn | undefined =>
    columns.find((col) => col.tasks.some((t) => t.id === taskId))

  const handleDragStart = ({ active }: DragStartEvent) => {
    const sourceColumn = findColumnByTaskId(active.id as string)
    const task = sourceColumn?.tasks.find((t) => t.id === active.id)
    if (task) setActiveTask(task)
  }

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return
    const activeColumnId = findColumnByTaskId(active.id as string)?.id
    const overColumnId =
      columns.find((c) => c.id === over.id)?.id ?? findColumnByTaskId(over.id as string)?.id

    if (!activeColumnId || !overColumnId || activeColumnId === overColumnId) return

    const updated = columns.map((col) => {
      const task = columns.find((c) => c.id === activeColumnId)?.tasks.find((t) => t.id === active.id)
      if (!task) return col
      if (col.id === activeColumnId) return { ...col, tasks: col.tasks.filter((t) => t.id !== active.id) }
      if (col.id === overColumnId) return { ...col, tasks: [...col.tasks, { ...task, status: col.id }] }
      return col
    })

    onColumnsChange(updated)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null)
    if (!over || active.id === over.id) return

    const activeColumn = findColumnByTaskId(active.id as string)
    const overColumn = findColumnByTaskId(over.id as string) ?? columns.find((c) => c.id === over.id)

    if (!activeColumn || !overColumn) return

    if (activeColumn.id === overColumn.id) {
      const oldIndex = activeColumn.tasks.findIndex((t) => t.id === active.id)
      const newIndex = overColumn.tasks.findIndex((t) => t.id === over.id)
      if (oldIndex !== newIndex) {
        onColumnsChange(
          columns.map((col) =>
            col.id === activeColumn.id
              ? { ...col, tasks: arrayMove(col.tasks, oldIndex, newIndex) }
              : col
          )
        )
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay>
        {activeTask ? (
          <TaskCard task={activeTask} {...sharedTaskProps} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
