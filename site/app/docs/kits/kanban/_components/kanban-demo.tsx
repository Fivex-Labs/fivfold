"use client"

import { useState } from "react"
import { Sun, Moon, Maximize2, ChevronDown } from "lucide-react"
import { KanbanKit } from "@/components/ui/kits/kanban"
import {
  MOCK_KANBAN_COLUMNS,
  MOCK_KANBAN_LABELS,
} from "../_data/mock-kanban-data"
import type { FivFoldKanbanColumn } from "@/components/ui/kits/kanban"
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

const SHADCN_FONT =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

export function KanbanDemo() {
  const [mode, setMode] = useState<"light" | "dark">("dark")
  const [baseColor, setBaseColor] = useState("neutral")
  const [colorTheme, setColorTheme] = useState("default")
  const [columns, setColumns] = useState<FivFoldKanbanColumn[]>(MOCK_KANBAN_COLUMNS)
  const [previewOpen, setPreviewOpen] = useState(false)

  const themeVars = mergeThemeVars(baseColor, colorTheme, mode)
  const styleObj = {
    ...themeVars,
    fontFamily: SHADCN_FONT,
  } as React.CSSProperties

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMode((m) => (m === "light" ? "dark" : "light"))}
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          {mode === "light" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
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
              <DropdownMenuItem
                key={opt.id}
                onClick={() => setBaseColor(opt.id)}
              >
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
              <DropdownMenuItem
                key={opt.id}
                onClick={() => setColorTheme(opt.id)}
              >
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
          <Maximize2 className="h-4 w-4" />
          <span className="ml-2">Open Device Simulation</span>
        </Button>
      </div>

      <div className={mode === "dark" ? "dark" : ""} style={styleObj}>
        <div
          className="overflow-hidden rounded-2xl border"
          style={{
            minHeight: 500,
            color: "var(--foreground)",
            backgroundColor: "var(--background)",
          }}
        >
          <KanbanKit
            className="h-[500px] p-4"
            columns={columns}
            onColumnsChange={setColumns}
            availableLabels={MOCK_KANBAN_LABELS}
            boardTitle="Project Board"
            showPriority
            showAssignee
            showDueDate
            showLabels
            showAttachments
            showComments
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
        {(portalContainer, deviceSize) => {
          const forceLayout =
            deviceSize === "mobile"
              ? "mobile"
              : deviceSize === "tablet"
                ? "tablet"
                : "desktop"
          return (
            <div className="h-full p-4">
              <KanbanKit
                className="h-full"
                columns={columns}
                onColumnsChange={setColumns}
                availableLabels={MOCK_KANBAN_LABELS}
                boardTitle="Project Board"
                showPriority
                showAssignee
                showDueDate
                showLabels
                showAttachments
                showComments
                portalContainer={portalContainer}
                forceLayout={forceLayout}
              />
            </div>
          )
        }}
      </DevicePreview>
    </div>
  )
}
