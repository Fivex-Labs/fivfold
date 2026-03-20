import {
  type LucideIcon,
  Info,
  FileCode,
  Zap,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./code-block";

const accentColors = {
  primary: "#ffd902",
  secondary: "#00F0FF",
  accent: "#FF7518",
  green: "#00ff88",
  orange: "#FF9F40",
} as const;

export function DocCard({
  icon: Icon,
  title,
  description,
  color = "primary",
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: keyof typeof accentColors;
  className?: string;
}) {
  const c = accentColors[color];
  return (
    <div
      className={cn(
        "group p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm hover:border-white/20 transition-all",
        className,
      )}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform"
        style={{ backgroundColor: `${c}20` }}
      >
        <Icon size={24} style={{ color: c }} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/70 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

export function DocCallout({
  icon: Icon,
  title,
  children,
  variant = "info",
  className,
}: {
  icon?: LucideIcon;
  title: string;
  children: React.ReactNode;
  variant?: "info" | "tip" | "warning";
  className?: string;
}) {
  const variants = {
    info: {
      border: "border-brand-secondary/30",
      bg: "bg-brand-secondary/20",
      iconColor: "#5cffe4",
      Icon: Info,
    },
    tip: {
      border: "border-brand-primary/30",
      bg: "bg-brand-primary/20",
      iconColor: "#ffd902",
      Icon: Zap,
    },
    warning: {
      border: "border-brand-accent/30",
      bg: "bg-brand-accent/20",
      iconColor: "#FF7518",
      Icon: Info,
    },
  };
  const v = variants[variant];
  const IconComponent = Icon ?? v.Icon;
  return (
    <div
      className={cn(
        "p-6 rounded-2xl",
        v.border,
        v.bg,
        className,
      )}
    >
      <div className="flex gap-3">
        <IconComponent size={22} style={{ color: v.iconColor }} className="shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-white mb-2">{title}</h4>
          <div className="text-white/80 text-sm leading-relaxed [&>p]:mb-2 [&>p:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DocCodeBlock({
  command,
  label,
  className,
}: {
  command: string;
  label?: string;
  className?: string;
}) {
  return (
    <CodeBlock
      code={command}
      language="bash"
      label={label}
      showTerminalIcon
      className={className}
    />
  );
}

export function DocStep({
  step,
  title,
  children,
  color = "primary",
}: {
  step: number;
  icon?: LucideIcon;
  title: string;
  children: React.ReactNode;
  color?: keyof typeof accentColors;
}) {
  const c = accentColors[color];
  return (
    <div className="flex gap-6 p-6 rounded-2xl border border-white/10 bg-black/40 hover:border-white/20 transition-all">
      <div className="flex shrink-0 gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-black"
          style={{ backgroundColor: c }}
        >
          {step}
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-white mb-2">{title}</h3>
        <div className="text-white/70 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export function DocLinkCard({
  href,
  icon: Icon,
  title,
  description,
  className,
  external,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  external?: boolean;
}) {
  const baseClass =
    "group flex items-start gap-4 p-5 rounded-2xl border border-white/10 bg-black/40 hover:border-brand-secondary/30 hover:bg-brand-secondary/5 transition-all";
  const content = (
    <>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${title !== 'Fivex Labs' ? 'bg-brand-secondary/20' : 'bg-[#dcff00]'} group-hover:scale-105 transition-transform`}>
        {(title !== 'Fivex Labs' && <Icon size={22} className="text-brand-secondary" />)}
        {(title === 'Fivex Labs' && <span className="text-black font-black tracking-tighter leading-none text-3xl">fx</span>)}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-white group-hover:text-brand-secondary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-white/60 mt-1">{description}</p>
      </div>
      <ArrowRight size={18} className="text-white/40 group-hover:text-brand-secondary shrink-0 mt-1" />
    </>
  );
  return external ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(baseClass, className)}
    >
      {content}
    </a>
  ) : (
    <Link
      href={href}
      className={cn(baseClass, className)}
    >
      {content}
    </Link>
  );
}

export function DocVariableList({
  items,
}: {
  items: Array<{ name: string; description: string }>;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
        <FileCode size={16} className="text-brand-accent" />
        <span className="text-xs font-medium text-white/60 uppercase tracking-wider">CSS Variables</span>
      </div>
      <div className="divide-y divide-white/5">
        {items.map((item) => (
          <div key={item.name} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <code className="text-sm font-mono text-brand-accent shrink-0">{item.name}</code>
            <span className="text-sm text-white/60 mt-1 sm:mt-0">{item.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
