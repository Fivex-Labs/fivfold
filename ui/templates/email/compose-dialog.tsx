"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { RecipientInput } from "./recipient-input"
import { Paperclip, X } from "lucide-react"
import type { ComposeDefaults } from "./types"

export interface ComposeDialogOnSendData {
  to: string[]
  cc: string[]
  bcc: string[]
  subject: string
  body: string
  attachments?: File[]
}

export interface ComposeDialogProps {
  open: boolean
  onClose: () => void
  onSend?: (data: ComposeDialogOnSendData) => void
  availableContacts?: string[]
  title?: string
  container?: HTMLElement | null
  defaults?: ComposeDefaults | null
  /** When set with container, compose goes full-screen on mobile for device preview */
  forceLayout?: "mobile" | "tablet" | "desktop"
}

export function ComposeDialog({
  open,
  onClose,
  onSend,
  availableContacts = [],
  title = "New Message",
  container,
  defaults,
  forceLayout,
}: ComposeDialogProps) {
  const [to, setTo] = React.useState<string[]>([])
  const [cc, setCc] = React.useState<string[]>([])
  const [bcc, setBcc] = React.useState<string[]>([])
  const [showCc, setShowCc] = React.useState(false)
  const [showBcc, setShowBcc] = React.useState(false)
  const [subject, setSubject] = React.useState("")
  const [body, setBody] = React.useState("")
  const [attachments, setAttachments] = React.useState<File[]>([])
  const [showSubjectWarning, setShowSubjectWarning] = React.useState(false)
  const [sendConfirmed, setSendConfirmed] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const resetForm = React.useCallback(() => {
    setTo([])
    setCc([])
    setBcc([])
    setShowCc(false)
    setShowBcc(false)
    setSubject("")
    setBody("")
    setAttachments([])
    setShowSubjectWarning(false)
    setSendConfirmed(false)
  }, [])

  React.useEffect(() => {
    if (open) {
      if (defaults) {
        setTo(defaults.to ?? [])
        setCc(defaults.cc ?? [])
        setBcc(defaults.bcc ?? [])
        setShowCc((defaults.cc?.length ?? 0) > 0)
        setShowBcc((defaults.bcc?.length ?? 0) > 0)
        setSubject(defaults.subject ?? "")
        setBody(defaults.body ?? "")
      } else {
        resetForm()
      }
    }
  }, [open, defaults, resetForm])

  const handleSend = () => {
    if (subject.trim() === "" && !sendConfirmed) {
      setShowSubjectWarning(true)
      return
    }
    if (subject.trim() === "" && sendConfirmed) {
      onSend?.({ to, cc, bcc, subject, body, attachments: attachments.length ? attachments : undefined })
      resetForm()
      onClose()
      return
    }
    onSend?.({ to, cc, bcc, subject, body, attachments: attachments.length ? attachments : undefined })
    resetForm()
    onClose()
  }

  const handleSendAnyway = () => {
    setSendConfirmed(true)
    setShowSubjectWarning(false)
    onSend?.({ to, cc, bcc, subject, body, attachments: attachments.length ? attachments : undefined })
    resetForm()
    onClose()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files?.length) setAttachments((prev) => [...prev, ...Array.from(files)])
    e.target.value = ""
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const isMobileFullScreen = container && forceLayout === "mobile"

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className={cn(
          "flex flex-col gap-0 p-0",
          isMobileFullScreen
            ? "inset-0 h-full w-full max-h-none max-w-none min-h-0 translate-x-0 translate-y-0 rounded-none"
            : "max-h-[90vh] sm:max-w-2xl"
        )}
        container={container}
      >
        <DialogHeader className="shrink-0 border-b px-4 py-3">
          <DialogTitle className="text-base">{title}</DialogTitle>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="flex flex-col gap-1 px-4 pt-2">
            <RecipientInput label="To" value={to} onChange={setTo} suggestions={availableContacts} />
            {showCc && (
              <RecipientInput label="Cc" value={cc} onChange={setCc} suggestions={availableContacts} />
            )}
            {showBcc && (
              <RecipientInput label="Bcc" value={bcc} onChange={setBcc} suggestions={availableContacts} />
            )}
            <div className="flex items-center gap-2">
              <Separator className="flex-1" />
              <div className="flex gap-1">
                {!showCc && (
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setShowCc(true)}>
                    Cc
                  </Button>
                )}
                {!showBcc && (
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => setShowBcc(true)}>
                    Bcc
                  </Button>
                )}
              </div>
            </div>
            <div className="py-1">
              <Input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="border-0 pl-2 pr-0 text-sm shadow-none focus-visible:ring-0"
              />
            </div>
            <Separator />
          </div>
          <Textarea
            placeholder="Write your message..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[200px] flex-1 resize-none rounded-none border-0 px-4 py-3 shadow-none focus-visible:ring-0"
          />
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-1 border-t px-4 py-2">
              {attachments.map((file, i) => (
                <Badge key={i} variant="secondary" className="h-6 gap-1 px-1.5 text-xs">
                  <span className="max-w-[120px] truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(i)}
                    className="rounded-sm hover:text-foreground"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          {showSubjectWarning && (
            <div className="flex items-center justify-between gap-2 border-t border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm">
              <span className="text-amber-700 dark:text-amber-400">Subject is empty. Send anyway?</span>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={handleSendAnyway}>
                  Send anyway
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowSubjectWarning(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center justify-between border-t px-4 py-3">
          <div className="flex items-center gap-1">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="h-8 w-8"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSend} size="sm" disabled={to.length === 0}>
              Send
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              Discard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
