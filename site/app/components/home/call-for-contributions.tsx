"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  Github,
  MessageSquare,
  Lightbulb,
  GitPullRequest,
} from "lucide-react";

const CONTRIBUTING_URL =
  "https://github.com/Fivex-Labs/fivfold/blob/main/CONTRIBUTING.md";

const viewport = { once: true, amount: 0.2 };
const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport,
  transition: { duration: 0.5 },
};

const ways = [
  {
    icon: GitPullRequest,
    title: "Pull requests",
    desc: "Fix bugs, add features, or improve docs. Every contribution counts.",
    color: "text-brand-primary",
    bg: "bg-brand-primary/10",
    border: "border-brand-primary/20",
  },
  {
    icon: MessageSquare,
    title: "Issues & feedback",
    desc: "Report bugs, suggest ideas, or share your experience. We listen.",
    color: "text-brand-secondary",
    bg: "bg-brand-secondary/10",
    border: "border-brand-secondary/20",
  },
  {
    icon: Lightbulb,
    title: "Ideas & discussions",
    desc: "Propose new Kits, stack combinations, or architectural improvements.",
    color: "text-brand-accent",
    bg: "bg-brand-accent/10",
    border: "border-brand-accent/20",
  },
];

export function CallForContributions() {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-[var(--section-feature-end)] to-[var(--section-contrib-end)]">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          {...fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border-2 border-brand-accent/30 bg-brand-accent/10 mb-6">
            <Heart className="h-8 w-8 text-brand-accent" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            We can&apos;t do it alone
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">
            FivFold is built in our spare time. Your contributions—code, feedback,
            or ideas—help us ship faster and build something the community actually needs.
          </p>
        </motion.div>

        {/* Ways to contribute */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {ways.map((way, i) => (
            <motion.div
              key={way.title}
              className={`rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20 ${way.bg} ${way.border}`}
              {...fadeInUp}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${way.bg} border ${way.border} mb-4`}
              >
                <way.icon className={`h-6 w-6 ${way.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {way.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {way.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA card */}
        <motion.div
          className="rounded-2xl border-2 border-brand-accent/30 bg-gradient-to-br from-brand-accent/10 to-brand-accent/5 p-8 md:p-10 text-center"
          {...fadeInUp}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-white/90 leading-relaxed mb-6 max-w-xl mx-auto">
            <strong className="text-white">
              Help us by contributing your genius and giving back to the community.
            </strong>{" "}
            Every PR, issue, or idea makes a difference.
          </p>
          <Link
            href={CONTRIBUTING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-brand-accent/40 bg-brand-accent/20 px-8 py-4 text-white font-semibold transition-all hover:bg-brand-accent/30 hover:border-brand-accent/60 hover:scale-105"
          >
            <Github className="h-5 w-5" />
            Contribute on GitHub
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
