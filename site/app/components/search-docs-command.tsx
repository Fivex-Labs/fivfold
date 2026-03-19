"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { searchDocsEntries, getOrderedEntriesForSection } from "@/lib/search-docs.config";
import type { SearchDocsEntry } from "@/lib/search-docs.config";
import { cn } from "@/lib/utils";

function getSearchValue(entry: SearchDocsEntry): string {
  return [
    entry.title,
    entry.description ?? "",
    ...entry.keywords,
  ]
    .filter(Boolean)
    .join(" ");
}

function scoreEntry(entry: SearchDocsEntry, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 1;

  const title = entry.title.toLowerCase();
  const desc = (entry.description ?? "").toLowerCase();
  const keywords = entry.keywords.map((k) => k.toLowerCase());

  if (title === q) return 100;
  if (title.includes(q)) return 80;
  if (keywords.some((k) => k.includes(q) || q.includes(k))) return 50;
  if (desc.includes(q)) return 25;
  if (getSearchValue(entry).toLowerCase().includes(q)) return 10;
  return 0;
}

interface SearchDocsCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDocsCommand({ open, onOpenChange }: SearchDocsCommandProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const handleSelect = (href: string) => {
    router.push(href);
    onOpenChange(false);
  };

  const sections = ["Getting Started", "Kits"] as const;

  const hasQuery = search.trim().length > 0;
  const filteredAndSorted = hasQuery
    ? searchDocsEntries
        .map((e) => ({ entry: e, score: scoreEntry(e, search) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ entry }) => entry)
    : [];

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search docs"
      description="Search documentation by title or keywords"
      showCloseButton={false}
      className={cn(
        "top-[12vh]! translate-y-0! max-h-[60vh] w-full max-w-2xl",
        "border border-white/10 bg-[#1a1a1a] shadow-2xl",
        "data-open:zoom-in-95 data-closed:zoom-out-95"
      )}
    >
      <Command
        className="rounded-2xl border-0 bg-transparent"
        shouldFilter={false}
      >
        <CommandInput
          placeholder="Search docs... (e.g. installation, auth)"
          className="text-white placeholder:text-white/40"
          value={search}
          onValueChange={setSearch}
        />
        <CommandList className="max-h-[50vh]">
          <CommandEmpty className="py-8 text-white/50">
            No results found. Try &quot;installation&quot; or &quot;auth&quot;.
          </CommandEmpty>
          {hasQuery ? (
            filteredAndSorted.length > 0 ? (
              <CommandGroup
                heading="Results"
                className="**[&_[data-slot=cmdk-group-heading]]:text-white/50 **[&_[data-slot=cmdk-group-heading]]:uppercase **[&_[data-slot=cmdk-group-heading]]:text-xs"
              >
                {filteredAndSorted.map((entry) => {
                  const Icon = entry.icon;
                  return (
                    <CommandItem
                      key={entry.href}
                      value={getSearchValue(entry)}
                      onSelect={() => handleSelect(entry.href)}
                      className="rounded-lg text-white data-[selected=true]:bg-brand-primary/10 data-[selected=true]:text-white"
                    >
                      {Icon && (
                        <Icon className="h-4 w-4 shrink-0 text-white/60" />
                      )}
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{entry.title}</span>
                        {entry.description && (
                          <span className="text-xs text-white/50 line-clamp-1">
                            {entry.description}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ) : null
          ) : (
            sections.map((section) => {
              const entries = getOrderedEntriesForSection(section);
              if (entries.length === 0) return null;
              return (
                <CommandGroup
                  key={section}
                  heading={section}
                  className="**[&_[data-slot=cmdk-group-heading]]:text-white/50 **[&_[data-slot=cmdk-group-heading]]:uppercase **[&_[data-slot=cmdk-group-heading]]:text-xs"
                >
                  {entries.map((entry) => {
                    const Icon = entry.icon;
                    return (
                      <CommandItem
                        key={entry.href}
                        value={getSearchValue(entry)}
                        onSelect={() => handleSelect(entry.href)}
                        className="rounded-lg text-white data-[selected=true]:bg-brand-primary/10 data-[selected=true]:text-white"
                      >
                        {Icon && (
                          <Icon className="h-4 w-4 shrink-0 text-white/60" />
                        )}
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium">{entry.title}</span>
                          {entry.description && (
                            <span className="text-xs text-white/50 line-clamp-1">
                              {entry.description}
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              );
            })
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
