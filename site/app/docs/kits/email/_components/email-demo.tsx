"use client";

import { useState, useCallback } from "react";
import { Sun, Moon, Maximize2, ChevronDown } from "lucide-react";
import { EmailKit } from "@/components/ui/kits/email";
import {
  MOCK_FOLDERS,
  MOCK_LABELS,
  MOCK_THREADS,
} from "../_data/mock-email-data";
import {
  mergeThemeVars,
  BASE_COLOR_OPTIONS,
  COLOR_THEME_OPTIONS,
} from "../_data/shadcn-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DevicePreview } from "./device-preview";

const SHADCN_FONT =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export function EmailDemo() {
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const [baseColor, setBaseColor] = useState("neutral");
  const [colorTheme, setColorTheme] = useState("default");
  const [selectedFolderId, setSelectedFolderId] = useState("inbox");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>("t1");
  const [searchValue, setSearchValue] = useState("");
  const [starred, setStarred] = useState<Record<string, boolean>>({
    t1: true,
    t3: true,
  });
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleStar = useCallback((threadId: string, starredState: boolean) => {
    setStarred((prev) => ({ ...prev, [threadId]: starredState }));
  }, []);

  const threads = MOCK_THREADS.filter((t) => {
    if (searchValue) {
      const q = searchValue.toLowerCase();
      return (
        t.subject.toLowerCase().includes(q) ||
        t.from.toLowerCase().includes(q) ||
        t.snippet.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedThread = threads.find((t) => t.id === selectedThreadId) ?? null;
  const selectedMessage = selectedThread?.messages?.[
    selectedThread.messages.length - 1
  ] ?? null;

  const themeVars = mergeThemeVars(baseColor, colorTheme, mode);
  const styleObj = {
    ...themeVars,
    fontFamily: SHADCN_FONT,
  } as React.CSSProperties;

  const foldersWithCount = MOCK_FOLDERS.map((f) =>
    f.id === "inbox" ? { ...f, count: threads.length } : f
  );

  return (
    <div className="space-y-4">
      {/* Theme controls - use site styling */}
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

      {/* Demo container - style isolated */}
      <div
        className={mode === "dark" ? "dark" : ""}
        style={styleObj}
      >
        <div
          className="overflow-hidden rounded-2xl border"
          style={{
            minHeight: 500,
            color: "var(--foreground)",
            backgroundColor: "var(--background)",
          }}
        >
          <EmailKit
            folders={foldersWithCount}
            selectedFolderId={selectedFolderId}
            onFolderSelect={setSelectedFolderId}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            threads={threads.map((t) => ({
              ...t,
              starred: starred[t.id] ?? t.starred ?? false,
            }))}
            selectedThreadId={selectedThreadId}
            onThreadSelect={setSelectedThreadId}
            message={selectedMessage}
            onStar={handleStar}
            availableLabels={MOCK_LABELS}
            onLabelSelect={() => {}}
            onDelete={() => {}}
            onArchive={() => {}}
            onCompose={() => {}}
            onSend={() => {}}
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
        emailKitProps={{
          folders: foldersWithCount,
          selectedFolderId,
          onFolderSelect: setSelectedFolderId,
          searchValue,
          onSearchChange: setSearchValue,
          threads: threads.map((t) => ({
            ...t,
            starred: starred[t.id] ?? t.starred ?? false,
          })),
          selectedThreadId,
          onThreadSelect: setSelectedThreadId,
          message: selectedMessage,
          onStar: handleStar,
          availableLabels: MOCK_LABELS,
          onLabelSelect: () => {},
          onDelete: () => {},
          onArchive: () => {},
          onCompose: () => {},
          onSend: () => {},
        }}
      />
    </div>
  );
}
