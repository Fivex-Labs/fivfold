"use client";

import Link from "next/link";
import { useStack } from "./stack-context";
import { CodeBlock } from "./code-block";
import { DocCallout } from "./doc-blocks";
import { KitIntegrationDisclaimer } from "./kit-integration-disclaimer";

export interface KitFeBeConnectionGuideProps {
  /** Human-readable kit name for prose */
  kitTitle: string;
  /** Nest/Express controller path segment, e.g. `email` → `/email/...` on the API host */
  apiControllerPath: string;
  /** Example extra note (e.g. Chat Socket.IO) */
  realtimeNote?: string;
  /** Set false if the parent already rendered `KitIntegrationDisclaimer`. */
  withDisclaimer?: boolean;
}

/**
 * Generic “how UI talks to API” section for kit docs, driven by the stack **Frontend** selection.
 */
export function KitFeBeConnectionGuide({
  kitTitle,
  apiControllerPath,
  realtimeNote,
  withDisclaimer = true,
}: KitFeBeConnectionGuideProps) {
  const { stack } = useStack();
  const fe = stack.frontend;
  const devOrigin = fe === "nextjs" ? "http://localhost:3000" : "http://localhost:5173";
  const apiExample = `https://api.example.com/${apiControllerPath}`;

  return (
    <div className="space-y-6 rounded-xl border border-white/10 bg-black/15 p-5">
      {withDisclaimer && <KitIntegrationDisclaimer />}

      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Step-by-step: {kitTitle} UI → API</h3>
        <p className="text-white/65 text-sm leading-relaxed">
          Examples match the <strong className="text-white/85">Frontend</strong> choice in the stack sidebar (
          <strong className="text-white/85">{fe === "nextjs" ? "Next.js" : "Vite"}</strong>). Your mount paths may differ;
          adjust prefixes to match how you register routes and proxies.
        </p>
        {kitTitle !== "Chat" && (
          <p className="text-white/55 text-xs mt-3">
            <strong className="text-white/70">Chat kit:</strong> follow the ordered{" "}
            <Link
              href="/docs/kits/chat#fullstack-checklist"
              className="text-brand-primary underline-offset-2 hover:underline"
            >
              full-stack checklist
            </Link>{" "}
            for dev user middleware, <code className="rounded bg-white/10 px-1">/socket.io</code> proxying, headers, and the integration host.
          </p>
        )}
      </div>

      {fe === "nextjs" ? (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white/90">Next.js → API</h4>
          <p className="text-white/60 text-sm">
            Prefer <strong className="text-white/80">rewrites</strong> in <code className="rounded bg-white/10 px-1">next.config.ts</code> so browser code can use same-origin paths like{" "}
            <code className="rounded bg-white/10 px-1">/api/{apiControllerPath}/...</code> while the dev server forwards to your backend. Alternatively set{" "}
            <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_API_URL</code> and call that base from client code.
          </p>
          <CodeBlock
            code={`// next.config.ts — example rewrite to API on another port
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*', // your Nest/Express port
      },
    ];
  },
};

export default nextConfig;`}
            language="ts"
            filename="next.config.ts"
          />
          <p className="text-white/50 text-xs">
            If the app and API both use port 3000, run the API on a different port (e.g. 3001) or use a monorepo BFF pattern.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-white/90">Vite → API</h4>
          <p className="text-white/60 text-sm">
            In development, configure <code className="rounded bg-white/10 px-1">server.proxy</code> in{" "}
            <code className="rounded bg-white/10 px-1">vite.config.ts</code> so the browser uses relative URLs. Exact targets and path rewrites depend on how you mount the kit on the server.
          </p>
          <CodeBlock
            code={`// vite.config.ts — example only; tune target + rewrite to your API
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\\/api/, ''),
      },
    },
  },
});`}
            language="ts"
            filename="vite.config.ts"
          />
        </div>
      )}

      <div>
        <h4 className="text-sm font-semibold text-white/90">API → browser (CORS)</h4>
        <p className="text-white/60 text-sm mb-2">
          Allow your UI&apos;s dev origin on the API. For <strong className="text-white/80">{fe === "nextjs" ? "Next.js" : "Vite"}</strong> that is typically{" "}
          <code className="rounded bg-white/10 px-1">{devOrigin}</code> (plus <code className="rounded bg-white/10 px-1">127.0.0.1</code> if you use it).
        </p>
        <DocCallout variant="tip" title="Production">
          Use your real API base (e.g. <code className="rounded bg-white/10 px-1">{apiExample}</code>) and lock CORS to known web origins — not <code className="rounded bg-white/10 px-1">*</code>.
        </DocCallout>
      </div>

      {realtimeNote && (
        <p className="text-white/55 text-sm border-t border-white/10 pt-4">
          <strong className="text-white/75">Realtime:</strong> {realtimeNote}
        </p>
      )}
    </div>
  );
}
