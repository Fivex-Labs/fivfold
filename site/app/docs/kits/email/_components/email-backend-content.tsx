"use client"

import { useStack } from "../../../components/stack-context"
import { CodeBlock } from "../../../components/code-block"

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
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">GET</td><td className="py-2 pr-4 font-mono">/api/email/threads</td><td>List threads (search/filter/pagination)</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">GET</td><td className="py-2 pr-4 font-mono">/api/email/threads/:id</td><td>Get thread with messages</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">PATCH</td><td className="py-2 pr-4 font-mono">/api/email/threads/:id</td><td>Update thread (star, read, move, labels)</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">DELETE</td><td className="py-2 pr-4 font-mono">/api/email/threads/:id</td><td>Delete thread</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">POST</td><td className="py-2 pr-4 font-mono">/api/email/send</td><td>Send email (creates thread or replies)</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">GET</td><td className="py-2 pr-4 font-mono">/api/email/folders</td><td>List folders</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">POST</td><td className="py-2 pr-4 font-mono">/api/email/folders</td><td>Create folder</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">DELETE</td><td className="py-2 pr-4 font-mono">/api/email/folders/:id</td><td>Delete folder</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">GET</td><td className="py-2 pr-4 font-mono">/api/email/labels</td><td>List labels</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">POST</td><td className="py-2 pr-4 font-mono">/api/email/labels</td><td>Create label</td></tr>
      </tbody>
    </table>
  </div>
)

