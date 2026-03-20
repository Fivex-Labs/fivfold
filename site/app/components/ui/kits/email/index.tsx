"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  Pencil,
  Trash2,
  Search,
  Menu,
  X,
  ChevronDown,
  Inbox,
  Send,
  File,
} from "lucide-react"

import type { FivFoldEmailFolder, EmailKitProps, ComposeDefaults } from "./types"
import { ThreadItem } from "./thread-item"
import { MessagePanel } from "./message-panel"
import { ComposeDialog } from "./compose-dialog"
import { SidebarContent } from "./sidebar-content"

// Re-export types for consumers
export type {
  FivFoldEmailFolder,
  FivFoldEmailLabel,
  FivFoldEmailAttachment,
  FivFoldEmailMessage,
  FivFoldEmailThread,
  EmailKitProps,
  ComposeDefaults,
} from "./types"

const DEFAULT_FOLDERS: FivFoldEmailFolder[] = [
  { id: "inbox", label: "Inbox", icon: <Inbox className="h-4 w-4" /> },
  { id: "sent", label: "Sent", icon: <Send className="h-4 w-4" /> },
  { id: "drafts", label: "Drafts", icon: <File className="h-4 w-4" /> },
  { id: "trash", label: "Trash", icon: <Trash2 className="h-4 w-4" /> },
]

