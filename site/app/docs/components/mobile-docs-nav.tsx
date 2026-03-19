"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { getDocsNavItems } from "@/lib/search-docs.config";

const navItems = getDocsNavItems();

export function MobileDocsNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const currentPage = navItems.flatMap((s) => s.items).find((i) => i.href === pathname);
  const CurrentIcon = currentPage?.icon;

  return (
    <div className="lg:hidden mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white"
      >
        <span className="flex items-center gap-2">
          {CurrentIcon && <CurrentIcon className="h-4 w-4 text-brand-secondary" />}
          {currentPage?.title ?? "Select a page"}
        </span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="mt-2 rounded-lg border border-white/10 bg-white/5 p-2">
          {navItems.map((section) => (
            <div key={section.title} className="mb-3 last:mb-0">
              <h3 className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-white/50">
                {section.title}
              </h3>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-2 rounded px-2 py-2 text-sm",
                          isActive ? "bg-brand-primary/15 text-brand-primary" : "text-white/80 hover:bg-white/5",
                        )}
                      >
                        {Icon && <Icon className="h-4 w-4 shrink-0" />}
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
