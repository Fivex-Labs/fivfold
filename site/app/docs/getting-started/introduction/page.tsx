import type { Metadata } from "next";
import { DocPage } from "../../components/doc-page";
import {
  DocCard,
  DocCallout,
  DocLinkCard,
} from "../../components/doc-blocks";
import { Layers, Server, Cpu, Sparkles, Terminal, BotIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Introduction",
  description:
    "FivFold overview, architecture, and Kits. Drop in complete, production-ready features in minutes with shadcn/ui and optional backend scaffolding.",
  openGraph: {
    title: "Introduction | FivFold",
    description:
      "FivFold overview, architecture, and Kits. Drop in complete, production-ready features in minutes with shadcn/ui and optional backend scaffolding.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Introduction | FivFold",
    description:
      "FivFold overview, architecture, and Kits. Drop in complete, production-ready features in minutes with shadcn/ui and optional backend scaffolding.",
  },
  alternates: {
    canonical: "https://fivfold.fivexlabs.com/docs/getting-started/introduction",
  },
};

const headings = [
  { id: "what-is-fivfold", text: "What is FivFold?", level: 2 },
  { id: "key-features", text: "Key features", level: 2 },
  { id: "architecture", text: "Architecture", level: 2 },
  { id: "next-steps", text: "Next steps", level: 2 },
];

export default function IntroductionPage() {
  return (
    <DocPage
      title="Introduction"
      description="FivFold is a full-stack Kit platform. Drop in complete, production-ready features in minutes."
      headings={headings}
    >
      <h2 id="what-is-fivfold" className="font-semibold text-2xl">What is FivFold?</h2>
      <p className="text-white/80 leading-relaxed mb-6 mt-2">
        FivFold provides pre-built, opinionated full-stack features called Kits. Each Kit includes a polished
        frontend built on{" "}
        <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline">
          shadcn/ui
        </a>{" "}
        and optional backend scaffolding for your chosen framework and database layer. You own the code as everything
        is copied into your project, not installed as a black-box dependency.
      </p>

      <DocCallout className="mb-8" icon={Sparkles} title="Why Kits?" variant="info">
        <p>
          Instead of building common features from scratch or stitching together disparate libraries, Kits give you
          complete, cohesive implementations. They follow best practices, use your existing design system, and integrate
          seamlessly with your stack.
        </p>
      </DocCallout>

      <h2 id="key-features" className="font-semibold text-2xl">Key features</h2>
      <div className="grid sm:grid-cols-2 gap-4 mt-4 mb-8">
        <DocCard
          icon={Layers}
          title="Frontend Kits"
          description="Complete UI modules built exclusively with shadcn/ui components. Fully responsive, accessible, and CSS variable-based for easy theming. Each Kit is a single import away."
          color="primary"
        />
        <DocCard
          icon={Server}
          title="Backend scaffolding"
          description="Entities, DTOs, services, and controllers for your chosen framework and database layer. Type-safe, validated, and ready to wire into your stack. Includes integration READMEs."
          color="secondary"
        />
        <DocCard
          icon={Cpu}
          title="Core engine"
          description="Shared @fivfold/core powers both CLIs. VFS, manifests, Strategy Pattern, AST engine. No combinatorial explosion—extensible by design."
          color="accent"
        />
        <DocCard
          icon={BotIcon}
          title="AI-ready"
          description="Generate AGENTS.md at project root with your FivFold setup, conventions, and installed Kits. Gives AI coding assistants full context for better suggestions."
          color="green"
        />
      </div>

      <h2 id="architecture" className="font-semibold text-2xl">Architecture</h2>
      <p className="text-white/80 leading-relaxed mb-4 mt-2">
        Each Kit is documented as a single unit: <strong>UI</strong> (every component and element) and <strong>API</strong> (backend scaffolding with platform options).
        The docs are organized by Kit—each with tabs for UI details and API platform choices.
      </p>
      <p className="text-white/80 leading-relaxed mb-4">
        FivFold uses two CLIs: <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">@fivfold/ui</code> for frontend
        Kits and <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">@fivfold/api</code> for backend modules. Both read from a shared{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">fivfold.json</code> config.
      </p>

      <DocCallout title="Tailwind v4 only" variant="warning">
        <p>
          FivFold targets Tailwind CSS v4 exclusively. Use <code>@import "tailwindcss"</code> in your CSS. No{" "}
          <code>tailwind.config.js</code> is required for FivFold themes.
        </p>
      </DocCallout>

      <h2 id="next-steps" className="font-semibold text-2xl mt-8">Next steps</h2>
      <p className="text-white/80 leading-relaxed mb-6">
        Get started by installing FivFold in your project, then explore the CLI commands.
      </p>
      <div className="grid sm:grid-cols-3 gap-4">
        <DocLinkCard
          href="/docs/getting-started/installation"
          icon={Layers}
          title="Installation"
          description="Add FivFold UI and API to your project"
        />
        <DocLinkCard
          href="/docs/getting-started/cli"
          icon={Terminal}
          title="CLI Reference"
          description="All commands and options"
        />
        <DocLinkCard
          href="/docs/getting-started/how-it-works"
          icon={Cpu}
          title="How it works"
          description="Architecture, pipeline, VFS, and plugins"
        />
      </div>
    </DocPage>
  );
}
