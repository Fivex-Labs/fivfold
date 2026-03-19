"use client";

import { DocPage } from "../../components/doc-page";
import { DocCallout } from "../../components/doc-blocks";
import { CodeBlock } from "../../components/code-block";
import { PushBackendContent } from "./_components/push-backend-content";
import { Bell, Server } from "lucide-react";

const headings = [
  { id: "quick-reference", text: "Quick reference", level: 2 },
  { id: "overview", text: "Overview", level: 2 },
  { id: "architecture", text: "Architecture", level: 2 },
  { id: "providers", text: "Supported providers", level: 2 },
  { id: "guide", text: "Guide", level: 2 },
  { id: "domain-port-methods", text: "Domain port methods", level: 2 },
];

export default function PushKitPage() {
  return (
    <DocPage
      title="Push Notifications Kit"
      description="Backend push notifications with device registration, sending, logging, and pluggable providers (FCM, OneSignal, AWS SNS, Pushy, Pusher Beams)."
      headings={headings}
      stackConfig={{
        showDatabaseFields: true,
        showPushProvider: true,
      }}
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
          code={`# Scaffold with defaults (NestJS + TypeORM + FCM)
npx @fivfold/api add push

# With explicit stack and provider
npx @fivfold/api add push --framework=express --orm=prisma --provider=onesignal

# Use MongoDB + Mongoose
npx @fivfold/api add push --framework=nestjs --orm=mongoose --database=mongodb

# Use Cosmos DB
npx @fivfold/api add push --orm=cosmos-sdk --database=cosmosdb --dry-run

# Dry run to preview files
npx @fivfold/api add push --dry-run`}
          language="bash"
          className="text-xs"
        />
      </div>

      <h2 id="overview" className="scroll-mt-24 font-semibold text-2xl pt-2">
        Overview
      </h2>
      <p className="text-white/80 leading-relaxed mb-6 mt-4">
        The Push Notifications Kit is a <strong>backend-only</strong> module that scaffolds a complete push notification
        system for your Node.js application. It handles device registration, sending notifications to devices/users/topics,
        and optional audit logging. Unlike the Email and Kanban Kits, it does not include a frontend UI—your mobile app
        or PWA obtains push tokens and registers them with the backend.
      </p>
      <p className="text-white/80 leading-relaxed mb-4">
        The kit follows <strong>Hexagonal Architecture</strong>: a domain port (<code>IPushNotificationService</code>) defines
        the contract, and pluggable adapters implement it using third-party SDKs. You choose one provider at scaffold time
        (FCM, OneSignal, AWS SNS, Pushy, or Pusher Beams), and the generated code is ready to integrate with your Express
        or NestJS app. Supported stack combinations:
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
            <tr className="border-b border-white/5">
              <td className="py-2 px-4 font-medium text-white/90">Push Provider</td>
              <td className="py-2 px-4">FCM, OneSignal, AWS SNS, Pushy, Pusher Beams</td>
            </tr>
          </tbody>
        </table>
      </div>

      <DocCallout className="mb-8" icon={Bell} title="Backend-only Kit" variant="info">
        <p>
          The Push Notifications Kit scaffolds only backend code. Your frontend (React Native, Flutter, PWA, etc.) must
          request notification permission, obtain a device token from the platform, and call <code>POST /api/push/subscribe</code> to
          register it. The guide below covers backend setup; frontend integration is provider-specific.
        </p>
      </DocCallout>

      <h2 id="architecture" className="scroll-mt-24 font-semibold text-2xl mt-12 pt-4">
        Architecture
      </h2>
      <p className="text-white/80 leading-relaxed mb-4 mt-4">
        The kit is structured in layers, with clear separation between domain logic and infrastructure:
      </p>
      <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden mb-6">
        <div className="p-4 border-b border-white/10">
          <h4 className="font-medium text-white">Layer structure</h4>
        </div>
        <div className="p-4 space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <span className="flex w-8 h-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary/20 text-brand-primary font-bold text-xs">1</span>
            <div>
              <strong className="text-white">Domain</strong> — <code>IPushNotificationService</code> port interface and DTOs
              (<code>SendNotificationDto</code>, <code>RegisterDeviceDto</code>). Framework-agnostic.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex w-8 h-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary/20 text-brand-primary font-bold text-xs">2</span>
            <div>
              <strong className="text-white">ORM</strong> — <code>PushSubscription</code> (device tokens per user) and
              <code>PushNotificationLog</code> (audit trail). TypeORM entities or Prisma models.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex w-8 h-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary/20 text-brand-primary font-bold text-xs">3</span>
            <div>
              <strong className="text-white">Framework</strong> — Express routes or NestJS controller + service. Handles HTTP,
              validation, and delegates to the adapter.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex w-8 h-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary/20 text-brand-primary font-bold text-xs">4</span>
            <div>
              <strong className="text-white">Provider adapter</strong> — Implements <code>IPushNotificationService</code> using
              the vendor SDK (e.g. <code>FcmPushAdapter</code> uses <code>firebase-admin</code>). One adapter per provider.
            </div>
          </div>
        </div>
      </div>
      <p className="text-white/70 text-sm">
        Swapping providers (e.g. FCM → OneSignal) requires re-scaffolding with <code>--provider=onesignal</code> or
        manually replacing the adapter file. The controller, service, and entities remain unchanged.
      </p>

      <h2 id="providers" className="scroll-mt-24 font-semibold text-2xl mt-12 pt-4">
        Supported providers
      </h2>
      <p className="text-white/80 leading-relaxed mb-6 mt-4">
        Choose one provider when scaffolding. Each has different setup requirements and capabilities:
      </p>
      <div className="overflow-x-auto rounded-xl border border-white/10 mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 font-medium text-white/80">Provider</th>
              <th className="text-left py-3 px-4 font-medium text-white/80">Package</th>
              <th className="text-left py-3 px-4 font-medium text-white/80">Best for</th>
            </tr>
          </thead>
          <tbody className="text-white/70">
            <tr className="border-b border-white/5"><td className="py-3 px-4 font-mono text-brand-secondary">fcm</td><td className="py-3 px-4 font-mono">firebase-admin</td><td className="py-3 px-4">Android, iOS, Web. Free tier. Google ecosystem.</td></tr>
            <tr className="border-b border-white/5"><td className="py-3 px-4 font-mono text-brand-secondary">onesignal</td><td className="py-3 px-4 font-mono">axios (REST API)</td><td className="py-3 px-4">Multi-platform, easy setup, free tier.</td></tr>
            <tr className="border-b border-white/5"><td className="py-3 px-4 font-mono text-brand-secondary">sns</td><td className="py-3 px-4 font-mono">@aws-sdk/client-sns</td><td className="py-3 px-4">AWS-native, scalable, pay-per-use.</td></tr>
            <tr className="border-b border-white/5"><td className="py-3 px-4 font-mono text-brand-secondary">pushy</td><td className="py-3 px-4 font-mono">pushy</td><td className="py-3 px-4">Reliable delivery, topics, status tracking.</td></tr>
            <tr className="border-b border-white/5"><td className="py-3 px-4 font-mono text-brand-secondary">pusher-beams</td><td className="py-3 px-4 font-mono">@pusher/push-notifications-server</td><td className="py-3 px-4">Interests (topics), user targeting, simple API.</td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="guide" className="scroll-mt-24 font-semibold text-2xl mt-12 pt-4">
        Guide
      </h2>
      <p className="text-white/80 leading-relaxed mb-6 mt-4 text-sm">
        Step-by-step backend integration (clients obtain tokens and call your API—there is no FivFold UI kit for Push). Select
        framework, ORM, and push provider in the sidebar for stack-specific instructions.
      </p>
      <div className="space-y-6">
        <p className="text-white/80 text-sm leading-relaxed">
          The Push API module provides entities, DTOs, services, controllers/routes, and a provider adapter. Platform icons
          indicate your current selection.
        </p>
        <PushBackendContent />
      </div>

      <h2 id="domain-port-methods" className="scroll-mt-24 font-semibold text-2xl mt-12 pt-8 border-t border-white/10">
        Domain port methods
      </h2>
      <p className="text-white/80 leading-relaxed mb-4 mt-4 text-sm">
        The <code>IPushNotificationService</code> port defines the following methods. Provider adapters implement this interface.
      </p>
      <div className="overflow-x-auto rounded-xl border border-white/10 mb-8">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-2 px-4 font-medium text-white/80">Method</th>
              <th className="text-left py-2 px-4 font-medium text-white/80">Parameters</th>
              <th className="text-left py-2 px-4 font-medium text-white/80">Return</th>
              <th className="text-left py-2 px-4 font-medium text-white/80">Purpose</th>
            </tr>
          </thead>
          <tbody className="text-white/70">
            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">registerDevice</td><td className="py-2 px-4 font-mono text-white/50">userId, dto</td><td className="py-2 px-4 font-mono text-white/50">Promise&lt;PushSubscription&gt;</td><td className="py-2 px-4">Register device token for a user</td></tr>
            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">unregisterDevice</td><td className="py-2 px-4 font-mono text-white/50">userId, token</td><td className="py-2 px-4 font-mono text-white/50">Promise&lt;void&gt;</td><td className="py-2 px-4">Unregister device token</td></tr>
            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">sendToDevice</td><td className="py-2 px-4 font-mono text-white/50">token, payload</td><td className="py-2 px-4 font-mono text-white/50">Promise&lt;SendResult&gt;</td><td className="py-2 px-4">Send notification to a specific device</td></tr>
            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">sendToUser</td><td className="py-2 px-4 font-mono text-white/50">userId, payload</td><td className="py-2 px-4 font-mono text-white/50">Promise&lt;SendResult&gt;</td><td className="py-2 px-4">Send to all devices of a user</td></tr>
            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">sendToTopic</td><td className="py-2 px-4 font-mono text-white/50">topic, payload</td><td className="py-2 px-4 font-mono text-white/50">Promise&lt;SendResult&gt;</td><td className="py-2 px-4">Send to topic (FCM, Pushy, Pusher Beams)</td></tr>
            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">getSubscriptions</td><td className="py-2 px-4 font-mono text-white/50">userId</td><td className="py-2 px-4 font-mono text-white/50">Promise&lt;PushSubscription[]&gt;</td><td className="py-2 px-4">List user&apos;s registered devices</td></tr>
            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">logNotification</td><td className="py-2 px-4 font-mono text-white/50">subscriptionId, messageId, status, ...</td><td className="py-2 px-4 font-mono text-white/50">Promise&lt;void&gt;</td><td className="py-2 px-4">Audit trail for sent notifications</td></tr>
          </tbody>
        </table>
      </div>

    </DocPage>
  );
}
