import type { Metadata } from "next";
import { DocPage } from "../../components/doc-page";
import {
  DocCard,
  DocStep,
  DocCallout,
  DocLinkCard,
  DocCodeBlock,
} from "../../components/doc-blocks";
import { CodeBlock } from "../../components/code-block";
import { Package, Layers, Server, Cog, Box, FileCode, Cpu, Puzzle } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "FivFold CLI architecture: package structure, pipeline, manifests, Strategy Pattern, Virtual File System, AST engine, and plugin architecture.",
  openGraph: {
    title: "How it works | FivFold",
    description:
      "FivFold CLI architecture: package structure, pipeline, manifests, Strategy Pattern, Virtual File System, AST engine, and plugin architecture.",
  },
  twitter: {
    card: "summary_large_image",
    title: "How it works | FivFold",
    description:
      "FivFold CLI architecture: package structure, pipeline, manifests, Strategy Pattern, Virtual File System, AST engine, and plugin architecture.",
  },
  alternates: {
    canonical: "https://fivfold.fivexlabs.com/docs/getting-started/how-it-works",
  },
};

const headings = [
  { id: "package-structure", text: "Package structure", level: 2 },
  { id: "architecture", text: "Architecture", level: 2 },
  { id: "pipeline", text: "Pipeline", level: 2 },
  { id: "manifests", text: "Manifests", level: 2 },
  { id: "strategy-pattern", text: "Strategy Pattern", level: 2 },
  { id: "vfs", text: "Virtual File System", level: 2 },
  { id: "ast-engine", text: "AST Engine", level: 2 },
  { id: "plugin-architecture", text: "Plugin Architecture", level: 2 },
];

