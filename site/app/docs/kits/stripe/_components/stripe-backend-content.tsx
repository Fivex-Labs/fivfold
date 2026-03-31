"use client";

import { useStack } from "../../../components/stack-context";
import { CodeBlock } from "../../../components/code-block";
import { DocDiagramSection } from "../../../components/doc-diagram-section";
import { stripeDiagramImages } from "./stripe-diagram-assets";

const BASE = "src/modules/stripe";

type OrmKey = "typeorm" | "prisma" | "mongoose" | "cosmos-sdk" | "dynamodb-sdk";

function ormArtifactBlock(orm: OrmKey): string {
  switch (orm) {
    case "typeorm":
      return `${BASE}/
  entities/stripe-customer.entity.ts          # payments
  entities/stripe-payment-transaction.entity.ts # payments
  entities/stripe-webhook-event.entity.ts     # webhooks
  entities/stripe-connected-account.entity.ts # connect`;
    case "prisma":
      return `prisma/
  schema.prisma   # appended block(s) only — not a new file under ${BASE}/
    # models: StripeCustomer, StripePaymentTransaction (payments)
    #         StripeWebhookEvent (webhooks)
    #         StripeConnectedAccount (connect)`;
    case "mongoose":
      return `${BASE}/
  schemas/stripe-customer.schema.ts
  schemas/stripe-payment-transaction.schema.ts
  schemas/stripe-webhook-event.schema.ts
  schemas/stripe-connected-account.schema.ts`;
    case "cosmos-sdk":
      return `${BASE}/
  containers/stripe.containers.ts   # stub — wire @azure/cosmos persistence yourself`;
    case "dynamodb-sdk":
      return `${BASE}/
  tables/stripe.tables.ts             # stub — wire DynamoDB persistence yourself`;
    default:
      return "";
  }
}

function fullFeatureTree(framework: "express" | "nestjs", orm: OrmKey): string {
  const fw =
    framework === "express"
      ? `${BASE}/
  stripe.service.ts
  stripe.routes.ts`
      : `${BASE}/
  stripe.module.ts
  stripe.controller.ts
  stripe.service.ts`;

  const domain = `${BASE}/
  domain/stripe.port.ts
  adapters/stripe-node.adapter.ts
  dto/create-customer.dto.ts              # payments
  dto/create-payment-intent.dto.ts        # payments
  dto/create-checkout-session.dto.ts      # checkout
  dto/create-connect-account.dto.ts       # connect
  dto/create-account-link.dto.ts          # connect
  dto/create-subscription.dto.ts          # billing
  dto/create-portal-session.dto.ts        # billing`;

  const ormBlock = ormArtifactBlock(orm);

  return `# Every file the kit can emit for ${framework} + ${orm}
# (omit dto/entity/schema/model slices when the feature is disabled)

${domain}

${ormBlock}

${fw}

# AST / host app (not under ${BASE}/ unless your project layout differs)
# Express: src/app.ts — registerStripe router (see Wire into the app)
# NestJS:  src/app.module.ts — StripeModule import
# NestJS + webhooks: src/main.ts — NestFactory.create(..., { rawBody: true })`;
}

function defaultFeatureTree(framework: "express" | "nestjs", orm: OrmKey): string {
  const fw =
    framework === "express"
      ? `${BASE}/stripe.service.ts
${BASE}/stripe.routes.ts`
      : `${BASE}/stripe.module.ts
${BASE}/stripe.controller.ts
${BASE}/stripe.service.ts`;

  let ormLines: string;
  switch (orm) {
    case "typeorm":
      ormLines = `${BASE}/entities/stripe-customer.entity.ts
${BASE}/entities/stripe-payment-transaction.entity.ts
${BASE}/entities/stripe-webhook-event.entity.ts`;
      break;
    case "prisma":
      ormLines = `prisma/schema.prisma  (append: StripeCustomer, StripePaymentTransaction, StripeWebhookEvent)`;
      break;
    case "mongoose":
      ormLines = `${BASE}/schemas/stripe-customer.schema.ts
${BASE}/schemas/stripe-payment-transaction.schema.ts
${BASE}/schemas/stripe-webhook-event.schema.ts`;
      break;
    case "cosmos-sdk":
      ormLines = `${BASE}/containers/stripe.containers.ts`;
      break;
    case "dynamodb-sdk":
      ormLines = `${BASE}/tables/stripe.tables.ts`;
      break;
    default:
      ormLines = "";
  }

  return `${BASE}/domain/stripe.port.ts
${BASE}/adapters/stripe-node.adapter.ts
${BASE}/dto/create-customer.dto.ts
${BASE}/dto/create-payment-intent.dto.ts
${ormLines}
${fw}`;
}

