"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { X, Sun, Moon, Smartphone, Tablet, Laptop, Monitor, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BASE_COLOR_OPTIONS,
  COLOR_THEME_OPTIONS,
} from "../kits/email/_data/shadcn-themes"

const DEVICE_SIZES = [
  { id: "mobile", label: "Mobile", width: 375, icon: Smartphone },
  { id: "tablet", label: "Tablet", width: 768, icon: Tablet },
  { id: "laptop", label: "Laptop", width: 1280, icon: Laptop },
  { id: "large", label: "Large", width: 1536, icon: Monitor },
] as const

export interface DevicePreviewProps {
  open: boolean
  onClose: () => void
  mode: "light" | "dark"
  baseColor: string
  colorTheme: string
  onModeChange: (mode: "light" | "dark") => void
  onBaseColorChange: (baseColor: string) => void
  onColorThemeChange: (colorTheme: string) => void
  themeVars: Record<string, string>
  fontFamily: string
  /** ReactNode or render prop receiving portalContainer and deviceSize for dialogs that should stay inside the device frame */
  children:
    | React.ReactNode
    | ((portalContainer: HTMLDivElement | null, deviceSize: "mobile" | "tablet" | "laptop" | "large") => React.ReactNode)
}

export function DevicePreview({
  open,
  onClose,
  mode,
  baseColor,
  colorTheme,
  onModeChange,
  onBaseColorChange,
  onColorThemeChange,
  themeVars,
  fontFamily,
  children,
}: DevicePreviewProps) {
  const [deviceSize, setDeviceSize] = useState<(typeof DEVICE_SIZES)[number]["id"]>("laptop")
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null)

  const currentDevice = DEVICE_SIZES.find((d) => d.id === deviceSize) ?? DEVICE_SIZES[2]
  const previewWidth = currentDevice.width

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  const styleObj = {
    ...themeVars,
    fontFamily,
  } as React.CSSProperties

  const content = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-sm"
        >
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-black/40 px-4 py-3">
            <div className="flex items-center gap-2">
              {DEVICE_SIZES.map((d) => {
                const Icon = d.icon
                return (
                  <Button
                    key={d.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeviceSize(d.id)}
                    className={
                      deviceSize === d.id
                        ? "bg-brand-primary/20 text-brand-primary"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span className="ml-1 hidden sm:inline">{d.label}</span>
                    <span className="ml-1 hidden sm:inline text-white/60">({d.width}px)</span>
                  </Button>
                )
              })}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onModeChange(mode === "light" ? "dark" : "light")}
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
                <DropdownMenuContent align="end" className="max-h-64 overflow-y-auto">
                  {BASE_COLOR_OPTIONS.map((opt) => (
                    <DropdownMenuItem
                      key={opt.id}
                      onClick={() => onBaseColorChange(opt.id)}
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
                <DropdownMenuContent align="end" className="max-h-64 overflow-y-auto">
                  {COLOR_THEME_OPTIONS.map((opt) => (
                    <DropdownMenuItem
                      key={opt.id}
                      onClick={() => onColorThemeChange(opt.id)}
                    >
                      {opt.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white/80 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center overflow-auto p-8">
            <div
              className="flex min-w-0 shrink-0 overflow-hidden rounded-lg border-2 border-white/20 shadow-2xl"
              style={{
                width: previewWidth,
                minWidth: Math.min(previewWidth, 320),
              }}
            >
              <div
                className={mode === "dark" ? "dark h-full w-full min-w-0" : "h-full w-full min-w-0"}
                style={styleObj}
              >
                <div
                  ref={(el) => setPortalContainer(el)}
                  className="relative h-[80vh] min-h-[500px] w-full min-w-0 overflow-auto"
                  style={{
                    color: "var(--foreground)",
                    backgroundColor: "var(--background)",
                  }}
                >
                  {typeof children === "function"
                    ? children(portalContainer, deviceSize)
                    : children}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (typeof document === "undefined") return null
  return createPortal(content, document.body)
}
