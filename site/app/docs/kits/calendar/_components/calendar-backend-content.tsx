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
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">GET</td><td className="py-2 pr-4 font-mono">/api/calendar/events</td><td>List all events for the authenticated user</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">GET</td><td className="py-2 pr-4 font-mono">/api/calendar/events?startDate=&amp;endDate=</td><td>Date-range query for a specific window</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">GET</td><td className="py-2 pr-4 font-mono">/api/calendar/events/:id</td><td>Get a single event with attendees</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">POST</td><td className="py-2 pr-4 font-mono">/api/calendar/events</td><td>Create event (title, startDate, endDate, isAllDay, color, location, recurrenceRule, attendeeEmails)</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">PATCH</td><td className="py-2 pr-4 font-mono">/api/calendar/events/:id</td><td>Update event fields</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">DELETE</td><td className="py-2 pr-4 font-mono">/api/calendar/events/:id</td><td>Delete event (cascades attendees)</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">POST</td><td className="py-2 pr-4 font-mono">/api/calendar/events/:id/attendees</td><td>Add attendee by email</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">DELETE</td><td className="py-2 pr-4 font-mono">/api/calendar/events/:id/attendees/:aid</td><td>Remove attendee</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">PATCH</td><td className="py-2 pr-4 font-mono">/api/calendar/events/:id/attendees/:aid/status</td><td>Update RSVP status (pending / accepted / declined)</td></tr>
      </tbody>
    </table>
  </div>
)

