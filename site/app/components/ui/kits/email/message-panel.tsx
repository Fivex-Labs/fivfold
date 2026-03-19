"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Paperclip, Reply, ReplyAll, Forward, Archive, Trash2, Inbox, AlertCircle } from "lucide-react"
import type { FivFoldEmailMessage, FivFoldEmailThread } from "./types"
import type { ComposeDefaults } from "./types"

function getMessageBodyText(body: React.ReactNode): string {
  if (body == null) return ""
  if (typeof body === "string") return body
  if (typeof body === "number") return String(body)
  if (Array.isArray(body)) return body.map(getMessageBodyText).join("")
  if (React.isValidElement(body)) {
    const children = (body.props as { children?: React.ReactNode })?.children
    return children != null ? getMessageBodyText(children) : ""
  }
  return "[Original message]"
}

export interface MessagePanelProps {
  thread: FivFoldEmailThread | null
  message: FivFoldEmailMessage | null
  loading: boolean
  onReply?: (msg: FivFoldEmailMessage) => void
  onReplyAll?: (msg: FivFoldEmailMessage) => void
  onForward?: (msg: FivFoldEmailMessage) => void
  onOpenComposeWithDefaults?: (defaults: ComposeDefaults) => void
  onDelete?: (threadId: string) => void
  onArchive?: (threadId: string) => void
  emptyText?: string
  /** When "mobile", used in device preview: reduce right padding for full-width content */
  forceLayout?: "mobile" | "tablet" | "desktop"
}

export function MessagePanel({
  thread,
  message,
  loading,
  onReply,
  onReplyAll,
  onForward,
  onOpenComposeWithDefaults,
  onDelete,
  onArchive,
  emptyText,
  forceLayout,
}: MessagePanelProps) {
  if (!thread) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
        <Inbox className="h-12 w-12 opacity-30" />
        <p className="text-sm">{emptyText ?? "Select a thread to read"}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    )
  }

  const messages = thread.messages ?? (message ? [message] : [])
  const isMobile = forceLayout === "mobile"
  const contentPadding = isMobile ? "pl-4 pr-0" : "px-4"

  return (
    <div className="flex h-full w-full min-w-0 flex-col overflow-x-hidden">
      <div className={cn("flex min-w-0 items-center justify-between gap-2 border-b py-3", contentPadding)}>
        <h2 className="truncate text-base font-semibold leading-tight">{thread.subject}</h2>
        <div className="flex shrink-0 gap-1">
          {onArchive && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onArchive(thread.id)}
              aria-label="Archive"
            >
              <Archive className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(thread.id)}
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <ScrollArea className="min-w-0 w-full flex-1 overflow-x-hidden">
        <div className="w-full min-w-0 divide-y">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <AlertCircle className="h-8 w-8 opacity-30" />
              <p className="mt-2 text-sm">No messages</p>
            </div>
          ) : (
            <Accordion
              key={thread.id}
              multiple
              defaultValue={
                messages.length > 0 ? [messages[messages.length - 1].id] : []
              }
            >
              {messages.map((msg) => (
                <AccordionItem key={msg.id} value={msg.id} className="border-0">
                  <AccordionTrigger className={cn("py-3 hover:no-underline", contentPadding)}>
                    <div className="flex w-full items-center gap-3 text-left">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {msg.from.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-medium">{msg.from}</span>
                          <span className="shrink-0 mr-2 text-xs text-muted-foreground">{msg.datetime}</span>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">to {msg.to}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className={cn("pb-4", contentPadding)}>
                    <div className="w-full min-w-0 overflow-x-hidden prose prose-sm max-w-none text-foreground dark:prose-invert">
                      {msg.body}
                    </div>
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {msg.attachments.map((att) => (
                          <div
                            key={att.id}
                            className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs"
                          >
                            <Paperclip className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">{att.name}</span>
                            <span className="text-muted-foreground">{att.size}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onReply?.(msg)
                          onOpenComposeWithDefaults?.({
                            to: [msg.fromEmail ?? msg.from],
                            subject: thread.subject.startsWith("RE: ") ? thread.subject : `RE: ${thread.subject}`,
                            body: `\n\nOn ${msg.datetime}, ${msg.from} wrote:\n\n${getMessageBodyText(msg.body).split("\n").map((l) => `> ${l}`).join("\n")}\n`,
                          })
                        }}
                      >
                        <Reply className="mr-1 h-3.5 w-3.5" /> Reply
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onReplyAll?.(msg)
                          const toRecip = msg.fromEmail ?? msg.from
                          const others = [...(msg.toRecipients ?? []), ...(msg.ccRecipients ?? [])].filter(
                            (e) => e && e !== toRecip
                          )
                          onOpenComposeWithDefaults?.({
                            to: [toRecip],
                            cc: others.length ? others : undefined,
                            subject: thread.subject.startsWith("RE: ") ? thread.subject : `RE: ${thread.subject}`,
                            body: `\n\nOn ${msg.datetime}, ${msg.from} wrote:\n\n${getMessageBodyText(msg.body).split("\n").map((l) => `> ${l}`).join("\n")}\n`,
                          })
                        }}
                      >
                        <ReplyAll className="mr-1 h-3.5 w-3.5" /> Reply All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onForward?.(msg)
                          onOpenComposeWithDefaults?.({
                            subject: thread.subject.startsWith("FW: ") ? thread.subject : `FW: ${thread.subject}`,
                            body: `\n\n---------- Forwarded message ---------\nFrom: ${msg.from}\nDate: ${msg.datetime}\n\n${getMessageBodyText(msg.body)}\n`,
                          })
                        }}
                      >
                        <Forward className="mr-1 h-3.5 w-3.5" /> Forward
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
