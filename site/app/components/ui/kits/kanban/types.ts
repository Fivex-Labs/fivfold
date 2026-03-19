export type TaskPriority = "low" | "medium" | "high" | "urgent"

export interface FivFoldKanbanAssignee {
  id: string
  name: string
  avatar?: string
  initials: string
}

export interface FivFoldKanbanLabel {
  id: string
  name: string
  color: string
}

export interface FivFoldKanbanTask {
  id: string
  title: string
  description?: string
  status: string
  priority: TaskPriority
  assignee?: FivFoldKanbanAssignee
  reporter?: FivFoldKanbanAssignee
  dueDate?: string
  estimatedHours?: number
  actualHours?: number
  labels?: FivFoldKanbanLabel[]
  taskId?: string
  storyPoints?: number
  sprint?: string
  attachments?: number
  comments?: number
  createdAt: string
  updatedAt: string
}

export interface FivFoldKanbanColumn {
  id: string
  title: string
  description?: string
  color?: string
  maxTasks?: number
  tasks: FivFoldKanbanTask[]
}

export interface KanbanKitProps {
  className?: string
  columns: FivFoldKanbanColumn[]
  onColumnsChange?: (columns: FivFoldKanbanColumn[]) => void
  availableLabels?: FivFoldKanbanLabel[]
  /** When set (e.g. in device preview), dialogs render inside this container instead of document.body */
  portalContainer?: HTMLElement | null
  /** When "mobile" (e.g. in device preview), Add Task and Task Detail dialogs go full-screen */
  forceLayout?: "mobile" | "tablet" | "desktop"
  showPriority?: boolean
  showAssignee?: boolean
  showDueDate?: boolean
  showTimeTracking?: boolean
  showLabels?: boolean
  showAttachments?: boolean
  showComments?: boolean
  emptyStateText?: string
  onTaskClick?: (task: FivFoldKanbanTask) => void
  onAddTask?: (columnId: string) => void
  mobileLayout?: "scroll" | "stack"
  boardTitle?: string
  searchPlaceholder?: string
  onSearch?: (query: string) => void
}
