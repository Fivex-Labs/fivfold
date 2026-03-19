import * as React from "react"

export interface FivFoldEmailFolder {
  id: string
  label: string
  icon?: React.ReactNode
  count?: number
}

export interface FivFoldEmailLabel {
  id: string
  name: string
  color?: string
}

export interface FivFoldEmailAttachment {
  id: string
  name: string
  size: string
  ext?: string
  thumbnailUrl?: string
}

export interface FivFoldEmailMessage {
  id: string
  subject: string
  from: string
  fromEmail?: string
  to: string
  toEmail?: string
  datetime: string
  body: React.ReactNode
  labels?: string[]
  avatarUrl?: string
  attachments?: FivFoldEmailAttachment[]
  toRecipients?: string[]
  ccRecipients?: string[]
  bccRecipients?: string[]
}

export interface FivFoldEmailThread {
  id: string
  from: string
  fromEmail?: string
  subject: string
  snippet: string
  datetime: string
  unread?: boolean
  starred?: boolean
  labels?: string[]
  conversationCount?: number
  messages?: FivFoldEmailMessage[]
}

export interface EmailKitProps {
  className?: string
  folders?: FivFoldEmailFolder[]
  selectedFolderId?: string
  onFolderSelect?: (folderId: string) => void
  searchValue?: string
  onSearchChange?: (value: string) => void
  threads?: FivFoldEmailThread[]
  loadingThreads?: boolean
  selectedThreadId?: string | null
  onThreadSelect?: (threadId: string) => void
  message?: FivFoldEmailMessage | null
  loadingMessage?: boolean
  onCompose?: () => void
  onSend?: (data: {
    to: string[]
    cc: string[]
    bcc: string[]
    subject: string
    body: string
    attachments?: File[]
  }) => void
  onStar?: (threadId: string, starred: boolean) => void
  onDelete?: (threadId: string) => void
  onArchive?: (threadId: string) => void
  onReply?: (message: FivFoldEmailMessage) => void
  onReplyAll?: (message: FivFoldEmailMessage) => void
  onForward?: (message: FivFoldEmailMessage) => void
  availableLabels?: FivFoldEmailLabel[]
  onLabelSelect?: (labelId: string) => void
  emptyThreadsText?: string
  emptyMessageText?: string
  composeTitle?: string
  /** Override responsive layout (for demos in fixed-width containers). Omit to use viewport breakpoints. */
  forceLayout?: "mobile" | "tablet" | "desktop"
  /** When set, dialogs and overlays render inside this element (for demos in device preview). */
  portalContainer?: HTMLElement | null
}

export interface ComposeDefaults {
  to?: string[]
  cc?: string[]
  bcc?: string[]
  subject?: string
  body?: string
}
