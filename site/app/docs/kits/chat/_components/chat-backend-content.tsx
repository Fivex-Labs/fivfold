"use client";

import { Image, FileUp, MapPin } from "lucide-react";
import { useStack } from "../../../components/stack-context";
import { CodeBlock } from "../../../components/code-block";
import { DocTabs } from "../../../components/doc-tabs";

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
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">GET</td><td className="py-2 pr-4 font-mono">/api/chat/conversations</td><td>List conversations for current user</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">POST</td><td className="py-2 pr-4 font-mono">/api/chat/conversations</td><td>Create a new 1-1 or group conversation</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">GET</td><td className="py-2 pr-4 font-mono">/api/chat/conversations/:id/messages</td><td>List messages (paginated)</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">POST</td><td className="py-2 pr-4 font-mono">/api/chat/conversations/:id/messages</td><td>Send a text message</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">POST</td><td className="py-2 pr-4 font-mono">/api/chat/conversations/:id/attachments</td><td>Upload and send attachment</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">POST</td><td className="py-2 pr-4 font-mono">/api/chat/conversations/:id/polls</td><td>Create a poll</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">POST</td><td className="py-2 pr-4 font-mono">/api/chat/polls/:id/vote</td><td>Vote on a poll</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">POST</td><td className="py-2 pr-4 font-mono">/api/chat/messages/:id/reactions</td><td>Add/toggle emoji reaction</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">PATCH</td><td className="py-2 pr-4 font-mono">/api/chat/messages/:id/read</td><td>Mark message as read</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">DELETE</td><td className="py-2 pr-4 font-mono">/api/chat/messages/:id</td><td>Delete own message</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">POST</td><td className="py-2 pr-4 font-mono">/api/chat/groups/:id/members</td><td>Add member to group</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">DELETE</td><td className="py-2 pr-4 font-mono">/api/chat/groups/:id/members/:userId</td><td>Remove member from group</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">GET</td><td className="py-2 pr-4 font-mono">/api/chat/search</td><td>Search conversations and messages</td></tr>
      </tbody>
    </table>
  </div>
);

