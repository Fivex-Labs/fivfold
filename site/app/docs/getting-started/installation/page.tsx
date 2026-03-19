import type { Metadata } from "next";
import Link from "next/link";
import { DocPage } from "../../components/doc-page";
import {
  DocStep,
  DocCodeBlock,
  DocCallout,
  DocCard,
} from "../../components/doc-blocks";
import { Package, Terminal, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Installation",
  description:
    "Add @fivfold/ui and @fivfold/api to your React or Next.js project. Prerequisites, init, add commands, and verification.",
  openGraph: {
    title: "Installation | FivFold",
    description:
      "Add @fivfold/ui and @fivfold/api to your React or Next.js project. Prerequisites, init, add commands, and verification.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Installation | FivFold",
    description:
      "Add @fivfold/ui and @fivfold/api to your React or Next.js project. Prerequisites, init, add commands, and verification.",
  },
  alternates: {
    canonical: "https://fivfold.fivexlabs.com/docs/getting-started/installation",
  },
};

const headings = [
  { id: "prerequisites", text: "Prerequisites", level: 2 },
  { id: "ui-package", text: "UI package", level: 2 },
  { id: "api-package", text: "API package", level: 2 },
  { id: "connecting-ui-and-api", text: "Connecting UI and API", level: 2 },
  { id: "verification", text: "Verification", level: 2 },
];

export default function InstallationPage() {
  return (
    <DocPage
      title="Installation"
      description="Add FivFold to your React or Next.js project. Two packages: UI for frontend Kits, API for backend scaffolding."
      headings={headings}
    >
      <h2 id="prerequisites" className="font-semibold text-2xl">Prerequisites</h2>
      <p className="text-white/80 leading-relaxed mb-6">
        Before installing FivFold, ensure your project meets these requirements:
      </p>
      <div className="space-y-4 mb-8">
        <DocStep step={1} icon={Package} title="Node.js 20 or later" color="primary">
          FivFold requires a modern Node.js runtime. Check with <code className="rounded bg-white/10 px-1 py-0.5 text-brand-secondary">node -v</code>.
        </DocStep>
        <DocStep step={2} icon={Package} title="React 18+ or Next.js project" color="primary">
          FivFold UI targets React 18 and above. Next.js 14+ with App Router is fully supported.
        </DocStep>
        <DocStep step={3} icon={Package} title="Tailwind CSS v4" color="primary">
          Add <code className="rounded bg-white/10 px-1 py-0.5 text-brand-secondary">@import "tailwindcss"</code> to your global CSS. No config file needed for FivFold themes.
        </DocStep>
        <DocStep step={4} icon={Package} title="shadcn/ui" color="primary">
          Initialize shadcn/ui first with <code className="rounded bg-white/10 px-1 py-0.5 text-brand-secondary">npx shadcn@latest init</code>. FivFold Kits are built on shadcn primitives.
        </DocStep>
      </div>

      <h2 id="ui-package" className="font-semibold text-2xl">UI package</h2>
      <p className="text-white/80 leading-relaxed mb-4 mt-2">
        The FivFold UI CLI adds frontend Kits to your project. Run <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">init</code> first to configure FivFold and set up themes.
      </p>
      <DocCodeBlock command="npx @fivfold/ui init" label="Initialize FivFold" className="mb-4" />
      <p className="text-white/80 leading-relaxed mb-6">
        The init command detects existing shadcn/ui, prompts for theme preferences, creates <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">fivfold.json</code>, and configures your global CSS. Then add Kits with:
      </p>
      <DocCodeBlock command="npx @fivfold/ui add <kit-name>" label="Add an Kit" className="mb-6" />
      <DocCallout icon={CheckCircle2} title="What add does" variant="info">
        <p>
          The add command installs npm dependencies, runs <code>npx shadcn@latest add</code> for required primitives, copies the Kit template to your configured kits path, and applies theme variables if needed.
        </p>
      </DocCallout>

      <h2 id="api-package" className="font-semibold text-2xl mt-8">API package</h2>
      <p className="text-white/80 leading-relaxed mb-4 mt-2">
        For backend scaffolding, use the FivFold API CLI. Initialize with your preferred stack:
      </p>
      <DocCodeBlock command="npx @fivfold/api init" label="Configure backend stack" className="mb-4" />
      <p className="text-white/80 leading-relaxed mb-4">
        You will be prompted for framework, ORM, database, and output directory. Configuration is saved to <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">fivfold.json</code>. Use flags to skip prompts:
      </p>
      <ul className="text-white/80 text-sm space-y-1 mb-4 list-disc list-inside">
        <li><code className="rounded bg-white/10 px-1 py-0.5">--yes</code> / <code className="rounded bg-white/10 px-1 py-0.5">-y</code> — Use smart defaults, bypass all prompts</li>
        <li><code className="rounded bg-white/10 px-1 py-0.5">--dry-run</code> — Show intended changes without writing files</li>
        <li><code className="rounded bg-white/10 px-1 py-0.5">--framework=...</code> — Framework choice</li>
        <li><code className="rounded bg-white/10 px-1 py-0.5">--orm=...</code> — ORM choice</li>
        <li><code className="rounded bg-white/10 px-1 py-0.5">--provider=...</code> — Auth provider (when applicable)</li>
      </ul>
      <DocCodeBlock command="npx @fivfold/api add <module-name>" label="Add an API module" className="mb-6" />
      <DocCallout title="Shared config" variant="tip">
        <p>
          Both UI and API CLIs read from the same <code>fivfold.json</code>. Run <code>@fivfold/ui init</code> first if you use both; the API init will merge its config into the existing file in a monorepo setup.
        </p>
      </DocCallout>

      <h2 id="connecting-ui-and-api" className="mt-10 font-semibold text-2xl scroll-mt-24">
        Connecting UI and API
      </h2>
      <p className="text-white/80 leading-relaxed mb-4 mt-2">
        Kits ship as source in your repo. Browser code typically calls same-origin paths (e.g. <code className="rounded bg-white/10 px-1 py-0.5 text-brand-secondary">/api/…</code>) that your dev server proxies to the backend, and you enable CORS on the API for your web origin. Realtime (e.g. Socket.IO) needs the same treatment: proxy WebSocket upgrades or point the client at the API host.
      </p>
      <DocCallout title="Chat kit" variant="info">
        <p>
          For <strong>Chat</strong>, use the ordered checklist in{" "}
          <Link
            href="/docs/kits/chat#fullstack-checklist"
            className="text-brand-primary underline-offset-2 hover:underline"
          >
            Chat → Full-stack integration
          </Link>{" "}
          (dev user middleware, <code>Vite</code> <code>/socket.io</code> proxy, <code>X-User-Id</code>, integration host). The generic patterns on this page apply to other kits too.
        </p>
      </DocCallout>

      <h2 id="verification" className="mt-6 font-semibold text-2xl">Verification</h2>
      <p className="text-white/80 leading-relaxed mb-4 mt-2">
        Run the setup command to verify your environment:
      </p>
      <DocCodeBlock command="npx @fivfold/ui setup" label="Check requirements" />
      <p className="text-white/80 leading-relaxed mt-4">
        This reports whether shadcn/ui and fivfold.json are present, and prints quick-start commands.
      </p>
    </DocPage>
  );
}
