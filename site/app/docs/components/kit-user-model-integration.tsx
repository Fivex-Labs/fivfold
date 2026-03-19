"use client"

import { DocCallout } from "./doc-blocks"

export interface KitUserModelIntegrationProps {
  kitTitle: string
  /** Short description of generated entities / user fields */
  summary: string
  bullets: string[]
}

/**
 * How scaffolded kit persistence lines up with an existing user / tenant model.
 */
export function KitUserModelIntegration({ kitTitle, summary, bullets }: KitUserModelIntegrationProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-5 space-y-3">
      <h4 className="text-base font-semibold text-white">
        Connecting {kitTitle} data to your user system
      </h4>
      <p className="text-white/70 text-sm leading-relaxed">{summary}</p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-white/75">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
      <DocCallout variant="tip" title="Inspect generated code">
        Open the scaffolded entities, schemas, or Prisma models for this kit and compare field names (
        <code className="rounded bg-white/10 px-1">userId</code>, <code className="rounded bg-white/10 px-1">ownerId</code>, etc.) to your{" "}
        <code className="rounded bg-white/10 px-1">User</code> table or IdP subject. Migrate or add FKs where needed—FivFold cannot know your prior schema.
      </DocCallout>
    </div>
  )
}
