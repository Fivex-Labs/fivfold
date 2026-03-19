"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Layout, Server, Box, Database } from "lucide-react";

const iconMap = {
  layout: Layout,
  server: Server,
  express: Server,
  nestjs: Box,
  typeorm: Database,
  postgresql: Database,
} as const;

const platformLogos = {
  express: "/platforms/express.svg",
  nestjs: "/platforms/nestjs.svg",
  typeorm: "/platforms/typeorm.svg",
  postgresql: "/platforms/postgresql.svg",
} as const;

export interface DocTabItem {
  id: string;
  label: string;
  icon?: keyof typeof iconMap;
  platformLogo?: keyof typeof platformLogos;
  content: React.ReactNode;
}

interface DocTabsProps {
  tabs: DocTabItem[];
  defaultTab?: string;
  className?: string;
}

export function DocTabs({ tabs, defaultTab, className }: DocTabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id ?? "");

  const renderIcon = (item: DocTabItem) => {
    if (item.platformLogo && item.platformLogo in platformLogos) {
      return (
        <Image
          src={platformLogos[item.platformLogo]}
          alt=""
          width={20}
          height={20}
          className="h-5 w-5 shrink-0 object-contain opacity-90"
        />
      );
    }
    const Icon = item.icon ? iconMap[item.icon] : null;
    return Icon ? <Icon className="h-4 w-4 shrink-0" /> : null;
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-wrap gap-1 rounded-xl border border-white/10 bg-black/20 p-1">
        {tabs.map((tab) => {
          const Icon = renderIcon(tab);
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-primary/20 text-brand-primary"
                  : "text-white/70 hover:bg-white/5 hover:text-white",
              )}
            >
              {Icon}
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="min-h-[200px]">
        {tabs.map((tab) =>
          active === tab.id ? (
            <div key={tab.id} className="animate-in fade-in duration-200">
              {tab.content}
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
}
