"use client";

import { DocPage } from "../../components/doc-page";
import { DocTabs } from "../../components/doc-tabs";
import { DocCallout } from "../../components/doc-blocks";
import { CodeBlock } from "../../components/code-block";
import { EmailDemo } from "./_components/email-demo";
import { EmailBackendContent } from "./_components/email-backend-content";

const headings = [
  { id: "quick-reference", text: "Quick reference", level: 2 },
  { id: "overview", text: "Overview", level: 2 },
  { id: "demo", text: "Demo", level: 2 },
  { id: "guide", text: "Guide", level: 2 },
];

export default function EmailKitPage() {
  return (
    <DocPage
      title="Email Kit"
      description="Full-featured email client with folders, threads, compose dialog, labels, and responsive layout. Includes both UI and backend scaffolding."
      headings={headings}
      stackConfig={{ showDatabaseFields: true }}
    >
      <h2 id="quick-reference" className="scroll-mt-24 font-semibold text-2xl pt-2">
        Quick reference
      </h2>
      <div className="rounded-xl border border-white/10 bg-black/20 p-4 mb-12 mt-4 max-w-2xl">
        <h4 className="font-medium text-white mb-3">CLI commands</h4>
        <CodeBlock
          code={`# Add UI components (inbox, compose, threads, etc.)
npx @fivfold/ui add email

# Add backend scaffolding (Express/NestJS + TypeORM)
npx @fivfold/api add email --framework=nestjs --orm=typeorm

# Use MongoDB + Mongoose
npx @fivfold/api add email --framework=nestjs --orm=mongoose --database=mongodb

# Use Express + Prisma
npx @fivfold/api add email --framework=express --orm=prisma

# Dry run to preview files
npx @fivfold/ui add email --dry-run
npx @fivfold/api add email --dry-run`}
          language="bash"
          className="text-xs"
        />
      </div>

      <h2 id="overview" className="scroll-mt-24 font-semibold text-2xl pt-2">
        Overview
      </h2>
      <p className="text-white/80 leading-relaxed mb-4 mt-4">
        The Email Kit provides a complete email client experience: folder sidebar, thread list,
        message view, compose dialog, labels, and recipient input with autocomplete. Each Kit in
        FivFold combines a polished frontend (built on shadcn/ui) with optional backend scaffolding
        for Express or NestJS. Supported combinations:
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
          </tbody>
        </table>
      </div>

      <h2 id="demo" className="scroll-mt-24 font-semibold text-2xl mt-4 pt-4">
        Demo
      </h2>
      <p className="text-white/60 text-sm mt-1 italic pb-8">
        This demo is presented with Mock Data
      </p>
      <EmailDemo />

      <h2 id="guide" className="scroll-mt-24 font-semibold text-2xl mt-12 pt-4">
        Guide
      </h2>
      <p className="text-white/80 leading-relaxed mb-6 mt-4 text-sm">
        Step-by-step guides for the frontend UI and backend API integration.
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
                  The Email Kit is built exclusively with shadcn/ui primitives. Follow the steps
                  below to install, integrate, and customize the UI.
                </p>

                {/* Step 1 */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="flex w-7 h-7 items-center justify-center rounded-lg bg-brand-primary/20 text-brand-primary text-sm font-bold">
                      1
                    </span>
                    Install the Email Kit
                  </h3>
                  <p className="text-white/80 text-sm mb-3">
                    Run the FivFold UI CLI to add the Email Kit to your project. Ensure you have run{" "}
                    <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">
                      npx @fivfold/ui init
                    </code>{" "}
                    first.
                  </p>
                  <CodeBlock
                    code="npx @fivfold/ui add email"
                    language="bash"
                    showTerminalIcon
                    className="mb-4"
                  />
                  <p className="text-white/80 text-sm">
                    The Kit is copied to{" "}
                    <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">
                      @/components/ui/kits/email/
                    </code>{" "}
                    (or your configured kits alias in <code>fivfold.json</code>).
                  </p>
                </div>

                {/* Step 2 */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="flex w-7 h-7 items-center justify-center rounded-lg bg-brand-primary/20 text-brand-primary text-sm font-bold">
                      2
                    </span>
                    Generated file structure
                  </h3>
                  <p className="text-white/80 text-sm mb-3">
                    The command creates a folder with multiple component files for easier development
                    and customization:
                  </p>
                  <CodeBlock
                    code={`kits/email/
  types.ts              # Shared types (FivFoldEmailFolder, FivFoldEmailThread, etc.)
  recipient-input.tsx   # To/Cc/Bcc input with autocomplete (Command + Popover)
  thread-item.tsx       # Thread list row with star button
  compose-dialog.tsx    # Compose, reply, and forward dialog
  message-panel.tsx     # Message detail with accordion and Reply/Reply All/Forward
  sidebar-content.tsx   # Folders and labels sidebar
  index.tsx             # Main EmailKit component and re-exports`}
                    language="text"
                    label="File tree"
                    className="mb-4"
                  />
                </div>

                {/* Step 3 */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="flex w-7 h-7 items-center justify-center rounded-lg bg-brand-primary/20 text-brand-primary text-sm font-bold">
                      3
                    </span>
                    Import and use in your app
                  </h3>
                  <p className="text-white/80 text-sm mb-3">
                    Import the main component and types from the kit folder:
                  </p>
                  <CodeBlock
                    code={`import { EmailKit } from "@/components/ui/kits/email";
import type { FivFoldEmailThread, FivFoldEmailFolder } from "@/components/ui/kits/email";

export function EmailPage() {
  const [threads, setThreads] = useState<FivFoldEmailThread[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState("inbox");

  return (
    <EmailKit
      folders={folders}
      selectedFolderId={selectedFolderId}
      onFolderSelect={setSelectedFolderId}
      threads={threads}
      selectedThreadId={selectedThreadId}
      onThreadSelect={setSelectedThreadId}
      onCompose={() => setComposeOpen(true)}
      onSend={handleSend}
      onStar={handleStar}
      availableLabels={labels}
    />
  );
}`}
                    language="tsx"
                    filename="app/email/page.tsx"
                  />
                </div>

                {/* Step 4 - Component reference */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="flex w-7 h-7 items-center justify-center rounded-lg bg-brand-primary/20 text-brand-primary text-sm font-bold">
                      4
                    </span>
                    Component reference
                  </h3>
                  <p className="text-white/80 text-sm mb-4">
                    The Email Kit exposes a single <code>EmailKit</code> component. Props are grouped by the UI section they control.
                  </p>

                  <div className="space-y-6">
                    <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                      <h4 className="font-medium text-white p-4 pb-2">Folder Sidebar</h4>
                      <p className="text-white/70 text-sm px-4 mb-3">
                        Navigation for Inbox, Sent, Drafts, Trash, and custom folders. Uses Button, ScrollArea, Badge, Separator. Implemented in <code>sidebar-content.tsx</code>.
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-y border-white/10">
                              <th className="text-left py-2 px-4 font-medium text-white/80">Prop</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Type</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Purpose</th>
                            </tr>
                          </thead>
                          <tbody className="text-white/70">
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">folders</td><td className="py-2 px-4 font-mono text-white/50">FivFoldEmailFolder[]</td><td className="py-2 px-4">List of folders (Inbox, Sent, Drafts, Trash, custom). Drives sidebar navigation.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">selectedFolderId</td><td className="py-2 px-4 font-mono text-white/50">string</td><td className="py-2 px-4">Currently selected folder. Controls which threads are shown.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onFolderSelect</td><td className="py-2 px-4 font-mono text-white/50">(id: string) =&gt; void</td><td className="py-2 px-4">Callback when user selects a folder. Fetch threads for the new folder.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">availableLabels</td><td className="py-2 px-4 font-mono text-white/50">FivFoldEmailLabel[]</td><td className="py-2 px-4">Labels shown in sidebar for filtering. Optional.</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                      <h4 className="font-medium text-white p-4 pb-2">Thread List</h4>
                      <p className="text-white/70 text-sm px-4 mb-3">
                        Scrollable list of email threads with sender, subject, snippet, datetime, labels, star toggle. Uses ScrollArea, Input, Badge. Each row is <code>thread-item.tsx</code>.
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-y border-white/10">
                              <th className="text-left py-2 px-4 font-medium text-white/80">Prop</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Type</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Purpose</th>
                            </tr>
                          </thead>
                          <tbody className="text-white/70">
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">threads</td><td className="py-2 px-4 font-mono text-white/50">FivFoldEmailThread[]</td><td className="py-2 px-4">Threads for the current folder. Map from your API response.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">selectedThreadId</td><td className="py-2 px-4 font-mono text-white/50">string | null</td><td className="py-2 px-4">Currently selected thread. Controls which message is shown.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onThreadSelect</td><td className="py-2 px-4 font-mono text-white/50">(id: string) =&gt; void</td><td className="py-2 px-4">Callback when user selects a thread. Fetch message details.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">searchValue</td><td className="py-2 px-4 font-mono text-white/50">string</td><td className="py-2 px-4">Search input value. Filter threads client-side or pass to API.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onSearchChange</td><td className="py-2 px-4 font-mono text-white/50">(value: string) =&gt; void</td><td className="py-2 px-4">Callback when search input changes. Debounce and refetch.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onStar</td><td className="py-2 px-4 font-mono text-white/50">(threadId, starred) =&gt; void</td><td className="py-2 px-4">Callback when user stars/unstars. Call PATCH /api/email/threads/:id.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">loadingThreads</td><td className="py-2 px-4 font-mono text-white/50">boolean</td><td className="py-2 px-4">Shows loading state in thread list while fetching.</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                      <h4 className="font-medium text-white p-4 pb-2">Message Panel</h4>
                      <p className="text-white/70 text-sm px-4 mb-3">
                        Accordion-style message view with sender avatar, body, attachments, Reply/Reply All/Forward actions. Uses Accordion, Button, ScrollArea.
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-y border-white/10">
                              <th className="text-left py-2 px-4 font-medium text-white/80">Prop</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Type</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Purpose</th>
                            </tr>
                          </thead>
                          <tbody className="text-white/70">
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">message</td><td className="py-2 px-4 font-mono text-white/50">FivFoldEmailMessage | null</td><td className="py-2 px-4">The selected message to display. From GET /api/email/threads/:id.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">loadingMessage</td><td className="py-2 px-4 font-mono text-white/50">boolean</td><td className="py-2 px-4">Shows loading state while fetching message details.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onReply</td><td className="py-2 px-4 font-mono text-white/50">(message) =&gt; void</td><td className="py-2 px-4">Opens compose with Reply pre-filled. Call onSend when submitted.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onReplyAll</td><td className="py-2 px-4 font-mono text-white/50">(message) =&gt; void</td><td className="py-2 px-4">Opens compose with Reply All (To/Cc) pre-filled.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onForward</td><td className="py-2 px-4 font-mono text-white/50">(message) =&gt; void</td><td className="py-2 px-4">Opens compose with Forward pre-filled.</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                      <h4 className="font-medium text-white p-4 pb-2">Compose Dialog</h4>
                      <p className="text-white/70 text-sm px-4 mb-3">
                        To/Cc/Bcc recipient input with autocomplete (Command + Popover), subject, body. Uses Dialog, Input, Textarea, Badge.
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-y border-white/10">
                              <th className="text-left py-2 px-4 font-medium text-white/80">Prop</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Type</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Purpose</th>
                            </tr>
                          </thead>
                          <tbody className="text-white/70">
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onCompose</td><td className="py-2 px-4 font-mono text-white/50">() =&gt; void</td><td className="py-2 px-4">Opens the compose dialog. Typically set state to show dialog.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onSend</td><td className="py-2 px-4 font-mono text-white/50">(data) =&gt; void</td><td className="py-2 px-4">Callback with to, cc, bcc, subject, body. Call POST /api/email/send.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">composeTitle</td><td className="py-2 px-4 font-mono text-white/50">string</td><td className="py-2 px-4">Dialog title (e.g. &quot;New Message&quot;, &quot;Reply&quot;, &quot;Forward&quot;).</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* shadcn dependencies */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">shadcn dependencies</h3>
                  <p className="text-white/80 text-sm mb-3">
                    Adding the Email Kit installs these shadcn/ui primitives if not already present:
                  </p>
                  <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-4 font-medium text-white/80">Component</th>
                          <th className="text-left py-2 px-4 font-medium text-white/80">Used in</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/70">
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">button</td><td className="py-2 px-4">Actions, folder items, compose</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">input</td><td className="py-2 px-4">Search, compose fields</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">dropdown-menu</td><td className="py-2 px-4">Label picker, actions</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">card</td><td className="py-2 px-4">Message panel, compose dialog</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">dialog</td><td className="py-2 px-4">Compose, reply, forward</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">scroll-area</td><td className="py-2 px-4">Thread list, message body, sidebar</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">label</td><td className="py-2 px-4">Form labels in compose</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">textarea</td><td className="py-2 px-4">Message body in compose</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">accordion</td><td className="py-2 px-4">Message headers/body expand</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">command</td><td className="py-2 px-4">Recipient autocomplete</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">popover</td><td className="py-2 px-4">Recipient autocomplete dropdown</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">badge</td><td className="py-2 px-4">Labels, unread count</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">separator</td><td className="py-2 px-4">Visual dividers</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">tooltip</td><td className="py-2 px-4">Hover hints</td></tr>
                      </tbody>
                    </table>
                  </div>
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
                <p className="text-white/80 text-sm leading-relaxed">
                  The Email API module provides entities, DTOs, services, and controllers for a
                  complete email backend. Select your stack in the sidebar for stack-specific integration steps.
                </p>
                <EmailBackendContent />
              </div>
            ),
          },
        ]}
        defaultTab="ui"
      />
    </DocPage>
  );
}
