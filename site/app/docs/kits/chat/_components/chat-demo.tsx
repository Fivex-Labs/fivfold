"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Sun,
  Moon,
  Maximize2,
  ChevronDown,
  Send,
  Search,
  MoreHorizontal,
  Paperclip,
  Smile,
  MapPin,
  BarChart2,
  ImageIcon,
  CheckCheck,
  Users,
  ArrowLeft,
  X,
  BellOff,
  Bell,
  Pin,
  Trash2,
  Eye,
  EyeOff,
  Info,
  UserMinus,
  Plus,
  ExternalLink,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DevicePreview } from "../../../components/device-preview";
import { cn } from "@/lib/utils";
import {
  mergeThemeVars,
  BASE_COLOR_OPTIONS,
  COLOR_THEME_OPTIONS,
} from "../../email/_data/shadcn-themes";

const SHADCN_FONT =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const QUICK_EMOJIS = ["❤️", "👍", "😂", "😮", "😢", "🙏"];
const EMOJI_GRID = ["😀","😂","🥰","😍","🤩","😎","🤔","😅","🎉","🔥","💯","✨","👏","🙌","💪","👋","🎯","🚀","💡","⚡"];
const GIF_COLORS = ["bg-violet-400", "bg-blue-400", "bg-emerald-400", "bg-rose-400"];

type MessageType = "text" | "file" | "image" | "location" | "poll" | "gif";

interface PollOption {
  text: string;
  votes: number;
}

interface Message {
  id: string;
  type: MessageType;
  text?: string;
  sentByMe: boolean;
  time: string;
  status?: "sent" | "delivered" | "read";
  reactions?: Record<string, number>;
  fileName?: string;
  location?: { lat: number; lng: number };
  pollQuestion?: string;
  pollOptions?: PollOption[];
  pollVoted?: number;
  gifColor?: string;
}

interface Thread {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  isGroup?: boolean;
  members?: string[];
  messages: Message[];
}

interface ThreadMeta {
  muted: boolean;
  pinned: boolean;
  unread: boolean;
}

const MOCK_THREADS: Thread[] = [
  {
    id: "t1",
    name: "Sarah Johnson",
    initials: "SJ",
    avatarColor: "bg-violet-500",
    lastMessage: "Sounds great! See you at 3pm 🎉",
    time: "2m",
    unread: 2,
    online: true,  
    messages: [
      { id: "m1", type: "text", text: "Hey! Are you free for a quick call today?", sentByMe: false, time: "10:30 AM", reactions: { "👍": 1 } },
      { id: "m2", type: "text", text: "Sure, what time works for you?", sentByMe: true, time: "10:32 AM", status: "read" },
      { id: "m3", type: "text", text: "How about 3pm?", sentByMe: false, time: "10:33 AM" },
      { id: "m4", type: "text", text: "Sounds great! See you at 3pm 🎉", sentByMe: false, time: "10:34 AM" },
    ],
  },
  {
    id: "t2",
    name: "Design Team",
    initials: "DT",
    avatarColor: "bg-blue-500",
    lastMessage: "Alex: New mockups uploaded to Figma",
    time: "1h",
    unread: 0,
    online: false,
    isGroup: true,
    members: ["Alex", "Jamie", "Sam", "You"],
    messages: [
      { id: "m1", type: "text", text: "Hey team, I've finished the homepage redesign", sentByMe: false, time: "9:00 AM" },
      { id: "m2", type: "text", text: "Looks amazing! Love the new header section", sentByMe: true, time: "9:15 AM", status: "read" },
      { id: "m3", type: "text", text: "New mockups uploaded to Figma", sentByMe: false, time: "9:30 AM" },
    ],
  },
  {
    id: "t3",
    name: "Marcus Chen",
    initials: "MC",
    avatarColor: "bg-emerald-500",
    lastMessage: "Did you see the new product launch?",
    time: "3h",
    unread: 1,
    online: true,
    messages: [
      { id: "m1", type: "text", text: "Hey, have you tried the new coffee place downtown?", sentByMe: false, time: "8:00 AM" },
      { id: "m2", type: "text", text: "Not yet, is it good?", sentByMe: true, time: "8:05 AM", status: "read" },
      { id: "m3", type: "text", text: "Did you see the new product launch?", sentByMe: false, time: "8:10 AM" },
    ],
  },
  {
    id: "t4",
    name: "Emma Wilson",
    initials: "EW",
    avatarColor: "bg-rose-500",
    lastMessage: "The report is ready for review",
    time: "Yesterday",
    unread: 0,
    online: false,
    messages: [
      { id: "m1", type: "text", text: "Can you review the Q3 report?", sentByMe: false, time: "Yesterday" },
      { id: "m2", type: "text", text: "Of course, send it over", sentByMe: true, time: "Yesterday", status: "read" },
      { id: "m3", type: "text", text: "The report is ready for review", sentByMe: false, time: "Yesterday" },
    ],
  },
];