export function CalendarBackendContent() {
  const { stack } = useStack()

  const isExpress = stack.framework === "express"
  const isNestJS = stack.framework === "nestjs"
  const isTypeORM = stack.orm === "typeorm"
  const isPrisma = stack.orm === "prisma"
  const isMongoose = stack.orm === "mongoose"
  const isCosmosSdk = stack.orm === "cosmos-sdk"
  const isDynamoSdk = stack.orm === "dynamodb-sdk"

  const isDefaultStack = isNestJS && isTypeORM
  const dbFlag = stack.database && stack.database !== "postgres" ? ` --database=${stack.database}` : ""
  const scaffoldCommand = isDefaultStack
    ? "npx @fivfold/api add calendar"
    : `npx @fivfold/api add calendar --framework=${stack.framework} --orm=${stack.orm}${dbFlag}`

  const typeormFileTree = `calendar/
  entities/
    event.entity.ts        # CalendarEvent (title, startDate, endDate, isAllDay, color, location, recurrenceRule, ownerId)
    attendee.entity.ts     # CalendarAttendee (eventId, userId, email, name, status)
  dto/
    create-event.dto.ts
    update-event.dto.ts
    query-events.dto.ts
  domain/
    calendar.port.ts       # ICalendarService hexagonal port
  ${isNestJS ? "calendar.controller.ts\n  calendar.service.ts\n  calendar.module.ts" : "calendar.routes.ts\n  calendar.service.ts"}`

  const prismaFileTree = `calendar/
  prisma/schema.prisma     # CalendarEvent + CalendarAttendee models (appended)
  dto/
  domain/
    calendar.port.ts
  ${isNestJS ? "calendar.controller.ts\n  calendar.service.ts\n  calendar.module.ts" : "calendar.routes.ts\n  calendar.service.ts"}`

  const mongooseFileTree = `calendar/
  schemas/
    event.schema.ts
    attendee.schema.ts
  dto/
  domain/
    calendar.port.ts
  ${isNestJS ? "calendar.controller.ts\n  calendar.service.ts\n  calendar.module.ts" : "calendar.routes.ts\n  calendar.service.ts"}`

  const cloudFileTree = `calendar/
  ${isCosmosSdk ? "containers/\n    calendar.containers.ts" : "tables/\n    calendar.tables.ts"}
  dto/
  domain/
    calendar.port.ts
  ${isNestJS ? "calendar.controller.ts\n  calendar.service.ts\n  calendar.module.ts" : "calendar.routes.ts\n  calendar.service.ts"}`

  const fileTree = (isTypeORM || (!isPrisma && !isMongoose && !isCosmosSdk && !isDynamoSdk))
    ? typeormFileTree
    : isPrisma ? prismaFileTree
    : isMongoose ? mongooseFileTree
    : cloudFileTree

  const envVarsCode = isTypeORM || isPrisma
    ? `DATABASE_URL=postgresql://user:password@localhost:5432/yourdb`
    : isMongoose
    ? `MONGODB_URI=mongodb://localhost:27017/yourdb`
    : isCosmosSdk
    ? `COSMOS_ENDPOINT="https://your-account.documents.azure.com:443/"
COSMOS_KEY="your-key"
COSMOS_DATABASE_ID="calendardb"`
    : `AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."`

  return (
    <div className="space-y-8">
      <div>
        <KitDocStepHeading step={1}>Install / scaffold the module</KitDocStepHeading>
        <p className="text-white/80 text-sm mb-3">
          Run <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">npx @fivfold/api init</code> first if you haven&apos;t already — it detects your framework and ORM and saves config to <code>fivfold.json</code>.
        </p>
        <CodeBlock code={scaffoldCommand} language="bash" showTerminalIcon className="mb-3" />
        <p className="text-white/70 text-sm">
          The command stages all calendar files in the VFS and commits them atomically. Use <code className="rounded bg-white/10 px-1">--dry-run</code> to preview without writing.
        </p>
      </div>

      <div>
        <KitDocStepHeading step={2}>Generated file structure</KitDocStepHeading>
        <CodeBlock code={fileTree} language="text" label="File tree" className="mb-4" />
      </div>

      <div>
        <KitDocStepHeading step={3}>Wire into your app</KitDocStepHeading>

        {isNestJS && isTypeORM && (
          <div className="space-y-4">
            <p className="text-white/80 text-sm">The AST engine auto-registers <code>CalendarModule</code> into <code>src/app.module.ts</code>. Ensure <code>TypeOrmModule.forRoot()</code> uses <code>autoLoadEntities: true</code>:</p>
            <CodeBlock
              code={`// src/app.module.ts (auto-modified by fivfold-api)
import { CalendarModule } from './modules/calendar/calendar.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    CalendarModule,
  ],
})
export class AppModule {}`}
              language="typescript"
              filename="src/app.module.ts"
            />
            <CodeBlock
              code={`// src/main.ts — enable global validation
import { ValidationPipe } from '@nestjs/common';
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));`}
              language="typescript"
              filename="src/main.ts"
            />
            <CodeBlock
              code={`npx typeorm migration:generate src/migrations/AddCalendarModule -d src/data-source.ts
npx typeorm migration:run -d src/data-source.ts`}
              language="bash"
              showTerminalIcon
              label="Run migrations (production)"
            />
          </div>
        )}

        {isNestJS && isPrisma && (
          <div className="space-y-4">
            <p className="text-white/80 text-sm">Prisma models are appended to <code>prisma/schema.prisma</code>. Register and migrate:</p>
            <CodeBlock
              code={`npx prisma migrate dev --name AddCalendarModule`}
              language="bash"
              showTerminalIcon
            />
            <CodeBlock
              code={`// src/app.module.ts (auto-modified)
import { CalendarModule } from './modules/calendar/calendar.module';
@Module({ imports: [CalendarModule] })
export class AppModule {}`}
              language="typescript"
              filename="src/app.module.ts"
            />
          </div>
        )}

        {isNestJS && isMongoose && (
          <div className="space-y-4">
            <p className="text-white/80 text-sm">Ensure <code>MongooseModule.forRoot()</code> is in your AppModule. The generated <code>CalendarModule</code> uses <code>MongooseModule.forFeature()</code> for event and attendee schemas.</p>
            <CodeBlock
              code={`// src/app.module.ts (auto-modified)
import { MongooseModule } from '@nestjs/mongoose';
import { CalendarModule } from './modules/calendar/calendar.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    CalendarModule,
  ],
})
export class AppModule {}`}
              language="typescript"
              filename="src/app.module.ts"
            />
          </div>
        )}

        {isNestJS && (isCosmosSdk || isDynamoSdk) && (
          <div className="space-y-4">
            <p className="text-white/80 text-sm">
              {isCosmosSdk
                ? "Use getCalendarContainers() from the generated containers file to initialize Cosmos DB containers on startup. The service stub exposes the ICalendarService port—implement methods using the container clients."
                : "Use TABLE_DEFINITIONS from the generated tables file to provision DynamoDB tables. The service stub exposes the ICalendarService port—implement methods using the DynamoDB document client."}
            </p>
          </div>
        )}

        {isExpress && isTypeORM && (
          <div className="space-y-4">
            <p className="text-white/80 text-sm">Register entities and mount the router:</p>
            <CodeBlock
              code={`// src/data-source.ts
import { CalendarEvent } from './modules/calendar/entities/event.entity';
import { CalendarAttendee } from './modules/calendar/entities/attendee.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [CalendarEvent, CalendarAttendee],
  synchronize: process.env.NODE_ENV !== 'production',
});`}
              language="typescript"
              filename="src/data-source.ts"
            />
            <CodeBlock
              code={`// src/app.ts (auto-modified by fivfold-api)
import { createCalendarRouter } from './modules/calendar/calendar.routes';
import { CalendarService } from './modules/calendar/calendar.service';

const calendarService = new CalendarService(AppDataSource);
app.use('/api/calendar', createCalendarRouter(calendarService));`}
              language="typescript"
              filename="src/app.ts"
            />
            <CodeBlock
              code={`npx typeorm migration:generate -n AddCalendarModule
npx typeorm migration:run`}
              language="bash"
              showTerminalIcon
              label="Run migrations (production)"
            />
          </div>
        )}

        {isExpress && isPrisma && (
          <div className="space-y-4">
            <CodeBlock
              code={`import { CalendarService } from './modules/calendar/calendar.service';
import { createCalendarRouter } from './modules/calendar/calendar.routes';

const calendarService = new CalendarService(prisma);
app.use('/api/calendar', createCalendarRouter(calendarService));`}
              language="typescript"
              filename="src/app.ts"
            />
            <CodeBlock
              code={`npx prisma migrate dev --name AddCalendarModule`}
              language="bash"
              showTerminalIcon
            />
          </div>
        )}

        {isExpress && isMongoose && (
          <div className="space-y-4">
            <p className="text-white/80 text-sm">Pass your mongoose connection to the service constructor and mount the router:</p>
            <CodeBlock
              code={`import mongoose from 'mongoose';
import { CalendarService } from './modules/calendar/calendar.service';
import { createCalendarRouter } from './modules/calendar/calendar.routes';

const calendarService = new CalendarService(mongoose.connection);
app.use('/api/calendar', createCalendarRouter(calendarService));`}
              language="typescript"
              filename="src/app.ts"
            />
          </div>
        )}

        {isExpress && (isCosmosSdk || isDynamoSdk) && (
          <div className="space-y-4">
            <p className="text-white/80 text-sm">
              {isCosmosSdk
                ? "Initialize Cosmos DB containers using getCalendarContainers() and inject them into CalendarService. Mount the router."
                : "Initialize DynamoDB table definitions and inject the client into CalendarService. Mount the router."}
            </p>
          </div>
        )}

        <div className="mt-4">
          <p className="text-white/80 text-sm mb-2">Replace auth placeholders in the generated service/routes with your JWT or session middleware:</p>
          <CodeBlock
            code={`function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  const user = verifyJwt(token); // your JWT verification
  if (!user) { res.status(401).json({ error: 'Unauthorized' }); return; }
  req.user = { id: user.sub, email: user.email };
  next();
}`}
            language="typescript"
            filename="calendar.routes.ts"
          />
        </div>
      </div>

      <div>
        <KitDocStepHeading step={4}>API reference</KitDocStepHeading>
        {API_ENDPOINTS_TABLE}
      </div>

      <div className="space-y-6">
        <KitDocStepHeading step={5}>Integration with frontend</KitDocStepHeading>
        <KitIntegrationDisclaimer />
        <KitApiFeBePlaybook withDisclaimer={false} kitTitle="Calendar" apiControllerPath="calendar" />
        <KitUserModelIntegration
          kitTitle="Calendar"
          summary="Events reference an ownerId string — map this to your authenticated user's ID when creating events and filtering queries."
          bullets={[
            "Pass auth headers (Authorization: Bearer ...) on every mutating call so the backend can enforce ownership.",
            "Map attendee.userId to your user directory if the API returns ids only — the UI uses email and name for display.",
            "For shared calendars, extend the event entity with a calendarId and filter queries accordingly.",
          ]}
        />
        <div>
          <h5 className="text-sm font-semibold text-white/90 mb-2">Mapping API data to the Calendar UI</h5>
          <p className="text-white/80 text-sm mb-3">
            The Calendar Kit UI expects <code>FivFoldCalendarEvent[]</code>. Map your API response in your data-fetching layer:
          </p>
          <CodeBlock
            code={`// lib/calendar-api.ts
import type { FivFoldCalendarEvent } from "@/components/ui/kits/calendar";

async function fetchEvents(start: Date, end: Date): Promise<FivFoldCalendarEvent[]> {
  const params = new URLSearchParams({
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  });
  const res = await fetch(\`/api/calendar/events?\${params}\`, {
    headers: { Authorization: \`Bearer \${getToken()}\` },
  });
  return res.json();
}

// app/calendar/page.tsx
import { CalendarKit } from "@/components/ui/kits/calendar";

export function CalendarPage() {
  const [events, setEvents] = React.useState<FivFoldCalendarEvent[]>([]);

  // On view/date change, fetch the visible range
  const handleEventsChange = async (updated: FivFoldCalendarEvent[]) => {
    setEvents(updated);
    // Persist to API: POST/PATCH/DELETE accordingly
  };

  return (
    <CalendarKit
      events={events}
      onEventsChange={handleEventsChange}
      onCreateEvent={async (partial) => {
        const created = await fetch('/api/calendar/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: \`Bearer \${getToken()}\` },
          body: JSON.stringify(partial),
        }).then(r => r.json());
        setEvents(prev => [...prev, created]);
      }}
      onDeleteEvent={async (id) => {
        await fetch(\`/api/calendar/events/\${id}\`, { method: 'DELETE', headers: { Authorization: \`Bearer \${getToken()}\` } });
        setEvents(prev => prev.filter(e => e.id !== id));
      }}
    />
  );
}`}
            language="tsx"
            filename="app/calendar/page.tsx"
          />
        </div>
        <div>
          <h5 className="text-sm font-semibold text-white/90 mb-2">Environment variables</h5>
          <p className="text-white/55 text-xs mb-2">Examples only — tune for your environments.</p>
          <CodeBlock code={envVarsCode} language="bash" label=".env" />
        </div>
      </div>

      <div>
        <KitDocStepHeading step={6}>Additional notes</KitDocStepHeading>
        <p className="text-white/80 text-sm mb-2">
          Use database migrations in production (never <code>synchronize: true</code>). The <code>calendar_events</code> table has a composite index on <code>(owner_id, start_date, end_date)</code> — keep queries within bounded date windows for performance.
        </p>
        <p className="text-white/80 text-sm">
          Recurrence is stored as a plain string (<code>recurrenceRule</code>). Implement expansion logic (e.g. using the <code>rrule</code> package) in your service layer if you need recurring event instances generated dynamically.
        </p>
      </div>
    </div>
  )
}
