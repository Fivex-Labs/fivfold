"use client"

import { useStack } from "../../../components/stack-context"
import { CodeBlock } from "../../../components/code-block"
import { KitIntegrationDisclaimer } from "../../../components/kit-integration-disclaimer"
import { KitApiFeBePlaybook } from "../../../components/kit-api-fe-be-playbook"
import { KitUserModelIntegration } from "../../../components/kit-user-model-integration"
import { KitDocStepHeading } from "../../../components/kit-doc-step-heading"

const API_ENDPOINTS_TABLE = (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-white/80 border-collapse">
      <thead>
        <tr className="border-b border-white/10">
          <th className="text-left py-2 pr-4">Method</th>
          <th className="text-left py-2 pr-4">Path</th>
          <th className="text-left py-2">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">GET</td><td className="py-2 pr-4 font-mono">/api/kanban/boards/:id</td><td>Get board with columns and tasks</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">GET</td><td className="py-2 pr-4 font-mono">/api/kanban/columns</td><td>List columns for a board</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">POST</td><td className="py-2 pr-4 font-mono">/api/kanban/tasks</td><td>Create task</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">PATCH</td><td className="py-2 pr-4 font-mono">/api/kanban/tasks/:id</td><td>Update task (title, description, priority, assignee, etc.)</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">PATCH</td><td className="py-2 pr-4 font-mono">/api/kanban/tasks/:id/move</td><td>Move task to new column and position</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">DELETE</td><td className="py-2 pr-4 font-mono">/api/kanban/tasks/:id</td><td>Delete task</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">GET</td><td className="py-2 pr-4 font-mono">/api/kanban/labels</td><td>List labels (id, name, color) for the board</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">POST</td><td className="py-2 pr-4 font-mono">/api/kanban/labels</td><td>Create label (name, color)</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">POST</td><td className="py-2 pr-4 font-mono">/api/kanban/columns</td><td>Create column</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">PATCH</td><td className="py-2 pr-4 font-mono">/api/kanban/columns/:id</td><td>Update column (title, order)</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">DELETE</td><td className="py-2 pr-4 font-mono">/api/kanban/columns/:id</td><td>Delete column</td></tr>
      </tbody>
    </table>
  </div>
)

