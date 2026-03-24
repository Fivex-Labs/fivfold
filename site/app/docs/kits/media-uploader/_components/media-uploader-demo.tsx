"use client"

import { useState } from "react"
import { Sun, Moon, Maximize2, ChevronDown } from "lucide-react"
import { MediaUploaderKit } from "@/components/ui/kits/media-uploader"
import {
  mergeThemeVars,
  BASE_COLOR_OPTIONS,
  COLOR_THEME_OPTIONS,
} from "../../email/_data/shadcn-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { DevicePreview } from "../../../components/device-preview"
import type { FinalizeUploadPayload, FinalizeUploadResult, PresignResponse } from "@/components/ui/kits/media-uploader"

const SHADCN_FONT =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export function MediaUploaderDemo() {
  const [mode, setMode] = useState<"light" | "dark">("dark")
  const [baseColor, setBaseColor] = useState("neutral")
  const [colorTheme, setColorTheme] = useState("default")
  const [previewOpen, setPreviewOpen] = useState(false)

  const themeVars = mergeThemeVars(baseColor, colorTheme, mode)
  const styleObj = {
    ...themeVars,
    fontFamily: SHADCN_FONT,
  } as React.CSSProperties

  const presign = async (_file: File): Promise<PresignResponse> => {
    await sleep(350)
    return {
      uploadSessionId: crypto.randomUUID(),
      upload: {
        kind: "http-put",
        url: "https://example.invalid/no-network",
        method: "PUT",
      },
    }
  }

  const finalizeUpload = async (payload: FinalizeUploadPayload): Promise<FinalizeUploadResult> => {
    await sleep(280)
    if (payload.outcome === "failure") {
      return { success: false, error: payload.failureReason ?? "Simulated failure" }
    }
    return {
      success: true,
      accessUrl: `https://demo.fivfold.fivexlabs.com/media/${payload.uploadSessionId}`,
      auditId: `audit-${payload.uploadSessionId.slice(0, 8)}`,
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMode((m) => (m === "light" ? "dark" : "light"))}
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          {mode === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:bg-white/10 hover:text-white"
              >
                Base: {BASE_COLOR_OPTIONS.find((o) => o.id === baseColor)?.label ?? baseColor}
                <ChevronDown className="ml-1 h-3.5 w-3.5" />
              </Button>
            }
          />
          <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto">
            {BASE_COLOR_OPTIONS.map((opt) => (
              <DropdownMenuItem key={opt.id} onClick={() => setBaseColor(opt.id)}>
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:bg-white/10 hover:text-white"
              >
                Color: {COLOR_THEME_OPTIONS.find((o) => o.id === colorTheme)?.label ?? colorTheme}
                <ChevronDown className="ml-1 h-3.5 w-3.5" />
              </Button>
            }
          />
          <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto">
            {COLOR_THEME_OPTIONS.map((opt) => (
              <DropdownMenuItem key={opt.id} onClick={() => setColorTheme(opt.id)}>
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setPreviewOpen(true)}
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          <Maximize2 className="mr-1 h-4 w-4" />
          Open Device Simulation
        </Button>
      </div>

      <div className={mode === "dark" ? "dark" : ""} style={styleObj}>
        <div
          className="overflow-hidden rounded-2xl border border-white/10 p-4 md:p-6"
          style={{
            minHeight: 420,
            color: "var(--foreground)",
            backgroundColor: "var(--background)",
          }}
        >
          <p className="mb-4 text-center text-xs text-muted-foreground italic">
            Interactive demo: presign and finalize are simulated; transport uses{" "}
            <code className="rounded bg-muted px-1">simulateTransport</code> so files are not uploaded anywhere.
          </p>
          <MediaUploaderKit
            presign={presign}
            finalizeUpload={finalizeUpload}
            simulateTransport
            uploadConcurrency={3}
          />
        </div>
      </div>

      <DevicePreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        mode={mode}
        baseColor={baseColor}
        colorTheme={colorTheme}
        onModeChange={setMode}
        onBaseColorChange={setBaseColor}
        onColorThemeChange={setColorTheme}
        themeVars={themeVars}
        fontFamily={SHADCN_FONT}
      >
        <div className="p-4">
          <MediaUploaderKit
            presign={presign}
            finalizeUpload={finalizeUpload}
            simulateTransport
            uploadConcurrency={3}
          />
        </div>
      </DevicePreview>
    </div>
  )
}
