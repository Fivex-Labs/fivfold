"use client";

import type { Framework, Orm } from "../../../components/stack-context";
import { CodeBlock } from "../../../components/code-block";

const ORM_LABELS: Record<Orm, string> = {
  typeorm: "TypeORM",
  prisma: "Prisma",
  mongoose: "Mongoose",
  "cosmos-sdk": "Azure Cosmos DB",
  "dynamodb-sdk": "DynamoDB",
};

const AUTH_NEST = `// chat.controller.ts — protect routes and ensure req.user.id is set
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // your guard

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController { /* ... */ }

// jwt.strategy.ts (example) — subject must match what you store in chat tables
async validate(payload: { sub: string }) {
  const user = await this.usersService.findById(payload.sub);
  return { id: user.id }; // string that matches Participant.userId / Message.senderId
}`;

const AUTH_EXPRESS = `// Mount JWT/session middleware before chat routes so req.user is set
app.use('/api/chat', authenticateJwt, createChatRouter(chatService));

// req.user.id must be the same identifier you use in participantIds / senderId`;

interface ChatUserIntegrationSectionProps {
  framework: Framework;
  orm: Orm;
}

function OrmSpecificContent({ orm }: Pick<ChatUserIntegrationSectionProps, "orm">) {
  switch (orm) {
    case "typeorm":
      return (
        <div className="space-y-4">
          <p className="text-white/70 text-sm">
            Generated columns use <code className="rounded bg-white/10 px-1 py-0.5">uuid</code> for{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">ParticipantEntity.userId</code> and{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">MessageEntity.senderId</code>. If your{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">User</code> entity already uses{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">@PrimaryGeneratedColumn(&apos;uuid&apos;)</code>, you are
            aligned — use that UUID string everywhere.
          </p>
          <p className="text-white/70 text-sm">
            If your user id is numeric, change those columns to{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">int</code> (or{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">bigint</code>) and run a migration. Keep types consistent
            across chat and users.
          </p>
          <p className="text-white/60 text-sm">
            Optional: add a <code className="rounded bg-white/10 px-1 py-0.5">@ManyToOne(() =&gt; User)</code> +{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">@JoinColumn(&#123; name: &apos;userId&apos; &#125;)</code>{" "}
            on participant (and similarly for messages) if you want foreign-key integrity — the kit ships without
            relations so it stays decoupled from your auth module.
          </p>
        </div>
      );
    case "prisma":
      return (
        <div className="space-y-4">
          <p className="text-white/70 text-sm">
            Chat models use <code className="rounded bg-white/10 px-1 py-0.5">String</code> for{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">userId</code> /{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">senderId</code> (template defaults to{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">@default(cuid())</code> on chat rows only). Your{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">User.id</code> must be the same type and format you pass
            from the API — e.g. both <code className="rounded bg-white/10 px-1 py-0.5">uuid()</code> or both{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">cuid()</code>.
          </p>
          <CodeBlock
            code={`// Optional: add relations for referential integrity (after merging Chat models into schema.prisma)

model User {
  id               String            @id @default(uuid())
  // ...your fields
  chatParticipants ChatParticipant[] @relation("UserChatParticipants")
  chatMessages     ChatMessage[]     @relation("UserChatMessages")
}

// Then extend generated chat models:
model ChatParticipant {
  // ...existing fields from kit
  userId String
  user   User   @relation("UserChatParticipants", fields: [userId], references: [id])
}

model ChatMessage {
  // ...existing fields from kit
  senderId String
  sender   User   @relation("UserChatMessages", fields: [senderId], references: [id])
}`}
            language="text"
            filename="schema.prisma"
          />
          <p className="text-white/50 text-xs">
            Run <code className="rounded bg-white/10 px-1">npx prisma migrate dev</code> after edits. If you skip
            relations, Prisma still works — IDs are just strings.
          </p>
        </div>
      );
    case "mongoose":
      return (
        <div className="space-y-4">
          <p className="text-white/70 text-sm">
            Schemas store <code className="rounded bg-white/10 px-1 py-0.5">userId</code> as{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">String</code>. With MongoDB, call{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">user._id.toString()</code> when creating participants or
            messages so values match JWT/session <code className="rounded bg-white/10 px-1 py-0.5">sub</code> if you use
            string subjects.
          </p>
          <CodeBlock
            code={`// Optional: use ObjectId + ref instead of plain strings
userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }

// When saving, pass real ObjectIds; JSON APIs still send strings — convert in your DTO layer.`}
            language="typescript"
            filename="participant.schema.ts"
          />
        </div>
      );
    case "cosmos-sdk":
      return (
        <div className="space-y-4">
          <p className="text-white/70 text-sm">
            Items use string fields <code className="rounded bg-white/10 px-1 py-0.5">userId</code> /{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">senderId</code> (see{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">ChatParticipantItem</code>,{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">ChatMessageItem</code>). Use the same string as your user
            profile document id (or stable external id) in Cosmos.
          </p>
          <p className="text-white/60 text-sm">
            There is no automatic join to a &quot;users&quot; container — resolve display names in your service by
            querying your users container keyed by <code className="rounded bg-white/10 px-1 py-0.5">userId</code>.
          </p>
        </div>
      );
    case "dynamodb-sdk":
      return (
        <div className="space-y-4">
          <p className="text-white/70 text-sm">
            Attribute names are strings (<code className="rounded bg-white/10 px-1 py-0.5">senderId</code>,{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">userId</code> on participant items). GSI keys such as{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">USER#&lt;userId&gt;</code> assume a single canonical string
            id per user — match whatever your Cognito <code className="rounded bg-white/10 px-1 py-0.5">sub</code>,
            custom auth, or users table uses.
          </p>
          <p className="text-white/60 text-sm">
            User search and group creation still flow through your HTTP API: load member ids from your user store, then
            call the chat service with those ids.
          </p>
        </div>
      );
    default:
      return null;
  }
}

export function ChatUserIntegrationSection({ framework, orm }: ChatUserIntegrationSectionProps) {
  const isNest = framework === "nestjs";
  const ormLabel = ORM_LABELS[orm];

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-white mb-2">Connect chat to your existing users</h4>
        <p className="text-white/60 text-sm mb-1">
          The kit stores <strong className="text-white/80">references</strong> to users, not copies. Wire authentication
          so <code className="rounded bg-white/10 px-1 py-0.5">req.user.id</code> matches your database. The following
          matches the <strong className="text-white/80">ORM and framework</strong> you selected in the stack bar above —
          change that selection to see different storage notes.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-white/70 text-sm">
          The Chat Kit does <strong className="text-white/85">not</strong> generate a{" "}
          <code className="rounded bg-white/10 px-1 py-0.5">User</code> entity. Everywhere you see{" "}
          <code className="rounded bg-white/10 px-1 py-0.5">userId</code> or{" "}
          <code className="rounded bg-white/10 px-1 py-0.5">senderId</code>, the value must be the{" "}
          <strong className="text-white/85">same string (or coerced string)</strong> as your existing user&apos;s
          primary key — usually a UUID, CUID, or MongoDB <code className="rounded bg-white/10 px-1 py-0.5">ObjectId</code>{" "}
          as <code className="rounded bg-white/10 px-1 py-0.5">.toString()</code>.
        </p>
        <ul className="list-disc pl-5 text-white/70 text-sm space-y-2">
          <li>
            <strong className="text-white/85">1:1 chat:</strong>{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">POST /api/chat/conversations</code> with{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">participantIds: [&quot;&lt;otherUserId&gt;&quot;]</code>.
            The current user is merged server-side with{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">req.user.id</code>.
          </li>
          <li>
            <strong className="text-white/85">Groups:</strong>{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">POST /api/chat/groups</code> uses{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">memberIds</code> — same rule: IDs must match your users
            table or collection.
          </li>
          <li>
            <strong className="text-white/85">Search:</strong>{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">GET /api/chat/search</code> searches{" "}
            <em>conversations and messages</em>, not your user directory. For pick-a-user flows, add your own endpoint
            (e.g. <code className="rounded bg-white/10 px-1 py-0.5">GET /users?q=</code>) and pass selected IDs into{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">participantIds</code> /{" "}
            <code className="rounded bg-white/10 px-1 py-0.5">memberIds</code>.
          </li>
        </ul>
      </div>

      <div>
        <h5 className="text-sm font-semibold text-white/90 mb-3">
          Storage layer ({ormLabel})
        </h5>
        <OrmSpecificContent orm={orm} />
      </div>

      <div>
        <h5 className="text-sm font-semibold text-white/90 mb-3">
          Auth wiring ({isNest ? "NestJS" : "Express"})
        </h5>
        <CodeBlock
          code={isNest ? AUTH_NEST : AUTH_EXPRESS}
          language="ts"
          filename={isNest ? "src/chat.controller.ts" : "src/server.ts"}
        />
      </div>
    </div>
  );
}
