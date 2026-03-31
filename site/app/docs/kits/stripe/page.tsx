"use client";

import { DocPage } from "../../components/doc-page";
import { CodeBlock } from "../../components/code-block";
import { StripeBackendContent } from "./_components/stripe-backend-content";
import { Server } from "lucide-react";

const headings = [
  { id: "quick-reference", text: "Quick reference", level: 2 },
  { id: "overview", text: "Overview", level: 2 },
  { id: "features", text: "Features at a glance", level: 2 },
  { id: "installation-and-features", text: "Installation, flags, and feature matrix", level: 2 },
  { id: "architecture-and-flows", text: "Architecture and flows", level: 2 },
  { id: "generated-files", text: "Generated file structure", level: 2 },
  { id: "wire-into-app", text: "Wire into the app", level: 2 },
  { id: "api-reference", text: "API reference", level: 2 },
  { id: "browsers-stripe-hosted", text: "Browsers and Stripe-hosted surfaces", level: 2 },
  { id: "stripe-dashboard-environment", text: "Stripe Dashboard, environment, SDK", level: 2 },
  { id: "security-and-operations", text: "Security and operations", level: 2 },
];

export default function StripeKitPage() {
  return (
    <DocPage
      title="Stripe Kit"
      description="Backend Stripe integration: PaymentIntents with server-side totals, signed webhooks and idempotency, optional Connect (Express accounts and platform fee env), Checkout Sessions, and Billing helpers—Express or NestJS, manifest-driven, ORM-aware."
      headings={headings}
      stackConfig={{ showDatabaseFields: true }}
    >
      <h2 id="quick-reference" className="scroll-mt-24 font-semibold text-2xl pt-2">
        Quick reference
      </h2>
      <div className="rounded-xl border border-white/10 bg-black/20 p-4 mb-12 mt-4 max-w-2xl">
        <h4 className="font-medium text-white mb-3 flex items-center gap-2">
          <Server className="h-4 w-4 text-brand-secondary" />
          CLI commands
        </h4>
        <CodeBlock
          code={`# Interactive feature multiselect (arrow keys + space)
npx @fivfold/api add stripe

# Non-interactive defaults (payments + webhooks)
npx @fivfold/api add stripe --yes

# Explicit features (works with --yes; overrides default feature list)
npx @fivfold/api add stripe --yes --features=payments,webhooks,connect,checkout,billing

# Stack flags (example)
npx @fivfold/api add stripe --framework=express --orm=prisma --database=postgres

# Preview staged files and AST edits without writing disk
npx @fivfold/api add stripe --dry-run`}
          language="bash"
          className="text-xs"
          showTerminalIcon
        />
      </div>

      <h2 id="overview" className="scroll-mt-24 font-semibold text-2xl pt-2">
        Overview
      </h2>
      <div className="text-white/80 leading-relaxed space-y-4 mt-4 mb-8">
        <p>
          The Stripe Kit is a <strong>backend-only</strong> module for <code className="rounded bg-white/10 px-1">@fivfold/api</code>.
          It generates a small hexagonal slice: a framework-agnostic port (
          <code className="rounded bg-white/10 px-1">IStripePaymentsPort</code>), a{" "}
          <code className="rounded bg-white/10 px-1">StripeNodeAdapter</code> that wraps the official{" "}
          <code className="rounded bg-white/10 px-1">stripe</code> npm package, DTO-validated HTTP endpoints, and—when you
          enable features—ORM-specific persistence for customers, payment-intent tracking, webhook idempotency, and connected
          accounts. Delivery is either Express (<code className="rounded bg-white/10 px-1">createStripeRouter</code>) or NestJS (
          <code className="rounded bg-white/10 px-1">StripeModule</code> + <code className="rounded bg-white/10 px-1">StripeController</code>
          ). Card data never touches your API: amounts are resolved on the server; confirmation uses Stripe&apos;s client SDKs or
          hosted pages.
        </p>
        <p>
          Feature selection is first-class: you choose <code className="rounded bg-white/10 px-1">payments</code>,{" "}
          <code className="rounded bg-white/10 px-1">webhooks</code>, <code className="rounded bg-white/10 px-1">connect</code>,{" "}
          <code className="rounded bg-white/10 px-1">checkout</code>, and <code className="rounded bg-white/10 px-1">billing</code>{" "}
          independently so the CLI does not multiply templates for every combination. Cosmos DB and DynamoDB paths ship
          container/table stubs and Nest service placeholders until you wire the Azure or AWS SDKs; TypeORM, Prisma, and Mongoose
          paths include working persistence in the generated service code.
        </p>
        <p>
          Use the stack sidebar on this page to match <strong>Framework</strong> and <strong>ORM</strong> to your project. The
          sections below list the exact files emitted for that pair, how to mount the router or module, and a full HTTP reference
          (bodies, headers, responses, and errors). There is no FivFold UI kit for Stripe; a short note on using Stripe&apos;s own
          hosted and embedded flows appears later so PCI-sensitive work stays on Stripe.
        </p>
      </div>

      <h2 id="features" className="scroll-mt-24 font-semibold text-2xl mt-12 pt-4">
        Features at a glance
      </h2>
      <div className="overflow-x-auto rounded-xl border border-white/10 mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-2 px-4 font-medium text-white/80">Token</th>
              <th className="text-left py-2 px-4 font-medium text-white/80">What you get</th>
              <th className="text-left py-2 px-4 font-medium text-white/80">Key env / config</th>
            </tr>
          </thead>
          <tbody className="text-white/70">
            <tr className="border-b border-white/5 align-top">
              <td className="py-2 px-4 font-mono text-brand-secondary">payments</td>
              <td className="py-2 px-4">
                Stripe Customer + PaymentIntent creation; local customer and transaction rows (SQL/Prisma/Mongoose). Cart totals
                via <code className="rounded bg-white/10 px-1">resolveCartTotalCents</code> (you replace).
              </td>
              <td className="py-2 px-4">
                <code className="rounded bg-white/10 px-1">STRIPE_SECRET_KEY</code>,{" "}
                <code className="rounded bg-white/10 px-1">STRIPE_DEFAULT_CURRENCY</code>, optional{" "}
                <code className="rounded bg-white/10 px-1">STRIPE_DEV_FIXTURE_AMOUNT_CENTS</code>, optional{" "}
                <code className="rounded bg-white/10 px-1">STRIPE_PLATFORM_FEE_BPS</code> with Connect destination charges.
              </td>
            </tr>
            <tr className="border-b border-white/5 align-top">
              <td className="py-2 px-4 font-mono text-brand-secondary">webhooks</td>
              <td className="py-2 px-4">
                <code className="rounded bg-white/10 px-1">POST /webhook</code> with signature verification and idempotent event
                storage; updates payment / Connect rows when those features are also on.
              </td>
              <td className="py-2 px-4">
                <code className="rounded bg-white/10 px-1">STRIPE_WEBHOOK_SECRET</code>; raw body on Nest (
                <code className="rounded bg-white/10 px-1">rawBody: true</code>) or Express raw parser on the webhook route only.
              </td>
            </tr>
            <tr className="border-b border-white/5 align-top">
              <td className="py-2 px-4 font-mono text-brand-secondary">connect</td>
              <td className="py-2 px-4">
                Express connected accounts, account links, optional application fee on destination PaymentIntents via basis points.
              </td>
              <td className="py-2 px-4">
                Same secret key; platform fee from <code className="rounded bg-white/10 px-1">STRIPE_PLATFORM_FEE_BPS</code> when{" "}
                <code className="rounded bg-white/10 px-1">stripeAccountId</code> is sent on payment-intent creation.
              </td>
            </tr>
            <tr className="border-b border-white/5 align-top">
              <td className="py-2 px-4 font-mono text-brand-secondary">checkout</td>
              <td className="py-2 px-4">Hosted Checkout Session creation; response returns redirect URL and session id.</td>
              <td className="py-2 px-4">
                Dashboard Prices; <code className="rounded bg-white/10 px-1">STRIPE_SECRET_KEY</code>.
              </td>
            </tr>
            <tr className="align-top">
              <td className="py-2 px-4 font-mono text-brand-secondary">billing</td>
              <td className="py-2 px-4">Create subscription and Customer Portal session URLs.</td>
              <td className="py-2 px-4">
                Billing products/prices in Dashboard; portal configuration; <code className="rounded bg-white/10 px-1">STRIPE_SECRET_KEY</code>.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <StripeBackendContent />
    </DocPage>
  );
}
