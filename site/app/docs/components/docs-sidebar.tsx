"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getDocsNavItems } from "@/lib/search-docs.config";

const navItems = getDocsNavItems();

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto border-r border-white/8 pl-2 pr-6 lg:block">
      <nav className="space-y-8">
        {navItems.map((section) => (
          <div key={section.title}>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm transition-colors",
                        isActive
                          ? "bg-brand-primary/15 text-brand-primary"
                          : "text-white/80 hover:bg-white/5 hover:text-white",
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
      </nav>
    </aside>
  );
}