function Avatar({
  initials,
  color,
  size = "md",
  online,
}: {
  initials: string;
  color: string;
  size?: "sm" | "md" | "lg";
  online?: boolean;
}) {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-12 w-12 text-base" };
  return (
    <div className="relative shrink-0">
      <div className={cn("flex items-center justify-center rounded-full font-semibold text-white", color, sizes[size])}>
        {initials}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500" />
      )}
    </div>
  );
}

/** Renders a location message with an OSM map preview + Google Maps link */
function LocationMessage({ lat, lng, sentByMe }: { lat: number; lng: number; sentByMe: boolean }) {
  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  const osmEmbed = `https://www.openstreetmap.org/export/embed.html?bbox=${(lng - 0.005).toFixed(6)}%2C${(lat - 0.005).toFixed(6)}%2C${(lng + 0.005).toFixed(6)}%2C${(lat + 0.005).toFixed(6)}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group/loc block w-[220px]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="overflow-hidden rounded-xl border border-white/10">
        {/* Map preview - pointer-events-none so clicks pass through to the link */}
        <div className="relative h-[120px] w-full overflow-hidden bg-muted">
          <iframe
            src={osmEmbed}
            width="220"
            height="120"
            className="pointer-events-none h-full w-full border-0"
            title={`Map location: ${lat}, ${lng}`}
            loading="lazy"
          />
        </div>
        {/* Footer bar */}
        <div
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-2",
            sentByMe ? "bg-primary/80" : "bg-muted"
          )}
        >
          <MapPin className="h-3 w-3 shrink-0 text-rose-400" />
          <span className={cn("flex-1 text-[11px] font-medium tabular-nums", sentByMe ? "text-primary-foreground" : "text-foreground")}>
            {lat}, {lng}
          </span>
          <ExternalLink className="h-2.5 w-2.5 shrink-0 opacity-50 group-hover/loc:opacity-100 transition-opacity" />
        </div>
      </div>
    </a>
  );
}

interface ChatUIProps {
  mode: "light" | "dark";
  /** Width of the container in px — used to drive mobile layout instead of viewport breakpoints */
  containerWidth?: number;
}

function ChatUI({ mode, containerWidth = 800 }: ChatUIProps) {
  const isDark = mode === "dark";
  const isMobile = containerWidth < 640;

  const [threads, setThreads] = useState<Thread[]>(MOCK_THREADS);
  const [activeThread, setActiveThread] = useState<Thread>(MOCK_THREADS[0]);
  const [messages, setMessages] = useState<Message[]>(MOCK_THREADS[0].messages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mobileView, setMobileView] = useState<"threads" | "conversation">("threads");
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [threadMeta, setThreadMeta] = useState<Map<string, ThreadMeta>>(
    () => new Map(MOCK_THREADS.map((t, i) => [t.id, { muted: false, pinned: i === 0, unread: t.unread > 0 }]))
  );
  const [hoveredMsgId, setHoveredMsgId] = useState<string | null>(null);
  const [iconsOpen, setIconsOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset to threads view if switching from mobile → desktop
  useEffect(() => {
    if (!isMobile) setMobileView("threads");
  }, [isMobile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Auto-resize textarea as content grows
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  // Handle input change: collapse icons on first keystroke, expand on clear
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length === 1 && input.length === 0) setIconsOpen(false);
    if (val.length === 0) setIconsOpen(true);
    setInput(val);
    // defer so the DOM updates height after value change
    setTimeout(autoResize, 0);
  }, [input, autoResize]);

  const now = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const addMessage = useCallback((msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const selectThread = (thread: Thread) => {
    setActiveThread(thread);
    setMessages(thread.messages);
    setInput("");
    setDetailOpen(false);
    setMobileView("conversation");
    setThreadMeta((prev) => {
      const next = new Map(prev);
      const m = next.get(thread.id);
      if (m) next.set(thread.id, { ...m, unread: false });
      return next;
    });
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    addMessage({ id: `m${Date.now()}`, type: "text", text: input, sentByMe: true, time: now(), status: "delivered" });
    setInput("");
    setIconsOpen(true);
    setShowEmojiPicker(false);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setTimeout(() => setIsTyping(true), 800);
    setTimeout(() => {
      setIsTyping(false);
      addMessage({ id: `r${Date.now()}`, type: "text", text: "Thanks for your message! I'll get back to you soon.", sentByMe: false, time: now() });
    }, 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isImage: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addMessage({ id: `m${Date.now()}`, type: isImage ? "image" : "file", fileName: file.name, sentByMe: true, time: now(), status: "delivered" });
    e.target.value = "";
  };

  const handleLocation = () => {
    if (!navigator.geolocation) {
      addMessage({ id: `m${Date.now()}`, type: "text", text: "Geolocation is not supported by your browser.", sentByMe: true, time: now(), status: "delivered" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        addMessage({
          id: `m${Date.now()}`,
          type: "location",
          location: { lat: parseFloat(pos.coords.latitude.toFixed(4)), lng: parseFloat(pos.coords.longitude.toFixed(4)) },
          sentByMe: true,
          time: now(),
          status: "delivered",
        });
      },
      () => {
        addMessage({ id: `m${Date.now()}`, type: "text", text: "📍 Location permission denied.", sentByMe: true, time: now(), status: "delivered" });
      }
    );
  };

  const sendPoll = () => {
    const opts = pollOptions.filter((o) => o.trim());
    if (!pollQuestion.trim() || opts.length < 2) return;
    addMessage({ id: `m${Date.now()}`, type: "poll", pollQuestion, pollOptions: opts.map((t) => ({ text: t, votes: 0 })), sentByMe: true, time: now(), status: "delivered" });
    setPollQuestion("");
    setPollOptions(["", ""]);
    setShowPollCreator(false);
  };

  const votePoll = (msgId: string, optIdx: number) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msgId || m.pollVoted !== undefined) return m;
        const newOpts = m.pollOptions!.map((o, i) => (i === optIdx ? { ...o, votes: o.votes + 1 } : o));
        return { ...m, pollOptions: newOpts, pollVoted: optIdx };
      })
    );
  };

  const sendGif = (color: string) => {
    addMessage({ id: `m${Date.now()}`, type: "gif", gifColor: color, sentByMe: true, time: now(), status: "delivered" });
    setShowEmojiPicker(false);
  };

  const toggleReaction = (msgId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msgId) return m;
        const r = { ...(m.reactions ?? {}) };
        r[emoji] = (r[emoji] ?? 0) + 1;
        if (r[emoji] === 0) delete r[emoji];
        return { ...m, reactions: r };
      })
    );
    setHoveredMsgId(null);
  };

  const updateMeta = (threadId: string, update: Partial<ThreadMeta>) => {
    setThreadMeta((prev) => {
      const next = new Map(prev);
      const m = next.get(threadId);
      if (m) next.set(threadId, { ...m, ...update });
      return next;
    });
  };

  const deleteThread = (threadId: string) => {
    setThreads((prev) => prev.filter((t) => t.id !== threadId));
    if (activeThread.id === threadId) {
      const remaining = threads.filter((t) => t.id !== threadId);
      if (remaining.length > 0) selectThread(remaining[0]);
      else setMobileView("threads");
    }
  };

  const filteredThreads = [...(searchQuery
    ? threads.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.messages.some((m) => m.text?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : threads
  )].sort((a, b) => {
    const ap = threadMeta.get(a.id)?.pinned ?? false;
    const bp = threadMeta.get(b.id)?.pinned ?? false;
    return ap === bp ? 0 : ap ? -1 : 1;
  });

  const renderMessageContent = (msg: Message) => {
    if (msg.type === "file") {
      return (
        <div className="flex items-center gap-2 py-0.5">
          <Paperclip className="h-3 w-3 shrink-0" />
          <span className="text-xs truncate max-w-[160px]">{msg.fileName}</span>
        </div>
      );
    }
    if (msg.type === "image") {
      return (
        <div className="space-y-1">
          <div className={cn("h-16 w-32 rounded-lg", msg.sentByMe ? "bg-primary-foreground/20" : isDark ? "bg-white/20" : "bg-zinc-200")} />
          <span className="text-[10px] opacity-70">{msg.fileName}</span>
        </div>
      );
    }
    if (msg.type === "location" && msg.location) {
      return <LocationMessage lat={msg.location.lat} lng={msg.location.lng} sentByMe={msg.sentByMe} />;
    }
    if (msg.type === "poll" && msg.pollOptions) {
      const total = msg.pollOptions.reduce((s, o) => s + o.votes, 0);
      return (
        <div className="space-y-1.5 min-w-[160px]">
          <p className="text-xs font-semibold">{msg.pollQuestion}</p>
          {msg.pollOptions.map((opt, i) => {
            const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
            const voted = msg.pollVoted === i;
            return (
              <button
                key={i}
                onClick={() => votePoll(msg.id, i)}
                disabled={msg.pollVoted !== undefined}
                className={cn(
                  "relative w-full overflow-hidden rounded-lg border text-left px-2.5 py-1.5 text-[11px] transition-all",
                  voted
                    ? "border-primary bg-primary/20 font-semibold"
                    : msg.pollVoted !== undefined
                    ? isDark ? "border-white/10 bg-white/5 opacity-60" : "border-zinc-200 bg-zinc-50 opacity-60"
                    : isDark ? "border-white/20 bg-white/5 hover:bg-white/10" : "border-zinc-200 bg-white hover:bg-zinc-50"
                )}
              >
                {msg.pollVoted !== undefined && (
                  <div
                    className={cn("absolute inset-y-0 left-0 rounded-l-lg opacity-20", voted ? "bg-primary" : isDark ? "bg-white" : "bg-zinc-400")}
                    style={{ width: `${pct}%` }}
                  />
                )}
                <span className="relative">{opt.text}</span>
                {msg.pollVoted !== undefined && (
                  <span className="relative float-right opacity-60">{pct}%</span>
                )}
              </button>
            );
          })}
          <p className={cn("text-[10px]", isDark ? "text-white/30" : "text-zinc-400")}>{total} votes</p>
        </div>
      );
    }
    if (msg.type === "gif") {
      return (
        <div className={cn("h-14 w-28 rounded-lg flex items-center justify-center text-white text-xs font-bold", msg.gifColor ?? "bg-primary")}>
          GIF
        </div>
      );
    }
    return <span className="text-xs leading-relaxed">{msg.text}</span>;
  };

  const meta = (id: string) => threadMeta.get(id) ?? { muted: false, pinned: false, unread: false };

  // Layout decisions based on container width, not viewport
  const showSidebar = !isMobile || mobileView === "threads";
  const showMain = !isMobile || mobileView === "conversation";

  return (
    <div className={cn("flex h-full overflow-hidden rounded-2xl border text-sm bg-background text-foreground", isDark ? "border-white/10" : "border-border")}>
      {/* Hidden file inputs */}
      <input ref={fileRef} type="file" className="hidden" onChange={(e) => handleFileChange(e, false)} />
      <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, true)} />

      {/* ───── SIDEBAR ───── */}
      {showSidebar && (
        <div
          className={cn(
            "flex flex-col border-r border-border bg-muted/30 shrink-0",
            isMobile ? "w-full" : "w-72"
          )}
        >
          {/* Sidebar header */}
          {searchOpen ? (
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
              <input
                autoFocus
                className="flex-1 bg-transparent text-xs outline-none text-foreground placeholder:text-muted-foreground"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
              <span className="font-bold text-sm text-foreground">Messages</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          {/* Thread list */}
          <div className="flex-1 overflow-y-auto py-1">
            {filteredThreads.map((thread) => {
              const m = meta(thread.id);
              return (
                <div
                  key={thread.id}
                  className={cn(
                    "group relative flex w-full items-center gap-3 px-3 py-2.5 transition-colors cursor-pointer",
                    activeThread.id === thread.id ? "bg-muted" : "hover:bg-muted/50",
                    m.pinned && "bg-primary/10 border-l-2 border-primary"
                  )}
                  onClick={() => selectThread(thread)}
                >
                  <Avatar initials={thread.initials} color={thread.avatarColor} size="sm" online={thread.online} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={cn("font-light text-xs truncate text-foreground", m.unread && "font-bold")}>
                        {m.pinned && <Pin className="inline h-2.5 w-2.5 mr-1 rotate-45 opacity-60 text-primary" />}
                        {thread.name}
                        {thread.isGroup && <Users className="inline h-3 w-3 ml-1 opacity-60" />}
                      </span>
                      <span className="text-[10px] group-hover:opacity-0 shrink-0 ml-1 text-muted-foreground">{thread.time}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className={cn("text-[11px] truncate text-muted-foreground", m.unread && "font-semibold")}>
                        {m.muted && <BellOff className="inline h-2.5 w-2.5 mr-1 opacity-50" />}
                        {thread.lastMessage}
                      </span>
                      {m.unread && !searchQuery && (
                        
                        <span className="ml-1 flex h-2 w-2 shrink-0 items-center justify-center group-hover:opacity-0 rounded-full bg-primary text-primary-foreground text-[9px] font-bold">
                          
                        </span>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-muted z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent className="w-full" align="end" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenuItem onClick={() => updateMeta(thread.id, { unread: !m.unread })}>
                        {m.unread ? <Eye className="mr-2 h-3.5 w-3.5" /> : <EyeOff className="mr-2 h-3.5 w-3.5" />}
                        {m.unread ? "Mark as Read" : "Mark as Unread"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateMeta(thread.id, { muted: !m.muted })}>
                        {m.muted ? <Bell className="mr-2 h-3.5 w-3.5" /> : <BellOff className="mr-2 h-3.5 w-3.5" />}
                        {m.muted ? "Unmute" : "Mute Notifications"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateMeta(thread.id, { pinned: !m.pinned })}>
                        <Pin className="mr-2 h-3.5 w-3.5" />
                        {m.pinned ? "Unpin" : "Pin Conversation"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteThread(thread.id)}>
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
            {filteredThreads.length === 0 && (
              <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">No results</div>
            )}
          </div>
        </div>
      )}

      {/* ───── MAIN CHAT AREA ───── */}
      {showMain && (
        <div className="flex flex-col flex-1 min-w-0 relative">
          {/* Chat header */}
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-border shrink-0">
            <div className="flex items-center gap-2.5">
              {/* Back button on mobile */}
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => { setMobileView("threads"); setDetailOpen(false); }}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <Avatar initials={activeThread.initials} color={activeThread.avatarColor} size="sm" online={activeThread.online} />
              <button
                className="text-left hover:opacity-80 transition-opacity"
                onClick={() => setDetailOpen((v) => !v)}
              >
                <p className="font-semibold text-xs text-foreground leading-tight">{activeThread.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {activeThread.isGroup
                    ? `${activeThread.members?.length ?? 4} members`
                    : activeThread.online
                    ? "Online"
                    : "Last seen recently"}
                </p>
              </button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                }
              />
              <DropdownMenuContent className="w-full" align="end">
                <DropdownMenuItem onClick={() => setDetailOpen(true)}>
                  <Info className="mr-2 h-3.5 w-3.5" />
                  {activeThread.isGroup ? "View Group Info" : "View Profile"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setDetailOpen(false); setSearchOpen(true); }}>
                  <Search className="mr-2 h-3.5 w-3.5" />
                  Search in Conversation
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => updateMeta(activeThread.id, { muted: !meta(activeThread.id).muted })}>
                  {meta(activeThread.id).muted ? <Bell className="mr-2 h-3.5 w-3.5" /> : <BellOff className="mr-2 h-3.5 w-3.5" />}
                  {meta(activeThread.id).muted ? "Unmute" : "Mute Notifications"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Clear Chat
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <UserMinus className="mr-2 h-3.5 w-3.5" />
                  {activeThread.isGroup ? "Leave Group" : "Block"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-background">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn("group/msg flex gap-2", msg.sentByMe ? "flex-row-reverse" : "flex-row")}
                onMouseEnter={() => setHoveredMsgId(msg.id)}
                onMouseLeave={() => setHoveredMsgId(null)}
              >
                {!msg.sentByMe && (
                  <Avatar initials={activeThread.initials} color={activeThread.avatarColor} size="sm" />
                )}
                <div className={cn("max-w-[70%] flex flex-col gap-1", msg.sentByMe ? "items-end" : "items-start")}>
                  {/* Reaction bar — shows on hover */}
                  <div
                    className={cn(
                      "flex items-center gap-0.5 rounded-full border border-border bg-background shadow-md px-1.5 py-0.5 transition-all duration-150",
                      msg.sentByMe ? "self-end" : "self-start",
                      hoveredMsgId === msg.id ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                    )}
                  >
                    {QUICK_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        className="h-6 w-6 text-base hover:scale-125 transition-transform"
                        onClick={() => toggleReaction(msg.id, emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  {/* Bubble */}
                  <div
                    className={cn(
                      "rounded-2xl px-3 py-2",
                      msg.sentByMe
                        ? "rounded-tr-sm bg-primary text-primary-foreground"
                        : "rounded-tl-sm bg-muted text-foreground"
                    )}
                  >
                    {renderMessageContent(msg)}
                  </div>
                  {/* Reactions */}
                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {Object.entries(msg.reactions).map(([emoji, count]) => (
                        <button
                          key={emoji}
                          onClick={() => toggleReaction(msg.id, emoji)}
                          className="rounded-full px-2 py-0.5 text-[10px] border border-border hover:bg-muted transition-colors bg-muted/50"
                        >
                          {emoji} {count}
                        </button>
                      ))}
                    </div>
                  )}
                  {/* Timestamp + status */}
                  <div className="flex items-center gap-1 text-[9px] text-muted-foreground overflow-visible">
                    <span>{msg.time}</span>
                    {msg.sentByMe && msg.status === "read" && (
                      <CheckCheck className="h-2.5 w-2.5 shrink-0 text-primary" />
                    )}
                    {msg.sentByMe && msg.status === "delivered" && (
                      <CheckCheck className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2">
                <Avatar initials={activeThread.initials} color={activeThread.avatarColor} size="sm" />
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted px-3 py-2.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50"
                      style={{ animation: `bounce 1.2s ${i * 0.2}s infinite` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Poll creator */}
          {showPollCreator && (
            <div className="border-t border-border px-3 py-2 space-y-2 shrink-0 bg-background">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Create Poll</p>
              <input
                className="w-full rounded-lg border border-border bg-muted px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none"
                placeholder="Poll question..."
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
              />
              {pollOptions.map((opt, i) => (
                <input
                  key={i}
                  className="w-full rounded-lg border border-border bg-muted px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const next = [...pollOptions];
                    next[i] = e.target.value;
                    setPollOptions(next);
                  }}
                />
              ))}
              <div className="flex items-center gap-2">
                {pollOptions.length < 4 && (
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] text-muted-foreground hover:text-foreground" onClick={() => setPollOptions([...pollOptions, ""])}>
                    <Plus className="h-3 w-3 mr-1" /> Add option
                  </Button>
                )}
                <div className="ml-auto flex gap-2">
                  <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => setShowPollCreator(false)}>Cancel</Button>
                  <Button size="sm" className="h-6 text-[10px] bg-primary hover:bg-primary/90 text-primary-foreground" onClick={sendPoll}>Send Poll</Button>
                </div>
              </div>
            </div>
          )}

          {/* Emoji / GIF picker */}
          {showEmojiPicker && (
            <div className="border-t border-border px-3 py-2 space-y-2 shrink-0 bg-background">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Emoji</p>
              <div className="flex flex-wrap gap-1">
                {EMOJI_GRID.map((e) => (
                  <button
                    key={e}
                    className="h-6 w-6 text-base hover:scale-125 transition-transform"
                    onClick={() => { setInput((v) => v + e); setShowEmojiPicker(false); }}
                  >
                    {e}
                  </button>
                ))}
              </div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">GIF</p>
              <div className="flex gap-2">
                {GIF_COLORS.map((color, i) => (
                  <button key={i} className={cn("h-10 w-16 rounded-lg flex items-center justify-center text-white text-xs font-bold hover:opacity-80 transition-opacity", color)} onClick={() => sendGif(color)}>
                    GIF
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="border-t border-border px-3 py-2 shrink-0 bg-background">
            <div className={cn("flex items-end gap-1.5 rounded-xl border border-border px-2 py-1.5", isDark ? "bg-muted/30" : "bg-muted/50")}>

              {/* Left controls: icons panel (animated) + toggle button */}
              <div className="flex items-center gap-0.5 shrink-0 self-end pb-0.5">
                {/* Collapsible icons — slide in/out via max-width */}
                <div
                  className={cn(
                    "flex items-center gap-0.5 overflow-hidden transition-[max-width,opacity] duration-200 ease-in-out",
                    iconsOpen ? "max-w-[160px] opacity-100" : "max-w-0 opacity-0 pointer-events-none"
                  )}
                >
                  <Button variant="ghost" size="icon" title="Attach file" className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted" onClick={() => fileRef.current?.click()}>
                    <Paperclip className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Send image" className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted" onClick={() => imageRef.current?.click()}>
                    <ImageIcon className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Share location" className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted" onClick={handleLocation}>
                    <MapPin className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost" size="icon" title="Create poll"
                    className={cn("h-6 w-6 hover:bg-muted", showPollCreator ? "text-primary" : "text-muted-foreground hover:text-foreground")}
                    onClick={() => { setShowPollCreator((v) => !v); setShowEmojiPicker(false); }}
                  >
                    <BarChart2 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost" size="icon" title="Emoji / GIF"
                    className={cn("h-6 w-6 hover:bg-muted", showEmojiPicker ? "text-primary" : "text-muted-foreground hover:text-foreground")}
                    onClick={() => { setShowEmojiPicker((v) => !v); setShowPollCreator(false); }}
                  >
                    <Smile className="h-3 w-3" />
                  </Button>
                </div>

                {/* Plus / chevron toggle — only when there's input */}
                <div
                  className={cn(
                    "overflow-hidden transition-[max-width,opacity] duration-200 ease-in-out",
                    input.length > 0 ? "max-w-[28px] opacity-100" : "max-w-0 opacity-0 pointer-events-none"
                  )}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted"
                    onClick={() => setIconsOpen((v) => !v)}
                  >
                    {iconsOpen
                      ? <ChevronLeft className="h-3.5 w-3.5" />
                      : <Plus className="h-3.5 w-3.5" />
                    }
                  </Button>
                </div>
              </div>

              {/* Auto-expanding textarea */}
              <textarea
                ref={textareaRef}
                rows={1}
                className="flex-1 bg-transparent py-1.5 text-xs outline-none text-foreground placeholder:text-muted-foreground resize-none leading-relaxed"
                style={{ minHeight: "28px", maxHeight: "120px", overflowY: "auto" }}
                placeholder="Type a message..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />

              {/* Send button — stays at bottom as textarea grows */}
              <Button
                size="icon"
                onClick={sendMessage}
                disabled={!input.trim()}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-30 shrink-0 self-end mb-0.5"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* ───── DETAIL PANEL ───── */}
          <div
            className={cn(
              "absolute inset-y-0 right-0 flex flex-col bg-background border-l border-border z-20 transition-transform duration-300 ease-out",
              isMobile ? "w-full" : "w-64",
              detailOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <span className="font-semibold text-xs text-foreground">
                {activeThread.isGroup ? "Group Info" : "Contact Info"}
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => setDetailOpen(false)}>
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              <div className="flex flex-col items-center gap-2">
                <Avatar initials={activeThread.initials} color={activeThread.avatarColor} size="lg" online={activeThread.online} />
                <p className="font-semibold text-sm text-foreground">{activeThread.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {activeThread.isGroup ? `${activeThread.members?.length ?? 4} members` : activeThread.online ? "Online" : "Last seen recently"}
                </p>
              </div>
              {activeThread.isGroup && activeThread.members ? (
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Members</p>
                  {activeThread.members.map((name, i) => (
                    <div key={name} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold", ["bg-violet-500","bg-blue-500","bg-emerald-500","bg-rose-500"][i % 4])}>
                          {name[0]}
                        </div>
                        <span className="text-xs text-foreground">{name}</span>
                      </div>
                      {i === 0 && <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">admin</span>}
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="mt-2 w-full text-xs text-destructive hover:text-destructive">
                    Leave Group
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Shared Media</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {["bg-violet-400","bg-blue-400","bg-emerald-400","bg-rose-400"].map((c, i) => (
                      <div key={i} className={cn("aspect-square rounded-lg", c)} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}

export function ChatDemo({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const [baseColor, setBaseColor] = useState("neutral");
  const [colorTheme, setColorTheme] = useState("default");
  const [previewOpen, setPreviewOpen] = useState(false);

  // Measure the inline demo container width to drive mobile layout (or use fixed 375 for compact)
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(compact ? 375 : 800);

  useEffect(() => {
    if (compact) return;
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    ro.observe(el);
    setContainerWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, [compact]);

  const themeVars = mergeThemeVars(baseColor, colorTheme, mode);
  const styleObj = { ...themeVars, fontFamily: SHADCN_FONT } as React.CSSProperties;

  return (
    <div className={cn("space-y-4", compact && "space-y-0")}>
      {/* Controls — hidden in compact mode */}
      {!compact && (
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMode((m) => (m === "light" ? "dark" : "light"))}
          className="text-white/80 hover:bg-white/10 hover:text-white"
        >
          {mode === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="sm" className="text-white/80 hover:bg-white/10 hover:text-white">
                Base: {BASE_COLOR_OPTIONS.find((o) => o.id === baseColor)?.label ?? baseColor}
                <ChevronDown className="ml-1 h-3.5 w-3.5" />
              </Button>
            }
          />
          <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto">
            {BASE_COLOR_OPTIONS.map((opt) => (
              <DropdownMenuItem key={opt.id} onClick={() => setBaseColor(opt.id)}>
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="sm" className="text-white/80 hover:bg-white/10 hover:text-white">
                Color: {COLOR_THEME_OPTIONS.find((o) => o.id === colorTheme)?.label ?? colorTheme}
                <ChevronDown className="ml-1 h-3.5 w-3.5" />
              </Button>
            }
          />
          <DropdownMenuContent align="start" className="max-h-64 overflow-y-auto">
            {COLOR_THEME_OPTIONS.map((opt) => (
              <DropdownMenuItem key={opt.id} onClick={() => setColorTheme(opt.id)}>
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPreviewOpen(true)}
            className="text-white/80 hover:bg-white/10 hover:text-white"
          >
            <Maximize2 className="h-4 w-4 mr-1.5" />
            Preview
          </Button>
        </div>
      </div>
      )}

      {/* Chat preview — measured container (or fixed 375px in compact) */}
      <div
        ref={compact ? undefined : containerRef}
        className={cn(
          "overflow-hidden rounded-2xl border border-white/10",
          compact ? "h-[520px] w-[375px] mx-auto" : "h-[500px] md:h-[560px]",
          mode === "dark" ? "dark" : ""
        )}
        style={styleObj}
      >
        <ChatUI mode={mode} containerWidth={containerWidth} />
      </div>

      {/* Device Preview — hidden in compact mode */}
      {!compact && <DevicePreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        mode={mode}
        baseColor={baseColor}
        colorTheme={colorTheme}
        onModeChange={setMode}
        onBaseColorChange={setBaseColor}
        onColorThemeChange={setColorTheme}
        themeVars={themeVars as Record<string, string>}
        fontFamily={SHADCN_FONT}
      >
        {((_portalContainer, deviceSize) => {
          const DEVICE_WIDTHS = { mobile: 375, tablet: 768, laptop: 1280, large: 1536 };
          const devWidth = DEVICE_WIDTHS[deviceSize] ?? 1280;
          return (
            <div className={cn("h-full", mode === "dark" ? "dark" : "")} style={styleObj}>
              <ChatUI mode={mode} containerWidth={devWidth} />
            </div>
          );
        }) as (portalContainer: HTMLDivElement | null, deviceSize: "mobile" | "tablet" | "laptop" | "large") => React.ReactNode}
      </DevicePreview>}
    </div>
  );
}
