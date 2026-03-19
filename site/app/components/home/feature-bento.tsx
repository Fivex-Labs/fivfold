import {
  Layers,
  Code,
  Puzzle,
  Server,
  Terminal,
} from "lucide-react";
import {
  SiExpress,
  SiNestjs,
  SiTypeorm,
  SiPrisma,
} from "@icons-pack/react-simple-icons";
import { formatMarketingVersionLabel } from "@/lib/fivfold-version";

const techIcons = [
  { Icon: SiExpress, label: "Express", color: "#FFFFFF" },
  { Icon: SiNestjs, label: "NestJS", color: "#E0234E" },
  { Icon: SiTypeorm, label: "TypeORM", color: "#FE0803" },
  { Icon: SiPrisma, label: "Prisma", color: "#2D3748" },
];

export function FeatureBento() {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-[var(--section-how-end)] to-[var(--section-feature-end)]">
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-12 text-center">
          What you get
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Kit Library — spans 2 cols */}
          <div className="rounded-2xl border border-white/10 bg-brand-primary/8 p-6 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20 lg:col-span-2">
            <Layers className="h-8 w-8 text-brand-primary mb-4" aria-hidden />
            <h3 className="text-xl font-semibold text-white mb-2">
              Kit Library
            </h3>
            <p className="text-white/70 mb-4">
              Pre-built modules for auth, email, kanban, push, and more. Browse
              the Kit Library.
            </p>
            <div className="rounded-lg bg-black/40 border border-white/10 p-3 font-mono text-sm text-white/90">
              <span className="text-brand-primary">$</span> npx @fivfold/ui add{" "}
              <span className="text-white/50">&lt;kit-name&gt;</span>
            </div>
          </div>

          {/* Open-Code */}
          <div className="rounded-2xl border border-white/10 bg-brand-secondary/5 p-6 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20">
            <Code className="h-8 w-8 text-brand-secondary mb-4" aria-hidden />
            <h3 className="text-xl font-semibold text-white mb-2">
              Open-Code
            </h3>
            <p className="text-white/70 mb-3">
              You own the code. No black boxes.
            </p>
            <ul className="text-sm text-white/60 space-y-1">
              <li>• Run command, review and customize</li>
              <li>• No runtime dependencies</li>
              <li>• Full control</li>
            </ul>
          </div>

          {/* Zero Lock-in */}
          <div className="rounded-2xl border border-white/10 bg-purple-500/8 p-6 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20">
            <Puzzle className="h-8 w-8 text-purple-500/80 mb-4" aria-hidden />
            <h3 className="text-xl font-semibold text-white mb-2">
              Zero Lock-in
            </h3>
            <p className="text-white/70">
              shadcn/ui primitives, Tailwind styling. No proprietary libraries
              required.
            </p>
          </div>

          {/* Multi-Stack Backend */}
          <div className="rounded-2xl border border-white/10 bg-green-500/8 p-6 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20">
            <Server className="h-8 w-8 text-green-500/80 mb-4" aria-hidden />
            <h3 className="text-xl font-semibold text-white mb-2">
              Multi-Stack Backend
            </h3>
            <p className="text-white/70 mb-4">
              Express or NestJS. TypeORM or Prisma.{" "}
              <span className="text-white/30 italic">...and more to come soon</span>
            </p>
            <div className="flex flex-wrap gap-3">
              {techIcons.map(({ Icon, label, color }) => (
                <Icon
                  key={label}
                  size={24}
                  color={color}
                  aria-label={label}
                  title={label}
                />
              ))}
            </div>
          </div>

          {/* CLI-first */}
          <div className="rounded-2xl border border-white/10 bg-pink-500/8 p-6 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20">
            <Terminal className="h-8 w-8 text-pink-500/80 mb-4" aria-hidden />
            <h3 className="text-xl font-semibold text-white mb-2">
              CLI-first
            </h3>
            <p className="text-white/70 mb-3">One command. Done.</p>
            <div className="rounded-lg bg-black/40 border border-white/10 p-2 font-mono text-sm text-white/90">
              npx @fivfold/ui add{" "}
              <span className="text-white/50">&lt;kit&gt;</span>
            </div>
          </div>

          {/* Pre-Alpha */}
          <div className="rounded-2xl border border-brand-accent/30 bg-brand-accent/5 p-6 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20">
            <p className="text-sm text-brand-accent/90">
              {formatMarketingVersionLabel()} · Pre-Alpha · Feedback welcome
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