export function StripeBackendContent() {
  const { stack } = useStack();
  const isExpress = stack.framework === "express";
  const isNest = stack.framework === "nestjs";
  const isTypeORM = stack.orm === "typeorm";
  const isPrisma = stack.orm === "prisma";
  const isMongoose = stack.orm === "mongoose";
  const isCosmos = stack.orm === "cosmos-sdk";
  const isDynamo = stack.orm === "dynamodb-sdk";
  const orm = stack.orm as OrmKey;
  const framework = stack.framework as "express" | "nestjs";

  const dbFlag =
    stack.database && stack.database !== "postgres" ? ` --database=${stack.database}` : "";

  const defaultCmd = `npx @fivfold/api add stripe`;
  const explicitCmd = `npx @fivfold/api add stripe --framework=${stack.framework} --orm=${stack.orm}${dbFlag} --features=payments,webhooks`;
  const scaffoldCommand =
    stack.framework === "nestjs" && stack.orm === "typeorm" && stack.database === "postgres"
      ? defaultCmd
      : explicitCmd;

  const wireExpressTypeorm = `// After TypeORM DataSource is initialized (e.g. src/app.ts)
import { createStripeService } from './modules/stripe/stripe.service';
import { createStripeRouter } from './modules/stripe/stripe.routes';

const stripeService = createStripeService(AppDataSource);
app.use('/api/stripe', createStripeRouter(stripeService));

// Ensure Stripe entities are registered on the same DataSource (migrations / synchronize / autoLoadEntities).`;

  const wireExpressPrisma = `import { PrismaClient } from '@prisma/client';
import { createStripeService } from './modules/stripe/stripe.service';
import { createStripeRouter } from './modules/stripe/stripe.routes';

const prisma = new PrismaClient(); // or your shared singleton
const stripeService = createStripeService(prisma);
app.use('/api/stripe', createStripeRouter(stripeService));

// Run prisma migrate after scaffold so Stripe models exist.`;

  const wireExpressMongoose = `import mongoose from 'mongoose';
import { createStripeService } from './modules/stripe/stripe.service';
import { createStripeRouter } from './modules/stripe/stripe.routes';

const stripeService = createStripeService(mongoose.connection);
app.use('/api/stripe', createStripeRouter(stripeService));`;

  const wireExpressCosmosDynamo = `import { createStripeService } from './modules/stripe/stripe.service';
import { createStripeRouter } from './modules/stripe/stripe.routes';

// Pass your Cosmos client or Dynamo client when you implement persistence in stripe.service / containers / tables.
const stripeService = createStripeService(yourCosmosOrDdbClient);
app.use('/api/stripe', createStripeRouter(stripeService));

// Generated service methods throw BadRequest until you replace notImplemented() paths.
// Webhook signature verification still runs in the adapter when STRIPE_WEBHOOK_SECRET is set.`;

  const wireNestTypeorm = `// FivFold registers StripeModule in AppModule and imports ./modules/stripe/stripe.module
//
// 1) TypeORM: include Stripe entities in the same connection (forFeature is already in StripeModule).
// 2) Run migrations if you do not use synchronize.
// 3) Webhooks: confirm main.ts contains NestFactory.create(AppModule, { rawBody: true }) (kit AST when webhooks enabled).`;

  const wireNestPrisma = `// StripeModule is registered on AppModule. StripeService injects PrismaService from ../../prisma.service
// Ensure that path matches your project (same relative layout as other kits) and PrismaClient includes appended Stripe models.
// npx prisma migrate dev after add stripe.`;

  const wireNestMongoose = `// StripeModule uses MongooseModule.forFeature for Stripe schemas when payments/webhooks/connect are on.
// Register Mongo connection in AppModule as you already do for the rest of the app.`;

  const wireNestCosmosDynamo = `// Nest StripeService for ${stack.orm} is a stub: HTTP routes exist but persistence throws until implemented.
// Implement storage using containers/stripe.containers.ts or tables/stripe.tables.ts and replace notImplemented() usage.
// processWebhook still verifies signatures; add idempotent event storage analogous to TypeORM/Prisma/Mongoose templates.`;

  return (
    <div className="space-y-10 not-prose">
      <h2 id="installation-and-features" className="scroll-mt-24 text-xl font-semibold text-white border-t border-white/10 pt-8">
        Installation, flags, and feature matrix
      </h2>
      <p className="text-white/80 text-sm leading-relaxed">
        Run <code className="rounded bg-white/10 px-1">npx @fivfold/api init</code> in the backend workspace first so{" "}
        <code className="rounded bg-white/10 px-1">fivfold.json</code> exists. The Stripe kit is{" "}
        <strong>backend-only</strong>: it does not ship React components or card inputs. It scaffolds a hexagonal slice
        (domain port, Node adapter, optional ORM persistence, HTTP delivery) aligned with Stripe&apos;s current APIs
        (PaymentIntents, Checkout Sessions, Connect Express, Billing helpers, signed webhooks). Legacy Charges API is not
        generated.
      </p>
      <p className="text-white/80 text-sm leading-relaxed">
        <strong>Interactive mode</strong> opens a multiselect for features (arrow keys, space to toggle, enter to confirm).{" "}
        <strong className="text-white/90">Non-interactive:</strong> use{" "}
        <code className="rounded bg-white/10 px-1">--yes</code> for defaults{" "}
        <code className="rounded bg-white/10 px-1">payments,webhooks</code>, or pass an explicit{" "}
        <code className="rounded bg-white/10 px-1">--features=payments,webhooks,connect,checkout,billing</code>. If both are
        present, <code className="rounded bg-white/10 px-1">--features=</code> wins over the default list. Use{" "}
        <code className="rounded bg-white/10 px-1">--dry-run</code> to preview VFS changes without writing disk.
      </p>
      <CodeBlock code={scaffoldCommand} language="bash" showTerminalIcon label="Scaffold (matches sidebar stack)" />
      <div className="overflow-x-auto rounded-xl border border-white/10 text-sm">
        <table className="w-full border-collapse text-white/80">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="py-2 px-3 font-medium text-white/90">Feature token</th>
              <th className="py-2 px-3 font-medium text-white/90">HTTP surface</th>
              <th className="py-2 px-3 font-medium text-white/90">DTOs / persistence</th>
              <th className="py-2 px-3 font-medium text-white/90">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5 align-top">
              <td className="py-2 px-3 font-mono text-brand-secondary">payments</td>
              <td className="py-2 px-3">
                <code className="text-xs">POST …/customers</code>,{" "}
                <code className="text-xs">POST …/payment-intents</code>
              </td>
              <td className="py-2 px-3">
                create-customer, create-payment-intent DTOs; customer + payment transaction rows (except Cosmos/Dynamo stubs)
              </td>
              <td className="py-2 px-3">
                Amount is resolved in <code className="rounded bg-white/10 px-1">resolveCartTotalCents</code> — replace with
                your cart/order service. Optional <code className="rounded bg-white/10 px-1">stripeAccountId</code> for Connect
                destination charges; <code className="rounded bg-white/10 px-1">STRIPE_PLATFORM_FEE_BPS</code> applies
                application fee when set.
              </td>
            </tr>
            <tr className="border-b border-white/5 align-top">
              <td className="py-2 px-3 font-mono text-brand-secondary">webhooks</td>
              <td className="py-2 px-3">
                <code className="text-xs">POST …/webhook</code>
              </td>
              <td className="py-2 px-3">Webhook event idempotency store (TypeORM / Prisma / Mongoose)</td>
              <td className="py-2 px-3">
                Requires raw body verification. Express: <code className="rounded bg-white/10 px-1">express.raw</code> on
                webhook path only. Nest: <code className="rounded bg-white/10 px-1">rawBody: true</code>. Handles{" "}
                <code className="rounded bg-white/10 px-1">payment_intent.succeeded</code> (if payments) and{" "}
                <code className="rounded bg-white/10 px-1">account.updated</code> (if connect).
              </td>
            </tr>
            <tr className="border-b border-white/5 align-top">
              <td className="py-2 px-3 font-mono text-brand-secondary">connect</td>
              <td className="py-2 px-3">
                <code className="text-xs">POST …/connect/accounts</code>,{" "}
                <code className="text-xs">POST …/connect/account-links</code>
              </td>
              <td className="py-2 px-3">connect DTOs; connected-account row</td>
              <td className="py-2 px-3">Express accounts with requested card_payments + transfers capabilities.</td>
            </tr>
            <tr className="border-b border-white/5 align-top">
              <td className="py-2 px-3 font-mono text-brand-secondary">checkout</td>
              <td className="py-2 px-3">
                <code className="text-xs">POST …/checkout/sessions</code>
              </td>
              <td className="py-2 px-3">create-checkout-session DTO</td>
              <td className="py-2 px-3">Creates a Checkout Session; response includes hosted <code className="rounded bg-white/10 px-1">url</code>.</td>
            </tr>
            <tr className="align-top">
              <td className="py-2 px-3 font-mono text-brand-secondary">billing</td>
              <td className="py-2 px-3">
                <code className="text-xs">POST …/billing/subscriptions</code>,{" "}
                <code className="text-xs">POST …/billing/portal-sessions</code>
              </td>
              <td className="py-2 px-3">subscription + portal DTOs</td>
              <td className="py-2 px-3">Uses Stripe Billing APIs; configure Customer Portal in Dashboard when using portal.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="architecture-and-flows" className="scroll-mt-24 text-xl font-semibold text-white border-t border-white/10 pt-8">
        Architecture and flows
      </h2>
      <p className="text-white/80 text-sm leading-relaxed">
        The domain defines <code className="rounded bg-white/10 px-1">IStripePaymentsPort</code>;{" "}
        <code className="rounded bg-white/10 px-1">StripeNodeAdapter</code> is the only Stripe SDK touchpoint. HTTP layers
        validate bodies with <code className="rounded bg-white/10 px-1">class-validator</code> and delegate to the service,
        which orchestrates persistence then calls the port. Controllers and routes use placeholder auth: replace{" "}
        <code className="rounded bg-white/10 px-1">REPLACE_WITH_USER_ID</code> and wire your session/JWT middleware.
      </p>

      <div className="space-y-8">
        <DocDiagramSection
          id="diagram-payment-intents-sequence"
          title="PaymentIntents and asynchronous webhook"
          description={
            <>
              End-to-end flow: the client sends only <code className="rounded bg-white/10 px-1">cartId</code>; the backend
              resolves money from the database, creates the PaymentIntent, returns <code className="rounded bg-white/10 px-1">clientSecret</code>{" "}
              for Stripe.js; confirmation goes directly to Stripe. Fulfillment after success should not rely only on the
              browser—use the highlighted webhook path for idempotent order updates.
            </>
          }
          imageSrc={stripeDiagramImages.paymentIntentsSequence}
          imageAlt="Sequence diagram: PaymentIntents checkout, confirmPayment to Stripe, and payment_intent.succeeded webhook"
          publicPathExample="/docs/kits/stripe/payment-intents-sequence.png"
        />

        <DocDiagramSection
          id="diagram-stripe-connect-onboarding"
          title="Stripe Connect Express onboarding"
          description={
            <>
              Platform creates an Express connected account, persists <code className="rounded bg-white/10 px-1">acct_…</code>, issues an Account Link,
              and redirects the vendor to Stripe-hosted onboarding. After KYC, Stripe redirects back and sends{" "}
              <code className="rounded bg-white/10 px-1">account.updated</code>; the kit&apos;s webhook handler updates{" "}
              <code className="rounded bg-white/10 px-1">payoutsEnabled</code> when the connect feature is enabled.
            </>
          }
          imageSrc={stripeDiagramImages.connectOnboardingSequence}
          imageAlt="Sequence diagram: Connect Express account, Account Link redirect, KYC on Stripe, account.updated webhook"
          publicPathExample="/docs/kits/stripe/connect-express-onboarding.png"
        />
      </div>

      <h2 id="generated-files" className="scroll-mt-24 text-xl font-semibold text-white border-t border-white/10 pt-8">
        Generated file structure
      </h2>
      <p className="text-white/80 text-sm leading-relaxed">
        Paths use the default kit output root <code className="rounded bg-white/10 px-1">{BASE}</code> (from{" "}
        <code className="rounded bg-white/10 px-1">outputDir</code> + kit folder <code className="rounded bg-white/10 px-1">stripe</code>{" "}
        in <code className="rounded bg-white/10 px-1">fivfold.json</code>). Below is exactly what is written for{" "}
        <strong>
          {stack.framework} + {stack.orm}
        </strong>
        .
      </p>
      <h3 className="text-lg font-semibold text-white mt-6 mb-2">Default: payments + webhooks</h3>
      <CodeBlock code={defaultFeatureTree(framework, orm)} language="text" className="text-xs" />
      <h3 className="text-lg font-semibold text-white mt-6 mb-2">Full inventory (all features enabled)</h3>
      <CodeBlock code={fullFeatureTree(framework, orm)} language="text" className="text-xs" />
      {isPrisma && (
        <p className="text-white/75 text-sm mt-3">
          Prisma appends models to the existing <code className="rounded bg-white/10 px-1">schema.prisma</code> at the repo
          root (or your configured Prisma path). Model names: <code className="rounded bg-white/10 px-1">StripeCustomer</code>,{" "}
          <code className="rounded bg-white/10 px-1">StripePaymentTransaction</code>,{" "}
          <code className="rounded bg-white/10 px-1">StripeWebhookEvent</code>,{" "}
          <code className="rounded bg-white/10 px-1">StripeConnectedAccount</code> — each gated by the matching feature.
        </p>
      )}

      <h2 id="wire-into-app" className="scroll-mt-24 text-xl font-semibold text-white border-t border-white/10 pt-8">
        Wire into the app
      </h2>
      <p className="text-white/80 text-sm leading-relaxed mb-4">
        The CLI stages an AST mutation on <code className="rounded bg-white/10 px-1">src/app.ts</code> (Express) or{" "}
        <code className="rounded bg-white/10 px-1">src/app.module.ts</code> (Nest). Adjust import paths if your entry files
        live elsewhere. Mount point is <code className="rounded bg-white/10 px-1">/api/stripe</code> → routes/controller base{" "}
        <code className="rounded bg-white/10 px-1">stripe</code>, so public paths are{" "}
        <code className="rounded bg-white/10 px-1">/api/stripe/…</code>.
      </p>

      {isExpress && isTypeORM && (
        <CodeBlock code={wireExpressTypeorm} language="typescript" filename="src/app.ts" />
      )}
      {isExpress && isPrisma && (
        <CodeBlock code={wireExpressPrisma} language="typescript" filename="src/app.ts" />
      )}
      {isExpress && isMongoose && (
        <CodeBlock code={wireExpressMongoose} language="typescript" filename="src/app.ts" />
      )}
      {isExpress && (isCosmos || isDynamo) && (
        <CodeBlock code={wireExpressCosmosDynamo} language="typescript" filename="src/app.ts" />
      )}

      {isNest && isTypeORM && <CodeBlock code={wireNestTypeorm} language="typescript" />}
      {isNest && isPrisma && <CodeBlock code={wireNestPrisma} language="typescript" />}
      {isNest && isMongoose && <CodeBlock code={wireNestMongoose} language="typescript" />}
      {isNest && (isCosmos || isDynamo) && <CodeBlock code={wireNestCosmosDynamo} language="typescript" />}

      <ul className="list-disc list-inside text-white/80 text-sm space-y-2 mt-4">
        <li>
          <strong className="text-white/90">Webhooks:</strong> Nest must expose raw body on the webhook route; the generated
          controller reads <code className="rounded bg-white/10 px-1">req.rawBody</code>. Express applies JSON parser only
          after the webhook route so <code className="rounded bg-white/10 px-1">POST /webhook</code> stays raw.
        </li>
        <li>
          <strong className="text-white/90">Auth:</strong> Express router includes a no-op <code className="rounded bg-white/10 px-1">authMiddleware</code>; Nest uses{" "}
          <code className="rounded bg-white/10 px-1">req.user?.id</code> when present. Replace with your guards.
        </li>
        <li>
          <strong className="text-white/90">TypeORM + Nest:</strong> Ensure global TypeORM config loads entities under{" "}
          <code className="rounded bg-white/10 px-1">{BASE}/entities</code> or rely on{" "}
          <code className="rounded bg-white/10 px-1">autoLoadEntities: true</code>.
        </li>
      </ul>

      <h2 id="api-reference" className="scroll-mt-24 text-xl font-semibold text-white border-t border-white/10 pt-8">
        API reference
      </h2>
      <p className="text-white/80 text-sm leading-relaxed">
        Base URL assumed: <code className="rounded bg-white/10 px-1">/api/stripe</code>. All JSON routes expect{" "}
        <code className="rounded bg-white/10 px-1">Content-Type: application/json</code> except the webhook (raw JSON bytes, see
        below). Successful JSON endpoints return <code className="rounded bg-white/10 px-1">201</code> (Express) or Nest
        default <code className="rounded bg-white/10 px-1">200</code>/<code className="rounded bg-white/10 px-1">201</code> as
        implemented — the tables note status codes.
      </p>

      <h3 className="text-base font-semibold text-white mt-6 mb-2">POST /webhook (feature: webhooks)</h3>
      <div className="overflow-x-auto rounded-xl border border-white/10 text-xs mb-4">
        <table className="w-full border-collapse text-white/80">
          <tbody className="align-top">
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-medium text-white/90 w-40">URL</td>
              <td className="py-2 px-3 font-mono">POST /api/stripe/webhook</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-medium text-white/90">Headers</td>
              <td className="py-2 px-3">
                <code className="rounded bg-white/10 px-1">Stripe-Signature</code> (required). Body must be the raw request
                bytes stringified by Stripe — do not parse/re-stringify JSON before verify.
              </td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-medium text-white/90">Body</td>
              <td className="py-2 px-3">Raw Buffer (Express) / rawBody (Nest) of the JSON event payload.</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-medium text-white/90">Success</td>
              <td className="py-2 px-3">
                <code className="rounded bg-white/10 px-1">200</code> JSON{" "}
                <code className="rounded bg-white/10 px-1">{`{ "received": true }`}</code> or{" "}
                <code className="rounded bg-white/10 px-1">{`{ "received": true, "duplicate": true }`}</code> when the event id
                was already processed.
              </td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-medium text-white/90">Errors</td>
              <td className="py-2 px-3">
                Missing secret or signature → adapter throws (Express <code className="rounded bg-white/10 px-1">400</code> with{" "}
                <code className="rounded bg-white/10 px-1">{`{ "error": "…" }`}</code>; Nest webhook →{" "}
                <code className="rounded bg-white/10 px-1">BadRequestException</code> if raw body missing). Invalid signature →
                Stripe SDK error surfaced as 400 (Express) or 500 depending on global filter (verify in your app).
              </td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium text-white/90">Side effects</td>
              <td className="py-2 px-3">
                Upserts webhook event row; on first process updates related payment transaction or connected account when event
                type matches (see template). Cosmos/Dynamo: implement storage yourself while keeping verify logic.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold text-white mt-6 mb-2">POST /customers (feature: payments)</h3>
      <div className="overflow-x-auto rounded-xl border border-white/10 text-xs mb-4">
        <table className="w-full border-collapse text-white/80">
          <tbody className="align-top">
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-medium text-white/90 w-40">Body</td>
              <td className="py-2 px-3">
                <code className="rounded bg-white/10 px-1">email</code> string (required, email).{" "}
                <code className="rounded bg-white/10 px-1">name</code> optional string.{" "}
                <code className="rounded bg-white/10 px-1">metadata</code> optional object of string values.
              </td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-medium text-white/90">Success</td>
              <td className="py-2 px-3">
                Express <code className="rounded bg-white/10 px-1">201</code>; JSON{" "}
                <code className="rounded bg-white/10 px-1">{`{ "customerId": "cus_…" }`}</code> (Stripe customer id). Local row
                upserted with <code className="rounded bg-white/10 px-1">userId</code> from auth stub.
              </td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium text-white/90">Errors</td>
              <td className="py-2 px-3">
                Validation → Nest <code className="rounded bg-white/10 px-1">400 BadRequestException</code> with constraint
                messages; Express <code className="rounded bg-white/10 px-1">400</code>{" "}
                <code className="rounded bg-white/10 px-1">{`{ "error": "…" }`}</code>. Missing{" "}
                <code className="rounded bg-white/10 px-1">STRIPE_SECRET_KEY</code> → adapter throws at first Stripe call.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold text-white mt-6 mb-2">POST /payment-intents (feature: payments)</h3>
      <div className="overflow-x-auto rounded-xl border border-white/10 text-xs mb-4">
        <table className="w-full border-collapse text-white/80">
          <tbody className="align-top">
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-medium text-white/90 w-40">Body</td>
              <td className="py-2 px-3">
                <code className="rounded bg-white/10 px-1">cartId</code> string (required).{" "}
                <code className="rounded bg-white/10 px-1">stripeAccountId</code> optional Connect account id for destination
                charges.
              </td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-medium text-white/90">Server behavior</td>
              <td className="py-2 px-3">
                Calls <code className="rounded bg-white/10 px-1">resolveCartTotalCents(cartId)</code> (stub returns{" "}
                <code className="rounded bg-white/10 px-1">STRIPE_DEV_FIXTURE_AMOUNT_CENTS</code> or 1000). Currency from{" "}
                <code className="rounded bg-white/10 px-1">STRIPE_DEFAULT_CURRENCY</code> (default <code className="rounded bg-white/10 px-1">usd</code>
                ). Creates PaymentIntent with <code className="rounded bg-white/10 px-1">automatic_payment_methods</code>. If{" "}
                <code className="rounded bg-white/10 px-1">stripeAccountId</code> set and{" "}
                <code className="rounded bg-white/10 px-1">STRIPE_PLATFORM_FEE_BPS</code> valid, sets{" "}
                <code className="rounded bg-white/10 px-1">application_fee_amount</code>.
              </td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-medium text-white/90">Success</td>
              <td className="py-2 px-3">
                JSON{" "}
                <code className="rounded bg-white/10 px-1">
                  {`{ "clientSecret", "paymentIntentId", "amountCents", "currency" }`}
                </code>
                . <code className="rounded bg-white/10 px-1">clientSecret</code> may be null per Stripe if not yet available;
                normally present for Elements / Payment Element.
              </td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium text-white/90">Errors</td>
              <td className="py-2 px-3">Same validation pattern as customers. Stripe API errors bubble as thrown errors (Express 400 stringified).</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold text-white mt-6 mb-2">POST /checkout/sessions (feature: checkout)</h3>
      <div className="overflow-x-auto rounded-xl border border-white/10 text-xs mb-4">
        <table className="w-full border-collapse text-white/80">
          <tbody className="align-top">
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-medium text-white/90 w-40">Body</td>
              <td className="py-2 px-3">
                <code className="rounded bg-white/10 px-1">mode</code>: <code className="rounded bg-white/10 px-1">payment</code>{" "}
                | <code className="rounded bg-white/10 px-1">subscription</code>. <code className="rounded bg-white/10 px-1">priceId</code>{" "}
                required. <code className="rounded bg-white/10 px-1">quantity</code> optional string (coerced to number, default 1).{" "}
                <code className="rounded bg-white/10 px-1">successUrl</code>, <code className="rounded bg-white/10 px-1">cancelUrl</code> valid URLs.{" "}
                <code className="rounded bg-white/10 px-1">customerId</code>, <code className="rounded bg-white/10 px-1">stripeAccountId</code> optional.
              </td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-medium text-white/90">Success</td>
              <td className="py-2 px-3">
                <code className="rounded bg-white/10 px-1">{`{ "url": "https://checkout.stripe.com/…", "sessionId": "cs_…" }`}</code>
              </td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium text-white/90">Notes</td>
              <td className="py-2 px-3">Single line item from <code className="rounded bg-white/10 px-1">priceId</code>; extend adapter for multi-line carts.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold text-white mt-6 mb-2">POST /connect/accounts (feature: connect)</h3>
      <div className="overflow-x-auto rounded-xl border border-white/10 text-xs mb-4">
        <table className="w-full border-collapse text-white/80">
          <tbody className="align-top">
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-medium text-white/90 w-40">Body</td>
              <td className="py-2 px-3">
                <code className="rounded bg-white/10 px-1">email</code> required. <code className="rounded bg-white/10 px-1">metadata</code> optional.
              </td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-medium text-white/90">Success</td>
              <td className="py-2 px-3">
                <code className="rounded bg-white/10 px-1">{`{ "accountId": "acct_…" }`}</code>; local row stores payouts flag snapshot.
              </td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium text-white/90">Errors</td>
              <td className="py-2 px-3">Stub ORM paths (Cosmos/Dynamo) return 400 with notImplemented message until you implement persistence.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold text-white mt-6 mb-2">POST /connect/account-links (feature: connect)</h3>
      <div className="overflow-x-auto rounded-xl border border-white/10 text-xs mb-4">
        <table className="w-full border-collapse text-white/80">
          <tbody className="align-top">
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-medium text-white/90 w-40">Body</td>
              <td className="py-2 px-3">
                <code className="rounded bg-white/10 px-1">accountId</code>, <code className="rounded bg-white/10 px-1">refreshUrl</code>,{" "}
                <code className="rounded bg-white/10 px-1">returnUrl</code> required. <code className="rounded bg-white/10 px-1">type</code> optional{" "}
                <code className="rounded bg-white/10 px-1">account_onboarding</code> | <code className="rounded bg-white/10 px-1">account_update</code>.
              </td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium text-white/90">Success</td>
              <td className="py-2 px-3">
                <code className="rounded bg-white/10 px-1">{`{ "url": "https://connect.stripe.com/…" }`}</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold text-white mt-6 mb-2">POST /billing/subscriptions (feature: billing)</h3>
      <div className="overflow-x-auto rounded-xl border border-white/10 text-xs mb-4">
        <table className="w-full border-collapse text-white/80">
          <tbody className="align-top">
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-medium text-white/90 w-40">Body</td>
              <td className="py-2 px-3">
                <code className="rounded bg-white/10 px-1">customerId</code>, <code className="rounded bg-white/10 px-1">priceId</code> required.{" "}
                <code className="rounded bg-white/10 px-1">metadata</code> optional.
              </td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium text-white/90">Success</td>
              <td className="py-2 px-3">
                <code className="rounded bg-white/10 px-1">{`{ "subscriptionId": "sub_…", "status": "…" }`}</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-base font-semibold text-white mt-6 mb-2">POST /billing/portal-sessions (feature: billing)</h3>
      <div className="overflow-x-auto rounded-xl border border-white/10 text-xs mb-4">
        <table className="w-full border-collapse text-white/80">
          <tbody className="align-top">
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-medium text-white/90 w-40">Body</td>
              <td className="py-2 px-3">
                <code className="rounded bg-white/10 px-1">customerId</code>, <code className="rounded bg-white/10 px-1">returnUrl</code> required.
              </td>
            </tr>
            <tr>
              <td className="py-2 px-3 font-medium text-white/90">Success</td>
              <td className="py-2 px-3">
                <code className="rounded bg-white/10 px-1">{`{ "url": "https://billing.stripe.com/…" }`}</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-white/65 text-xs">
        Route summary: webhook (webhooks); customers, payment-intents (payments); checkout/sessions (checkout); connect/accounts,
        connect/account-links (connect); billing/subscriptions, billing/portal-sessions (billing).
      </p>

      <h2 id="browsers-stripe-hosted" className="scroll-mt-24 text-xl font-semibold text-white border-t border-white/10 pt-8">
        Browsers and Stripe-hosted surfaces
      </h2>
      <p className="text-white/80 text-sm leading-relaxed">
        This kit intentionally does not include a client UI layer. For anything involving card numbers or strong customer
        authentication, use Stripe&apos;s own surfaces—Stripe.js with the Payment Element or Card Element, Embedded Checkout,
        or hosted Checkout / Customer Portal URLs returned by this API—so sensitive data stays inside Stripe&apos;s PCI
        boundaries. Your application should only handle publishable keys in the browser, call these backend endpoints for
        intents and sessions, and never send raw card data to your server.
      </p>

      <h2 id="stripe-dashboard-environment" className="scroll-mt-24 text-xl font-semibold text-white border-t border-white/10 pt-8">
        Stripe Dashboard, environment variables, and SDK
      </h2>
      <p className="text-white/80 text-sm leading-relaxed mb-3">
        In the Stripe Dashboard, create a webhook endpoint pointing to your deployed{" "}
        <code className="rounded bg-white/10 px-1">https://your.api/api/stripe/webhook</code> and select the event types you
        rely on (at minimum <code className="rounded bg-white/10 px-1">payment_intent.succeeded</code> and{" "}
        <code className="rounded bg-white/10 px-1">account.updated</code> if you use the generated handlers). Copy the signing
        secret into <code className="rounded bg-white/10 px-1">STRIPE_WEBHOOK_SECRET</code>. Use test mode keys until you go live.
      </p>
      <CodeBlock
        code={`# Required for server-side Stripe API calls
STRIPE_SECRET_KEY=sk_test_...

# Webhooks feature — signing secret from Dashboard
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional: pin API version (must match Stripe typings you use)
STRIPE_API_VERSION=2024-11-20.acacia

# PaymentIntents default currency (lowercase ISO code)
STRIPE_DEFAULT_CURRENCY=usd

# Dev-only stub when cart pricing is not wired yet
STRIPE_DEV_FIXTURE_AMOUNT_CENTS=1000

# Connect: optional platform fee (basis points, 100 = 1%) on destination PaymentIntents
STRIPE_PLATFORM_FEE_BPS=250`}
        language="bash"
        label=".env (backend)"
      />
      <p className="text-white/65 text-xs mt-2">
        Never expose <code className="rounded bg-white/10 px-1">STRIPE_SECRET_KEY</code> or{" "}
        <code className="rounded bg-white/10 px-1">STRIPE_WEBHOOK_SECRET</code> to a browser. The adapter default API version is{" "}
        <code className="rounded bg-white/10 px-1">2024-11-20.acacia</code> unless overridden.
      </p>
      {(isCosmos || isDynamo) && (
        <p className="text-white/75 text-sm mt-4">
          <strong className="text-white/90">{isCosmos ? "Cosmos" : "DynamoDB"} kit slice:</strong> manifest lists additional env
          hints ({isCosmos ? "COSMOS_ENDPOINT, COSMOS_KEY, COSMOS_DATABASE_ID" : "AWS_REGION, credentials"}). Wire these when you
          replace stubs.
        </p>
      )}

      <h2 id="security-and-operations" className="scroll-mt-24 text-xl font-semibold text-white border-t border-white/10 pt-8">
        Security and operations
      </h2>
      <ul className="list-disc list-inside text-white/80 text-sm space-y-2">
        <li>
          Replace <code className="rounded bg-white/10 px-1">resolveCartTotalCents</code> with trusted pricing from your database;
          never accept money amounts from the client for authorization.
        </li>
        <li>
          Extend <code className="rounded bg-white/10 px-1">processWebhook</code> / <code className="rounded bg-white/10 px-1">handleStripeWebhook</code> for
          fulfillment logic; keep idempotency on <code className="rounded bg-white/10 px-1">event.id</code>.
        </li>
        <li>Rotate keys and webhook secrets per environment; use Stripe&apos;s test/live mode separation.</li>
        <li>Connect: complete Stripe Connect onboarding requirements before production charges.</li>
        <li>Run database migrations after scaffold (TypeORM, Prisma, or your Mongoose strategy) so Stripe tables exist before traffic.</li>
      </ul>
    </div>
  );
}
