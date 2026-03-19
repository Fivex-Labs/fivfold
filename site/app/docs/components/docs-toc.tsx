"use client";

import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { StackConfiguratorSidebar } from "./stack-configurator-sidebar";
import type { StackConfiguratorSidebarProps } from "./stack-configurator-sidebar";

// Must match scroll-mt on doc headings (scroll-mt-24 = 6rem = 96px)
const HEADER_OFFSET_PX = 96;

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface DocsTocProps {
  headings: TocItem[];
  stackConfig?: StackConfiguratorSidebarProps;
}

export function DocsToc({ headings, stackConfig }: DocsTocProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const updateActiveId = useCallback(() => {
    const offset = HEADER_OFFSET_PX;
    let active: string | null = null;
    for (const { id } of headings) {
      const el = document.getElementById(id);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= offset + 80) {
        active = id;
      }
    }
    setActiveId(active ?? headings[0]?.id ?? null);
  }, [headings]);

  useEffect(() => {
    updateActiveId();
    window.addEventListener("scroll", updateActiveId, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveId);
  }, [updateActiveId]);

  if (headings.length === 0 && !stackConfig) return null;

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-4rem)] w-48 shrink-0 overflow-y-auto pl-6 xl:block">
      {headings.length > 0 && (
        <>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">
            On this page
          </h3>
          <ul className="space-y-2 border-l border-white/10 pl-4">
            {headings.map((item) => (
              <li
                key={item.id}
                style={{ paddingLeft: item.level > 2 ? (item.level - 2) * 12 : 0 }}
              >
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "block text-sm transition-colors",
                    activeId === item.id
                      ? "text-brand-secondary font-medium"
                      : "text-white/60 hover:text-white",
                  )}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
      {stackConfig && <StackConfiguratorSidebar {...stackConfig} />}
    </aside>
  );
}
