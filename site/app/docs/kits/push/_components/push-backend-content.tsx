"use client";

import { useStack } from "../../../components/stack-context";
import { CodeBlock } from "../../../components/code-block";

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
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">POST</td><td className="py-2 pr-4 font-mono">/api/push/subscribe</td><td>Register device token for a user</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">DELETE</td><td className="py-2 pr-4 font-mono">/api/push/subscribe/:token</td><td>Unregister device token</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">GET</td><td className="py-2 pr-4 font-mono">/api/push/subscriptions</td><td>List user&apos;s registered devices</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">POST</td><td className="py-2 pr-4 font-mono">/api/push/send/device</td><td>Send notification to a specific device token</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">POST</td><td className="py-2 pr-4 font-mono">/api/push/send/user</td><td>Send notification to all devices of a user</td></tr>
        <tr className="border-b border-white/5"><td className="py-2 pr-4 font-mono">POST</td><td className="py-2 pr-4 font-mono">/api/push/send/topic</td><td>Send notification to a topic (FCM, Pushy, Pusher Beams)</td></tr>
      </tbody>
    </table>
  </div>
);

const PROVIDER_ENV_VARS: Record<string, string> = {
  fcm: `FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"`,
  onesignal: `ONESIGNAL_APP_ID=your-app-id
ONESIGNAL_REST_API_KEY=your-rest-api-key`,
  sns: `AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key`,
  pushy: `PUSHY_API_KEY=your-secret-api-key`,
  "pusher-beams": `PUSHER_BEAMS_INSTANCE_ID=your-instance-id
PUSHER_BEAMS_SECRET_KEY=your-secret-key`,
};

