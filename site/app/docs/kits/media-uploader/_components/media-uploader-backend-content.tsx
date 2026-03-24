"use client"

import { CodeBlock } from "../../../components/code-block"
import { KitDocStepHeading } from "../../../components/kit-doc-step-heading"
import { KitApiFeBePlaybook } from "../../../components/kit-api-fe-be-playbook"
import { DocCallout } from "../../../components/doc-blocks"
import { useStack } from "../../../components/stack-context"
import type { StorageProvider } from "../../../components/stack-context"

function CorsSection({ provider }: { provider: StorageProvider }) {
  if (provider === "s3") {
    return (
      <div className="space-y-3 text-sm text-white/80">
        <p>
          In the S3 console: <strong className="text-white/90">Bucket → Permissions → Cross-origin resource sharing (CORS)</strong>.
          Allow <code className="rounded bg-white/10 px-1">PUT</code> (and optionally <code className="rounded bg-white/10 px-1">GET</code> for reads) from your web
          origin. Example configuration:
        </p>
        <CodeBlock
          code={`[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedOrigins": ["https://your-app.example", "http://localhost:3000"],
    "ExposeHeaders": ["ETag"]
  }
]`}
          language="json"
          className="text-xs"
        />
        <p className="text-white/60 text-xs">
          If you use signed GET URLs for <code className="rounded bg-white/10 px-1">accessUrl</code>, callers may not need public bucket ACLs; keep buckets private and rely on presigned URLs.
        </p>
      </div>
    )
  }

  if (provider === "azure-blob") {
    return (
      <div className="space-y-3 text-sm text-white/80">
        <p>
          In Azure Portal: <strong className="text-white/90">Storage account → Settings → Resource sharing (CORS)</strong> for Blob service. Allow your origin,
          methods <code className="rounded bg-white/10 px-1">PUT</code>, <code className="rounded bg-white/10 px-1">GET</code>, <code className="rounded bg-white/10 px-1">HEAD</code>, and required headers
          (e.g. <code className="rounded bg-white/10 px-1">x-ms-blob-type</code>, <code className="rounded bg-white/10 px-1">Content-Type</code>).
        </p>
      </div>
    )
  }

  if (provider === "gcs") {
    return (
      <div className="space-y-3 text-sm text-white/80">
        <p>
          Create or update a CORS JSON on the bucket (gsutil or Cloud Console). Allow your origin and methods{" "}
          <code className="rounded bg-white/10 px-1">PUT</code>, <code className="rounded bg-white/10 px-1">GET</code>, <code className="rounded bg-white/10 px-1">HEAD</code>.
        </p>
        <CodeBlock
          code={`[
  {
    "origin": ["https://your-app.example", "http://localhost:3000"],
    "method": ["PUT", "GET", "HEAD"],
    "responseHeader": ["Content-Type", "x-goog-resumable"],
    "maxAgeSeconds": 3600
  }
]`}
          language="json"
          className="text-xs"
        />
      </div>
    )
  }

  if (provider === "cloudinary") {
    return (
      <div className="space-y-3 text-sm text-white/80">
        <p>
          Browser uploads go to <code className="rounded bg-white/10 px-1">api.cloudinary.com</code>; configure CORS on your Cloudinary upload preset and allowed
          client-side upload settings in the Cloudinary console. This kit&apos;s API adapter only permits <strong className="text-white/90">image/*</strong> and{" "}
          <strong className="text-white/90">video/*</strong> MIME types.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3 text-sm text-white/80">
      <p>
        Dropbox uploads use <code className="rounded bg-white/10 px-1">content.dropboxapi.com</code>. Ensure your Dropbox app has the correct permissions and follow Dropbox
        OAuth guidance for production; the scaffold uses <code className="rounded bg-white/10 px-1">DROPBOX_ACCESS_TOKEN</code> for development only.
      </p>
    </div>
  )
}

export function MediaUploaderBackendContent() {
  const { stack } = useStack()
  const provider = stack.storageProvider ?? "s3"
  const fw = stack.framework === "nestjs" ? "nestjs" : "express"

  return (
    <div className="space-y-10">
      <KitDocStepHeading step={1}>Installation / scaffold</KitDocStepHeading>
      <CodeBlock
        code={`npx @fivfold/api add media-uploader --framework=${fw} --orm=typeorm --provider=${provider}

# Other providers: s3 | azure-blob | gcs | cloudinary | dropbox
npx @fivfold/api add media-uploader --yes --provider=s3 --dry-run`}
        language="bash"
        className="text-xs"
      />

      <KitDocStepHeading step={2}>Generated file structure</KitDocStepHeading>
      <CodeBlock
        code={`src/modules/media-uploader/
├── domain/               # ports + DTOs
├── dto/
├── entities/             # TypeORM audit entity (audit only)
├── adapters/             # storage provider adapter
├── media-uploader.controller.ts
├── media-uploader.service.ts
└── media-uploader.module.ts`}
        language="text"
        className="text-xs"
      />

      <KitDocStepHeading step={3}>Wire into the app</KitDocStepHeading>
      <p className="text-white/80 text-sm">
        NestJS: <code className="rounded bg-white/10 px-1">MediaUploaderModule</code> is registered via AST when <code className="rounded bg-white/10 px-1">src/app.module.ts</code> exists. Express: mount{" "}
        <code className="rounded bg-white/10 px-1">createMediaUploaderRouter(createMediaUploaderMediaUploadService(dataSource))</code> at{" "}
        <code className="rounded bg-white/10 px-1">/api/media-uploader</code> (adjust in <code className="rounded bg-white/10 px-1">app.ts</code>).
      </p>

      <KitDocStepHeading step={4}>API reference</KitDocStepHeading>
      <div className="overflow-x-auto rounded-xl border border-white/10 text-sm">
        <table className="w-full border-collapse text-white/80">
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="py-2 px-3 font-medium text-white/90">Method</th>
              <th className="py-2 px-3 font-medium text-white/90">Path</th>
              <th className="py-2 px-3 font-medium text-white/90">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-mono">POST</td>
              <td className="py-2 px-3 font-mono text-brand-secondary">/media-uploader/presign</td>
              <td className="py-2 px-3">Creates pending audit row; returns <code className="rounded bg-white/10 px-1">uploadSessionId</code> + direct upload instruction.</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="py-2 px-3 font-mono">POST</td>
              <td className="py-2 px-3 font-mono text-brand-secondary">/media-uploader/finalize</td>
              <td className="py-2 px-3">
                Body: <code className="rounded bg-white/10 px-1">uploadSessionId</code>, <code className="rounded bg-white/10 px-1">outcome</code>{" "}
                <code className="rounded bg-white/10 px-1">success|failure</code>. Success → updates audit to completed, sets <code className="rounded bg-white/10 px-1">uploadedAt</code>, returns{" "}
                <code className="rounded bg-white/10 px-1">accessUrl</code>. Failure → sets <code className="rounded bg-white/10 px-1">failedAt</code> and reason; no <code className="rounded bg-white/10 px-1">accessUrl</code>.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <DocCallout variant="info" title="Database is audit-only">
        <p className="text-sm">
          The generated ORM models store metadata and <code className="rounded bg-white/10 px-1">accessUrl</code> for traceability only. File bytes never pass through your API body and are not stored in the database.
          Use <code className="rounded bg-white/10 px-1">accessUrl</code> in your own domain entities as needed.
        </p>
      </DocCallout>

      <KitDocStepHeading step={5}>Integration with frontend</KitDocStepHeading>
      <KitApiFeBePlaybook
        kitTitle="Media Uploader"
        apiControllerPath="media-uploader"
        withDisclaimer={false}
      />

      <KitDocStepHeading step={6}>Third-party</KitDocStepHeading>
      <p className="text-white/80 text-sm">
        Provider SDKs are listed in the scaffolded adapter. Set env vars from the kit manifest (e.g. <code className="rounded bg-white/10 px-1">AWS_S3_BUCKET</code>,{" "}
        <code className="rounded bg-white/10 px-1">GCS_BUCKET</code>, <code className="rounded bg-white/10 px-1">CLOUDINARY_*</code>, etc.).
      </p>

      <KitDocStepHeading step={7}>CORS & access (selected storage)</KitDocStepHeading>
      <p className="text-white/60 text-xs mb-2">
        Stack sidebar storage: <strong className="text-white/80">{provider}</strong>
      </p>
      <CorsSection provider={provider} />

      <KitDocStepHeading step={8}>Additional</KitDocStepHeading>
      <ul className="list-disc pl-5 text-sm text-white/80 space-y-2">
        <li>Run migrations for <code className="rounded bg-white/10 px-1">media_uploader_upload_audits</code> (or your ORM equivalent).</li>
        <li>Protect both routes with your auth guard / middleware so users can only finalize their own sessions.</li>
      </ul>
    </div>
  )
}
