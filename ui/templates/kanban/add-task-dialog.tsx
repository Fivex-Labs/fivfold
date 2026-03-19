"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { FivFoldKanbanTask, FivFoldKanbanLabel, TaskPriority } from "./types"

export interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  columnId: string
  columnTitle: string
  onSubmit: (task: Partial<FivFoldKanbanTask>) => void
  availableLabels?: FivFoldKanbanLabel[]
  /** When "mobile", dialog goes full-screen */
  forceLayout?: "mobile" | "tablet" | "desktop"
}

const PRIORITIES: TaskPriority[] = ["low", "medium", "high", "urgent"]

export function AddTaskDialog({
  open,
  onOpenChange,
  columnId,
  columnTitle,
  onSubmit,
  availableLabels = [],
  forceLayout,
}: AddTaskDialogProps) {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [priority, setPriority] = React.useState<TaskPriority>("medium")
  const [selectedLabels, setSelectedLabels] = React.useState<FivFoldKanbanLabel[]>([])
  const [storyPoints, setStoryPoints] = React.useState<number | "">("")

  const toggleLabel = (label: FivFoldKanbanLabel) => {
    setSelectedLabels((prev) =>
      prev.some((l) => l.id === label.id)
        ? prev.filter((l) => l.id !== label.id)
        : [...prev, label]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      status: columnId,
      priority,
      labels: selectedLabels.length > 0 ? selectedLabels : undefined,
      storyPoints: typeof storyPoints === "number" ? storyPoints : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    setTitle("")
    setDescription("")
    setPriority("medium")
    setSelectedLabels([])
    setStoryPoints("")
    onOpenChange(false)
  }

  const isMobileFullScreen = forceLayout === "mobile"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "p-6 sm:max-w-[425px]",
          isMobileFullScreen &&
            "inset-0 h-full w-full max-h-none max-w-none min-h-0 translate-x-0 translate-y-0 rounded-none"
        )}
      >
        <DialogHeader>
          <DialogTitle>Add task to {columnTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="mt-2"
              rows={3}
            />
          </div>
          <div>
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {availableLabels.length > 0 && (
            <div>
              <Label>Labels</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {availableLabels.map((label) => {
                  const isSelected = selectedLabels.some((l) => l.id === label.id)
                  return (
                    <button
                      key={label.id}
                      type="button"
                      onClick={() => toggleLabel(label)}
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium transition-opacity hover:opacity-90 ${
                        isSelected ? "border-2" : "opacity-70"
                      }`}
                      style={{
                        backgroundColor: isSelected ? `${label.color}30` : `${label.color}15`,
                        color: label.color,
                        borderColor: `${label.color}${isSelected ? "80" : "40"}`,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: label.color }}
                      />
                      {label.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
          <div>
            <Label htmlFor="storyPoints">Story points</Label>
            <Input
              id="storyPoints"
              type="number"
              min={0}
              step={0.5}
              value={storyPoints === "" ? "" : storyPoints}
              onChange={(e) => {
                const v = e.target.value
                setStoryPoints(v === "" ? "" : Math.max(0, parseFloat(v) || 0))
              }}
              placeholder="Optional"
              className="mt-2 w-24"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Add task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