export function EmailKit({
  className,
  folders = DEFAULT_FOLDERS,
  selectedFolderId,
  onFolderSelect,
  searchValue = "",
  onSearchChange,
  threads = [],
  loadingThreads = false,
  selectedThreadId,
  onThreadSelect,
  message = null,
  loadingMessage = false,
  onCompose,
  onSend,
  onStar,
  onDelete,
  onArchive,
  onReply,
  onReplyAll,
  onForward,
  availableLabels = [],
  onLabelSelect,
  emptyThreadsText = "No messages",
  emptyMessageText = "Select a thread to read",
  composeTitle = "New Message",
  forceLayout,
  portalContainer,
}: EmailKitProps) {
  const [composeOpen, setComposeOpen] = React.useState(false)
  const [composeDefaults, setComposeDefaults] = React.useState<ComposeDefaults | null>(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false)
  const [mobileView, setMobileView] = React.useState<"threads" | "message">("threads")

  const handleOpenComposeWithDefaults = React.useCallback((defaults: ComposeDefaults) => {
    setComposeDefaults(defaults)
    setComposeOpen(true)
  }, [])

  const handleComposeClose = React.useCallback(() => {
    setComposeOpen(false)
    setComposeDefaults(null)
  }, [])

  const showMobile = forceLayout === "mobile"
  const showTablet = forceLayout === "tablet"
  const showDesktop = forceLayout === "desktop"

  const selectedThread = threads.find((t) => t.id === selectedThreadId) ?? null

  const handleThreadSelect = (threadId: string) => {
    onThreadSelect?.(threadId)
    setMobileView("message")
  }

  const handleCompose = () => {
    setComposeOpen(true)
    onCompose?.()
  }

  const handleMobileBack = () => {
    setMobileView("threads")
  }

  const sidebarProps = {
    folders,
    selectedFolderId,
    onFolderSelect,
    availableLabels,
    onLabelSelect,
    onCompose: handleCompose,
    onCloseSidenav: () => setMobileSidebarOpen(false),
  }

  return (
    <TooltipProvider>
      <div
        className={cn(
          "relative flex h-full w-full min-w-0 overflow-hidden rounded-lg border border-border bg-background",
          className
        )}
        style={{ minHeight: "500px" }}
      >
        {/* ── Desktop layout (≥1280px) ── */}
        <div
          className={cn(
            "h-full w-full min-w-0",
            forceLayout ? (showDesktop ? "flex" : "hidden") : "hidden xl:flex"
          )}
        >
          <div className="grid h-full w-full grid-cols-[minmax(140px,18%)_minmax(200px,32%)_1fr] min-w-0">
            <div className="flex min-w-0 flex-col overflow-hidden border-r border-border">
              <SidebarContent {...sidebarProps} />
            </div>
            <div className="flex min-w-0 flex-col overflow-hidden border-r border-border">
              <div className="border-b p-3 min-w-0">
                <div className="relative min-w-0">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="min-w-0 pl-8"
                  />
                </div>
              </div>
              <ScrollArea className="flex-1 overflow-x-hidden min-w-0">
                {loadingThreads ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
                  </div>
                ) : threads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Inbox className="h-10 w-10 opacity-30" />
                    <p className="mt-2 text-sm">{emptyThreadsText}</p>
                  </div>
                ) : (
                  threads.map((thread) => (
                    <ThreadItem
                      key={thread.id}
                      thread={thread}
                      selected={thread.id === selectedThreadId}
                      onClick={() => onThreadSelect?.(thread.id)}
                      onStar={(starred) => onStar?.(thread.id, starred)}
                      availableLabels={availableLabels}
                    />
                  ))
                )}
              </ScrollArea>
            </div>
            <div className="flex min-w-0 flex-col overflow-hidden">
              <MessagePanel
                thread={selectedThread}
                message={message}
                loading={loadingMessage}
                onReply={onReply}
                onReplyAll={onReplyAll}
                onForward={onForward}
                onOpenComposeWithDefaults={handleOpenComposeWithDefaults}
                onDelete={onDelete}
                onArchive={onArchive}
                emptyText={emptyMessageText}
                forceLayout={forceLayout}
              />
            </div>
          </div>
        </div>

        {/* ── Tablet layout (768px–1279px): 2-panel split, sidebar overlay ── */}
        <div
          className={cn(
            "h-full w-full min-w-0 flex-col",
            forceLayout ? (showTablet ? "flex" : "hidden") : "hidden md:flex xl:hidden"
          )}
        >
          <div className="flex h-full min-w-0 flex-col">
            <div className="flex items-center gap-2 border-b px-3 py-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="min-w-0 pl-8"
                />
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={handleCompose}>
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid h-full min-w-0 flex-1 grid-cols-[minmax(180px,40%)_1fr]">
              <div className="flex min-w-0 flex-col overflow-hidden border-r border-border">
                <ScrollArea className="flex-1">
                  {loadingThreads ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
                    </div>
                  ) : threads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                      <Inbox className="h-10 w-10 opacity-30" />
                      <p className="mt-2 text-sm">{emptyThreadsText}</p>
                    </div>
                  ) : (
                    threads.map((thread) => (
                      <ThreadItem
                        key={thread.id}
                        thread={thread}
                        selected={thread.id === selectedThreadId}
                        onClick={() => onThreadSelect?.(thread.id)}
                        onStar={(starred) => onStar?.(thread.id, starred)}
                        availableLabels={availableLabels}
                      />
                    ))
                  )}
                </ScrollArea>
              </div>
              <div className="flex min-w-0 flex-col overflow-hidden">
                <MessagePanel
                  thread={selectedThread}
                  message={message}
                  loading={loadingMessage}
                  onReply={onReply}
                  onReplyAll={onReplyAll}
                  onForward={onForward}
                  onOpenComposeWithDefaults={handleOpenComposeWithDefaults}
                  onDelete={onDelete}
                  onArchive={onArchive}
                  emptyText={emptyMessageText}
                  forceLayout={forceLayout}
                />
              </div>
            </div>
          </div>
          <div
            className={cn(
              "absolute inset-0 z-50 flex transition-opacity duration-300",
              mobileSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div
              className={cn(
                "relative z-10 flex h-full w-[240px] flex-col bg-background shadow-xl transition-transform duration-300 ease-in-out",
                mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
              )}
            >
              <div className="flex items-center justify-between border-b px-4 py-3">
                <span className="text-sm font-semibold">Folders</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <SidebarContent {...sidebarProps} />
            </div>
          </div>
        </div>

        {/* ── Mobile layout (<768px) ── */}
        <div
          className={cn(
            "flex h-full min-w-0 flex-1 flex-col overflow-hidden",
            forceLayout ? (showMobile ? "" : "hidden") : "md:hidden"
          )}
          style={{ width: "100%", maxWidth: "100%" }}
        >
          {/* Mobile header */}
          <div className="flex min-w-0 shrink-0 items-center gap-2 border-b px-3 py-2">
            {mobileView === "message" ? (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleMobileBack}>
                <ChevronDown className="h-4 w-4 rotate-90" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setMobileSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            <div className="min-w-0 flex-1">
              {mobileView === "threads" ? (
                <div className="relative min-w-0">
                  <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="h-8 min-w-0 pl-8"
                  />
                </div>
              ) : (
                <p className="truncate text-sm font-medium">{selectedThread?.subject}</p>
              )}
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={handleCompose}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile thread list */}
          {mobileView === "threads" && (
            <ScrollArea className="min-w-0 flex-1 overflow-hidden">
              {loadingThreads ? (
                <div className="flex items-center justify-center py-16">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
                </div>
              ) : threads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Inbox className="h-10 w-10 opacity-30" />
                  <p className="mt-2 text-sm">{emptyThreadsText}</p>
                </div>
              ) : (
                threads.map((thread) => (
                  <ThreadItem
                    key={thread.id}
                    thread={thread}
                    selected={thread.id === selectedThreadId}
                    onClick={() => handleThreadSelect(thread.id)}
                    onStar={(starred) => onStar?.(thread.id, starred)}
                    availableLabels={availableLabels}
                  />
                ))
              )}
            </ScrollArea>
          )}

          {/* Mobile message detail */}
          {mobileView === "message" && (
            <div className="flex-1 min-w-0 overflow-hidden">
              <MessagePanel
                thread={selectedThread}
                message={message}
                loading={loadingMessage}
                onReply={onReply}
                onReplyAll={onReplyAll}
                onForward={onForward}
                onOpenComposeWithDefaults={handleOpenComposeWithDefaults}
                onDelete={onDelete}
                onArchive={onArchive}
                emptyText={emptyMessageText}
                forceLayout={forceLayout}
              />
            </div>
          )}

          {/* Mobile sidebar overlay */}
          <div
            className={cn(
              "absolute inset-0 z-50 flex transition-opacity duration-300",
              mobileSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div
              className={cn(
                "relative z-10 flex h-full w-[240px] flex-col bg-background shadow-xl transition-transform duration-300 ease-in-out",
                mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
              )}
            >
              <div className="flex items-center justify-between border-b px-4 py-3">
                <span className="text-sm font-semibold">Folders</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <SidebarContent {...sidebarProps} />
            </div>
          </div>
        </div>

        {/* Compose dialog */}
        <ComposeDialog
          open={composeOpen}
          onClose={handleComposeClose}
          onSend={onSend}
          title={composeTitle}
          container={portalContainer}
          defaults={composeDefaults}
          forceLayout={forceLayout}
        />
      </div>
    </TooltipProvider>
  )
}
