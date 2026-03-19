"use client"

import { DocPage } from "../../components/doc-page"
import { DocTabs } from "../../components/doc-tabs"
import { CodeBlock } from "../../components/code-block"
import { KanbanDemo } from "./_components/kanban-demo"
import { KanbanBackendContent } from "./_components/kanban-backend-content"

const headings = [
  { id: "quick-reference", text: "Quick reference", level: 2 },
  { id: "overview", text: "Overview", level: 2 },
  { id: "demo", text: "Demo", level: 2 },
  { id: "guide", text: "Guide", level: 2 },
]

export default function KanbanKitPage() {
  return (
    <DocPage
      title="Kanban Kit"
      description="Drag-and-drop kanban board with columns, tasks, priorities, assignees, and labels. Includes both UI and backend scaffolding."
      headings={headings}
      stackConfig={{ showDatabaseFields: true }}
    >
      <h2 id="quick-reference" className="scroll-mt-24 font-semibold text-2xl pt-2">
        Quick reference
      </h2>
      <div className="rounded-xl border border-white/10 bg-black/20 p-4 mb-12 mt-4 max-w-2xl">
        <h4 className="font-medium text-white mb-3">CLI commands</h4>
        <CodeBlock
          code={`# Add UI components (board, columns, tasks, drag-and-drop)
npx @fivfold/ui add kanban

# Add backend scaffolding (Express/NestJS + TypeORM)
npx @fivfold/api add kanban --framework=nestjs --orm=typeorm

# Use MongoDB + Mongoose
npx @fivfold/api add kanban --framework=nestjs --orm=mongoose --database=mongodb

# Use Express + Prisma
npx @fivfold/api add kanban --framework=express --orm=prisma

# Dry run to preview files
npx @fivfold/ui add kanban --dry-run
npx @fivfold/api add kanban --dry-run`}
          language="bash"
          className="text-xs"
        />
      </div>

      <h2 id="overview" className="scroll-mt-24 font-semibold text-2xl pt-2">
        Overview
      </h2>
      <p className="text-white/80 leading-relaxed mb-4 mt-4">
        The Kanban Kit provides a full kanban board UI with drag-and-drop columns and tasks,
        priorities, assignees, and labels. Built with shadcn/ui Card, Badge, Avatar, ScrollArea, and
        @dnd-kit for drag-and-drop. Each Kit in FivFold combines a polished frontend with optional
        backend scaffolding for Express or NestJS. Supported combinations:
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
      <KanbanDemo />

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
                  The Kanban Kit is built exclusively with shadcn/ui primitives. Follow the steps
                  below to install, integrate, and customize the UI.
                </p>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="flex w-7 h-7 items-center justify-center rounded-lg bg-brand-primary/20 text-brand-primary text-sm font-bold">
                      1
                    </span>
                    Install the Kanban Kit
                  </h3>
                  <p className="text-white/80 text-sm mb-3">
                    Run the FivFold UI CLI to add the Kanban Kit to your project. Ensure you have run{" "}
                    <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">
                      npx @fivfold/ui init
                    </code>{" "}
                    first.
                  </p>
                  <CodeBlock
                    code="npx @fivfold/ui add kanban"
                    language="bash"
                    showTerminalIcon
                    className="mb-4"
                  />
                  <p className="text-white/80 text-sm">
                    The Kit is copied to{" "}
                    <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">
                      @/components/ui/kits/kanban/
                    </code>{" "}
                    (or your configured kits alias in <code>fivfold.json</code>).
                  </p>
                </div>

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
                    code={`kits/kanban/
  types.ts           # Shared types (FivFoldKanbanColumn, FivFoldKanbanTask, etc.)
  board-header.tsx   # Board title and search
  board.tsx          # Main board layout with columns
  column.tsx         # Column container with task list
  column-header.tsx  # Column title and add-task button
  task-card.tsx      # Task card with priority, assignee, labels
  task-detail.tsx    # Task detail dialog (view/edit)
  add-task-dialog.tsx # Create task form
  drag-provider.tsx  # @dnd-kit DndContext wrapper
  index.tsx         # Main KanbanKit component and re-exports`}
                    language="text"
                    label="File tree"
                    className="mb-4"
                  />
                </div>

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
                    code={`import { KanbanKit } from "@/components/ui/kits/kanban";
import type { FivFoldKanbanColumn, FivFoldKanbanLabel } from "@/components/ui/kits/kanban";

const LABELS: FivFoldKanbanLabel[] = [
  { id: "design", name: "Design", color: "#8b5cf6" },
  { id: "frontend", name: "Frontend", color: "#3b82f6" },
  // ...
];

export function KanbanPage() {
  const [columns, setColumns] = useState<FivFoldKanbanColumn[]>([]);

  return (
    <KanbanKit
      columns={columns}
      onColumnsChange={setColumns}
      availableLabels={LABELS}
      boardTitle="Project Board"
      showPriority
      showAssignee
      showDueDate
      showLabels
      showAttachments
      showComments
    />
  );
}`}
                    language="tsx"
                    filename="app/kanban/page.tsx"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="flex w-7 h-7 items-center justify-center rounded-lg bg-brand-primary/20 text-brand-primary text-sm font-bold">
                      4
                    </span>
                    Component reference
                  </h3>
                  <p className="text-white/80 text-sm mb-4">
                    The Kanban Kit exposes a single <code>KanbanKit</code> component. Props control
                    board behavior and visibility of optional features.
                  </p>

                  <div className="space-y-6">
                    <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                      <h4 className="font-medium text-white p-4 pb-2">Board & Columns</h4>
                      <p className="text-white/70 text-sm px-4 mb-3">
                        Core data and layout. Uses Card, ScrollArea, @dnd-kit for drag-and-drop.
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
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">columns</td><td className="py-2 px-4 font-mono text-white/50">FivFoldKanbanColumn[]</td><td className="py-2 px-4">List of columns with tasks. Map from your API response. Tasks use <code>labels: FivFoldKanbanLabel[]</code> for colored labels.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onColumnsChange</td><td className="py-2 px-4 font-mono text-white/50">(columns) =&gt; void</td><td className="py-2 px-4">Callback when columns/tasks change (e.g. drag-drop). Call PATCH /api/kanban/tasks/:id/move.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">availableLabels</td><td className="py-2 px-4 font-mono text-white/50">FivFoldKanbanLabel[]</td><td className="py-2 px-4">Predefined label definitions (id, name, color) for the board. Passed to Add Task dialog for label selection.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">boardTitle</td><td className="py-2 px-4 font-mono text-white/50">string</td><td className="py-2 px-4">Board header title.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">mobileLayout</td><td className="py-2 px-4 font-mono text-white/50">&quot;scroll&quot; | &quot;stack&quot;</td><td className="py-2 px-4">Mobile layout: horizontal scroll or stacked columns.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">portalContainer</td><td className="py-2 px-4 font-mono text-white/50">HTMLElement | null</td><td className="py-2 px-4">When set (e.g. in device preview), add-task and task-detail dialogs render inside this container instead of document.body.</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                      <h4 className="font-medium text-white p-4 pb-2">Visibility toggles</h4>
                      <p className="text-white/70 text-sm px-4 mb-3">
                        Show/hide optional task fields. Uses Badge, Avatar.
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
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">showPriority</td><td className="py-2 px-4 font-mono text-white/50">boolean</td><td className="py-2 px-4">Show priority badge (Low, Medium, High, Urgent).</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">showAssignee</td><td className="py-2 px-4 font-mono text-white/50">boolean</td><td className="py-2 px-4">Show assignee avatar.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">showDueDate</td><td className="py-2 px-4 font-mono text-white/50">boolean</td><td className="py-2 px-4">Show due date on task cards.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">showLabels</td><td className="py-2 px-4 font-mono text-white/50">boolean</td><td className="py-2 px-4">Show labels on task cards.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">showAttachments</td><td className="py-2 px-4 font-mono text-white/50">boolean</td><td className="py-2 px-4">Show attachment count.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">showComments</td><td className="py-2 px-4 font-mono text-white/50">boolean</td><td className="py-2 px-4">Show comment count.</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                      <h4 className="font-medium text-white p-4 pb-2">Types</h4>
                      <p className="text-white/70 text-sm px-4 mb-3">
                        <code>FivFoldKanbanLabel</code> has <code>id</code>, <code>name</code>, and <code>color</code> (hex). Tasks use <code>labels?: FivFoldKanbanLabel[]</code>. Optional task fields: <code>taskId</code>, <code>storyPoints</code>, <code>sprint</code>, <code>reporter</code>.
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                      <h4 className="font-medium text-white p-4 pb-2">Callbacks</h4>
                      <p className="text-white/70 text-sm px-4 mb-3">
                        Optional handlers for task click and add task.
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
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onTaskClick</td><td className="py-2 px-4 font-mono text-white/50">(task) =&gt; void</td><td className="py-2 px-4">Override default task detail dialog. Use for custom routing.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onAddTask</td><td className="py-2 px-4 font-mono text-white/50">(columnId) =&gt; void</td><td className="py-2 px-4">Override default add-task dialog. Use for API-driven create flow.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onSearch</td><td className="py-2 px-4 font-mono text-white/50">(query) =&gt; void</td><td className="py-2 px-4">Search callback. Filter columns/tasks or call API.</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">shadcn dependencies</h3>
                  <p className="text-white/80 text-sm mb-3">
                    Adding the Kanban Kit installs these shadcn/ui primitives if not already present:
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
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">card</td><td className="py-2 px-4">Columns, task cards, task detail, add-task dialog</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">scroll-area</td><td className="py-2 px-4">Column task list, board layout</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">badge</td><td className="py-2 px-4">Priority, labels</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">avatar</td><td className="py-2 px-4">Assignee avatars</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">button</td><td className="py-2 px-4">Add task, actions</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">dialog</td><td className="py-2 px-4">Task detail, add-task form</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">input</td><td className="py-2 px-4">Search, form fields</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">label</td><td className="py-2 px-4">Form labels in add-task</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">textarea</td><td className="py-2 px-4">Task description</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">select</td><td className="py-2 px-4">Priority, assignee picker</td></tr>
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
                  The Kanban API module provides entities, DTOs, services, and controllers for boards,
                  columns, tasks, and labels. Select your stack in the sidebar for stack-specific integration steps.
                </p>
                <KanbanBackendContent />
              </div>
            ),
          },
        ]}
        defaultTab="ui"
      />
    </DocPage>
  )
}
