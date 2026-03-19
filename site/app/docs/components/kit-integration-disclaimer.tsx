"use client"

import { DocCallout } from "./doc-blocks"

/**
 * Shown before step-by-step integration, env vars, or proxy/rewrite examples.
 */
export function KitIntegrationDisclaimer() {
  return (
    <DocCallout variant="info" title="You own the wiring">
      <p className="text-sm text-white/80 leading-relaxed">
        The step-by-step guides, environment variables, and dev-server proxy or rewrite examples are suggestions—not a mandated
        layout. You should read the generated files, your existing routes and auth, and your deployment topology, then choose
        URLs, origins, and headers that match your app. We encourage verifying every connection yourself before shipping.
      </p>
    </DocCallout>
  )
}
