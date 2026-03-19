"use client"

import * as React from "react"
import { useStack } from "./stack-context"
import type { Framework, Orm } from "./stack-context"
import { CodeBlock } from "./code-block"
export interface CodeVariant {
  framework: Framework
  orm?: Orm
  code: string
  label?: string
  language?: string
  filename?: string
}

export interface CodeForStackProps {
  variants: CodeVariant[]
  fallback?: string
  className?: string
}

/**
 * Renders the code block that matches the current stack selection.
 * Variants can specify framework and optionally orm.
 */
export function CodeForStack({
  variants,
  fallback,
  className,
}: CodeForStackProps) {
  const { stack } = useStack()

  const match = variants.find(
    (v) =>
      v.framework === stack.framework &&
      (v.orm === undefined || v.orm === stack.orm)
  )

  const code = match?.code ?? fallback ?? variants[0]?.code ?? ""
  const language = match?.language ?? "typescript"
  const filename = match?.filename
  const label = match?.label

  return (
    <div className={className}>
      <CodeBlock
        code={code}
        language={language}
        filename={filename}
        label={label}
      />
    </div>
  )
}

export interface CodeForStackBlockProps {
  expressTypeorm?: string
  expressPrisma?: string
  nestjsTypeorm?: string
  nestjsPrisma?: string
  language?: string
  filename?: string
  className?: string
}

/**
 * Convenience component for the common 4-variant pattern (Express/NestJS x TypeORM/Prisma).
 */
export function CodeForStackBlock({
  expressTypeorm,
  expressPrisma,
  nestjsTypeorm,
  nestjsPrisma,
  language = "typescript",
  filename,
  className,
}: CodeForStackBlockProps) {
  const variants: CodeVariant[] = []
  if (expressTypeorm) variants.push({ framework: "express", orm: "typeorm", code: expressTypeorm, language, filename })
  if (expressPrisma) variants.push({ framework: "express", orm: "prisma", code: expressPrisma, language, filename })
  if (nestjsTypeorm) variants.push({ framework: "nestjs", orm: "typeorm", code: nestjsTypeorm, language, filename })
  if (nestjsPrisma) variants.push({ framework: "nestjs", orm: "prisma", code: nestjsPrisma, language, filename })

  return <CodeForStack variants={variants} className={className} />
}
