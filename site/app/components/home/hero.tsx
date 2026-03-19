"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = (i: number) => ({ delay: i * 0.1 });

import {
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiTypescript,
  SiTailwindcss,
  SiExpress,
  SiNestjs,
  SiPrisma,
  SiTypeorm,
  SiPostgresql,
  SiMysql,
  SiMariadb,
  SiMongodb,
  SiVite,
  SiFirebase,
  SiAuth0,
} from "@icons-pack/react-simple-icons";

import {
  DiMsqlServer
} from 'react-icons/di';

const iconItems = [
  { Icon: SiReact, label: "React", color: "#61DAFB" },
  { Icon: SiVite, label: "Vite", color: "#646CFF" },
  { Icon: SiNextdotjs, label: "Next.js", color: "#FFFFFF" },
  { Icon: SiNodedotjs, label: "Node.js", color: "#339933" },
  { Icon: SiTypescript, label: "TypeScript", color: "#3178C6" },
  { Icon: SiTailwindcss, label: "Tailwind", color: "#06B6D4" },
  { Icon: SiExpress, label: "Express", color: "#FFFFFF" },
  { Icon: SiNestjs, label: "NestJS", color: "#E0234E" },
  { Icon: SiPrisma, label: "Prisma", color: "#2D3748" },
  { Icon: SiTypeorm, label: "TypeORM", color: "#FE0823" },
  { Icon: SiPostgresql, label: "PostgreSQL", color: "#4169E1" },
  { Icon: SiMysql, label: "MySQL", color: "#4479A1" },
  { Icon: DiMsqlServer, label: "MSSQL", color: "#CC2927" },
  { Icon: SiMariadb, label: "MariaDB", color: "#003545" },
  { Icon: SiMongodb, label: "MongoDB", color: "#47A248" },
  { Icon: SiFirebase, label: "Firebase", color: "#FFCA28" },
  { Icon: SiAuth0, label: "Auth0", color: "#EB5424" },
];

function MarqueeRow({
  items,
  direction,
  size = "lg",
}: {
  items: typeof iconItems;
  direction: "ltr" | "rtl";
  size?: "sm" | "lg";
}) {
  const iconSize = size === "lg" ? "h-24 w-24" : "h-16 w-16";
  return (
    <div
      className="flex shrink-0 gap-10 animate-marquee"
      style={{
        animationDirection: direction === "ltr" ? "reverse" : "normal",
      }}
    >
      {[...items, ...items].map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-center gap-x-6 text-white/60 transition-colors hover:text-white/90"
        >
          <item.Icon
            className={cn(iconSize, "shrink-0")}
            color={item.color}
            aria-label={item.label}
          />
        </div>
      ))}
    </div>
  );
}


export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#030303] to-[var(--section-hero-end)]">
      <div className="relative flex min-w-0 w-full flex-1 items-stretch gap-0 overflow-x-hidden">
        {/* Left marquee: slides left-to-right */}
        <div className="relative hidden min-w-0 flex-1 overflow-hidden md:block">
          <div
            className="absolute inset-y-0 right-0 z-10 w-24 pointer-events-none"
            style={{
              background: "linear-gradient(to left, #030303, transparent)",
            }}
          />
          <motion.div
            className="flex h-full items-center overflow-hidden py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            <MarqueeRow items={iconItems} direction="ltr" size="lg" />
          </motion.div>
        </div>

        {/* Center content: full width on mobile, narrow on desktop */}
        <div className="relative z-10 flex w-full min-w-0 shrink flex-col items-center justify-center py-12 md:w-[min(500px,58vw)] md:shrink-0 md:px-0">
          <div className="w-full min-w-0 max-w-full text-center space-y-6 px-4 md:max-w-[500px] md:px-0">
            <motion.span
              {...fadeUp}
              transition={stagger(0)}
              className="inline-block rounded-full border border-brand-accent/40 bg-brand-accent/10 px-4 py-1.5 text-xs font-medium text-brand-accent"
            >
              Pre-Alpha · v0.12.0
            </motion.span>

            <motion.h1
              {...fadeUp}
              transition={stagger(1)}
              className="text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Full-Stack Kits,
              <br />
              <span className="text-brand-primary font-bold">Zero Lock-in.</span>
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={stagger(2)}
              className="text-lg text-white/70 w-full max-w-2xl mx-auto wrap-break-word sm:text-xl"
            >
              Drop in complete features, with one command.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={stagger(3)}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
            >
              <Link
                href="/docs/getting-started/introduction"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-brand-primary text-black hover:bg-brand-primary/90 font-semibold px-8 h-11 rounded-xl"
                )}
              >
                Get Started
              </Link>
              <a
                href="https://github.com/Fivex-Labs/fivfold"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 px-8 h-11 rounded-xl"
                )}
              >
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
              </a>
            </motion.div>
          </div>
        </div>

        {/* Right marquee: slides right-to-left */}
        <div className="relative hidden min-w-0 flex-1 overflow-hidden md:block">
          <div
            className="absolute inset-y-0 left-0 z-10 w-24 pointer-events-none"
            style={{
              background: "linear-gradient(to right, #030303, transparent)",
            }}
          />
          <motion.div
            className="flex h-full items-center overflow-hidden py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          >
            <MarqueeRow items={iconItems} direction="rtl" size="lg" />
          </motion.div>
        </div>
      </div>

      {/* Mobile: single marquee below */}
      <div className="relative flex w-full flex-col gap-8 md:hidden pb-16">
        <div
          className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to right, #030303, transparent)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to left, #030303, transparent)",
          }}
        />
        <motion.div
          className="flex overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        >
          <MarqueeRow items={iconItems} direction="rtl" size="sm" />
        </motion.div>
      </div>
    </section>
  );
}