export default function HowItWorksPage() {
  return (
    <DocPage
      title="How it works"
      description="High-level architecture of the FivFold CLI engine: packages, detection, manifests, pipeline, VFS, AST, and plugins."
      headings={headings}
    >
      <h2 id="package-structure" className="font-semibold text-2xl scroll-mt-24">
        Package structure
      </h2>
      <p className="text-white/80 leading-relaxed mb-6 mt-2">
        FivFold is built as a monorepo with three main packages. The core engine is shared; the UI and API CLIs orchestrate it for their respective domains.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <DocCard
          icon={Cpu}
          title="@fivfold/core"
          description="Shared engine: VFS, StrategyPipeline, TemplateEngine, Manifests, TsMorphEngine, Detection, Workspace. Used by both CLIs. No framework or database specifics—fully agnostic."
          color="primary"
        />
        <DocCard
          icon={Layers}
          title="@fivfold/ui"
          description="init, add, list, agents, setup. Uses VFS + loadUiManifest for copy-based scaffolding. No StrategyPipeline—templates are copied directly into your project."
          color="secondary"
        />
        <DocCard
          icon={Server}
          title="@fivfold/api"
          description="init, add, list. Uses full pipeline (VFS + StrategyPipeline + TemplateEngine + manifests + AST) for manifest-based Kits. Legacy registry mode for older modules."
          color="accent"
        />
      </div>

      <h2 id="architecture" className="font-semibold text-2xl scroll-mt-24 mt-12">
        Architecture
      </h2>
      <p className="text-white/80 leading-relaxed mb-6 mt-2">
        The FivFold CLI is an extensible scaffolding engine. It does not hardcode every stack permutation.
        Instead, it uses manifests to describe Kits, a Strategy Pattern to compose generators, and a
        Virtual File System to stage changes before committing.
      </p>

      <Image src="/diagrams/fivfold_cli_architecture.png" alt="FivFold CLI Architecture" width={1000} height={1000} className="mb-6" />

      {/* <CodeBlock
        code={`flowchart TD
    A[CLI Input] --> B[Detect Stack]
    B --> C[Load Manifest]
    C --> D[Strategy Pipeline]
    D --> E[VFS Stage]
    E --> F{--dry-run?}
    F -->|Yes| G[preview()]
    F -->|No| H[commit()]
    H --> I[Output]
    G --> J[Print Preview]`}
        language="text"
        label="Mermaid"
        className="mb-6"
      /> */}

      <DocCallout title="Shared config" variant="info" className="mb-8">
        <p>
          Both CLIs read from <code>fivfold.json</code>. Run <code>@fivfold/ui init</code> first if you use both; the API init merges its config into the existing file in a monorepo setup.
        </p>
      </DocCallout>

      <h2 id="pipeline" className="font-semibold text-2xl scroll-mt-24 mt-12">
        Pipeline
      </h2>
      <p className="text-white/80 leading-relaxed mb-4 mt-2">
        When you run <code className="rounded bg-white/10 px-1.5 py-0.5">npx @fivfold/api add &lt;module&gt;</code>:
      </p>
      <div className="space-y-4 mb-6">
        <DocStep step={1} icon={Package} title="Detect" color="primary">
          Parse <code>package.json</code> to detect framework and ORM. Skip prompts when detected.
        </DocStep>
        <DocStep step={2} icon={Package} title="Load manifest" color="primary">
          Load the Kit manifest (or legacy registry). Manifest lists files, dependencies, AST mutations.
        </DocStep>
        <DocStep step={3} icon={Package} title="Run strategies" color="primary">
          Run strategies in order: domain → framework → orm → auth (when applicable). Each strategy generates files into the VFS.
        </DocStep>
        <DocStep step={4} icon={Package} title="VFS stage" color="primary">
          All creates, modifies, and deletes are staged. No disk writes until commit.
        </DocStep>
        <DocStep step={5} icon={Package} title="Commit" color="primary">
          If not <code>--dry-run</code>, flush to disk atomically. Then run <code>npm install</code> for new dependencies.
        </DocStep>
      </div>

      <DocCallout title="UI vs API" variant="tip" className="mb-8">
        <p>
          API uses StrategyPipeline for manifest-based Kits. UI uses VFS + manifests for copy-based scaffolding—no pipeline, just direct template copy.
        </p>
      </DocCallout>

      <h2 id="manifests" className="font-semibold text-2xl scroll-mt-24 mt-12">
        Manifests
      </h2>
      <p className="text-white/80 leading-relaxed mb-6 mt-2">
        Kits are defined by declarative JSON/YAML schemas (manifests). The manifest specifies dependencies to install, template files to copy, and AST mutation targets. The CLI acts as an agnostic orchestrator—it does not hardcode every Kit.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <DocCard
          icon={FileCode}
          title="Manifest-driven"
          description="Modern Kits use .kit.json manifests in ui/manifests/ and api/manifests/. Declarative, extensible, and easy to add new Kits."
          color="secondary"
        />
        <DocCard
          icon={Box}
          title="Legacy registry"
          description="Older modules may use registry JSON. Still supported for backward compatibility. New Kits use manifest-driven approach."
          color="accent"
        />
      </div>

      <DocCallout title="Manifest structure" variant="info" className="mb-8">
        <p>
          A <code>.kit.json</code> typically includes: <code>files</code> (templates to copy), <code>shadcnDependencies</code> (primitives to add), <code>astMutations</code> (targets for code injection), and optional auth provider configuration when applicable.
        </p>
      </DocCallout>

      <h2 id="strategy-pattern" className="font-semibold text-2xl scroll-mt-24 mt-12">
        Strategy Pattern
      </h2>
      <p className="text-white/80 leading-relaxed mb-6 mt-2">
        FivFold avoids hardcoding directories for every stack permutation. Instead, it uses interchangeable strategy classes. Each strategy implements <code className="rounded bg-white/10 px-1.5 py-0.5">IGeneratorStrategy</code> and generates files for its layer. The pipeline composes them based on the user&apos;s selection.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <DocCard
          icon={Layers}
          title="domain"
          description="Framework-agnostic entities, DTOs, ports (interfaces)."
          color="primary"
        />
        <DocCard
          icon={Server}
          title="framework"
          description="Modules, controllers, routes, middleware—adapts to your chosen framework."
          color="secondary"
        />
        <DocCard
          icon={Box}
          title="orm"
          description="Entities, repositories, schema—adapts to your chosen data layer."
          color="accent"
        />
        <DocCard
          icon={Cog}
          title="auth / delivery"
          description="Auth adapters when applicable; HTTP transport wiring."
          color="green"
        />
      </div>

      <p className="text-white/80 leading-relaxed mb-4">
        <code className="rounded bg-white/10 px-1.5 py-0.5">StrategyPipeline</code> runs strategies in order. Each receives a <code className="rounded bg-white/10 px-1.5 py-0.5">GeneratorContext</code> with the VFS, template engine, manifest, and stack config. Strategies write to the VFS—they never touch the disk directly.
      </p>
      <CodeBlock
        code={`// Simplified flow
const pipeline = new StrategyPipeline([
  getStrategy('domain'),
  getStrategy('framework'),
  getStrategy('orm'),
  getStrategy('auth'),  // Optional, when applicable
]);
await pipeline.run(ctx);`}
        language="typescript"
        label="Strategy pipeline"
        className="mb-8"
      />

      <h2 id="vfs" className="font-semibold text-2xl scroll-mt-24 mt-12">
        Virtual File System
      </h2>
      <p className="text-white/80 leading-relaxed mb-6 mt-2">
        The VFS ensures no partial writes. All file creations, modifications, and deletions are staged in memory first. Only after all generators complete successfully does the VFS flush to disk in a single transaction. If any step fails, nothing is written.
      </p>

      <div className="space-y-4 mb-6">
        <DocStep step={1} title="Stage" color="primary">
          All operations go to <code>stageCreate</code>, <code>stageModify</code>, or <code>stageDelete</code>. Nothing hits disk.
        </DocStep>
        <DocStep step={2} title="Preview or commit" color="primary">
          With <code>--dry-run</code>, call <code>preview(root)</code> to see the diff. Otherwise, call <code>commit(root)</code> to write atomically.
        </DocStep>
      </div>

      <p className="text-white/80 leading-relaxed mb-2">
        From <code className="rounded bg-white/10 px-1.5 py-0.5">@fivfold/core</code>:
      </p>
      <ul className="text-white/80 text-sm space-y-2 mb-6">
        <li><code className="rounded bg-white/10 px-1 py-0.5">stageCreate(path, content)</code> — Stage a new file</li>
        <li><code className="rounded bg-white/10 px-1 py-0.5">stageModify(path, content)</code> — Stage an overwrite</li>
        <li><code className="rounded bg-white/10 px-1 py-0.5">stageDelete(path)</code> — Stage a deletion</li>
        <li><code className="rounded bg-white/10 px-1 py-0.5">preview(rootDir)</code> — Human-readable diff for dry run</li>
        <li><code className="rounded bg-white/10 px-1 py-0.5">commit(rootDir)</code> — Write all staged ops to disk</li>
      </ul>

      <DocCodeBlock command="npx @fivfold/api add <module> --dry-run" label="Preview without writing" className="mb-8" />

      <h2 id="ast-engine" className="font-semibold text-2xl scroll-mt-24 mt-12">
        AST Engine
      </h2>
      <p className="text-white/80 leading-relaxed mb-4 mt-2">
        For <strong>existing</strong> files, FivFold never uses regex or <code className="rounded bg-white/10 px-1.5 py-0.5">.replace()</code>. That would be fragile and could destroy user modifications. Instead, it uses Abstract Syntax Tree (AST) manipulation via <code className="rounded bg-white/10 px-1.5 py-0.5">ts-morph</code>: parse the file, inject the node, serialize back.
      </p>

      <DocCallout title="Existing vs new files" variant="info" className="mb-6">
        <p>
          AST mutations apply only to existing files (e.g. app entry, module registration). New files use Handlebars templating.
        </p>
      </DocCallout>

      <p className="text-white/80 leading-relaxed mb-2">
        Built-in mutations include:
      </p>
      <ul className="text-white/80 text-sm space-y-2 mb-8">
        <li>Register module in app — Add a module to app imports</li>
        <li>Register middleware — Add middleware to the app</li>
        <li>Add import if not present — Inject an import statement when missing</li>
      </ul>

      <h2 id="plugin-architecture" className="font-semibold text-2xl scroll-mt-24 mt-12">
        Plugin Architecture
      </h2>
      <p className="text-white/80 leading-relaxed mb-6 mt-2">
        FivFold has two packages today: <code className="rounded bg-white/10 px-1.5 py-0.5">@fivfold/ui</code> and <code className="rounded bg-white/10 px-1.5 py-0.5">@fivfold/api</code>. The architecture is being prepared for a unified, language-agnostic future.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <DocCard
          icon={Cpu}
          title="Orchestrator"
          description="Terminal input, VFS, manifest resolution, pipeline orchestration. Framework and database agnostic."
          color="primary"
        />
        <DocCard
          icon={Puzzle}
          title="Plugins"
          description="Language-specific logic (e.g. ts-morph for Node/TypeScript) will live in isolated plugins. The orchestrator stays agnostic; plugins do the heavy lifting."
          color="secondary"
        />
      </div>

      <div className="mt-8">
        <DocLinkCard
          href="/docs/getting-started/cli"
          icon={Cog}
          title="CLI Reference"
          description="All commands and options"
        />
      </div>
    </DocPage>
  );
}
