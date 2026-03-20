import type { Metadata } from "next";
import { DocPage } from "../../components/doc-page";
import {
  DocCodeBlock,
  DocCallout,
} from "../../components/doc-blocks";
import { Wrench, Plus, List, FileText, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "CLI Reference",
  description:
    "Command-line reference for fivfold (UI) and fivfold-api. All commands, options, and flags for init, add, list, agents, and setup.",
  openGraph: {
    title: "CLI Reference | FivFold",
    description:
      "Command-line reference for fivfold (UI) and fivfold-api. All commands, options, and flags for init, add, list, agents, and setup.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CLI Reference | FivFold",
    description:
      "Command-line reference for fivfold (UI) and fivfold-api. All commands, options, and flags for init, add, list, agents, and setup.",
  },
  alternates: {
    canonical: "https://fivfold.fivexlabs.com/docs/getting-started/cli",
  },
};

const headings = [
  { id: "fivfold-ui", text: "fivfold (UI)", level: 2 },
  { id: "fivfold-api", text: "fivfold-api", level: 2 },
];

export default function CLIPage() {
  return (
    <DocPage
      title="CLI"
      description="Command-line reference for FivFold UI and API packages. All commands support standard help flags."
      headings={headings}
    >
      <DocCallout title="Prompt flow & auto-detection" variant="info" className="mb-6">
        <p>
          The CLI deduces choices sequentially: <strong>Runtime</strong> → <strong>Framework</strong> → <strong>ORM</strong> → <strong>Auth</strong> (when applicable). It parses <code>package.json</code> to detect your existing stack and silently skips relevant prompts. Use <code>--yes</code> to bypass all questions with smart defaults.
        </p>
      </DocCallout>

      <h2 id="fivfold-ui" className="font-semibold text-2xl">fivfold (ui)</h2>
      <p className="text-white/80 leading-relaxed mb-6 pt-4">
        The <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">@fivfold/ui</code> package provides the <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">fivfold</code> binary. Run commands with <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">npx @fivfold/ui &lt;command&gt;</code>.
      </p>

      <div className="space-y-8">
        <div className="p-6 rounded-2xl border border-white/10 bg-black/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-primary/20">
              <Wrench size={20} className="text-brand-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-white">init</h3>
              <p className="text-sm text-white/60">Initialize FivFold in your project</p>
            </div>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            Detects existing shadcn/ui installation, prompts for theme preferences (keep existing or apply FivFold theme), creates <code className="rounded bg-white/10 px-1 py-0.5 text-brand-secondary">fivfold.json</code>, and sets up <code className="rounded bg-white/10 px-1 py-0.5 text-brand-secondary">globals.css</code>. Optionally runs <code className="rounded bg-white/10 px-1 py-0.5 text-brand-secondary">shadcn init</code> if not present.
          </p>
          <DocCodeBlock command="npx @fivfold/ui init" />
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-black/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-secondary/20">
              <Plus size={20} className="text-brand-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-white">add &lt;kits...&gt;</h3>
              <p className="text-sm text-white/60">Add one or more Kits</p>
            </div>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            Installs npm dependencies, runs <code className="rounded bg-white/10 px-1 py-0.5 text-brand-secondary">npx shadcn@latest add</code> for required primitives, and copies the Kit template to your configured kits path. Supports multiple Kit names in one invocation.
          </p>
          <div className="mb-4">
            <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Options</p>
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 space-y-2">
              <div><code className="text-brand-secondary">--theme &lt;color&gt;</code><span className="text-white/60 text-sm ml-2">Override base color: neutral, slate, gray, zinc, stone</span></div>
              <div><code className="text-brand-secondary">--yes</code> / <code className="text-brand-secondary">-y</code><span className="text-white/60 text-sm ml-2">Skip prompts, use defaults</span></div>
              <div><code className="text-brand-secondary">--dry-run</code><span className="text-white/60 text-sm ml-2">Preview changes without writing</span></div>
            </div>
          </div>
          <DocCodeBlock command="npx @fivfold/ui add <kit> [--theme zinc] [--yes] [--dry-run]" />
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-black/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-accent/20">
              <List size={20} className="text-brand-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-white">list</h3>
              <p className="text-sm text-white/60">List available Kits</p>
            </div>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            Displays all available Kits with descriptions and their shadcn/ui dependencies.
          </p>
          <DocCodeBlock command="npx @fivfold/ui list" />
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-black/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-500/20">
              <FileText size={20} className="text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">agents</h3>
              <p className="text-sm text-white/60">Generate AGENTS.md</p>
            </div>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            Creates <code className="rounded bg-white/10 px-1 py-0.5 text-brand-secondary">AGENTS.md</code> at project root with your FivFold setup, conventions, theming, and installed Kits. Helps AI coding assistants understand your project context.
          </p>
          <div className="mb-4">
            <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Options</p>
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <code className="text-brand-secondary">--force</code>
              <span className="text-white/60 text-sm ml-2">Overwrite existing AGENTS.md</span>
            </div>
          </div>
          <DocCodeBlock command="npx @fivfold/ui agents [--force]" />
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-black/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-500/20">
              <HelpCircle size={20} className="text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">setup</h3>
              <p className="text-sm text-white/60">Show setup instructions</p>
            </div>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            Checks for shadcn/ui, fivfold.json, and Tailwind v4. Prints requirements status and quick-start commands.
          </p>
          <DocCodeBlock command="npx @fivfold/ui setup" />
        </div>
      </div>

      <h2 id="fivfold-api" className="font-semibold text-2xl pt-8">fivfold (api)</h2>
      <p className="text-white/80 leading-relaxed mb-6 pt-4">
        The <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">@fivfold/api</code> package provides the <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">fivfold-api</code> binary. Run commands with <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">npx @fivfold/api &lt;command&gt;</code>.
      </p>

      <div className="space-y-8">
        <div className="p-6 rounded-2xl border border-white/10 bg-black/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-primary/20">
              <Wrench size={20} className="text-brand-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-white">init</h3>
              <p className="text-sm text-white/60">Configure backend stack</p>
            </div>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            Prompts for framework, ORM, database, and output directory. Saves configuration to <code className="rounded bg-white/10 px-1 py-0.5 text-brand-secondary">fivfold.json</code>. Auto-detects existing stack from <code>package.json</code>.
          </p>
          <div className="mb-4">
            <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Flags</p>
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 space-y-2">
              <div><code className="text-brand-secondary">--yes</code> / <code className="text-brand-secondary">-y</code><span className="text-white/60 text-sm ml-2">Use defaults, skip prompts</span></div>
              <div><code className="text-brand-secondary">--dry-run</code><span className="text-white/60 text-sm ml-2">Preview config without writing</span></div>
              <div><code className="text-brand-secondary">--framework=...</code><span className="text-white/60 text-sm ml-2">Framework choice</span></div>
              <div><code className="text-brand-secondary">--orm=...</code><span className="text-white/60 text-sm ml-2">ORM choice</span></div>
              <div><code className="text-brand-secondary">--provider=...</code><span className="text-white/60 text-sm ml-2">Auth provider (when applicable)</span></div>
            </div>
          </div>
          <DocCodeBlock command="npx @fivfold/api init [--yes] [--dry-run] [--framework=...] [--orm=...]" />
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-black/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-secondary/20">
              <Plus size={20} className="text-brand-secondary" />
            </div>
            <div>
              <h3 className="font-semibold text-white">add &lt;module&gt;</h3>
              <p className="text-sm text-white/60">Add an API module</p>
            </div>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            Scaffolds entities, DTOs, services, and controllers (or routes) based on your configured stack. Copies files to the output directory and prints integration instructions from the module README.
          </p>
          <div className="mb-4">
            <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Flags</p>
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 space-y-2">
              <div><code className="text-brand-secondary">--dry-run</code><span className="text-white/60 text-sm ml-2">Preview staged files without committing</span></div>
              <div><code className="text-brand-secondary">--provider=...</code><span className="text-white/60 text-sm ml-2">Auth provider (when applicable)</span></div>
            </div>
          </div>
          <DocCodeBlock command="npx @fivfold/api add <module-name> [--dry-run] [--provider=...]" />
        </div>

        <div className="p-6 rounded-2xl border border-white/10 bg-black/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-accent/20">
              <List size={20} className="text-brand-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-white">list</h3>
              <p className="text-sm text-white/60">List available API modules</p>
            </div>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            Displays all available API modules and their supported stacks.
          </p>
          <DocCodeBlock command="npx @fivfold/api list" />
        </div>
      </div>
    </DocPage>
  );
}
