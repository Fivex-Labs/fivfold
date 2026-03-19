"use client";

import { useState, useCallback } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Terminal, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";

const LANGUAGE_LABELS: Record<string, string> = {
  bash: "Bash",
  sh: "Shell",
  typescript: "TypeScript",
  ts: "TypeScript",
  tsx: "TSX",
  javascript: "JavaScript",
  js: "JavaScript",
  jsx: "JSX",
  json: "JSON",
  yaml: "YAML",
  yml: "YAML",
  sql: "SQL",
  html: "HTML",
  css: "CSS",
  scss: "SCSS",
  text: "Plain Text",
};

export interface CodeBlockProps {
  /** Raw code content */
  code: string;
  /** Prism language alias (e.g. typescript, bash, json) */
  language?: string;
  /** Optional filename to show in header (e.g. app.module.ts) */
  filename?: string;
  /** Optional custom label (overrides language-based label) */
  label?: string;
  /** Show terminal icon instead of file icon for CLI-style blocks */
  showTerminalIcon?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = "text",
  filename,
  label,
  showTerminalIcon = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      setCopied(false);
    }
  }, [code]);

  const displayLabel =
    label ?? filename ?? LANGUAGE_LABELS[language] ?? language;

  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-[#1e1e1e] overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-white/10 bg-black/30">
        <div className="flex items-center gap-2 min-w-0">
          {showTerminalIcon ? (
            <Terminal size={14} className="text-brand-secondary shrink-0" />
          ) : (
            <FileCode size={14} className="text-brand-secondary shrink-0" />
          )}
          <span className="text-xs font-medium text-white/70 truncate">
            {displayLabel}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          aria-label={copied ? "Copied!" : "Copy code"}
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto [&>pre]:m-0! [&>pre]:rounded-none! [&>pre]:bg-transparent!">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: "1rem 1.25rem",
            fontSize: "0.8125rem",
            lineHeight: 1.6,
            background: "transparent",
          }}
          codeTagProps={{
            style: { fontFamily: "ui-monospace, monospace" },
          }}
          showLineNumbers={false}
          PreTag="div"
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
