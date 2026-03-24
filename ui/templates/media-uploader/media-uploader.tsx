"use client"

import * as React from "react"
import {
  Upload,
  FileIcon,
  ImageIcon,
  FileVideo,
  FileAudio,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import type {
  FinalizeUploadPayload,
  FinalizeUploadResult,
  PresignResponse,
  TrackedFile,
} from "./types"
import { runWithConcurrency, uploadToDirectStorage } from "./upload-client"

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(2)} MB`
}

function extensionOf(name: string): string {
  const i = name.lastIndexOf(".")
  return i >= 0 ? name.slice(i + 1).toUpperCase() : "FILE"
}

function FileKindIcon({ mime }: { mime: string }) {
  if (mime.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-muted-foreground" />
  if (mime.startsWith("video/")) return <FileVideo className="h-5 w-5 text-muted-foreground" />
  if (mime.startsWith("audio/")) return <FileAudio className="h-5 w-5 text-muted-foreground" />
  return <FileIcon className="h-5 w-5 text-muted-foreground" />
}

export interface MediaUploaderKitProps {
  className?: string
  /** Request presigned / direct upload instructions from your API. */
  presign: (file: File) => Promise<PresignResponse>
  /** Notify backend after storage attempt; returns accessUrl on success. */
  finalizeUpload: (payload: FinalizeUploadPayload) => Promise<FinalizeUploadResult>
  /** Max parallel storage uploads (default 3). Use 1 for sequential. */
  uploadConcurrency?: number
  multiple?: boolean
  maxFiles?: number
  accept?: string
  maxSizeBytes?: number
  warnSizeBytes?: number
  requireConfirm?: boolean
  disabled?: boolean
  onUploadSuccess?: (file: File, result: { accessUrl: string; auditId: string }) => void
  onUploadFailure?: (file: File, error: string) => void
  onAllComplete?: () => void
  /** When true, skips real HTTP upload (for docs demos only). */
  simulateTransport?: boolean
}

let idCounter = 0
function nextId(): string {
  return `f-${Date.now()}-${++idCounter}`
}

export function MediaUploaderKit({
  className,
  presign,
  finalizeUpload,
  uploadConcurrency = 3,
  multiple = true,
  maxFiles = 20,
  accept,
  maxSizeBytes = 50 * 1024 * 1024,
  warnSizeBytes = 10 * 1024 * 1024,
  requireConfirm = true,
  disabled = false,
  onUploadSuccess,
  onUploadFailure,
  onAllComplete,
  simulateTransport = false,
}: MediaUploaderKitProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [items, setItems] = React.useState<TrackedFile[]>([])
  const [confirmed, setConfirmed] = React.useState(!requireConfirm)
  const [isUploading, setIsUploading] = React.useState(false)

  const addFiles = React.useCallback(
    (list: FileList | File[]) => {
      const arr = Array.from(list)
      const capped = multiple ? arr.slice(0, maxFiles) : arr.slice(0, 1)
      setItems((prev) => {
        const next = [...prev]
        for (const file of capped) {
          if (next.length >= maxFiles) break
          next.push({ id: nextId(), file, status: "queued", progress: 0 })
        }
        return next
      })
      if (requireConfirm) setConfirmed(false)
    },
    [maxFiles, multiple, requireConfirm]
  )

  const onDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (disabled) return
      addFiles(e.dataTransfer.files)
    },
    [addFiles, disabled]
  )

  const onPick = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) addFiles(e.target.files)
      e.target.value = ""
    },
    [addFiles]
  )

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id))
  }

  const overallProgress = React.useMemo(() => {
    if (items.length === 0) return 0
    const sum = items.reduce((a, t) => a + t.progress, 0)
    return Math.round(sum / items.length)
  }, [items])

  const runUploads = async () => {
    setIsUploading(true)
    const toRun = items.filter((t) => t.status === "queued" || t.status === "error")
    const tasks = toRun.map((t) => async () => {
      const update = (patch: Partial<TrackedFile>) => {
        setItems((prev) => prev.map((x) => (x.id === t.id ? { ...x, ...patch } : x)))
      }

      let presignRes: PresignResponse
      try {
        update({ status: "presigning", progress: 0, error: undefined })
        presignRes = await presign(t.file)
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Presign failed"
        update({ status: "error", error: msg })
        onUploadFailure?.(t.file, msg)
        return
      }

      const { uploadSessionId, upload } = presignRes

      try {
        update({ status: "uploading", progress: 0 })
        await uploadToDirectStorage(t.file, upload, (p) => update({ progress: p }), {
          simulate: simulateTransport,
        })
        update({ status: "finalizing", progress: 100 })
        const fin = await finalizeUpload({ uploadSessionId, outcome: "success" })
        if (fin.success) {
          update({ status: "done", progress: 100, accessUrl: fin.accessUrl })
          onUploadSuccess?.(t.file, { accessUrl: fin.accessUrl, auditId: fin.auditId })
        } else {
          update({ status: "error", error: fin.error })
          onUploadFailure?.(t.file, fin.error)
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Upload failed"
        const http =
          e instanceof Error && "status" in e ? Number((e as { status?: number }).status) : undefined
        update({ status: "error", error: msg })
        onUploadFailure?.(t.file, msg)
        await finalizeUpload({
          uploadSessionId,
          outcome: "failure",
          failureReason: msg,
          storageHttpStatus: http,
        }).catch(() => {})
      }
    })

    await runWithConcurrency(tasks, uploadConcurrency)
    setIsUploading(false)
    onAllComplete?.()
  }

  const handleConfirmUpload = async () => {
    setConfirmed(true)
    await runUploads()
  }

  return (
    <Card className={cn("w-full max-w-2xl border-border/80", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Upload className="h-5 w-5" />
          Media uploader
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className={cn(
            "rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 px-6 py-10 text-center transition-colors",
            !disabled && "hover:border-primary/40 hover:bg-muted/50",
            disabled && "pointer-events-none opacity-60"
          )}
        >
          <Upload className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag and drop files here, or{" "}
            <button
              type="button"
              className="font-medium text-primary underline-offset-4 hover:underline"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
            >
              browse
            </button>
          </p>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            multiple={multiple}
            accept={accept}
            onChange={onPick}
            disabled={disabled}
          />
        </div>

        {items.length > 0 && (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Overall progress</span>
                <span>{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>

            <ScrollArea className="max-h-72 pr-3">
              <ul className="space-y-3">
                {items.map((t) => {
                  const warn = t.file.size >= warnSizeBytes
                  const over = t.file.size > maxSizeBytes
                  return (
                    <li
                      key={t.id}
                      className="flex gap-3 rounded-lg border border-border/60 bg-card p-3 text-left"
                    >
                      <div className="mt-0.5">
                        <FileKindIcon mime={t.file.type || "application/octet-stream"} />
                      </div>
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="truncate font-medium text-foreground">{t.file.name}</span>
                          <Badge variant="secondary" className="shrink-0 text-[10px]">
                            {extensionOf(t.file.name)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{formatBytes(t.file.size)}</span>
                        </div>
                        {warn && !over && (
                          <div className="flex gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-2 text-xs text-amber-950 dark:text-amber-100">
                            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                            <div>
                              <p className="font-medium">Large file</p>
                              <p className="text-muted-foreground">
                                This file is over {formatBytes(warnSizeBytes)}.
                              </p>
                            </div>
                          </div>
                        )}
                        {over && (
                          <div className="flex gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-2 text-xs text-destructive">
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            <div>
                              <p className="font-medium">Over limit</p>
                              <p>Max size is {formatBytes(maxSizeBytes)}. Remove or choose a smaller file.</p>
                            </div>
                          </div>
                        )}
                        {(t.status === "uploading" ||
                          t.status === "presigning" ||
                          t.status === "finalizing") && (
                          <Progress value={t.progress} className="h-1.5" />
                        )}
                        {t.status === "done" && t.accessUrl && (
                          <p className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Ready — URL returned from finalize
                          </p>
                        )}
                        {t.status === "error" && t.error && (
                          <p className="flex items-center gap-1 text-xs text-destructive">
                            <XCircle className="h-3.5 w-3.5" />
                            {t.error}
                          </p>
                        )}
                      </div>
                      {!isUploading && t.status === "queued" && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="shrink-0"
                          onClick={() => removeItem(t.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </li>
                  )
                })}
              </ul>
            </ScrollArea>

            {requireConfirm && !confirmed && (
              <Button
                type="button"
                className="w-full"
                disabled={disabled || items.length === 0 || items.some((t) => t.file.size > maxSizeBytes)}
                onClick={() => void handleConfirmUpload()}
              >
                Confirm upload
              </Button>
            )}
            {!requireConfirm && items.some((t) => t.status === "queued") && (
              <Button type="button" className="w-full" disabled={disabled} onClick={() => void runUploads()}>
                Upload
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
