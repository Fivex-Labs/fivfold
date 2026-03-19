import { Clock, Brain, Sliders } from "lucide-react";

const points = [
  {
    icon: Clock,
    title: "Save development time",
    description:
      "Stop rebuilding auth flows, email UIs, and kanban boards from scratch. Drop in production-ready Kits and ship faster.",
    color: "text-brand-primary",
    bgColor: "bg-brand-primary/10",
    borderColor: "border-brand-primary/20",
  },
  {
    icon: Brain,
    title: "Focus on logic, not boilerplate",
    description:
      "Engineers spend too much time on repetitive patterns. FivFold handles the common stuff so you can focus on what makes your product unique.",
    color: "text-brand-secondary",
    bgColor: "bg-brand-secondary/10",
    borderColor: "border-brand-secondary/20",
  },
  {
    icon: Sliders,
    title: "Customize however you want",
    description:
      "Every line of code lands in your codebase. No black boxes, no runtime lock-in. Tweak, extend, or rip it apart—it's yours.",
    color: "text-brand-accent",
    bgColor: "bg-brand-accent/10",
    borderColor: "border-brand-accent/20",
  },
];

export function WhyWeBuiltIt() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4 sm:text-4xl">
            Why we built it
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            We kept rebuilding the same things—auth, email clients, kanban
            boards. So we built FivFold: drop in what you need, own every line,
            and focus on what actually matters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {points.map((point) => (
            <div
              key={point.title}
              className={`rounded-2xl border ${point.borderColor} ${point.bgColor} p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/5`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl border ${point.borderColor} bg-black/20 mb-4`}
              >
                <point.icon className={`h-6 w-6 ${point.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {point.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-white/50 text-sm max-w-xl mx-auto">
          No magic, no lock-in. Just code you can read, modify, and ship.
        </p>
      </div>
    </section>
  );
}
