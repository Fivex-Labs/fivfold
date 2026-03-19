"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Calendar,
  Clock,
  Paperclip,
  MessageSquare,
  ArrowDown,
  Minus,
  ArrowUp,
  Flame,
  GripVertical,
} from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { FivFoldKanbanTask, TaskPriority } from "./types"

export const PRIORITY_CONFIG: Record<
  TaskPriority,
  { icon: React.ReactNode; label: string; className: string }
> = {
  low: {
    icon: <ArrowDown className="h-3 w-3" />,
    label: "Low",
    className: "bg-secondary text-secondary-foreground border-border",
  },
  medium: {
    icon: <Minus className="h-3 w-3" />,
    label: "Medium",
    className: "bg-muted text-muted-foreground border-border",
  },
  high: {
    icon: <ArrowUp className="h-3 w-3" />,
    label: "High",
    className: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
  },
  urgent: {
    icon: <Flame className="h-3 w-3" />,
    label: "Urgent",
    className: "bg-destructive/15 text-destructive border-destructive/30",
  },
}

export interface TaskCardProps {
  task: FivFoldKanbanTask
  showPriority: boolean
  showAssignee: boolean
  showDueDate: boolean
  showTimeTracking: boolean
  showLabels: boolean
  showAttachments: boolean
  showComments: boolean
  onClick?: () => void
  isDragging?: boolean
}

export function TaskCard({
  task,
  showPriority,
  showAssignee,
  showDueDate,
  showTimeTracking,
  showLabels,
  showAttachments,
  showComments,
  onClick,
  isDragging = false,
}: TaskCardProps) {
  const priority = PRIORITY_CONFIG[task.priority]

  return (
    <Card
      className={cn(
        "cursor-pointer select-none rounded-lg border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md",
        isDragging && "rotate-1 scale-105 shadow-lg ring-2 ring-primary/30 opacity-80"
      )}
      onClick={onClick}
    >
      <div className="mb-2.5 flex items-start justify-between gap-2">
        {showLabels && task.labels && task.labels.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {task.labels.map((label) => (
              <span
                key={label.id}
                className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium"
                style={{
                  backgroundColor: `${label.color}20`,
                  color: label.color,
                  borderColor: `${label.color}40`,
                }}
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: label.color }}
                />
                {label.name}
              </span>
            ))}
          </div>
        ) : (
          <span />
        )}
        {task.taskId && (
          <span className="shrink-0 text-[10px] text-muted-foreground">{task.taskId}</span>
        )}
      </div>

      <p className="text-sm font-medium leading-snug text-card-foreground">{task.title}</p>

      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {showPriority && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium",
              priority.className
            )}
          >
            {priority.icon}
            {priority.label}
          </span>
        )}

        {task.storyPoints !== undefined && task.storyPoints > 0 && (
          <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
            {task.storyPoints} pts
          </span>
        )}

        {showDueDate && task.dueDate && (
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="h-2.5 w-2.5" />
            {task.dueDate}
          </span>
        )}

        {showTimeTracking && (task.estimatedHours ?? task.actualHours) && (
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-2.5 w-2.5" />
            {task.actualHours ?? 0}h / {task.estimatedHours ?? 0}h
          </span>
        )}

        {showAttachments && task.attachments !== undefined && task.attachments > 0 && (
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Paperclip className="h-2.5 w-2.5" />
            {task.attachments}
          </span>
        )}

        {showComments && task.comments !== undefined && task.comments > 0 && (
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <MessageSquare className="h-2.5 w-2.5" />
            {task.comments}
          </span>
        )}

        {showAssignee && task.assignee && (
          <Tooltip>
            <TooltipTrigger>
              <span className="inline-flex cursor-default">
                <Avatar className="ml-auto h-5 w-5">
                  <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                  <AvatarFallback className="bg-primary/10 text-[9px] text-primary">
                    {task.assignee.initials}
                  </AvatarFallback>
                </Avatar>
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">{task.assignee.name}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </Card>
  )
}

export interface SortableTaskCardProps extends TaskCardProps {
  id: string
}

export function SortableTaskCard({ id, ...props }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0.5 top-3 hidden cursor-grab items-center justify-center rounded text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing group-hover:flex"
        style={{ zIndex: 10 }}
        aria-label="Drag task"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </div>
      <TaskCard {...props} isDragging={isDragging} />
    </div>
  )
}
