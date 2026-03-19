"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, BookOpen, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const REPO = "Fivex-Labs/fivfold";

export function CtaBanner() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${REPO}`)
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative py-28 px-4 overflow-hidden bg-gradient-to-b from-[var(--section-contrib-end)] to-[var(--section-cta-end)]">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-4 py-1.5 mb-6">
            <Sparkles className="h-4 w-4 text-brand-primary" />
            <span className="text-sm font-medium text-brand-primary">
              Open-source · Pre-alpha · Building in public
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Ready to ship faster?
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
            Drop in complete features with one command. Docs, Kits, and a community
            that ships.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/docs/getting-started/introduction"
              className={cn(
                buttonVariants({ size: "lg" }),
                "inline-flex bg-brand-primary text-black hover:bg-brand-primary/90 font-semibold px-8 h-12 rounded-xl text-base shadow-lg shadow-brand-primary/20"
              )}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Read the docs
            </Link>
            <a
              href="https://github.com/Fivex-Labs/fivfold"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "inline-flex border-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 px-8 h-12 rounded-xl text-base"
              )}
            >
              <Github className="mr-2 h-5 w-5" />
              Star on GitHub
              {stars !== null && (
                <span className="ml-2 rounded-full bg-white/10 px-2.5 py-0.5 text-sm font-medium">
                  {stars}
                </span>
              )}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
