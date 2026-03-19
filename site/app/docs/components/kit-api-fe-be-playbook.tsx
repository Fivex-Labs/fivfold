"use client"

import { useStack } from "./stack-context"
import { KitIntegrationDisclaimer } from "./kit-integration-disclaimer"

export interface KitApiFeBePlaybookProps {
  kitTitle: string
  /** Controller mount segment, e.g. `email` → `/api/email/...` */
  apiControllerPath: string
  /** When false, render only the numbered steps (parent already showed the disclaimer). */
  withDisclaimer?: boolean
  /**
   * Browser-focused CORS hints use the stack Frontend choice. For backend-only kits (e.g. Push),
   * set false and describe clients generically.
   */
  useStackFrontendForCors?: boolean
}

/**
 * API-tab checklist: how the backend meets the browser and the UI tab’s dev setup.
 */
export function KitApiFeBePlaybook({
  kitTitle,
  apiControllerPath,
  withDisclaimer = true,
  useStackFrontendForCors = true,
}: KitApiFeBePlaybookProps) {
  const { stack } = useStack()
  const isNext = stack.frontend === "nextjs"
  const devOrigin = isNext ? "http://localhost:3000" : "http://localhost:5173"
  const altOrigin = isNext ? "http://127.0.0.1:3000" : "http://127.0.0.1:5173"

  return (
    <div className="space-y-5 rounded-xl border border-white/10 bg-black/15 p-5">
      {withDisclaimer && <KitIntegrationDisclaimer />}

      <div>
        <h4 className="text-base font-semibold text-white mb-2">Step-by-step: API ↔ browser (and ↔ UI)</h4>
        <p className="text-white/60 text-sm mb-4">
          {useStackFrontendForCors ? (
            <>
              Follow these on the <strong className="text-white/80">API</strong> side together with the <strong className="text-white/80">UI</strong> tab.
              The stack <strong className="text-white/80">Frontend</strong> choice ({isNext ? "Next.js" : "Vite"}) should match what you configure in CORS when a browser loads your UI.
            </>
          ) : (
            <>
              This kit is <strong className="text-white/80">backend-only</strong>: mobile and desktop clients call your API directly. Browsers and PWAs still need correct CORS when they hit a different origin than the API.
            </>
          )}
        </p>
        <ol className="list-decimal list-inside space-y-3 text-sm text-white/75">
          <li>
            <strong className="text-white/85">Confirm routes</strong> — Ensure your Express app or Nest module exposes{" "}
            <code className="rounded bg-white/10 px-1">/api/{apiControllerPath}</code> (or your chosen prefix). If a web UI calls same-origin{" "}
            <code className="rounded bg-white/10 px-1">/api/...</code>, its dev server must forward to this API.
          </li>
          <li>
            <strong className="text-white/85">CORS &amp; clients</strong> —{" "}
            {useStackFrontendForCors ? (
              <>
                Allow your web app&apos;s dev origin:{" "}
                <code className="rounded bg-white/10 px-1">{devOrigin}</code> and{" "}
                <code className="rounded bg-white/10 px-1">{altOrigin}</code> (plus production origins). Enable{" "}
                <code className="rounded bg-white/10 px-1">credentials</code> if you use cookies.
              </>
            ) : (
              <>
                Native apps use HTTPS to your API (no CORS). For web or admin dashboards, allow the exact browser origins that will call{" "}
                <code className="rounded bg-white/10 px-1">/api/{apiControllerPath}</code> — not <code className="rounded bg-white/10 px-1">*</code> in production.
              </>
            )}
          </li>
          <li>
            <strong className="text-white/85">Auth context</strong> — Resolve the current user in middleware or guards and pass{" "}
            <code className="rounded bg-white/10 px-1">req.user.id</code> (or equivalent) into {kitTitle} services so list/create endpoints are scoped correctly.
          </li>
          <li>
            <strong className="text-white/85">Response shape</strong> — The kit UI expects specific prop shapes; map your entities in the client or add a thin BFF (see UI tab and the &quot;Connecting UI&quot; section below).
          </li>
        </ol>
      </div>
    </div>
  )
}
