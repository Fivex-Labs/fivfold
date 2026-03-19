import type { Metadata } from "next";
import { DocPage } from "../../components/doc-page";
import {
  DocStep,
  DocCallout,
  DocCard,
  DocLinkCard,
} from "../../components/doc-blocks";
import {
  Building2,
  AlertTriangle,
  Layers,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Background",
  description:
    "The story behind FivFold—from production scaffolding needs to a full-stack Kit platform. Origins, FivUI, and the pivot to FivFold.",
  openGraph: {
    title: "Background | FivFold",
    description:
      "The story behind FivFold—from production scaffolding needs to a full-stack Kit platform. Origins, FivUI, and the pivot to FivFold.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Background | FivFold",
    description:
      "The story behind FivFold—from production scaffolding needs to a full-stack Kit platform. Origins, FivUI, and the pivot to FivFold.",
  },
  alternates: {
    canonical: "https://fivfold.fivexlabs.com/docs/getting-started/background",
  },
};

const headings = [
  { id: "origins", text: "Origins", level: 2 },
  { id: "the-problem", text: "The problem", level: 2 },
  { id: "fivui", text: "FivUI", level: 2 },
  { id: "the-pivot", text: "The pivot", level: 2 },
  { id: "today", text: "Today", level: 2 },
];

export default function BackgroundPage() {
  return (
    <DocPage
      title="Background"
      description="The story behind FivFold—from production scaffolding needs to a full-stack Kit platform."
      headings={headings}
    >
      <p className="text-white/80 leading-relaxed mb-8">
        FivFold did not appear overnight. Its roots trace back to{" "}
        <a
          href="https://fivexlabs.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-secondary hover:underline"
        >
          Fivex Labs
        </a>
        , a product development studio that needed out-of-the-box scaffolding for production builds. What followed was a journey through the React UI ecosystem, a custom solution, and ultimately the platform you see today.
      </p>

      <h2 id="origins" className="font-semibold text-2xl">Origins</h2>
      <p className="text-white/80 leading-relaxed mb-6 mt-2">
        The idea behind FivFold started when Fivex Labs wanted a production-ready scaffolding kit—something that could accelerate client projects without reinventing the wheel. At the time,{" "}
        <a
          href="https://ui.shadcn.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-secondary hover:underline"
        >
          shadcn/ui
        </a>{" "}
        was leading the market for React-based platforms. It offered copy-paste components, a clean design language, and strong adoption. But that dominance came with a dependency: Radix UI.
      </p>

      <h2 id="the-problem" className="font-semibold text-2xl mt-8">The problem</h2>
      <p className="text-white/80 leading-relaxed mb-4 mt-2">
        shadcn/ui was built on Radix UI primitives. When WorkOS (the company behind Radix UI) stopped supporting those primitives, the ecosystem stalled. shadcn/ui went a long time without updates. On top of that, Fivex Labs routinely needed components that simply were not available—more than what shadcn/ui offered out of the box.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 my-6">
        <DocCard
          icon={AlertTriangle}
          title="Stale primitives"
          description="With Radix UI support withdrawn, shadcn/ui components could not evolve. Security fixes, accessibility improvements, and new patterns were delayed or blocked."
          color="orange"
        />
        <DocCard
          icon={Layers}
          title="Gap in coverage"
          description="Daily production work required components beyond shadcn/ui's scope. Building them from scratch or gluing third-party libraries added friction and inconsistency."
          color="accent"
        />
      </div>

      <h2 id="fivui" className="font-semibold text-2xl mt-8">FivUI</h2>
      <p className="text-white/80 leading-relaxed mb-6 mt-2">
        In response, the team at Fivex Labs built their own registry and component library: <strong className="text-white">FivUI</strong>. It supported multiple baseline primitives—Radix UI, Base UI, and Ark UI—so projects were not locked to a single vendor. FivUI also shipped a theme generator, featured themes, and more components than shadcn/ui out of the box. It became the default choice for Fivex Labs projects.
      </p>

      <DocCallout className="mb-8" title="What FivUI delivered" variant="info">
        <p>
          A flexible registry, multi-primitive support (Radix, Base, Ark), a theme generator, curated themes, and a broader component set. FivUI filled the gaps left by a stalled shadcn/ui.
        </p>
      </DocCallout>

      <h2 id="the-pivot" className="font-semibold text-2xl mt-8">The pivot</h2>
      <p className="text-white/80 leading-relaxed mb-6 mt-2">
        When shadcn/ui eventually received updates—new features, a refreshed design language, and renewed momentum—the calculus changed. FivUI was no longer adding unique value. Maintaining a parallel component library that duplicated shadcn/ui did not serve the community. The right move was to evolve, not compete.
      </p>

      <div className="space-y-4 mb-8">
        <DocStep step={1} title="Evolve, not compete" color="primary">
          Instead of maintaining FivUI as a shadcn/ui alternative, Fivex Labs pivoted toward <strong className="text-white">FivFold</strong>—a platform that <em>builds on</em> shadcn/ui rather than replacing it.
        </DocStep>
        <DocStep step={2} title="From components to Kits" color="primary">
          FivFold shifts focus from individual components to full-stack Kits: complete features (frontend + optional backend) that drop into your project. You still use shadcn/ui for primitives; FivFold adds the scaffolding and integration.
        </DocStep>
      </div>

      <DocCallout className="mb-8" title="Deprecation" variant="warning">
        <p>
          FivUI is deprecated. If you run the legacy FivUI CLI, you will see a message directing you to FivFold. We recommend migrating to FivFold for new projects and future updates.
        </p>
      </DocCallout>

      <h2 id="today" className="font-semibold text-2xl mt-8">Today</h2>
      <p className="text-white/80 leading-relaxed mb-6 mt-2">
        FivFold is the evolution of that journey: a full-stack Kit platform that embraces shadcn/ui, adds production-ready scaffolding, and keeps the code in your hands. Built by Fivex Labs, for teams that ship.
      </p>

      <DocCallout title="Under the hood" variant="tip" className="mb-8">
        <p>
          FivFold uses a <strong>Virtual File System (VFS)</strong>—all changes are staged in memory and committed atomically. A <strong>Strategy Pattern</strong> composes interchangeable generators. Kits are defined by <strong>manifest-driven</strong> JSON schemas, not hardcoded permutations. See the <a href="/docs/getting-started/how-it-works" className="text-brand-secondary hover:underline">How it works</a> section for architecture details.
        </p>
      </DocCallout>

      <DocLinkCard
        href="https://fivexlabs.com"
        icon={Building2}
        title="Fivex Labs"
        description="Learn more about the team behind FivFold"
        className="border-brand-primary/20 hover:border-brand-primary/40"
        external
      />
    </DocPage>
  );
}