export function KanbanBackendContent() {
  const { stack } = useStack()

  const isExpress = stack.framework === "express"
  const isNestJS = stack.framework === "nestjs"
  const isTypeORM = stack.orm === "typeorm"
  const isPrisma = stack.orm === "prisma"
  const isMongoose = stack.orm === "mongoose"
  const isCosmosSdk = stack.orm === "cosmos-sdk"
  const isDynamoSdk = stack.orm === "dynamodb-sdk"

  const expressTypeORM = (
    <>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Generated file tree
        </h4>
        <CodeBlock
          code={`kanban/
  entities/
    board.entity.ts       # KanbanBoard
    column.entity.ts      # KanbanColumn
    task.entity.ts        # KanbanTask
    label.entity.ts       # KanbanLabel (id, name, color)
  dto/
    create-task.dto.ts
    update-task.dto.ts
    move-task.dto.ts
  services/
    kanban.service.ts     # Business logic
  routes/
    kanban.routes.ts      # Express router (GET/POST/PATCH/DELETE)`}
          language="text"
          label="File tree"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Register entities in TypeORM DataSource
        </h4>
        <CodeBlock
          code={`// src/data-source.ts (or your TypeORM config)
import { KanbanBoard } from './modules/kanban/entities/board.entity';
import { KanbanColumn } from './modules/kanban/entities/column.entity';
import { KanbanTask } from './modules/kanban/entities/task.entity';
import { KanbanLabel } from './modules/kanban/entities/label.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    // ... your existing entities
    KanbanBoard,
    KanbanColumn,
    KanbanTask,
    KanbanLabel,
  ],
  synchronize: process.env.NODE_ENV !== 'production',
});`}
          language="typescript"
          filename="src/data-source.ts"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Mount the router in your Express app
        </h4>
        <CodeBlock
          code={`// src/app.ts
import { createKanbanService } from './modules/kanban/kanban.service';
import { createKanbanRouter } from './modules/kanban/kanban.routes';

const app = express();
app.use(express.json());
const kanbanService = createKanbanService(AppDataSource);
app.use('/api/kanban', createKanbanRouter(kanbanService));`}
          language="typescript"
          filename="src/app.ts"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Replace auth placeholder with your JWT middleware
        </h4>
        <p className="text-white/80 text-sm mb-2">
          In <code>routes/kanban.routes.ts</code>, update the authMiddleware and getUser functions to use your JWT verification.
        </p>
        <CodeBlock
          code={`function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  const user = verifyJwt(token); // your JWT verification
  if (!user) { res.status(401).json({ error: 'Unauthorized' }); return; }
  req.user = { id: user.sub, email: user.email };
  next();
}`}
          language="typescript"
          filename="routes/kanban.routes.ts"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Run migrations (production)
        </h4>
        <CodeBlock
          code={`npx typeorm migration:generate -n AddKanbanModule
npx typeorm migration:run`}
          language="bash"
          showTerminalIcon
        />
      </div>
    </>
  )

  const nestjsTypeORM = (
    <>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Generated file tree
        </h4>
        <CodeBlock
          code={`kanban/
  entities/             # TypeORM entities (board, column, task, label with color)
  dto/                  # class-validator DTOs
  kanban.controller.ts  # NestJS controller with all kanban endpoints
  kanban.service.ts     # Business logic
  kanban.module.ts      # NestJS module (registers entities, controller, service)`}
          language="text"
          label="File tree"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Import KanbanModule into AppModule
        </h4>
        <CodeBlock
          code={`// src/app.module.ts
import { KanbanModule } from './modules/kanban/kanban.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    KanbanModule,
  ],
})
export class AppModule {}`}
          language="typescript"
          filename="src/app.module.ts"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Enable ValidationPipe globally
        </h4>
        <CodeBlock
          code={`// src/main.ts
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));`}
          language="typescript"
          filename="src/main.ts"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Add auth guard to the controller
        </h4>
        <p className="text-white/80 text-sm mb-2">
          In <code>kanban.controller.ts</code>, add your JWT guard and replace the getUser helper.
        </p>
        <CodeBlock
          code={`import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('kanban')
export class KanbanController { ... }`}
          language="typescript"
          filename="kanban.controller.ts"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Run TypeORM migrations (production)
        </h4>
        <CodeBlock
          code={`npx typeorm migration:generate src/migrations/AddKanbanModule -d src/data-source.ts
npx typeorm migration:run -d src/data-source.ts`}
          language="bash"
          showTerminalIcon
        />
      </div>
    </>
  )

  const expressMongoose = (
    <>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Generated file tree
        </h4>
        <CodeBlock
          code={`kanban/
  schemas/
    board.schema.ts
    column.schema.ts
    task.schema.ts
    label.schema.ts
  dto/
  services/
  routes/
    kanban.routes.ts`}
          language="text"
          label="File tree"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Register Mongoose schemas and mount router
        </h4>
        <CodeBlock
          code={`import mongoose from 'mongoose';
import { createKanbanService } from './modules/kanban/kanban.service';
import { createKanbanRouter } from './modules/kanban/kanban.routes';
// Register models: mongoose.model('KanbanBoard', KanbanBoardSchema);
// Repeat for Column, Task, Label

const kanbanService = createKanbanService(mongoose.connection);
app.use('/api/kanban', createKanbanRouter(kanbanService));`}
          language="typescript"
          filename="src/app.ts"
        />
      </div>
    </>
  )

  const expressCosmosDynamo = (
    <>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Generated file tree
        </h4>
        <CodeBlock
          code={`kanban/
  ${isCosmosSdk ? "containers/\n    kanban.containers.ts" : "tables/\n    kanban.tables.ts"}
  dto/
  services/
  routes/
    kanban.routes.ts`}
          language="text"
          label="File tree"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Data layer setup
        </h4>
        <p className="text-white/80 text-sm mb-2">
          {isCosmosSdk
            ? "Create Cosmos DB database and containers per the generated kanban.containers.ts. Pass the connection to createKanbanService, then pass the service to createKanbanRouter."
            : "Create DynamoDB tables per the generated kanban.tables.ts. Pass the client to createKanbanService, then pass the service to createKanbanRouter."}
        </p>
      </div>
    </>
  )

  const expressPrisma = (
    <>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Generated file tree
        </h4>
        <CodeBlock
          code={`kanban/
  prisma/schema.prisma   # Kanban models (Board, Column, Task, Label with color)
  dto/
  services/
  routes/
    kanban.routes.ts`}
          language="text"
          label="File tree"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Mount the router
        </h4>
        <CodeBlock
          code={`import { createKanbanService } from './modules/kanban/kanban.service';
import { createKanbanRouter } from './modules/kanban/kanban.routes';

const kanbanService = createKanbanService(prisma);
app.use('/api/kanban', createKanbanRouter(kanbanService));`}
          language="typescript"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Run Prisma migrations
        </h4>
        <CodeBlock
          code={`npx prisma migrate dev --name AddKanbanModule`}
          language="bash"
          showTerminalIcon
        />
      </div>
    </>
  )

  const nestjsMongoose = (
    <>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Generated file tree
        </h4>
        <CodeBlock
          code={`kanban/
  schemas/
    board.schema.ts
    column.schema.ts
    task.schema.ts
    label.schema.ts
  dto/
  kanban.controller.ts
  kanban.service.ts
  kanban.module.ts`}
          language="text"
          label="File tree"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Import KanbanModule into AppModule
        </h4>
        <CodeBlock
          code={`// kanban.module.ts (auto-generated) uses MongooseModule.forFeature([...])
// Ensure MongooseModule.forRoot(process.env.MONGODB_URI) is in your AppModule.`}
          language="typescript"
          filename="src/app.module.ts"
        />
      </div>
    </>
  )

  const nestjsCosmosDynamo = (
    <>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Generated file tree
        </h4>
        <CodeBlock
          code={`kanban/
  ${isCosmosSdk ? "containers/\n    kanban.containers.ts" : "tables/\n    kanban.tables.ts"}
  dto/
  kanban.controller.ts
  kanban.service.ts
  kanban.module.ts`}
          language="text"
          label="File tree"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Data layer setup
        </h4>
        <p className="text-white/80 text-sm mb-2">
          {isCosmosSdk
            ? "Create Cosmos DB database and containers per the generated kanban.containers.ts. The KanbanModule uses a stub service—implement the Cosmos client in the service."
            : "Create DynamoDB tables per the generated kanban.tables.ts. The KanbanModule uses a stub service—implement the DynamoDB client in the service."}
        </p>
      </div>
    </>
  )

  const nestjsPrisma = (
    <>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Generated file tree
        </h4>
        <CodeBlock
          code={`kanban/
  prisma/schema.prisma   # Kanban models
  dto/
  kanban.controller.ts
  kanban.service.ts
  kanban.module.ts`}
          language="text"
          label="File tree"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Import KanbanModule into AppModule
        </h4>
        <CodeBlock
          code={`@Module({ imports: [KanbanModule] })
export class AppModule {}`}
          language="typescript"
          filename="app.module.ts"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">
          Run Prisma migrations
        </h4>
        <CodeBlock
          code={`npx prisma migrate dev --name AddKanbanModule`}
          language="bash"
          showTerminalIcon
        />
      </div>
    </>
  )

  let stackContent = expressTypeORM
  if (isExpress && isPrisma) stackContent = expressPrisma
  else if (isExpress && isMongoose) stackContent = expressMongoose
  else if (isExpress && (isCosmosSdk || isDynamoSdk)) stackContent = expressCosmosDynamo
  else if (isNestJS && isTypeORM) stackContent = nestjsTypeORM
  else if (isNestJS && isPrisma) stackContent = nestjsPrisma
  else if (isNestJS && isMongoose) stackContent = nestjsMongoose
  else if (isNestJS && (isCosmosSdk || isDynamoSdk)) stackContent = nestjsCosmosDynamo

  const isDefaultStack = isNestJS && isTypeORM
  const dbFlag = stack.database && stack.database !== "postgres" ? ` --database=${stack.database}` : ""
  const scaffoldCommand = isDefaultStack
    ? "npx @fivfold/api add kanban"
    : `npx @fivfold/api add kanban --framework=${stack.framework} --orm=${stack.orm}${dbFlag}`

  return (
    <div className="space-y-8">
      <div>
        <KitDocStepHeading step={1}>Install / scaffold the module</KitDocStepHeading>
        <p className="text-white/80 text-sm mb-3">
          Normally, when you run <code>npx @fivfold/api init</code>, it prompts for framework, ORM, database, and output directory. That config is saved to <code>fivfold.json</code>, so you can then run the basic command without flags.
        </p>
        <p className="text-white/80 text-sm mb-2">
          {isDefaultStack
            ? "With NestJS + TypeORM selected (default), run:"
            : `With ${isNestJS ? "NestJS" : "Express"} + ${isPrisma ? "Prisma" : "TypeORM"} selected, run:`}
        </p>
        <CodeBlock
          code={scaffoldCommand}
          language="bash"
          showTerminalIcon
        />
      </div>
      <div className="space-y-6">
        <KitDocStepHeading step={2}>Generated file structure & wire into the app</KitDocStepHeading>
        <p className="text-white/65 text-sm -mt-1 mb-2">
          Subsections below follow the <strong className="text-white/85">framework</strong> and <strong className="text-white/85">ORM</strong> selected in the stack sidebar (covers <code className="rounded bg-white/10 px-1">AGENTS.md</code> API tab §2–§3).
        </p>
        {stackContent}
      </div>
      <div>
        <KitDocStepHeading step={3}>API reference</KitDocStepHeading>
        {API_ENDPOINTS_TABLE}
      </div>
      <div className="space-y-6">
        <KitDocStepHeading step={4}>Integration with frontend</KitDocStepHeading>
        <KitIntegrationDisclaimer />
        <KitApiFeBePlaybook withDisclaimer={false} kitTitle="Kanban" apiControllerPath="kanban" />
        <KitUserModelIntegration
          kitTitle="Kanban"
          summary="Boards, columns, and tasks reference users for ownership and assignees. Generated code uses string identifiers that must match your real user records."
          bullets={[
            "Check board and task fields (assigneeId, createdBy, ownerId, etc.) in the scaffolded entities or Prisma models and map them to your User.id or IdP subject.",
            "If assignees are optional in your product, keep null handling in the service layer when loading boards.",
            "For multi-tenant apps, add a tenant or organization key to queries in KanbanService so boards never leak across customers.",
          ]}
        />
        <div>
          <h5 className="text-sm font-semibold text-white/90 mb-2">Environment variables</h5>
          <p className="text-white/55 text-xs mb-2">
            Examples only—tune for your environments after reading the disclaimer above.
          </p>
          <CodeBlock
            code={
              isTypeORM || isPrisma
                ? `DATABASE_URL=postgresql://user:password@localhost:5432/yourdb`
                : isMongoose
                ? `MONGODB_URI=mongodb://localhost:27017/yourdb`
                : isCosmosSdk
                ? `COSMOS_ENDPOINT="https://your-account.documents.azure.com:443/"
COSMOS_KEY="your-key"
COSMOS_DATABASE_ID="kanbandb"`
                : isDynamoSdk
                ? `AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."`
                : `DATABASE_URL=postgresql://user:password@localhost:5432/yourdb`
            }
            language="bash"
            label=".env"
          />
        </div>
        <div>
          <h5 className="text-sm font-semibold text-white/90 mb-2">Mapping API data to the Kanban UI</h5>
        <p className="text-white/80 text-sm mb-4">
          The Kanban Kit UI expects data in the <code>FivFoldKanbanColumn</code>[] shape (columns with nested tasks).
          Your API returns its own format—map the response in your data-fetching layer (e.g. React Query, SWR, or fetch).
        </p>
        <p className="text-white/80 text-sm mb-3 font-medium">1. Map API response to FivFoldKanbanColumn[]</p>
        <CodeBlock
          code={`// In your data layer (e.g. lib/kanban-api.ts or a React Query hook)
function mapColumn(c: ApiColumn): FivFoldKanbanColumn {
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    color: c.color,
    maxTasks: c.maxTasks,
    tasks: (c.tasks ?? []).map(mapTask),
  };
}

function mapTask(t: ApiTask): FivFoldKanbanTask {
  return {
    id: t.id,
    taskId: t.taskId,
    title: t.title,
    description: t.description,
    status: t.columnId,
    priority: t.priority,
    assignee: t.assignee,
    reporter: t.reporter,
    dueDate: t.dueDate,
    storyPoints: t.storyPoints,
    sprint: t.sprint,
    labels: t.labels, // FivFoldKanbanLabel[] with id, name, color
    estimatedHours: t.estimatedHours,
    actualHours: t.actualHours,
    attachments: t.attachments,
    comments: t.comments,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}

// Fetch and map when loading board
const { columns } = await fetch('/api/kanban/boards/1').then(r => r.json());
const mappedColumns = columns.map(mapColumn);`}
          language="typescript"
          filename="lib/kanban-api.ts"
        />
        <p className="text-white/80 text-sm mt-4 mb-3 font-medium">2. Wire KanbanKit props to your API</p>
        <CodeBlock
          code={`// app/kanban/page.tsx
import { KanbanKit } from "@/components/ui/kits/kanban";
import { useBoard, useMoveTask, useAddTask } from "./hooks";

export function KanbanPage() {
  const { columns, labels, isLoading } = useBoard();  // GET boards, GET labels
  const { mutate: moveTask } = useMoveTask();         // PATCH /api/kanban/tasks/:id/move
  const { mutate: addTask } = useAddTask();           // POST /api/kanban/tasks

  const handleColumnsChange = (updated: FivFoldKanbanColumn[]) => {
    // Detect moves from onColumnsChange and call moveTask API
    // Or sync optimistically and refetch
  };

  return (
    <KanbanKit
      columns={columns}
      onColumnsChange={handleColumnsChange}
      availableLabels={labels}
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
        <p className="text-white/80 text-sm mt-4 mb-3 font-medium">3. On drag-drop completion</p>
        <p className="text-white/70 text-sm mt-2">
          When <code>onColumnsChange</code> fires after a drag, call <code>PATCH /api/kanban/tasks/:id/move</code> with the new <code>columnId</code> and <code>position</code>.
        </p>
        <p className="text-white/70 text-sm mt-4">
          Ensure your API base URL and auth token are passed in fetch headers (e.g. <code>Authorization: Bearer ...</code>).
        </p>
        </div>
      </div>
      <div>
        <KitDocStepHeading step={5}>Third-party integrations</KitDocStepHeading>
        <p className="text-white/80 text-sm">
          The Kanban API module is database-backed only. The UI kit may use <code className="rounded bg-white/10 px-1">@dnd-kit</code> in the browser; that is separate from this backend scaffold.
        </p>
      </div>
      <div>
        <KitDocStepHeading step={8}>Additional notes</KitDocStepHeading>
        <p className="text-white/80 text-sm">
          Use migrations in production and validate <code className="rounded bg-white/10 px-1">PATCH /api/kanban/tasks/:id/move</code> payloads so clients cannot reorder across boards they do not own.
        </p>
      </div>
    </div>
  )
}
