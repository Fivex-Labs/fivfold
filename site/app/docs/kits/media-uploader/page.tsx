"use client"

import { DocPage } from "../../components/doc-page"
import { DocTabs } from "../../components/doc-tabs"
import { CodeBlock } from "../../components/code-block"
import { MediaUploaderDemo } from "./_components/media-uploader-demo"
import { MediaUploaderUiContent } from "./_components/media-uploader-ui-content"
import { MediaUploaderBackendContent } from "./_components/media-uploader-backend-content"

const headings = [
  { id: "quick-reference", text: "Quick reference", level: 2 },
  { id: "overview", text: "Overview", level: 2 },
  { id: "demo", text: "Demo", level: 2 },
  { id: "guide", text: "Guide", level: 2 },
]

export default function MediaUploaderKitPage() {
  return (
    <DocPage
      title="Media Uploader Kit"
      description="Presigned direct uploads, finalize + accessUrl, and audit-only ORM rows. UI kit + API adapters for S3, Azure Blob, GCS, Cloudinary (images/videos), and Dropbox."
      headings={headings}
      stackConfig={{
        showDatabaseFields: true,
        showFrontendBundler: true,
        showStorageProvider: true,
      }}
    >
      <h2 id="quick-reference" className="scroll-mt-24 font-semibold text-2xl pt-2">
        Quick reference
      </h2>
      <div className="rounded-xl border border-white/10 bg-black/20 p-4 mb-12 mt-4 max-w-2xl">
        <h4 className="font-medium text-white mb-3">CLI commands</h4>
        <CodeBlock
          code={`# UI
npx @fivfold/ui add media-uploader

# API (pick storage provider)
npx @fivfold/api add media-uploader --framework=nestjs --orm=typeorm --provider=s3

npx @fivfold/ui add media-uploader --dry-run
npx @fivfold/api add media-uploader --dry-run --provider=azure-blob`}
          language="bash"
          className="text-xs"
        />
      </div>

      <h2 id="overview" className="scroll-mt-24 font-semibold text-2xl pt-2">
        Overview
      </h2>
      <p className="text-white/80 leading-relaxed mb-4 mt-4">
        The Media Uploader kit follows the standard three-step flow: your backend issues a{" "}
        <strong className="text-white/90">presign</strong> response and records a <strong className="text-white/90">pending</strong> audit row; the browser uploads
        bytes directly to object storage; then the client calls <strong className="text-white/90">finalize</strong> so the API can set{" "}
        <code className="rounded bg-white/10 px-1">completed</code> or <code className="rounded bg-white/10 px-1">failed</code> with timestamps and return{" "}
        <code className="rounded bg-white/10 px-1">accessUrl</code> only when the storage upload succeeded.
      </p>

      <h2 id="demo" className="scroll-mt-24 font-semibold text-2xl mt-8 pt-4">
        Demo
      </h2>
      <p className="text-white/60 text-sm mt-1 italic pb-8">
        Interactive preview: simulated presign/finalize; transport uses simulateTransport — no real cloud upload.
      </p>
      <MediaUploaderDemo />

      <h2 id="guide" className="scroll-mt-24 font-semibold text-2xl mt-12 pt-4">
        Guide
      </h2>
      <p className="text-white/80 leading-relaxed mb-6 mt-4 text-sm">
        Choose <strong className="text-white/90">Frontend</strong> and <strong className="text-white/90">Storage</strong> in the sidebar for matching connection and CORS notes.
      </p>
      <DocTabs
        tabs={[
          {
            id: "ui",
            label: "UI",
            icon: "layout",
            content: <MediaUploaderUiContent />,
          },
          {
            id: "api",
            label: "API",
            icon: "server",
            content: <MediaUploaderBackendContent />,
          },
        ]}
      />
    </DocPage>
  )
}
