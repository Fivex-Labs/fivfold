"use client";

import { FileUp, MapPin, ImageIcon } from "lucide-react";
import { DocPage } from "../../components/doc-page";
import { DocTabs } from "../../components/doc-tabs";
import { DocCallout } from "../../components/doc-blocks";
import { CodeBlock } from "../../components/code-block";
import { ChatDemo } from "./_components/chat-demo";
import { ChatBackendContent } from "./_components/chat-backend-content";
import {
  ChatFullstackUiGuide,
  ChatKitShadcnPrimitivesSection,
} from "./_components/chat-fullstack-docs";
import { KitUserModelIntegration } from "../../components/kit-user-model-integration";
import { KitDocStepHeading } from "../../components/kit-doc-step-heading";
import Image from "next/image";

const headings = [
  { id: "quick-reference", text: "Quick reference", level: 2 },
  { id: "overview", text: "Overview", level: 2 },
  { id: "architecture", text: "Architecture", level: 2 },
  { id: "demo", text: "Demo", level: 2 },
  { id: "guide", text: "Guide", level: 2 },
];

export default function ChatKitPage() {
  return (
    <DocPage
      title="Chat Kit"
      description="Full-featured iMessage/WhatsApp-inspired chat with 1-1 and group conversations, attachments, polls, GIFs, location sharing, reactions, and Socket.IO real-time transport."
      headings={headings}
      stackConfig={{ showDatabaseFields: true, showFrontendBundler: true }}
    >
      {/* Quick reference */}
      <h2 id="quick-reference" className="scroll-mt-24 font-semibold text-2xl pt-2">
        Quick reference
      </h2>
      <div className="rounded-xl border border-white/10 bg-black/20 p-4 mb-12 mt-4 max-w-2xl">
        <h4 className="font-medium text-white mb-3">CLI commands</h4>
        <CodeBlock
          code={`# Add Chat UI components
npx @fivfold/ui add chat

# Add Chat backend (NestJS + TypeORM + Socket.IO)
npx @fivfold/api add chat --framework=nestjs --orm=typeorm

# Use MongoDB + Mongoose
npx @fivfold/api add chat --framework=nestjs --orm=mongoose

# Use Express + Prisma
npx @fivfold/api add chat --framework=express --orm=prisma

# Dry run to preview generated files
npx @fivfold/ui add chat --dry-run
npx @fivfold/api add chat --dry-run`}
          language="bash"
          className="text-xs"
        />
      </div>

      {/* Overview */}
      <h2 id="overview" className="scroll-mt-24 font-semibold text-2xl pt-2">
        Overview
      </h2>
      <p className="text-white/80 leading-relaxed mb-4 mt-4">
        The Chat Kit is a production-ready messaging system scaffolded across your full stack. It follows
        Hexagonal Architecture so you can swap databases, ORMs, and real-time providers without touching
        your domain logic. Supported combinations:
      </p>
      <div className="overflow-x-auto rounded-xl border border-white/10 mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-2 px-4 font-medium text-white/80">Layer</th>
              <th className="text-left py-2 px-4 font-medium text-white/80">Options</th>
            </tr>
          </thead>
          <tbody className="text-white/70">
            <tr className="border-b border-white/5">
              <td className="py-2 px-4 font-medium text-white/90">Framework</td>
              <td className="py-2 px-4">NestJS, Express</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 px-4 font-medium text-white/90">SQL</td>
              <td className="py-2 px-4">TypeORM (PostgreSQL, MySQL, MariaDB, MSSQL), Prisma</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 px-4 font-medium text-white/90">NoSQL</td>
              <td className="py-2 px-4">Mongoose (MongoDB), Prisma (MongoDB connector)</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 px-4 font-medium text-white/90">Cloud NoSQL</td>
              <td className="py-2 px-4">Azure Cosmos DB SDK, AWS DynamoDB SDK</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 px-4 font-medium text-white/90">Realtime</td>
              <td className="py-2 px-4">Socket.IO (WebSocket — auto-selected)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {[
          { title: "1-1 & Group Chats", body: "Private DMs and multi-participant group conversations with admin roles, member management, and leave/remove actions." },
          { title: "Rich Messages", body: "Text, images, videos, files, audio, GIFs (Tenor API), location pins, and interactive polls — all sent as typed message variants." },
          { title: "Real-time Updates", body: "Socket.IO WebSocket rooms with typing indicators, presence detection, read receipts, and message delivery events — works with any database." },
          { title: "Reactions & Read Receipts", body: "Per-message emoji reactions, per-message read-by tracking, and animated typing indicators with user avatars." },
          { title: "Search", body: "Full-text search across conversations and message content with paginated results grouped by type." },
          { title: "Glassmorphism UI", body: "Backdrop-blur message bubbles, smooth framer-motion animations, and fully responsive layout from mobile to desktop." },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-white/10 bg-black/20 p-4">
            <h4 className="font-semibold text-white mb-1">{f.title}</h4>
            <p className="text-white/60 text-sm">{f.body}</p>
          </div>
        ))}
      </div>

      {/* Architecture */}
      <h2 id="architecture" className="scroll-mt-24 font-semibold text-2xl pt-2 mt-4">
        Architecture
      </h2>
      <p className="text-white/70 text-sm mt-2 mb-4">
        The Chat Kit backend strictly follows Hexagonal (Ports &amp; Adapters) Architecture. The
        domain port (<code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">IChatService</code>) is
        framework and database agnostic — the delivery and infrastructure layers are generated separately
        based on your stack selection.
      </p>
      
      <Image
        src="/diagrams/fivfold_chatkit_overview.png"
        alt="Chat Architecture"
        width={1000}
        height={1000}
        className="rounded-xl border border-white/10"
      />

      {/* Demo */}
      <h2 id="demo" className="scroll-mt-24 font-semibold text-2xl mt-8 pt-4">
        Demo
      </h2>
      <p className="text-white/60 text-sm mt-1 italic pb-8">
        Interactive preview with simulated real-time replies and mock data
      </p>
      <ChatDemo />

      {/* Guide */}
      <h2 id="guide" className="scroll-mt-24 font-semibold text-2xl mt-12 pt-4">
        Guide
      </h2>
      <p className="text-white/80 leading-relaxed mb-6 mt-4 text-sm">
        Step-by-step guides for the frontend UI and backend API integration. In the sidebar, pick{" "}
        <strong className="text-white/90">Frontend</strong> first (Next.js or Vite), then runtime through ORM; the API tab uses the same
        selection for CORS and connection steps.
      </p>
      <DocTabs
        tabs={[
          {
            id: "ui",
            label: "UI",
            icon: "layout",
            content: (
              <div className="space-y-10">
                <p className="text-white/80 text-sm leading-relaxed">
                  The Chat Kit UI is built on shadcn/ui with Tailwind CSS v4. All components are fully
                  customizable and support light/dark mode via CSS variables.
                </p>

                <div>
                  <KitDocStepHeading step={1}>Install the Chat Kit</KitDocStepHeading>
                  <p className="text-white/80 text-sm mb-3">
                    Run the FivFold UI CLI after initializing your project with{" "}
                    <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">npx @fivfold/ui init</code>.
                  </p>
                  <CodeBlock code="npx @fivfold/ui add chat" language="bash" showTerminalIcon className="mb-4" />
                  <p className="text-white/80 text-sm">
                    Components are placed in{" "}
                    <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">
                      @/components/ui/kits/chat/
                    </code>
                    .
                  </p>
                </div>

                <div>
                  <KitDocStepHeading step={2}>Generated file structure</KitDocStepHeading>
                  <CodeBlock
                    code={`kits/chat/
  types.ts                   # All shared TypeScript types
  index.tsx                  # ChatKit root component + re-exports
  chat-avatar.tsx            # ChatAvatar, GroupAvatar
  threads-list.tsx           # Sidebar conversation list
  thread-item.tsx            # Individual thread row with context menu
  conversation.tsx           # Message view with infinite scroll
  message-bubble.tsx         # Message bubble (text, image, poll, location, GIF)
  message-input.tsx          # Compose bar with attachment/GIF/poll/location
  typing-indicator.tsx       # Animated typing dots
  attachment-picker.tsx      # File/image/video picker with drag-and-drop
  gif-picker.tsx             # Tenor GIF search and picker
  poll-creator.tsx           # Create poll dialog
  poll-display.tsx           # Rendered poll with vote progress
  location-picker.tsx        # Share location (geolocation or manual)
  location-display.tsx       # Static map + Google Maps link
  reaction-picker.tsx        # Quick emoji reaction overlay
  search-panel.tsx           # Full-text search dialog
  new-chat-dialog.tsx        # Start DM or create group dialog
  contact-detail.tsx         # Contact info sheet
  group-detail.tsx           # Group info, members, admin controls`}
                    language="text"
                    label="File tree"
                  />
                </div>

                <div>
                  <KitDocStepHeading step={3}>Import and use in your app</KitDocStepHeading>
                  <CodeBlock
                    code={`import { ChatKit } from "@/components/ui/kits/chat";
import type {
  FivFoldChatConversation,
  FivFoldChatMessage,
  FivFoldChatUser,
} from "@/components/ui/kits/chat";

export default function ChatPage() {
  const currentUser: FivFoldChatUser = {
    id: "u1",
    name: "You",
    email: "you@example.com",
  };

  return (
    <ChatKit
      currentUser={currentUser}
      conversations={conversations}
      onSendMessage={handleSendMessage}
      onCreateConversation={handleCreate}
      onVotePoll={handleVote}
      onAddReaction={handleReaction}
      onMarkRead={handleMarkRead}
    />
  );
}`}
                    language="tsx"
                    filename="app/chat/page.tsx"
                  />
                </div>

                <div>
                  <KitDocStepHeading step={4}>Props reference (ChatKit)</KitDocStepHeading>
                  <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-4 font-medium text-white/80">Prop</th>
                          <th className="text-left py-2 px-4 font-medium text-white/80">Type</th>
                          <th className="text-left py-2 px-4 font-medium text-white/80">Purpose</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/70">
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">currentUser</td><td className="py-2 px-4 font-mono text-white/50">FivFoldChatUser</td><td>The logged-in user. Used to determine sent/received and show own avatar.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">conversations</td><td className="py-2 px-4 font-mono text-white/50">FivFoldChatConversation[]</td><td>All conversations to display in the sidebar thread list.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onSendMessage</td><td className="py-2 px-4 font-mono text-white/50">(convId, dto) =&gt; void</td><td>Called when user sends any message type (text, attachment, poll, location, GIF).</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onCreateConversation</td><td className="py-2 px-4 font-mono text-white/50">(dto) =&gt; Promise&lt;Conversation&gt;</td><td>Called when user starts a new DM or group. Return the created conversation.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onVotePoll</td><td className="py-2 px-4 font-mono text-white/50">(pollId, optionIds) =&gt; void</td><td>Called when user votes on a poll. PATCH /api/chat/polls/:id/vote.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onAddReaction</td><td className="py-2 px-4 font-mono text-white/50">(msgId, emoji) =&gt; void</td><td>Called when user reacts to a message. POST /api/chat/messages/:id/reactions.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onMarkRead</td><td className="py-2 px-4 font-mono text-white/50">(msgId) =&gt; void</td><td>Called when a message enters the viewport. PATCH /api/chat/messages/:id/read.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">typingUsers</td><td className="py-2 px-4 font-mono text-white/50">Record&lt;string, string[]&gt;</td><td>Map of convId → userIds currently typing. Drives the animated typing indicator.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onTyping</td><td className="py-2 px-4 font-mono text-white/50">(convId, isTyping) =&gt; void</td><td>Emit typing start/stop events to your real-time backend.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">loadingMessages</td><td className="py-2 px-4 font-mono text-white/50">boolean</td><td>Show skeleton loaders while fetching message history.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">hasMoreMessages</td><td className="py-2 px-4 font-mono text-white/50">boolean</td><td>Enable the "load more" trigger at the top of the message list.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onLoadMore</td><td className="py-2 px-4 font-mono text-white/50">() =&gt; void</td><td>Called when user scrolls to the top. Fetch the next page of messages.</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-6">
                  <KitDocStepHeading step={5}>Integration with backend</KitDocStepHeading>
                  <KitUserModelIntegration
                    kitTitle="Chat (UI layer)"
                    summary="The kit needs a currentUser object and conversation data from your API. User ids in props, REST calls, and Socket.IO handshakes must all refer to the same identifiers your backend stores on participants and messages."
                    bullets={[
                      "Set currentUser.id to the same value the API uses for req.user.id (or your dev-user header during local testing).",
                      "When rendering participants and avatars, map userId fields from DTOs to display names via your user directory.",
                      "Socket.IO query userId and REST headers must stay in sync so typing and read receipts target the right participant.",
                    ]}
                  />
                  <ChatFullstackUiGuide embedded />
                </div>

                <div>
                  <KitDocStepHeading step={6} className="mb-4">
                    Third-party integrations
                  </KitDocStepHeading>
                  <p className="text-white/70 text-sm mb-4">
                    The Chat Kit UI integrates with external services for GIFs, file uploads, and location sharing. Configure these in your frontend; the API supports the corresponding message types (see API tab).
                  </p>

                  <div className="space-y-6">
                    {/* Tenor GIF */}
                    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                      <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-brand-secondary" />
                        Tenor GIF integration
                      </h4>
                      <p className="text-white/70 text-sm mb-3">
                        <a href="https://developers.google.com/tenor" target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline">Tenor</a> (by Google) provides a GIF search API. The <code className="rounded bg-white/10 px-1 py-0.5">gif-picker.tsx</code> component calls Tenor directly for search; when the user selects a GIF, it sends a message via <code className="rounded bg-white/10 px-1 py-0.5">onSendMessage</code> with <code className="rounded bg-white/10 px-1 py-0.5">type: &quot;gif&quot;</code> and <code className="rounded bg-white/10 px-1 py-0.5">metadata: &#123; tenorId, url, previewUrl, ... &#125;</code>.
                      </p>
                      <p className="text-white/60 text-xs mb-3">
                        <strong>Flow:</strong> (1) User opens GIF picker → frontend calls Tenor Search API with query. (2) User selects GIF → call <code className="rounded bg-white/10 px-1 py-0.5">onSendMessage(convId, &#123; type: &quot;gif&quot;, metadata: &#123; tenorId, url, previewUrl, description &#125; &#125;)</code>. (3) Your backend receives <code className="rounded bg-white/10 px-1 py-0.5">POST /api/chat/conversations/:id/messages</code> and creates the message. (4) Optionally call Tenor&apos;s Register Share endpoint when a GIF is sent to improve future search results.
                      </p>
                      <CodeBlock
                        code={`// gif-picker.tsx — Tenor Search (frontend)
const res = await fetch(
  \`https://tenor.googleapis.com/v2/search?q=\${query}&key=\${TENOR_API_KEY}&client_key=my_app&limit=8&media_filter=tinygif,gif\`
);
const data = await res.json();
// Use tinygif for previews, gif for the URL sent in metadata`}
                        language="ts"
                        label="Tenor Search"
                      />
                      <p className="text-white/50 text-xs mt-2">
                        <strong>Setup:</strong> Create an API key in <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline">Google Cloud Console</a> and enable the Tenor API. Use <code className="rounded bg-white/10 px-1 py-0.5">NEXT_PUBLIC_TENOR_API_KEY</code> for client-side search, or proxy Tenor through your backend. Include <code className="rounded bg-white/10 px-1 py-0.5">client_key</code> in all requests. Tenor requires attribution — see their <a href="https://developers.google.com/tenor/guides/attribution" target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline">attribution guide</a>.
                      </p>
                    </div>

                    {/* File storage */}
                    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                      <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <FileUp className="h-4 w-4 text-brand-secondary" />
                        File storage (attachments)
                      </h4>
                      <p className="text-white/70 text-sm mb-3">
                        The <code className="rounded bg-white/10 px-1 py-0.5">attachment-picker.tsx</code> lets users select files. Attachments are stored in object storage — not in your database. Your frontend must upload the file first, then call <code className="rounded bg-white/10 px-1 py-0.5">onSendMessage</code> (or your attachment endpoint) with the resulting URL.
                      </p>
                      <ol className="list-decimal list-inside text-white/60 text-sm space-y-1 mb-3">
                        <li>User selects file → upload to S3, GCS, R2, or your backend proxy (presigned URLs, etc.).</li>
                        <li>On upload complete → call your API with <code className="rounded bg-white/10 px-1 py-0.5">url</code>, <code className="rounded bg-white/10 px-1 py-0.5">name</code>, <code className="rounded bg-white/10 px-1 py-0.5">size</code>, <code className="rounded bg-white/10 px-1 py-0.5">mimeType</code>.</li>
                        <li>Backend creates Message + Attachment; UI displays via <code className="rounded bg-white/10 px-1 py-0.5">message-bubble.tsx</code>.</li>
                      </ol>
                      <p className="text-white/50 text-xs">
                        Recommended: AWS S3, Google Cloud Storage, Cloudflare R2, or Azure Blob. Generate thumbnails for videos and pass <code className="rounded bg-white/10 px-1 py-0.5">thumbnailUrl</code> for faster rendering.
                      </p>
                    </div>

                    {/* Location */}
                    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                      <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-brand-secondary" />
                        Location sharing
                      </h4>
                      <p className="text-white/70 text-sm mb-3">
                        The <code className="rounded bg-white/10 px-1 py-0.5">location-picker.tsx</code> and <code className="rounded bg-white/10 px-1 py-0.5">location-display.tsx</code> components handle sharing and display. Use <code className="rounded bg-white/10 px-1 py-0.5">navigator.geolocation.getCurrentPosition()</code> to obtain coordinates, or allow manual input. Send via <code className="rounded bg-white/10 px-1 py-0.5">onSendMessage</code> with <code className="rounded bg-white/10 px-1 py-0.5">type: &quot;location&quot;</code> and <code className="rounded bg-white/10 px-1 py-0.5">metadata: &#123; latitude, longitude, label? &#125;</code>.
                      </p>
                      <p className="text-white/50 text-xs">
                        No external API required. <code className="rounded bg-white/10 px-1 py-0.5">location-display.tsx</code> can use OpenStreetMap for the preview and link to Google Maps for &quot;Open in Maps&quot;.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <KitDocStepHeading step={7}>Shadcn primitives dependencies</KitDocStepHeading>
                  <ChatKitShadcnPrimitivesSection />
                </div>

                <div>
                  <KitDocStepHeading step={8}>Additional dependencies</KitDocStepHeading>
                  <p className="text-white/80 text-sm mb-3">
                    Besides shadcn/ui primitives, <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">npx @fivfold/ui add chat</code> adds these npm packages (declared in the kit manifest <code className="rounded bg-white/10 px-1 py-0.5 text-brand-secondary">ui/manifests/chat.kit.json</code>):
                  </p>
                  <ul className="list-disc list-inside text-white/75 text-sm space-y-2">
                    <li>
                      <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-brand-secondary">framer-motion</code> — layout animations (typing indicator, message transitions).
                    </li>
                    <li>
                      <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-brand-secondary">date-fns</code> — message timestamps and relative time.
                    </li>
                    <li>
                      <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-brand-secondary">emoji-mart</code> — emoji picker for reactions and compose.
                    </li>
                    <li>
                      <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-brand-secondary">socket.io-client</code> — optional real-time layer when you wire the kit to a Socket.IO backend (see integration section).
                    </li>
                  </ul>
                </div>
              </div>
            ),
          },
          {
            id: "api",
            label: "API",
            icon: "server",
            content: (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Step-by-step: API integration</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  The Chat API module scaffolds a complete backend following Hexagonal Architecture.
                  Use the sidebar in order: <strong className="text-white/90">Frontend</strong>, then runtime, framework, database, and ORM—the docs below follow those choices.
                </p>
                <ChatBackendContent />
              </div>
            ),
          },
        ]}
        defaultTab="ui"
      />
    </DocPage>
  );
}