export function EmailBackendContent() {
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
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">2</span>
          Generated file tree
        </h4>
        <CodeBlock
          code={`email/
  entities/
    folder.entity.ts      # Email folders (Inbox, Sent, Drafts, Trash, custom)
    label.entity.ts       # Custom labels/tags
    thread.entity.ts      # Email threads (conversations)
    message.entity.ts     # Individual emails within a thread
    attachment.entity.ts  # File attachments
  dto/
    create-email.dto.ts   # Send/compose email DTO
    update-email.dto.ts   # Update thread (star, read, move, label) DTO
    search-email.dto.ts   # Search/filter threads DTO
  services/
    email.service.ts      # Business logic
  routes/
    email.routes.ts       # Express router (GET/POST/PATCH/DELETE)`}
          language="text"
          label="File tree"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">3</span>
          Register entities in TypeORM DataSource
        </h4>
        <CodeBlock
          code={`// src/data-source.ts (or your TypeORM config)
import { EmailFolder } from './modules/email/entities/folder.entity';
import { EmailLabel } from './modules/email/entities/label.entity';
import { EmailThread } from './modules/email/entities/thread.entity';
import { EmailMessage } from './modules/email/entities/message.entity';
import { EmailAttachment } from './modules/email/entities/attachment.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    // ... your existing entities
    EmailFolder,
    EmailLabel,
    EmailThread,
    EmailMessage,
    EmailAttachment,
  ],
  synchronize: process.env.NODE_ENV !== 'production',
});`}
          language="typescript"
          filename="src/data-source.ts"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">4</span>
          Mount the router in your Express app
        </h4>
        <CodeBlock
          code={`// src/app.ts
import { createEmailService } from './modules/email/email.service';
import { createEmailRouter } from './modules/email/email.routes';

const app = express();
app.use(express.json());
const emailService = createEmailService(AppDataSource);
app.use('/api/email', createEmailRouter(emailService));`}
          language="typescript"
          filename="src/app.ts"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">5</span>
          Replace auth placeholder with your JWT middleware
        </h4>
        <p className="text-white/80 text-sm mb-2">
          In <code>routes/email.routes.ts</code>, update the authMiddleware and getUser functions to use your JWT verification.
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
          filename="routes/email.routes.ts"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">6</span>
          Run migrations (production)
        </h4>
        <CodeBlock
          code={`npx typeorm migration:generate -n AddEmailModule
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
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">2</span>
          Generated file tree
        </h4>
        <CodeBlock
          code={`email/
  entities/             # TypeORM entities (folder, label, thread, message, attachment)
  dto/                  # class-validator DTOs
  email.controller.ts   # NestJS controller with all email endpoints
  email.service.ts      # Business logic
  email.module.ts       # NestJS module (registers entities, controller, service)`}
          language="text"
          label="File tree"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">3</span>
          Import EmailModule into AppModule
        </h4>
        <CodeBlock
          code={`// src/app.module.ts
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    EmailModule,
  ],
})
export class AppModule {}`}
          language="typescript"
          filename="src/app.module.ts"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">4</span>
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
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">5</span>
          Add auth guard to the controller
        </h4>
        <p className="text-white/80 text-sm mb-2">
          In <code>email.controller.ts</code>, add your JWT guard and replace the getUser helper.
        </p>
        <CodeBlock
          code={`import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('email')
export class EmailController { ... }`}
          language="typescript"
          filename="email.controller.ts"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">6</span>
          Run TypeORM migrations (production)
        </h4>
        <CodeBlock
          code={`npx typeorm migration:generate src/migrations/AddEmailModule -d src/data-source.ts
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
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">2</span>
          Generated file tree
        </h4>
        <CodeBlock
          code={`email/
  schemas/
    folder.schema.ts
    label.schema.ts
    thread.schema.ts
    message.schema.ts
    attachment.schema.ts
  dto/
  services/
  routes/
    email.routes.ts`}
          language="text"
          label="File tree"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">3</span>
          Register Mongoose schemas and mount router
        </h4>
        <CodeBlock
          code={`import mongoose from 'mongoose';
import { createEmailService } from './modules/email/email.service';
import { createEmailRouter } from './modules/email/email.routes';
// Register models: mongoose.model('EmailFolder', EmailFolderSchema);
// Repeat for Label, Thread, Message, Attachment

const emailService = createEmailService(mongoose.connection);
app.use('/api/email', createEmailRouter(emailService));`}
          language="typescript"
          filename="src/app.ts"
        />
      </div>
    </>
  )

  const expressCosmosDynamo = (
    <>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">2</span>
          Generated file tree
        </h4>
        <CodeBlock
          code={`email/
  ${isCosmosSdk ? "containers/\n    email.containers.ts" : "tables/\n    email.tables.ts"}
  dto/
  services/
  routes/
    email.routes.ts`}
          language="text"
          label="File tree"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">3</span>
          Data layer setup
        </h4>
        <p className="text-white/80 text-sm mb-2">
          {isCosmosSdk
            ? "Create Cosmos DB database and containers per the generated email.containers.ts. Pass the connection to createEmailService, then pass the service to createEmailRouter."
            : "Create DynamoDB tables per the generated email.tables.ts. Pass the client to createEmailService, then pass the service to createEmailRouter."}
        </p>
      </div>
    </>
  )

  const expressPrisma = (
    <>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">2</span>
          Generated file tree
        </h4>
        <CodeBlock
          code={`email/
  prisma/schema.prisma   # Email models (Folder, Label, Thread, Message, Attachment)
  dto/
  services/
  routes/
    email.routes.ts`}
          language="text"
          label="File tree"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">3</span>
          Mount the router
        </h4>
        <CodeBlock
          code={`import { createEmailService } from './modules/email/email.service';
import { createEmailRouter } from './modules/email/email.routes';

const emailService = createEmailService(prisma);
app.use('/api/email', createEmailRouter(emailService));`}
          language="typescript"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">4</span>
          Run Prisma migrations
        </h4>
        <CodeBlock
          code={`npx prisma migrate dev --name AddEmailModule`}
          language="bash"
          showTerminalIcon
        />
      </div>
    </>
  )

  const nestjsMongoose = (
    <>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">2</span>
          Generated file tree
        </h4>
        <CodeBlock
          code={`email/
  schemas/
    folder.schema.ts
    label.schema.ts
    thread.schema.ts
    message.schema.ts
    attachment.schema.ts
  dto/
  email.controller.ts
  email.service.ts
  email.module.ts`}
          language="text"
          label="File tree"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">3</span>
          Import EmailModule into AppModule
        </h4>
        <CodeBlock
          code={`// email.module.ts (auto-generated) uses MongooseModule.forFeature([...])
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
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">2</span>
          Generated file tree
        </h4>
        <CodeBlock
          code={`email/
  ${isCosmosSdk ? "containers/\n    email.containers.ts" : "tables/\n    email.tables.ts"}
  dto/
  email.controller.ts
  email.service.ts
  email.module.ts`}
          language="text"
          label="File tree"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">3</span>
          Data layer setup
        </h4>
        <p className="text-white/80 text-sm mb-2">
          {isCosmosSdk
            ? "Create Cosmos DB database and containers per the generated email.containers.ts. The EmailModule uses a stub service—implement the Cosmos client in the service."
            : "Create DynamoDB tables per the generated email.tables.ts. The EmailModule uses a stub service—implement the DynamoDB client in the service."}
        </p>
      </div>
    </>
  )

  const nestjsPrisma = (
    <>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">2</span>
          Generated file tree
        </h4>
        <CodeBlock
          code={`email/
  prisma/schema.prisma   # Email models
  dto/
  email.controller.ts
  email.service.ts
  email.module.ts`}
          language="text"
          label="File tree"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">3</span>
          Import EmailModule into AppModule
        </h4>
        <CodeBlock
          code={`@Module({ imports: [EmailModule] })
export class AppModule {}`}
          language="typescript"
          filename="app.module.ts"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">4</span>
          Run Prisma migrations
        </h4>
        <CodeBlock
          code={`npx prisma migrate dev --name AddEmailModule`}
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
    ? "npx @fivfold/api add email"
    : `npx @fivfold/api add email --framework=${stack.framework} --orm=${stack.orm}${dbFlag}`

  return (
    <div className="space-y-8">
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">1</span>
          Scaffold the module
        </h4>
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
      {stackContent}
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">7</span>
          Set environment variables
        </h4>
        <CodeBlock
          code={
            isTypeORM || isPrisma
              ? `DATABASE_URL=postgresql://user:password@localhost:5432/yourdb`
              : isMongoose
              ? `MONGODB_URI=mongodb://localhost:27017/yourdb`
              : isCosmosSdk
              ? `COSMOS_ENDPOINT="https://your-account.documents.azure.com:443/"
COSMOS_KEY="your-key"
COSMOS_DATABASE_ID="emaildb"`
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
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">8</span>
          API Endpoints
        </h4>
        {API_ENDPOINTS_TABLE}
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">9</span>
          Connecting the Email Kit UI with your API
        </h4>
        <p className="text-white/80 text-sm mb-4">
          The Email Kit UI expects data in the <code>FivFoldEmailThread</code> and <code>FivFoldEmailFolder</code> shapes.
          Your API returns its own format—map the response in your data-fetching layer (e.g. React Query, SWR, or fetch).
        </p>
        <p className="text-white/80 text-sm mb-3 font-medium">1. Map API threads to FivFoldEmailThread</p>
        <CodeBlock
          code={`// In your data layer (e.g. lib/email-api.ts or a React Query hook)
function mapThread(t: ApiThread): FivFoldEmailThread {
  return {
    id: t.id,
    from: t.messages[0]?.senderName ?? t.messages[0]?.senderEmail ?? 'Unknown',
    subject: t.subject,
    snippet: t.messages[t.messages.length - 1]?.body?.slice(0, 100) ?? '',
    datetime: formatDate(t.lastMessageAt),
    unread: t.unread,
    starred: t.starred,
    labels: t.labelIds ?? [],
    conversationCount: t.messages?.length ?? 0,
    messages: t.messages?.map(mapMessage) ?? [],
  };
}

// Fetch and map when loading threads
const threads = (await fetch('/api/email/threads').then(r => r.json()))
  .map(mapThread);`}
          language="typescript"
          filename="lib/email-api.ts"
        />
        <p className="text-white/80 text-sm mt-4 mb-3 font-medium">2. Wire EmailKit props to your API</p>
        <CodeBlock
          code={`// app/email/page.tsx
import { EmailKit } from "@/components/ui/kits/email";
import { useThreads, useFolders, useStar, useSend } from "./hooks";

export function EmailPage() {
  const { threads, isLoading } = useThreads();      // GET /api/email/threads
  const { folders } = useFolders();                  // GET /api/email/folders
  const { mutate: star } = useStar();               // PATCH /api/email/threads/:id
  const { mutate: send } = useSend();               // POST /api/email/send

  return (
    <EmailKit
      folders={folders}
      selectedFolderId={selectedFolderId}
      onFolderSelect={setSelectedFolderId}
      threads={threads}
      loadingThreads={isLoading}
      selectedThreadId={selectedThreadId}
      onThreadSelect={setSelectedThreadId}
      onStar={(id, starred) => star({ id, starred })}
      onSend={(data) => send(data)}
      onCompose={() => setComposeOpen(true)}
      availableLabels={labels}
    />
  );
}`}
          language="tsx"
          filename="app/email/page.tsx"
        />
        <p className="text-white/70 text-sm mt-4">
          Ensure your API base URL and auth token are passed in fetch headers (e.g. <code>Authorization: Bearer ...</code>).
        </p>
      </div>
    </div>
  )
}
