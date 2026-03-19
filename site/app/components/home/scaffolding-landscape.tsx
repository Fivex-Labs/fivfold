"use client";

import { motion } from "framer-motion";
import { Layers, Zap, Sparkles, Wallpaper } from "lucide-react";
import ElectricBorder from "../ui/ElectricBorder";
import Image from "next/image";

const viewport = { once: true, amount: 0.2 };

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport,
  transition: { duration: 0.5 },
};

const stagger = (i: number) => ({ delay: i * 0.1 });

export function ScaffoldingLandscape() {
  return (
    <section className="relative py-32 px-4 overflow-hidden bg-gradient-to-b from-[var(--section-hero-end)] to-[var(--section-scaffold-end)]">
      {/* Subtle gradient mesh overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255,217,2,0.03), transparent 70%)",
        }}
        aria-hidden
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 text-center tracking-tight"
          {...fadeInUp}
          transition={stagger(0)}
        >
          The gap we&apos;re filling
        </motion.h2>
        <motion.p
          className="text-white/50 text-center max-w-lg mx-auto mb-24 text-lg"
          {...fadeInUp}
          transition={stagger(1)}
        >
          Most tools are fragmented. We&apos;re building the bridge.
        </motion.p>

        {/* Split landscape: two shores + glowing bridge */}
        <div className="relative">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-4 items-stretch">
            {/* Left shore — Frontend-only */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewport}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="h-full rounded-2xl border border-white/10 bg-linear-to-br from-red-400/10 to-transparent flex flex-col items-start justify-center px-6 py-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/10 ring-2 ring-red-400/20">
                    <Wallpaper className="h-6 w-6 text-red-400" />
                  </div>
                  <span className="text-xl font-semibold text-white">
                    Frontend-only
                  </span>
                </div>
                <p className="text-white/60 leading-relaxed">
                  Reactbits, Aceternity, Magic UI — beautiful UI blocks, but no
                  backend. You stitch things together.
                </p>
              </div>
            </motion.div>

            {/* Center — FivFold bridge */}
            <motion.div
              className="relative flex flex-col justify-center order-first lg:order-0"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <ElectricBorder
                color="#ffd902"
                speed={1}
                chaos={0.03}
                style={{ borderRadius: 16 }}
              >
                <div className="h-full rounded-2xl bg-linear-to-br from-white/5 to-transparent px-6 py-4">
                  <div className="flex items-center justify-center gap-3 mb-1">
                    <Image src="/logos/logo_full_dark_transparent.png" alt="FivFold" width={512} height={512} className="h-16 w-auto" />
                  </div>
                  <p className="text-white/60 leading-relaxed">
                    Frontend and backend all in one place. No stitching, no lock-in—mix and match any stack, with just one command.
                  </p>
                </div>
              </ElectricBorder>
            </motion.div>

            {/* Right shore — Backend-only */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewport}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="h-full rounded-2xl border border-white/10 bg-linear-to-bl from-red-400/10 to-transparent flex flex-col items-end justify-center px-6 py-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-400/10 ring-2 ring-red-400/20">
                    <Layers className="h-6 w-6 text-red-400" />
                  </div>
                  <span className="text-xl font-semibold text-white">
                    Backend-only
                  </span>
                </div>
                <p className="text-white/60 leading-relaxed text-right">
                  Vratix and similar — API modules, but locked to one framework. No mixing. No matching front-end either.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom tagline */}
        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto">
            One toolkit, many combinations.{" "}
            <span className="text-brand-primary font-semibold">
              No more fragmentation.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
