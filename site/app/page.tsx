import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/home/hero";
import { ScaffoldingLandscape } from "@/components/home/scaffolding-landscape";
import { FeatureBento } from "@/components/home/feature-bento";
import { ToolkitBenefits } from "@/components/home/toolkit-benefits";
import { WhyWeBuiltIt } from "@/components/home/why-we-built-it";
import { CallForContributions } from "@/components/home/call-for-contributions";
import { HowItWorks } from "@/components/home/how-it-works";
import { CtaBanner } from "@/components/home/cta-banner";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "FivFold — Full-stack Kits for React & Next.js",
  description:
    "Full-stack Kits built on shadcn/ui. Drop in a complete email client, chat, or kanban board in minutes. Express or NestJS, TypeORM or Prisma. Open-source, community-driven. Contribute on GitHub.",
  keywords: [
    "FivFold",
    "full-stack kits",
    "React",
    "Next.js",
    "shadcn/ui",
    "Express",
    "NestJS",
    "TypeORM",
    "Prisma",
    "scaffolding",
    "open source",
    "contribute",
    "community",
  ],
  openGraph: {
    title: "FivFold — Full-stack Kits for React & Next.js",
    description:
      "Full-stack Kits built on shadcn/ui. Drop in complete features in minutes. Open-source, community-driven. Star on GitHub and contribute.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FivFold — Full-stack Kits for React & Next.js",
    description:
      "Full-stack Kits built on shadcn/ui. Drop in complete features in minutes. Open-source, community-driven. Star on GitHub.",
  },
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#030303] text-white">
      <Header />
      <Hero />
      <ScaffoldingLandscape />
      <ToolkitBenefits />
      <HowItWorks />
      <FeatureBento />
      {/* <WhyWeBuiltIt /> */}
      <CallForContributions />
      <CtaBanner />
      <Footer />
    </div>
  );
}
