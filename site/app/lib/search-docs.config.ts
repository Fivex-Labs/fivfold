import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Download,
  Terminal,
  Layers,
  Mail,
  LayoutGrid,
  TimerReset,
  Shield,
  Cog,
  Bell,
  MessageSquareText,
} from "lucide-react";

export type SearchDocsSection = "Getting Started" | "Kits";

export interface SearchDocsEntry {
  title: string;
  href: string;
  description?: string;
  keywords: string[];
  section: SearchDocsSection;
  icon: LucideIcon;
}

export const searchDocsEntries: SearchDocsEntry[] = [
  // Getting Started
  {
    title: "Introduction",
    href: "/docs/getting-started/introduction",
    description: "FivFold is a full-stack Kit platform. Drop in complete, production-ready features in minutes.",
    keywords: ["intro", "overview", "what is", "fivfold", "kit", "platform", "full-stack"],
    section: "Getting Started",
    icon: BookOpen,
  },
  {
    title: "Background",
    href: "/docs/getting-started/background",
    description: "Why FivFold exists and the problems it solves.",
    keywords: ["background", "why", "rationale", "motivation", "history"],
    section: "Getting Started",
    icon: TimerReset,
  },
  {
    title: "Installation",
    href: "/docs/getting-started/installation",
    description: "Add FivFold to your React or Next.js project. Two packages: UI for frontend Kits, API for backend scaffolding.",
    keywords: ["install", "installation", "setup", "npx", "pnpm", "init", "add kit", "tailwind", "shadcn", "getting started"],
    section: "Getting Started",
    icon: Download,
  },
  {
    title: "CLI",
    href: "/docs/getting-started/cli",
    description: "Command-line reference for FivFold UI and API packages. All commands support standard help flags.",
    keywords: ["cli", "command", "terminal", "fivfold", "init", "add", "list", "agents", "setup", "npx"],
    section: "Getting Started",
    icon: Terminal,
  },
  {
    title: "How it works",
    href: "/docs/getting-started/how-it-works",
    description: "Architecture, VFS, strategy pipeline, and manifest flow.",
    keywords: ["architecture", "vfs", "strategy", "manifest", "flow", "how", "works", "pipeline"],
    section: "Getting Started",
    icon: Cog,
  },
  // Kits
  {
    title: "Kits Overview",
    href: "/docs/kits/overview",
    description: "Pre-built, full-featured modules that accelerate development. Each Kit combines a polished frontend with optional backend scaffolding.",
    keywords: ["kits", "overview", "modules", "components", "frontend", "backend", "scaffolding"],
    section: "Kits",
    icon: Layers,
  },
  {
    title: "Auth",
    href: "/docs/kits/auth",
    description: "Provider-agnostic authentication screens: Login, Register, Forgot Password, Reset Password, Email Verification.",
    keywords: ["auth", "auth kit", "authentication", "login", "register", "firebase", "cognito", "auth0", "jwt", "password", "sign in"],
    section: "Kits",
    icon: Shield,
  },
  {
    title: "Email",
    href: "/docs/kits/email",
    description: "Full email client UI: compose, inbox, drafts, recipient input with autocomplete.",
    keywords: ["email", "email kit", "compose", "inbox", "recipient", "draft", "mail", "send"],
    section: "Kits",
    icon: Mail,
  },
  {
    title: "Kanban",
    href: "/docs/kits/kanban",
    description: "Drag-and-drop kanban board with columns, cards, and full backend scaffolding.",
    keywords: ["kanban", "kanban kit", "board", "column", "card", "drag", "dnd", "drag and drop", "tasks"],
    section: "Kits",
    icon: LayoutGrid,
  },
  {
    title: "Push Notifications",
    href: "/docs/kits/push",
    description: "Backend push notifications with device registration, sending, logging, and pluggable providers (FCM, OneSignal, AWS SNS, Pushy, Pusher Beams).",
    keywords: ["push", "push notifications kit", "notifications", "fcm", "firebase", "onesignal", "sns", "aws", "pushy", "pusher", "beams", "device", "token", "mobile"],
    section: "Kits",
    icon: Bell,
  },
  {
    title: "Chat",
    href: "/docs/kits/chat",
    description: "Full-featured real-time chat kit: 1-1 and group conversations, attachments, polls, GIFs, location sharing, reactions, and multi-stack support (Socket.IO, Firebase).",
    keywords: [
      "chat", "chat kit", "messaging", "imessage", "whatsapp", "real-time", "realtime", "websocket",
      "socket.io", "group chat", "direct message", "dm", "attachments", "polls", "gif", "location",
      "reactions", "emoji", "typing indicator", "read receipts", "firebase firestore", "firebase rtdb",
      "mongodb", "mongoose", "typeorm", "prisma", "nestjs", "express",
    ],
    section: "Kits",
    icon: MessageSquareText,
  },
];

/** Kits: Overview first, then alphabetical. Other sections unchanged. */
function sortSectionEntries<T extends { title: string }>(items: T[], section: SearchDocsSection): T[] {
  if (section !== "Kits") return items;
  const overview = items.find((i) => i.title === "Kits Overview");
  const rest = items.filter((i) => i.title !== "Kits Overview").sort((a, b) => a.title.localeCompare(b.title));
  return overview ? [overview, ...rest] : rest;
}

/** Grouped nav structure for sidebar - derived from search entries */
export function getDocsNavItems() {
  const sections: SearchDocsSection[] = ["Getting Started", "Kits"];
  return sections.map((section) => {
    const entries = searchDocsEntries.filter((e) => e.section === section);
    const sorted = sortSectionEntries(entries, section);
    return {
      title: section,
      items: sorted.map(({ title, href, icon }) => ({ title, href, icon })),
    };
  });
}

/** Entries for a section, with Kits sorted (Overview first, then alphabetical) */
export function getOrderedEntriesForSection(section: SearchDocsSection): SearchDocsEntry[] {
  const entries = searchDocsEntries.filter((e) => e.section === section);
  return sortSectionEntries(entries, section);
}