export function ChatBackendContent() {
  const { stack } = useStack();

  const isNestJS = stack.framework === "nestjs";
  const isTypeORM = stack.orm === "typeorm";
  const isPrisma = stack.orm === "prisma";
  const isMongoose = stack.orm === "mongoose";
  const isCosmosSdk = stack.orm === "cosmos-sdk";
  const isDynamoSdk = stack.orm === "dynamodb-sdk";

  const ormInfraDir = isTypeORM
    ? "entities/\n      conversation.entity.ts\n      message.entity.ts\n      participant.entity.ts\n      attachment.entity.ts\n      poll.entity.ts\n      poll-vote.entity.ts\n      reaction.entity.ts"
    : isPrisma
    ? "prisma/\n      chat-models.prisma       # Append to schema.prisma"
    : isMongoose
    ? "schemas/\n      conversation.schema.ts\n      message.schema.ts\n      participant.schema.ts\n      attachment.schema.ts\n      poll.schema.ts\n      reaction.schema.ts"
    : isCosmosSdk
    ? "cosmos/\n      chat-containers.ts      # Cosmos container definitions"
    : isDynamoSdk
    ? "dynamodb/\n      chat-tables.ts          # DynamoDB table/GSI definitions"
    : "";

  const fileTree = isNestJS
    ? `chat/
  domain/
    ports/
      chat.port.ts           # IChatService interface (framework-agnostic)
    dto/
      create-message.dto.ts
      create-group.dto.ts
      send-attachment.dto.ts
      create-poll.dto.ts
      vote-poll.dto.ts
      add-reaction.dto.ts
      search-chat.dto.ts
      pagination.dto.ts
  infrastructure/
    ${ormInfraDir}
  delivery/
    nestjs/
      chat.module.ts
      chat.controller.ts
      chat.service.ts
      chat.gateway.ts          # WebSocket gateway (Socket.IO)
  realtime/
    socketio/
      socketio-realtime.adapter.ts`
    : `chat/
  domain/
    ports/
      chat.port.ts             # IChatService interface
    dto/
      create-message.dto.ts
      create-group.dto.ts
      send-attachment.dto.ts
      create-poll.dto.ts
      vote-poll.dto.ts
      add-reaction.dto.ts
      pagination.dto.ts
  infrastructure/
    ${ormInfraDir}
  delivery/
    express/
      chat.routes.ts           # Express router
      chat.service.ts          # Service implementation
      chat.socket-handler.ts   # Socket.IO namespace
  realtime/
    socketio/
      socketio-realtime.adapter.ts`;

  const installCmd = isNestJS
    ? `npx @fivfold/api add chat --framework=nestjs --orm=${stack.orm}`
    : `npx @fivfold/api add chat --framework=express --orm=${stack.orm}`;

  const realtimeSetup = isNestJS
    ? `// main.ts – enable Socket.IO with NestJS
import { IoAdapter } from '@nestjs/platform-socket.io';
app.useWebSocketAdapter(new IoAdapter(app));`
    : `// server.ts – attach Socket.IO to Express
import { createServer } from 'http';
import { Server } from 'socket.io';
import { registerChatSocketHandlers } from './modules/chat/delivery/express/chat.socket-handler';

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
registerChatSocketHandlers(io);
httpServer.listen(3000);`;

  const stepOffset = isTypeORM || isPrisma || isMongoose ? 1 : 0;

  return (
    <div className="space-y-8">
      {/* Step 1 – Install */}
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">1</span>
          Install the Chat API module
        </h4>
        <CodeBlock code={installCmd} language="bash" showTerminalIcon />
      </div>

      {/* Step 2 – File tree */}
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">2</span>
          Generated file structure
        </h4>
        <CodeBlock code={fileTree} language="text" label="File tree" />
      </div>

      {/* Step 3 – Data layer setup (only for relational / Mongoose) */}
      {(isTypeORM || isPrisma || isMongoose) && (
        <div>
          <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
            <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">3</span>
            {isTypeORM
              ? "Register entities in TypeORM DataSource"
              : isPrisma
              ? "Append Prisma models"
              : "Register Mongoose schemas"}
          </h4>
          {isTypeORM && (
            <CodeBlock
              code={`import { ConversationEntity } from './modules/chat/infrastructure/entities/conversation.entity';
import { MessageEntity } from './modules/chat/infrastructure/entities/message.entity';
import { ParticipantEntity } from './modules/chat/infrastructure/entities/participant.entity';
import { AttachmentEntity } from './modules/chat/infrastructure/entities/attachment.entity';
import { PollEntity } from './modules/chat/infrastructure/entities/poll.entity';
import { PollVoteEntity } from './modules/chat/infrastructure/entities/poll-vote.entity';
import { ReactionEntity } from './modules/chat/infrastructure/entities/reaction.entity';

// Add to entities array in your DataSource / TypeORM config:
entities: [
  ConversationEntity, MessageEntity, ParticipantEntity,
  AttachmentEntity, PollEntity, PollVoteEntity, ReactionEntity,
  // ...other entities
]`}
              language="ts"
              filename={isNestJS ? "src/app.module.ts" : "src/data-source.ts"}
            />
          )}
          {isPrisma && (
            <CodeBlock
              code={`# Append the generated models to schema.prisma, then run:
npx prisma migrate dev --name add-chat`}
              language="bash"
              showTerminalIcon
            />
          )}
          {isMongoose && (
            <CodeBlock
              code={
                isNestJS
                  ? `// chat.module.ts (auto-generated) already imports MongooseModule.forFeature([...])
// Ensure MongooseModule.forRoot(uri) is in your AppModule.`
                  : `import mongoose from 'mongoose';
import { ConversationSchema } from './modules/chat/infrastructure/schemas/conversation.schema';
mongoose.model('Conversation', ConversationSchema);
// Repeat for Message, Participant, Attachment, Poll, Reaction`
              }
              language="ts"
              filename={isNestJS ? "src/app.module.ts" : "src/app.ts"}
            />
          )}
        </div>
      )}

      {/* Step (3 or 4) – Socket.IO realtime setup — always Socket.IO */}
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">
            {3 + stepOffset}
          </span>
          Configure real-time transport
          <span className="ml-1 text-[11px] font-normal opacity-60">(Socket.IO)</span>
        </h4>
        <CodeBlock
          code={realtimeSetup}
          language="ts"
          filename={isNestJS ? "src/main.ts" : "src/server.ts"}
        />
      </div>

      {/* Data entities — tab bar per entity */}
      <div>
        <h4 className="font-semibold text-white mb-3">Data entities</h4>
        <p className="text-white/60 text-sm mb-4">
          The Chat Kit creates seven core entities (or equivalent schemas/tables) that model conversations, messages, participants, attachments, polls, votes, and reactions. Each entity is designed for a specific responsibility with clear relationships.
        </p>
        <DocTabs
          tabs={[
            {
              id: "conversation",
              label: "Conversation",
              content: (
                <div className="space-y-4">
                  <p className="text-white/70 text-sm">
                    Represents a chat thread — either a direct (1-1) or group conversation. The <code className="rounded bg-white/10 px-1 py-0.5">type</code> field drives UI and permission logic; groups support names, avatars, and descriptions.
                  </p>
                  <div className="overflow-x-auto rounded-lg border border-white/10">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-3 font-medium text-white/80">Field</th>
                          <th className="text-left py-2 px-3 font-medium text-white/80">Type</th>
                          <th className="text-left py-2 px-3 font-medium text-white/80">Reasoning</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/70">
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">id</td><td className="py-2 px-3">UUID</td><td>Globally unique identifier for the conversation.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">type</td><td className="py-2 px-3">direct \| group</td><td>Determines if it&apos;s a DM or group; groups need name/avatar.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">name</td><td className="py-2 px-3">string?</td><td>Group display name; null for DMs (derived from other participant).</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">avatarUrl</td><td className="py-2 px-3">string?</td><td>Group avatar; DMs typically use the other user&apos;s avatar.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">description</td><td className="py-2 px-3">string?</td><td>Optional group description or topic.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">pinnedByUserIds</td><td className="py-2 px-3">string[]</td><td>User IDs who pinned this conversation; used for sort order.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">mutedByUsers</td><td className="py-2 px-3">Record&lt;userId, mutedUntil&gt;</td><td>Per-user mute state; value is ISO date when mute expires.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">createdAt, updatedAt</td><td className="py-2 px-3">timestamp</td><td>Audit and ordering.</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-white/50 text-xs">Relations: has many Messages, Participants.</p>
                </div>
              ),
            },
            {
              id: "message",
              label: "Message",
              
              content: (
                <div className="space-y-4">
                  <p className="text-white/70 text-sm">
                    A single message in a conversation. The <code className="rounded bg-white/10 px-1 py-0.5">type</code> discriminator determines how <code className="rounded bg-white/10 px-1 py-0.5">content</code> and <code className="rounded bg-white/10 px-1 py-0.5">metadata</code> are interpreted — e.g. <code className="rounded bg-white/10 px-1 py-0.5">gif</code> stores Tenor ID and URLs in metadata.
                  </p>
                  <div className="overflow-x-auto rounded-lg border border-white/10">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-3 font-medium text-white/80">Field</th>
                          <th className="text-left py-2 px-3 font-medium text-white/80">Type</th>
                          <th className="text-left py-2 px-3 font-medium text-white/80">Reasoning</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/70">
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">id</td><td className="py-2 px-3">UUID</td><td>Unique message ID for reactions, replies, and deletion.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">conversationId</td><td className="py-2 px-3">UUID</td><td>Links to the parent conversation.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">senderId</td><td className="py-2 px-3">UUID</td><td>User who sent the message; used for alignment and avatars.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">content</td><td className="py-2 px-3">text?</td><td>Plain text body; null for non-text types (poll, gif, location).</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">type</td><td className="py-2 px-3">text \| image \| video \| file \| poll \| location \| gif</td><td>Discriminator for rendering and metadata shape.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">metadata</td><td className="py-2 px-3">JSON?</td><td>Type-specific data: poll options, location coords, Tenor GIF URLs, etc.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">readByUserIds</td><td className="py-2 px-3">string[]</td><td>Users who have read this message; drives read receipts.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">replyToMessageId</td><td className="py-2 px-3">string?</td><td>Optional reply threading.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">status</td><td className="py-2 px-3">sending \| sent \| delivered \| read \| failed</td><td>Delivery state for optimistic UI and retries.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">createdAt, updatedAt, deletedAt</td><td className="py-2 px-3">timestamp</td><td>Audit, ordering, soft delete.</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-white/50 text-xs">Relations: belongs to Conversation; has many Attachments (for image/video/file); has one Poll (when type=poll); has many Reactions.</p>
                </div>
              ),
            },
            {
              id: "participant",
              label: "Participant",
              
              content: (
                <div className="space-y-4">
                  <p className="text-white/70 text-sm">
                    Junction table linking users to conversations. Tracks membership, role (admin vs member), and read position for unread counts and badges.
                  </p>
                  <div className="overflow-x-auto rounded-lg border border-white/10">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-3 font-medium text-white/80">Field</th>
                          <th className="text-left py-2 px-3 font-medium text-white/80">Type</th>
                          <th className="text-left py-2 px-3 font-medium text-white/80">Reasoning</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/70">
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">id</td><td className="py-2 px-3">UUID</td><td>Unique participant record ID.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">conversationId</td><td className="py-2 px-3">UUID</td><td>Which conversation this membership belongs to.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">userId</td><td className="py-2 px-3">UUID</td><td>User who is a member; unique per conversation.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">role</td><td className="py-2 px-3">admin \| member</td><td>Group admins can add/remove members and edit group.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">lastReadAt</td><td className="py-2 px-3">timestamp?</td><td>Last message read; used for unread count and &quot;read up to&quot;.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">joinedAt</td><td className="py-2 px-3">timestamp</td><td>When the user joined; audit and ordering.</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-white/50 text-xs">Unique constraint on (conversationId, userId). Index on userId for &quot;my conversations&quot; queries.</p>
                </div>
              ),
            },
            {
              id: "attachment",
              label: "Attachment",
              
              content: (
                <div className="space-y-4">
                  <p className="text-white/70 text-sm">
                    Stores file metadata for messages with type <code className="rounded bg-white/10 px-1 py-0.5">image</code>, <code className="rounded bg-white/10 px-1 py-0.5">video</code>, <code className="rounded bg-white/10 px-1 py-0.5">file</code>, or <code className="rounded bg-white/10 px-1 py-0.5">audio</code>. The actual file lives in object storage (S3, GCS, etc.); this entity holds the URL and metadata.
                  </p>
                  <div className="overflow-x-auto rounded-lg border border-white/10">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-3 font-medium text-white/80">Field</th>
                          <th className="text-left py-2 px-3 font-medium text-white/80">Type</th>
                          <th className="text-left py-2 px-3 font-medium text-white/80">Reasoning</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/70">
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">id</td><td className="py-2 px-3">UUID</td><td>Unique attachment ID.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">messageId</td><td className="py-2 px-3">UUID</td><td>Parent message; one message can have multiple attachments.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">type</td><td className="py-2 px-3">image \| video \| file \| audio</td><td>Determines rendering (preview vs download) and icon.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">url</td><td className="py-2 px-3">string</td><td>Signed or public URL to the file in object storage.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">name</td><td className="py-2 px-3">string</td><td>Original filename for display and download.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">size</td><td className="py-2 px-3">bigint</td><td>File size in bytes; for progress and limits.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">mimeType</td><td className="py-2 px-3">string</td><td>Content type for correct rendering and security.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">thumbnailUrl</td><td className="py-2 px-3">string?</td><td>Preview image for videos; optional for images.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">durationSeconds</td><td className="py-2 px-3">int?</td><td>Video/audio duration for display.</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-white/50 text-xs">Belongs to Message. Upload flow: client uploads to storage → backend creates Message + Attachment with URL.</p>
                </div>
              ),
            },
            {
              id: "poll",
              label: "Poll",
              
              content: (
                <div className="space-y-4">
                  <p className="text-white/70 text-sm">
                    Inline poll attached to a message. When a user creates a poll, a message with <code className="rounded bg-white/10 px-1 py-0.5">type=poll</code> is created and linked to this entity. Votes are stored in PollVote.
                  </p>
                  <div className="overflow-x-auto rounded-lg border border-white/10">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-3 font-medium text-white/80">Field</th>
                          <th className="text-left py-2 px-3 font-medium text-white/80">Type</th>
                          <th className="text-left py-2 px-3 font-medium text-white/80">Reasoning</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/70">
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">id</td><td className="py-2 px-3">UUID</td><td>Unique poll ID for voting endpoint.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">messageId</td><td className="py-2 px-3">UUID</td><td>One-to-one with the poll message.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">question</td><td className="py-2 px-3">text</td><td>Poll question text.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">options</td><td className="py-2 px-3">string[]</td><td>Array of option labels; index used for votes.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">allowMultipleAnswers</td><td className="py-2 px-3">boolean</td><td>Whether users can select multiple options.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">expiresAt</td><td className="py-2 px-3">timestamp?</td><td>Optional deadline; voting disabled after.</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-white/50 text-xs">Belongs to Message. Has many PollVotes. Vote endpoint: POST /api/chat/polls/:id/vote with optionIndex.</p>
                </div>
              ),
            },
            {
              id: "poll-vote",
              label: "PollVote",
              
              content: (
                <div className="space-y-4">
                  <p className="text-white/70 text-sm">
                    Records a user&apos;s vote on a poll option. Unique constraint on (pollId, userId, optionIndex) prevents duplicate votes per option; for multi-select polls, a user can have multiple rows (one per option).
                  </p>
                  <div className="overflow-x-auto rounded-lg border border-white/10">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-3 font-medium text-white/80">Field</th>
                          <th className="text-left py-2 px-3 font-medium text-white/80">Type</th>
                          <th className="text-left py-2 px-3 font-medium text-white/80">Reasoning</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/70">
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">id</td><td className="py-2 px-3">UUID</td><td>Unique vote record.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">pollId</td><td className="py-2 px-3">UUID</td><td>Which poll this vote belongs to.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">userId</td><td className="py-2 px-3">UUID</td><td>Who voted.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">optionIndex</td><td className="py-2 px-3">int</td><td>Index into poll.options; 0-based.</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-white/50 text-xs">Unique (pollId, userId, optionIndex). Aggregating votes by optionIndex gives percentages for the UI.</p>
                </div>
              ),
            },
            {
              id: "reaction",
              label: "Reaction",
              
              content: (
                <div className="space-y-4">
                  <p className="text-white/70 text-sm">
                    Emoji reaction on a message. Toggle semantics: adding the same emoji again removes it. Unique (messageId, userId, emoji) ensures one reaction per user per emoji.
                  </p>
                  <div className="overflow-x-auto rounded-lg border border-white/10">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-3 font-medium text-white/80">Field</th>
                          <th className="text-left py-2 px-3 font-medium text-white/80">Type</th>
                          <th className="text-left py-2 px-3 font-medium text-white/80">Reasoning</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/70">
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">id</td><td className="py-2 px-3">UUID</td><td>Unique reaction record.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">messageId</td><td className="py-2 px-3">UUID</td><td>Which message was reacted to.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">userId</td><td className="py-2 px-3">UUID</td><td>Who reacted.</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-3 font-mono text-brand-secondary">emoji</td><td className="py-2 px-3">string (max 32)</td><td>Unicode emoji or shortcode; e.g. 👍, :thumbsup:.</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-white/50 text-xs">Unique (messageId, userId, emoji). UI aggregates by emoji and shows count; clicking toggles add/remove.</p>
                </div>
              ),
            },
          ]}
          defaultTab="conversation"
        />
      </div>

      {/* API endpoints reference */}
      <div>
        <h4 className="font-semibold text-white mb-3">REST API reference</h4>
        {API_ENDPOINTS_TABLE}
      </div>

      {/* API support for rich messages (GIF, attachments, location) */}
      <div>
        <h4 className="font-semibold text-white mb-3">API support for rich messages</h4>
        <p className="text-white/60 text-sm mb-4">
          The backend accepts GIF, attachment, and location messages. Integration setup (Tenor, file storage, geolocation) is documented in the <strong className="text-white/80">UI tab</strong>. Below is the API contract for each type.
        </p>

        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <h5 className="font-semibold text-white mb-2 flex items-center gap-2">
              <Image className="h-4 w-4 text-brand-secondary" />
              GIF messages
            </h5>
            <p className="text-white/70 text-sm mb-2">
              <code className="rounded bg-white/10 px-1 py-0.5">POST /api/chat/conversations/:id/messages</code> accepts <code className="rounded bg-white/10 px-1 py-0.5">type: &quot;gif&quot;</code> with <code className="rounded bg-white/10 px-1 py-0.5">metadata</code> containing <code className="rounded bg-white/10 px-1 py-0.5">tenorId</code>, <code className="rounded bg-white/10 px-1 py-0.5">url</code>, <code className="rounded bg-white/10 px-1 py-0.5">previewUrl</code>, <code className="rounded bg-white/10 px-1 py-0.5">description</code>. No file upload; the UI fetches GIFs from Tenor and sends metadata.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <h5 className="font-semibold text-white mb-2 flex items-center gap-2">
              <FileUp className="h-4 w-4 text-brand-secondary" />
              Attachments
            </h5>
            <p className="text-white/70 text-sm mb-2">
              <code className="rounded bg-white/10 px-1 py-0.5">POST /api/chat/conversations/:id/attachments</code> expects <code className="rounded bg-white/10 px-1 py-0.5">url</code>, <code className="rounded bg-white/10 px-1 py-0.5">name</code>, <code className="rounded bg-white/10 px-1 py-0.5">size</code>, <code className="rounded bg-white/10 px-1 py-0.5">mimeType</code>, and optionally <code className="rounded bg-white/10 px-1 py-0.5">thumbnailUrl</code>, <code className="rounded bg-white/10 px-1 py-0.5">durationSeconds</code>. The UI uploads files to object storage first, then sends the URL to this endpoint.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <h5 className="font-semibold text-white mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-secondary" />
              Location messages
            </h5>
            <p className="text-white/70 text-sm mb-2">
              <code className="rounded bg-white/10 px-1 py-0.5">POST /api/chat/conversations/:id/messages</code> or <code className="rounded bg-white/10 px-1 py-0.5">shareLocation</code> accepts <code className="rounded bg-white/10 px-1 py-0.5">type: &quot;location&quot;</code> with <code className="rounded bg-white/10 px-1 py-0.5">metadata: &#123; latitude, longitude, label? &#125;</code>. The UI obtains coordinates via <code className="rounded bg-white/10 px-1 py-0.5">navigator.geolocation</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Environment variables */}
      <div>
        <h4 className="font-semibold text-white mb-3">Environment variables</h4>
        <CodeBlock
          code={[
            isTypeORM || isPrisma
              ? `DATABASE_URL="postgresql://user:pass@localhost:5432/mydb"`
              : null,
            isMongoose
              ? `MONGODB_URI="mongodb://localhost:27017/mydb"`
              : null,
            isCosmosSdk
              ? `COSMOS_ENDPOINT="https://your-account.documents.azure.com:443/"\nCOSMOS_KEY="your-key"\nCOSMOS_DATABASE="chatdb"`
              : null,
            isDynamoSdk
              ? `AWS_REGION="us-east-1"\nAWS_ACCESS_KEY_ID="..."\nAWS_SECRET_ACCESS_KEY="..."`
              : null,
            `CORS_ORIGIN="http://localhost:3000"`,
          ]
            .filter(Boolean)
            .join("\n")}
          language="bash"
          filename=".env"
        />
      </div>
    </div>
  );
}
