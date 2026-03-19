"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Pencil, Inbox, Tag } from "lucide-react"
import type { FivFoldEmailFolder, FivFoldEmailLabel } from "./types"

export interface SidebarContentProps {
  folders: FivFoldEmailFolder[]
  selectedFolderId?: string
  onFolderSelect?: (folderId: string) => void
  availableLabels?: FivFoldEmailLabel[]
  onLabelSelect?: (labelId: string) => void
  onCompose?: () => void
  onCloseSidenav?: () => void
}

export function SidebarContent({
  folders,
  selectedFolderId,
  onFolderSelect,
  availableLabels = [],
  onLabelSelect,
  onCompose,
  onCloseSidenav,
}: SidebarContentProps) {
  const handleFolderClick = (folderId: string) => {
    onFolderSelect?.(folderId)
    onCloseSidenav?.()
  }

  return (
    <div className="flex h-full flex-col">
      <div className="p-3">
        <Button className="w-full" onClick={onCompose}>
          <Pencil className="mr-2 h-4 w-4" /> Compose
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="px-2 pb-2">
          {folders.map((folder) => (
            <button
              key={folder.id}
              type="button"
              onClick={() => handleFolderClick(folder.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 my-0.5 text-sm transition-colors",
                selectedFolderId === folder.id
                  ? "bg-primary/10 font-medium text-primary hover:bg-primary/15"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground"
              )}
            >
              <span className="shrink-0">{folder.icon ?? <Inbox className="h-4 w-4" />}</span>
              <span className="flex-1 truncate text-left">{folder.label}</span>
              {folder.count !== undefined && folder.count > 0 && (
                <Badge variant="secondary" className="h-5 min-w-[20px] justify-center px-1 text-xs">
                  {folder.count}
                </Badge>
              )}
            </button>
          ))}
          {availableLabels.length > 0 && (
            <>
              <Separator className="my-2" />
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Labels
              </p>
              {availableLabels.map((lbl) => (
                <button
                  key={lbl.id}
                  type="button"
                  onClick={() => onLabelSelect?.(lbl.id)}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Tag
                    className="h-4 w-4 shrink-0"
                    style={lbl.color ? { color: lbl.color } : undefined}
                  />
                  <span className="flex-1 truncate text-left">{lbl.name}</span>
                </button>
              ))}
            </>
          )}
        </nav>
      </ScrollArea>
    </div>
  )
}
