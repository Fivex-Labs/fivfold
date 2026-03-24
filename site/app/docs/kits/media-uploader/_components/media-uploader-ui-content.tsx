"use client"

import { CodeBlock } from "../../../components/code-block"
import { KitDocStepHeading } from "../../../components/kit-doc-step-heading"
import { KitFeBeConnectionGuide } from "../../../components/kit-fe-be-connection"
import { KitIntegrationDisclaimer } from "../../../components/kit-integration-disclaimer"

export function MediaUploaderUiContent() {
  return (
    <div className="space-y-10">
      <KitDocStepHeading step={1}>Installation</KitDocStepHeading>
      <CodeBlock
        code={`npx @fivfold/ui add media-uploader

# Dry run
npx @fivfold/ui add media-uploader --dry-run`}
        language="bash"
        className="text-xs"
      />
      <p className="text-white/80 text-sm leading-relaxed">
        Run <code className="rounded bg-white/10 px-1">npx @fivfold/ui init</code> first if you have not. Output is written under your configured kits path (default{" "}
        <code className="rounded bg-white/10 px-1">@/components/ui/kits/media-uploader</code>).
      </p>

      <KitDocStepHeading step={2}>Generated file structure</KitDocStepHeading>
      <CodeBlock
        code={`kits/media-uploader/
├── index.tsx           # exports MediaUploaderKit, types, upload helpers
├── media-uploader.tsx  # main UI (drag-drop, progress, confirm)
├── types.ts            # DirectUploadInstruction, presign/finalize types
└── upload-client.ts    # XHR upload + concurrency helper`}
        language="text"
        className="text-xs"
      />

      <KitDocStepHeading step={3}>Import and usage</KitDocStepHeading>
      <p className="text-white/80 text-sm leading-relaxed">
        Wire <code className="rounded bg-white/10 px-1">presign</code> to <code className="rounded bg-white/10 px-1">POST /media-uploader/presign</code> and{" "}
        <code className="rounded bg-white/10 px-1">finalizeUpload</code> to <code className="rounded bg-white/10 px-1">POST /media-uploader/finalize</code> on your API.
        On success, <code className="rounded bg-white/10 px-1">finalizeUpload</code> returns <code className="rounded bg-white/10 px-1">accessUrl</code> — store it on your own
        models (the kit does not persist app data beyond calling your API).
      </p>
      <CodeBlock
        code={`import { MediaUploaderKit } from "@/components/ui/kits/media-uploader";

export function UploadPage() {
  return (
    <MediaUploaderKit
      presign={async (file) => {
        const res = await fetch("/api/media-uploader/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            mimeType: file.type || "application/octet-stream",
            sizeBytes: file.size,
          }),
        });
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      }}
      finalizeUpload={async (payload) => {
        const res = await fetch("/api/media-uploader/finalize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        return res.json();
      }}
      uploadConcurrency={3}
      onUploadSuccess={(_, r) => console.log("URL:", r.accessUrl)}
    />
  );
}`}
        language="tsx"
        className="text-xs"
      />

      <KitDocStepHeading step={4}>Props reference</KitDocStepHeading>
      <div className="overflow-x-auto rounded-xl border border-white/10 text-sm">
        <table className="w-full border-collapse text-white/80">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="py-2 px-3 font-medium text-white/90">Prop</th>
              <th className="py-2 px-3 font-medium text-white/90">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-mono text-brand-secondary">presign</td>
              <td className="py-2 px-3">Returns <code className="rounded bg-white/10 px-1">uploadSessionId</code> + <code className="rounded bg-white/10 px-1">upload</code> instruction from your API.</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-mono text-brand-secondary">finalizeUpload</td>
              <td className="py-2 px-3">
                Called after storage upload succeeds or fails. Success response must include <code className="rounded bg-white/10 px-1">accessUrl</code>.
              </td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-mono text-brand-secondary">uploadConcurrency</td>
              <td className="py-2 px-3">Parallel uploads (default 3). Use <code className="rounded bg-white/10 px-1">1</code> for sequential.</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-mono text-brand-secondary">simulateTransport</td>
              <td className="py-2 px-3">Docs-only: skips real HTTP upload to storage (used on this site&apos;s demo).</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-mono text-brand-secondary">requireConfirm</td>
              <td className="py-2 px-3">Default <code className="rounded bg-white/10 px-1">true</code> — user confirms before upload starts.</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-mono text-brand-secondary">maxSizeBytes / warnSizeBytes</td>
              <td className="py-2 px-3">Hard cap vs warning threshold for file size UI.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <KitDocStepHeading step={5}>Integration with backend</KitDocStepHeading>
      <p className="text-white/80 text-sm leading-relaxed">
        Flow: <strong className="text-white/90">presign</strong> creates a pending audit row and returns a direct upload instruction → browser uploads bytes to the cloud →{" "}
        <strong className="text-white/90">finalize</strong> marks the audit completed or failed and returns <code className="rounded bg-white/10 px-1">accessUrl</code> only on success.
      </p>
      <KitIntegrationDisclaimer />
      <KitFeBeConnectionGuide
        kitTitle="Media Uploader"
        apiControllerPath="media-uploader"
        withDisclaimer={false}
      />

      <KitDocStepHeading step={6}>Third-party integrations</KitDocStepHeading>
      <p className="text-white/60 text-sm">Object storage is configured on the API side (S3, Azure, GCS, Cloudinary, Dropbox). See the API tab for env vars and CORS.</p>

      <KitDocStepHeading step={7}>shadcn/ui primitives</KitDocStepHeading>
      <div className="overflow-x-auto rounded-xl border border-white/10 text-sm">
        <table className="w-full border-collapse text-white/80">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="py-2 px-3 font-medium text-white/90">Primitive</th>
              <th className="py-2 px-3 font-medium text-white/90">Usage</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="py-2 px-3">Button, Card, Progress</td>
              <td className="py-2 px-3">Layout, confirm, progress bars</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 px-3">ScrollArea, Badge</td>
              <td className="py-2 px-3">File list, extension labels</td>
            </tr>
          </tbody>
        </table>
      </div>

      <KitDocStepHeading step={8}>Additional</KitDocStepHeading>
      <ul className="list-disc pl-5 text-sm text-white/80 space-y-2">
        <li>
          Use <code className="rounded bg-white/10 px-1">uploadToDirectStorage</code> from the kit if you build a custom flow; it supports{" "}
          <code className="rounded bg-white/10 px-1">http-put</code> and <code className="rounded bg-white/10 px-1">post-multipart</code> instructions.
        </li>
        <li>Cloudinary adapter on the API only allows image/* and video/* MIME types.</li>
      </ul>
    </div>
  )
}