export function PushBackendContent() {
  const { stack } = useStack();

  const isExpress = stack.framework === "express";
  const isNestJS = stack.framework === "nestjs";
  const isTypeORM = stack.orm === "typeorm";
  const isPrisma = stack.orm === "prisma";
  const isMongoose = stack.orm === "mongoose";
  const isCosmosSdk = stack.orm === "cosmos-sdk";
  const isDynamoSdk = stack.orm === "dynamodb-sdk";
  const provider = stack.pushProvider ?? "fcm";

  const expressTypeORM = (
    <>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">2</span>
          Generated file tree
        </h4>
        <CodeBlock
          code={`push/
  domain/
    push.port.ts           # IPushNotificationService interface
  dto/
    send-notification.dto.ts
    register-device.dto.ts
    send-to-topic.dto.ts
  entities/
    push-subscription.entity.ts   # Device tokens per user
    notification-log.entity.ts    # Audit log for sent notifications
  adapters/
    ${provider}-push.adapter.ts   # Provider-specific implementation
  push.service.ts          # Business logic
  push.routes.ts           # Express router`}
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
import { PushSubscription } from './modules/push/entities/push-subscription.entity';
import { PushNotificationLog } from './modules/push/entities/notification-log.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    // ... your existing entities
    PushSubscription,
    PushNotificationLog,
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
import { createPushService } from './modules/push/push.service';
import { createPushRouter } from './modules/push/push.routes';

const app = express();
app.use(express.json());
const pushService = createPushService(AppDataSource);
app.use('/api/push', createPushRouter(pushService));`}
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
          In <code>push.routes.ts</code>, update the authMiddleware and getUser functions to use your JWT verification.
        </p>
        <CodeBlock
          code={`function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  const user = verifyJwt(token); // your JWT verification
  if (!user) { res.status(401).json({ error: 'Unauthorized' }); return; }
  req.user = { id: user.sub };
  next();
}`}
          language="typescript"
          filename="push.routes.ts"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">6</span>
          Run migrations (production)
        </h4>
        <CodeBlock
          code={`npx typeorm migration:generate -n AddPushModule
npx typeorm migration:run`}
          language="bash"
          showTerminalIcon
        />
      </div>
    </>
  );

  const nestjsTypeORM = (
    <>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">2</span>
          Generated file tree
        </h4>
        <CodeBlock
          code={`push/
  domain/
    push.port.ts           # IPushNotificationService interface
  dto/
    send-notification.dto.ts
    register-device.dto.ts
    send-to-topic.dto.ts
  entities/
    push-subscription.entity.ts
    notification-log.entity.ts
  adapters/
    ${provider}-push.adapter.ts   # Provider-specific implementation
  push.controller.ts       # NestJS controller with all push endpoints
  push.service.ts          # Business logic
  push.module.ts           # NestJS module (registers entities, controller, service, adapter)`}
          language="text"
          label="File tree"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">3</span>
          Import PushModule into AppModule
        </h4>
        <CodeBlock
          code={`// src/app.module.ts
import { PushModule } from './modules/push/push.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    PushModule,
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
          Add auth guard to the controller
        </h4>
        <p className="text-white/80 text-sm mb-2">
          In <code>push.controller.ts</code>, add your JWT guard and replace the getUser helper.
        </p>
        <CodeBlock
          code={`import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('push')
export class PushController { ... }`}
          language="typescript"
          filename="push.controller.ts"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">5</span>
          Run TypeORM migrations (production)
        </h4>
        <CodeBlock
          code={`npx typeorm migration:generate src/migrations/AddPushModule -d src/data-source.ts
npx typeorm migration:run -d src/data-source.ts`}
          language="bash"
          showTerminalIcon
        />
      </div>
    </>
  );

  const expressMongoose = (
    <>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">2</span>
          Generated file tree
        </h4>
        <CodeBlock
          code={`push/
  schemas/
    push-subscription.schema.ts
    notification-log.schema.ts
  domain/
  dto/
  adapters/
    ${provider}-push.adapter.ts
  push.service.ts
  push.routes.ts`}
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
import { createPushService } from './modules/push/push.service';
import { createPushRouter } from './modules/push/push.routes';
// Register models for PushSubscription, PushNotificationLog

const pushService = createPushService(mongoose.connection);
app.use('/api/push', createPushRouter(pushService));`}
          language="typescript"
          filename="src/app.ts"
        />
      </div>
    </>
  );

  const expressCosmosDynamo = (
    <>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">2</span>
          Generated file tree
        </h4>
        <CodeBlock
          code={`push/
  ${isCosmosSdk ? "containers/\n    push.containers.ts" : "tables/\n    push.tables.ts"}
  domain/
  dto/
  adapters/
    ${provider}-push.adapter.ts
  push.service.ts
  push.routes.ts`}
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
            ? "Create Cosmos DB database and containers per the generated push.containers.ts. Pass the connection to createPushService, then pass the service to createPushRouter."
            : "Create DynamoDB tables per the generated push.tables.ts. Pass the client to createPushService, then pass the service to createPushRouter."}
        </p>
      </div>
    </>
  );

  const expressPrisma = (
    <>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">2</span>
          Generated file tree
        </h4>
        <CodeBlock
          code={`push/
  prisma/schema.prisma     # PushSubscription, PushNotificationLog models (appended)
  domain/
  dto/
  adapters/
    ${provider}-push.adapter.ts
  push.service.ts
  push.routes.ts`}
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
          code={`import { createPushService } from './modules/push/push.service';
import { createPushRouter } from './modules/push/push.routes';

const pushService = createPushService(prisma);
app.use('/api/push', createPushRouter(pushService));`}
          language="typescript"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">4</span>
          Run Prisma migrations
        </h4>
        <CodeBlock
          code={`npx prisma migrate dev --name AddPushModule`}
          language="bash"
          showTerminalIcon
        />
      </div>
    </>
  );

  const nestjsMongoose = (
    <>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">2</span>
          Generated file tree
        </h4>
        <CodeBlock
          code={`push/
  schemas/
    push-subscription.schema.ts
    notification-log.schema.ts
  domain/
  dto/
  adapters/
    ${provider}-push.adapter.ts
  push.controller.ts
  push.service.ts
  push.module.ts`}
          language="text"
          label="File tree"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">3</span>
          Import PushModule into AppModule
        </h4>
        <CodeBlock
          code={`// push.module.ts (auto-generated) uses MongooseModule.forFeature([...])
// Ensure MongooseModule.forRoot(process.env.MONGODB_URI) is in your AppModule.`}
          language="typescript"
          filename="src/app.module.ts"
        />
      </div>
    </>
  );

  const nestjsCosmosDynamo = (
    <>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">2</span>
          Generated file tree
        </h4>
        <CodeBlock
          code={`push/
  ${isCosmosSdk ? "containers/\n    push.containers.ts" : "tables/\n    push.tables.ts"}
  domain/
  dto/
  adapters/
    ${provider}-push.adapter.ts
  push.controller.ts
  push.service.ts
  push.module.ts`}
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
            ? "Create Cosmos DB database and containers per the generated push.containers.ts. The PushModule uses a stub service—implement the Cosmos client in the service."
            : "Create DynamoDB tables per the generated push.tables.ts. The PushModule uses a stub service—implement the DynamoDB client in the service."}
        </p>
      </div>
    </>
  );

  const nestjsPrisma = (
    <>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">2</span>
          Generated file tree
        </h4>
        <CodeBlock
          code={`push/
  prisma/schema.prisma     # PushSubscription, PushNotificationLog models
  domain/
  dto/
  adapters/
    ${provider}-push.adapter.ts
  push.controller.ts
  push.service.ts
  push.module.ts`}
          language="text"
          label="File tree"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">3</span>
          Import PushModule into AppModule
        </h4>
        <CodeBlock
          code={`@Module({ imports: [PushModule] })
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
          code={`npx prisma migrate dev --name AddPushModule`}
          language="bash"
          showTerminalIcon
        />
      </div>
    </>
  );

  let stackContent = expressTypeORM;
  if (isExpress && isPrisma) stackContent = expressPrisma;
  else if (isExpress && isMongoose) stackContent = expressMongoose;
  else if (isExpress && (isCosmosSdk || isDynamoSdk)) stackContent = expressCosmosDynamo;
  else if (isNestJS && isTypeORM) stackContent = nestjsTypeORM;
  else if (isNestJS && isPrisma) stackContent = nestjsPrisma;
  else if (isNestJS && isMongoose) stackContent = nestjsMongoose;
  else if (isNestJS && (isCosmosSdk || isDynamoSdk)) stackContent = nestjsCosmosDynamo;

  const isDefaultStack = isNestJS && isTypeORM && provider === "fcm";
  const dbFlag = stack.database && stack.database !== "postgres" ? ` --database=${stack.database}` : "";
  const scaffoldCommand = isDefaultStack
    ? "npx @fivfold/api add push"
    : `npx @fivfold/api add push --framework=${stack.framework} --orm=${stack.orm} --provider=${provider}${dbFlag}`;

  return (
    <div className="space-y-8">
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">1</span>
          Scaffold the module
        </h4>
        <p className="text-white/80 text-sm mb-3">
          Run <code>npx @fivfold/api init</code> first if you haven&apos;t. The push kit requires a <strong>provider</strong> (push notification service). Select your stack and provider above, then run:
        </p>
        <CodeBlock
          code={scaffoldCommand}
          language="bash"
          showTerminalIcon
        />
        <p className="text-white/70 text-sm mt-2">
          Without <code>--provider</code>, the CLI will prompt you to choose: FCM, OneSignal, AWS SNS, Pushy, or Pusher Beams.
        </p>
      </div>
      {stackContent}
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">7</span>
          Set environment variables
        </h4>
        <p className="text-white/80 text-sm mb-2">
          Database URL plus provider-specific credentials. For <strong>{provider}</strong>:
        </p>
        <CodeBlock
          code={`${
            isTypeORM || isPrisma
              ? `DATABASE_URL=postgresql://user:password@localhost:5432/yourdb`
              : isMongoose
              ? `MONGODB_URI=mongodb://localhost:27017/yourdb`
              : isCosmosSdk
              ? `COSMOS_ENDPOINT="https://your-account.documents.azure.com:443/"
COSMOS_KEY="your-key"
COSMOS_DATABASE_ID="pushdb"`
              : isDynamoSdk
              ? `AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."`
              : `DATABASE_URL=postgresql://user:password@localhost:5432/yourdb`
          }

${PROVIDER_ENV_VARS[provider] ?? PROVIDER_ENV_VARS.fcm}`}
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
          Request/Response examples
        </h4>
        <p className="text-white/80 text-sm mb-3">
          Register a device (mobile app or web client calls this after obtaining a push token):
        </p>
        <CodeBlock
          code={`POST /api/push/subscribe
Content-Type: application/json
Authorization: Bearer <jwt>

{
  "token": "fcm-or-apns-device-token-here",
  "platform": "ios",
  "metadata": { "appVersion": "1.0.0" }
}`}
          language="http"
          label="Register device"
        />
        <p className="text-white/80 text-sm mt-4 mb-3">
          Send a notification to a user (admin or server-triggered):
        </p>
        <CodeBlock
          code={`POST /api/push/send/user
Content-Type: application/json
Authorization: Bearer <jwt>

{
  "userId": "user-uuid",
  "payload": {
    "title": "New message",
    "body": "You have a new message from John",
    "data": { "type": "chat", "chatId": "123" },
    "imageUrl": "https://example.com/image.png"
  }
}`}
          language="http"
          label="Send to user"
        />
        <p className="text-white/80 text-sm mt-4 mb-3">
          Send to a topic (e.g. &quot;news&quot;, &quot;promotions&quot;):
        </p>
        <CodeBlock
          code={`POST /api/push/send/topic
Content-Type: application/json
Authorization: Bearer <jwt>

{
  "topic": "news",
  "payload": {
    "title": "Breaking news",
    "body": "Check out our latest update"
  }
}`}
          language="http"
          label="Send to topic"
        />
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-6 h-6 items-center justify-center rounded-md bg-brand-secondary/20 text-brand-secondary text-xs font-bold">10</span>
          Integrating with your frontend
        </h4>
        <p className="text-white/80 text-sm mb-4">
          The Push Notifications Kit is backend-only. Your mobile app (React Native, Flutter, etc.) or web app (PWA with service worker) must:
        </p>
        <ol className="list-decimal list-inside text-white/80 text-sm space-y-2 mb-4">
          <li>Request notification permission from the user</li>
          <li>Obtain a device token from the platform (FCM, APNs, Web Push)</li>
          <li>Call <code>POST /api/push/subscribe</code> with the token and platform</li>
          <li>Handle incoming notifications (foreground/background handlers)</li>
        </ol>
        <p className="text-white/70 text-sm">
          For web push, use the Web Push API and a service worker. For mobile, use the native SDK (e.g. <code>@react-native-firebase/messaging</code>) to get the token, then register it with your backend.
        </p>
      </div>
    </div>
  );
}
