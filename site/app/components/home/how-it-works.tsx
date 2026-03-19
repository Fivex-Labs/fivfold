import { Download, Plus, Pencil } from "lucide-react";

const steps = [
  {
    num: 1,
    icon: Download,
    title: "Install",
    desc: "Initialize FivFold in your project. Configure shadcn/ui and themes.",
    code: "npx @fivfold/ui init",
  },
  {
    num: 2,
    icon: Plus,
    title: "Add Kits",
    desc: "Drop in a complete Kit. Components appear in your codebase.",
    code: "npx @fivfold/ui add auth",
  },
  {
    num: 3,
    icon: Pencil,
    title: "Customize",
    desc: "Open the files. Edit freely. Integrate with your own system. You own every line.",
    code: "Save time, just customize!",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-[var(--section-benefits-end)] to-[var(--section-how-end)]">
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-16 text-center">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
          {/* Dashed connector line on desktop */}
          <div
            className="hidden md:block absolute top-16 left-1/6 right-1/6 h-px border-t border-dashed border-white/20"
            aria-hidden
          />
          {steps.map((step) => (
            <div key={step.num} className="relative flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full border-2 border-brand-primary bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xl mb-4">
                {step.num}
              </div>
              <step.icon className="h-8 w-8 text-white/70 mb-3" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-white/60 text-sm mb-4 max-w-xs">
                {step.desc}
              </p>
              <div className="rounded-lg bg-black/40 border border-white/10 px-4 py-2 font-mono text-sm text-white/90">
                {step.code}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
