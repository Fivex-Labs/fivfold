"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Zap,
  MessageSquare,
  Code2,
  Server,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const viewport = { once: true, amount: 0.2 };
const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport,
  transition: { duration: 0.5 },
};

const FROM_SCRATCH_FRONTEND_WEEKS = 3;
const FROM_SCRATCH_BACKEND_WEEKS = 2.5;
const TOTAL_SCRATCH_WEEKS = FROM_SCRATCH_FRONTEND_WEEKS + FROM_SCRATCH_BACKEND_WEEKS;
const FIVFOLD_MINUTES = 5;

export function ToolkitBenefits() {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-[var(--section-scaffold-end)] to-[var(--section-benefits-end)]">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          {...fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Benefits of this toolkit
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            See how FivFold transforms weeks of work into minutes. We&apos;ll use
            a full-featured Chat service as the example.
          </p>
        </motion.div>

        {/* Main content: both approaches side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {/* From scratch */}
          <motion.div
              className="rounded-2xl border border-white/10 bg-white/5 p-6 h-full flex flex-col"
              {...fadeInUp}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 ring-2 ring-red-500/20">
                  <Clock className="h-5 w-5 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Building Chat from scratch
                </h3>
              </div>
              <p className="text-white/70 text-sm mb-6">
                A production-ready chat (1-1 & group conversations, real-time
                sync, attachments, reactions, mobile-responsive UI) requires
                significant effort across frontend and backend.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Code2 className="h-5 w-5 text-white/50 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-white">Frontend</p>
                    <p className="text-sm text-white/60">
                      Thread list, conversation view, message bubbles, input with
                      attachments, real-time updates, responsive layout, state
                      management.{" "}
                      <span className="text-red-400 font-semibold">
                        ~{FROM_SCRATCH_FRONTEND_WEEKS} weeks
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Server className="h-5 w-5 text-white/50 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-white">Backend</p>
                    <p className="text-sm text-white/60">
                      REST/GraphQL API, WebSocket gateway, auth, database schema,
                      message persistence, real-time delivery.{" "}
                      <span className="text-red-400 font-semibold">
                        ~{FROM_SCRATCH_BACKEND_WEEKS} weeks
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-white/80 font-medium">
                  Total:{" "}
                  <span className="text-red-400 text-lg">
                    {TOTAL_SCRATCH_WEEKS}–{TOTAL_SCRATCH_WEEKS + 1} weeks
                  </span>{" "}
                  of focused development
                </p>
              </div>
          </motion.div>

          {/* With FivFold */}
          <motion.div
              className="rounded-2xl border-2 border-brand-primary/30 bg-brand-primary/5 p-6 h-full flex flex-col"
              {...fadeInUp}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/20 ring-2 ring-brand-primary/40">
                  {/* <Zap className="h-5 w-5 text-brand-primary" /> */}
                  <Image src="/logos/logomark_dark_transparent.png" alt="Fivex Labs" width={24} height={24} />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  With FivFold
                </h3>
              </div>
              <p className="text-white/80 text-sm mb-6">
                One command for the frontend. One command for the backend. Full
                architecture, ready to customize.
              </p>

              <div className="space-y-3 mb-6">
                <div className="rounded-lg bg-black/40 border border-white/10 p-3 font-mono text-sm">
                  <span className="text-brand-primary">$</span> npx @fivfold/ui
                  add chat
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-white/40 rotate-90" />
                </div>
                <div className="rounded-lg bg-black/40 border border-white/10 p-3 font-mono text-sm">
                  <span className="text-brand-primary">$</span> npx @fivfold/api
                  add chat --framework=nestjs --orm=typeorm
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/20 px-3 py-1 text-sm text-brand-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  ~{FIVFOLD_MINUTES} minutes
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
                  <CheckCircle2 className="h-4 w-4" />
                  Fully customizable
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
                  <CheckCircle2 className="h-4 w-4" />
                  You own the code
                </span>
              </div>

              <p className="mt-4 text-white/70 text-sm">
                <strong className="text-white">
                  Save {TOTAL_SCRATCH_WEEKS}+ weeks
                </strong>{" "}
                per feature. Focus on what makes your product unique.
              </p>

              <Link
                href="/docs/kits/chat"
                className="mt-6 inline-flex items-center gap-2 text-brand-primary hover:text-brand-secondary transition-colors font-medium"
              >
                Explore the Chat Kit
                <ArrowRight className="h-4 w-4" />
              </Link>
          </motion.div>
        </div>

        {/* Bottom summary bar */}
        <motion.div
          className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8"
          {...fadeInUp}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/20">
                <MessageSquare className="h-6 w-6 text-brand-primary" />
              </div>
              <div>
                <p className="font-semibold text-white">
                  Chat is just one example
                </p>
                <p className="text-sm text-white/60">
                  Auth, Email, Kanban, Push and more — same story. Drop in, customize,
                  ship.
                </p>
              </div>
            </div>
            <Link
              href="/docs/kits/overview"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-white font-medium hover:bg-brand-primary hover:text-black hover:border-white/30 transition-all shrink-0"
            >
              Browse all Kits
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
