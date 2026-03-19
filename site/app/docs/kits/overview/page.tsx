import type { Metadata } from "next";
import { DocPage } from "../../components/doc-page";
import {
  DocCard,
  DocCallout,
  DocLinkCard,
} from "../../components/doc-blocks";
import { Clock, Layers, Server, Zap, Code2, Sparkles, Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "Kits Overview",
  description:
    "Pre-built, full-featured modules that accelerate development. Each Kit combines a polished frontend with optional backend scaffolding.",
  openGraph: {
    title: "Kits Overview | FivFold",
    description:
      "Pre-built, full-featured modules that accelerate development. Each Kit combines a polished frontend with optional backend scaffolding.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kits Overview | FivFold",
    description:
      "Pre-built, full-featured modules that accelerate development. Each Kit combines a polished frontend with optional backend scaffolding.",
  },
  alternates: {
    canonical: "https://fivfold.fivexlabs.com/docs/kits/overview",
  },
};

const headings = [
  { id: "what-are-kits", text: "What are Kits?", level: 2 },
  { id: "how-kits-save-time", text: "How Kits save development time", level: 2 },
  { id: "frontend-and-backend", text: "Frontend and backend", level: 2 },
  { id: "next-steps", text: "Next steps", level: 2 },
];

export default function KitsOverviewPage() {
  return (
    <DocPage
      title="Kits Overview"
      description="Pre-built, full-featured modules that accelerate development. Each Kit combines a polished frontend with optional backend scaffolding."
      headings={headings}
    >
      <h2 id="what-are-kits" className="font-semibold text-2xl">What are Kits?</h2>
      <p className="text-white/80 leading-relaxed mb-6 mt-2">
        Kits are complete, opinionated features you can drop into your app. Each one uses only{" "}
        <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline">
          shadcn/ui
        </a>{" "}
        primitives, is fully responsive, and follows CSS variable-based theming. No proprietary components—everything
        is copied into your project and is yours to customize.
      </p>

      <h2 id="how-kits-save-time" className="font-semibold text-2xl">How Kits save development time</h2>
      <p className="text-white/80 leading-relaxed mb-6 mt-2">
        Building full-featured modules from scratch—with proper layout, accessibility, responsive behavior, and
        backend integration—typically takes days or weeks. Kits compress that into minutes.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <DocCard
          icon={Clock}
          title="Skip the boilerplate"
          description="No more wiring up forms, dialogs, lists, and layouts from scratch. Kits ship with production-ready UI patterns, validation, and state handling. Focus on your business logic instead of reinventing common interactions."
          color="primary"
        />
        <DocCard
          icon={Code2}
          title="Avoid integration headaches"
          description="Mixing libraries often leads to style conflicts, prop mismatches, and inconsistent patterns. Kits are built from a single design system (shadcn/ui) and share the same conventions. Everything fits together from day one."
          color="secondary"
        />
        <DocCard
          icon={Zap}
          title="Ship faster, iterate sooner"
          description="Get a working feature in your app immediately. Test with real users, gather feedback, and refine—instead of spending weeks in development before you can demo. Kits let you validate ideas quickly."
          color="accent"
        />
        <DocCard
          icon={Sparkles}
          title="Own the code"
          description="Kits are copied into your project, not installed as opaque dependencies. You can tweak layouts, add fields, change behavior, and evolve the implementation. No vendor lock-in, no black-box components."
          color="green"
        />
      </div>

      <DocCallout className="mb-8" icon={Layers} title="Full-stack in one place" variant="info">
        <p>
          Each Kit includes both frontend and backend documentation. The frontend covers every component and element;
          the backend covers scaffolding for your chosen stack. You get a single, cohesive reference instead of
          juggling separate UI and API docs.
        </p>
      </DocCallout>

      <h2 id="frontend-and-backend" className="font-semibold text-2xl">Frontend and backend</h2>
      <p className="text-white/80 leading-relaxed mb-4 mt-2">
        Kits are designed as full-stack units. The <strong>frontend</strong> is a complete, responsive UI built on
        shadcn/ui—ready to import and use. The <strong>backend</strong> is optional scaffolding: entities, DTOs,
        services, and route handlers that you wire into your existing stack.
      </p>
      <p className="text-white/80 leading-relaxed mb-6">
        You can use the frontend alone (e.g., with a custom API or mock data) or add the backend scaffolding to
        get a full data layer. Both are documented in detail on each Kit page, with platform-specific options for
        the backend so you can match your preferred framework and database.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <DocCard
          icon={Layers}
          title="Frontend"
          description="Polished UI modules with every component and element documented. Fully responsive, accessible, and themeable via CSS variables. Drop in, customize as needed, and ship."
          color="primary"
        />
        <DocCard
          icon={Server}
          title="Backend"
          description="Optional scaffolding for entities, validation, and API endpoints. Type-safe, validated, and ready to integrate with your database. Choose the platform that fits your stack."
          color="secondary"
        />
      </div>

      <h2 id="next-steps" className="font-semibold text-2xl mt-8">Prerequisites</h2>
      <p className="text-white/80 leading-relaxed mb-6">
        Install FivFold in your project, then browse the available Kits. Each Kit page has detailed UI and API
        documentation with platform options.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
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
      </div>
    </DocPage>
  );
}
