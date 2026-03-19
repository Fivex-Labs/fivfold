"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PRIORITY_CONFIG } from "./task-card"
import type { FivFoldKanbanTask } from "./types"

export interface TaskDetailProps {
  task: FivFoldKanbanTask | null
  open: boolean
  onOpenChange: (open: boolean) => void
  /** When "mobile", dialog goes full-screen and uses vertical layout */
  forceLayout?: "mobile" | "tablet" | "desktop"
}

export function TaskDetail({ task, open, onOpenChange, forceLayout }: TaskDetailProps) {
  if (!task) return null

  const priority = PRIORITY_CONFIG[task.priority]
  const hasTimeTracking =
    (task.estimatedHours ?? 0) > 0 || (task.actualHours ?? 0) > 0
  const timeProgress =
    (task.estimatedHours ?? 0) > 0
      ? Math.min(100, ((task.actualHours ?? 0) / task.estimatedHours!) * 100)
      : 0

  const isMobileFullScreen = forceLayout === "mobile"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "p-6 sm:max-w-[680px]",
          isMobileFullScreen &&
            "inset-0 h-full w-full max-h-none max-w-none min-h-0 translate-x-0 translate-y-0 rounded-none"
        )}
      >
        <div
          className={cn(
            "flex gap-6",
            isMobileFullScreen ? "flex-col" : "flex-col sm:flex-row sm:gap-8"
          )}
        >
          <div
            className={cn(
              "min-w-0 flex-1 space-y-4",
              !isMobileFullScreen && "sm:flex-2"
            )}
          >
            <DialogHeader>
              <DialogTitle>{task.title}</DialogTitle>
              {task.taskId && (
                <DialogDescription className="text-xs">
                  {task.taskId}
                </DialogDescription>
              )}
            </DialogHeader>
            {task.description && (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {task.description}
              </p>
            )}
            {task.labels && task.labels.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {task.labels.map((label) => (
                  <span
                    key={label.id}
                    className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium"
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
            )}
          </div>

          <div
            className={cn(
              "flex flex-col gap-4",
              isMobileFullScreen
                ? "border-t border-border pt-6"
                : "pt-6 sm:w-52 sm:shrink-0 sm:border-l sm:border-border sm:pl-8 sm:pt-0"
            )}
          >
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Details
            </h4>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Status</dt>
                <dd className="mt-0.5 font-medium capitalize">
                  {task.status.replace(/-/g, " ")}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Priority</dt>
                <dd>
                  <span
                    className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-medium ${priority.className}`}
                  >
                    {priority.icon}
                    {priority.label}
                  </span>
                </dd>
              </div>
              {task.assignee && (
                <div>
                  <dt className="text-xs text-muted-foreground">Assignee</dt>
                  <dd className="mt-0.5 flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={task.assignee.avatar}
                        alt={task.assignee.name}
                      />
                      <AvatarFallback className="text-[10px]">
                        {task.assignee.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span>{task.assignee.name}</span>
                  </dd>
                </div>
              )}
              {task.reporter && (
                <div>
                  <dt className="text-xs text-muted-foreground">Reporter</dt>
                  <dd className="mt-0.5 flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={task.reporter.avatar}
                        alt={task.reporter.name}
                      />
                      <AvatarFallback className="text-[10px]">
                        {task.reporter.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span>{task.reporter.name}</span>
                  </dd>
                </div>
              )}
              {task.dueDate && (
                <div>
                  <dt className="text-xs text-muted-foreground">Due date</dt>
                  <dd className="mt-0.5 font-medium">{task.dueDate}</dd>
                </div>
              )}
              {task.sprint && (
                <div>
                  <dt className="text-xs text-muted-foreground">Sprint</dt>
                  <dd className="mt-0.5 font-medium">{task.sprint}</dd>
                </div>
              )}
              {task.storyPoints !== undefined && task.storyPoints > 0 && (
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Story points
                  </dt>
                  <dd className="mt-0.5 font-medium">{task.storyPoints}</dd>
                </div>
              )}
            </dl>

            {hasTimeTracking && (
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Time tracking
                </h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {task.actualHours ?? 0}h logged / {task.estimatedHours ?? 0}h
                      estimated
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary/80 transition-all"
                      style={{ width: `${timeProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
