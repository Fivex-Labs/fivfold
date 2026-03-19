import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for FivFold — Full-stack Kits. Terms and conditions for using our CLI tools and documentation.",
  openGraph: {
    title: "Terms of Service | FivFold",
    description:
      "Terms of Service for FivFold — Full-stack Kits. Terms and conditions for using our CLI tools and documentation.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | FivFold",
    description:
      "Terms of Service for FivFold — Full-stack Kits. Terms and conditions for using our CLI tools and documentation.",
  },
  alternates: {
    canonical: "https://fivfold.fivexlabs.com/terms",
  },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 pb-24 pt-12">
      <Link
        href="/"
        className="mb-12 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-brand-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="mb-12 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-brand-secondary/10">
          <FileText className="h-7 w-7 text-brand-secondary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Last updated: March 2026
          </p>
        </div>
      </div>

      <div className="prose prose-invert max-w-none space-y-8">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Acceptance of Terms
          </h2>
          <p className="leading-relaxed text-white/80">
            By accessing or using FivFold, including our CLI tools
            (@fivfold/ui, @fivfold/api), documentation site, and GitHub
            repository, you agree to be bound by these Terms of Service. If you
            do not agree, please do not use our services. FivFold does not
            collect any data from users.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Open Source License
          </h2>
          <p className="leading-relaxed text-white/80">
            FivFold is open-source software. Our code is licensed under the MIT
            License (or as specified in the repository). You may use, modify,
            and distribute the software in accordance with the license terms.
            We do not claim ownership of code you generate using our tools.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Use of the CLI and Kits
          </h2>
          <p className="mb-4 leading-relaxed text-white/80">
            You may use FivFold CLI tools to scaffold and generate code for your
            projects. Generated code is yours to own, modify, and deploy. We
            provide no warranty that generated code will meet your specific
            requirements or be free of defects.
          </p>
          <p className="leading-relaxed text-white/80">
            You are responsible for reviewing, testing, and securing any code
            before use in production.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Prohibited Uses
          </h2>
          <p className="mb-4 leading-relaxed text-white/80">
            You agree not to:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-white/80">
            <li>Use FivFold for any illegal or unauthorized purpose</li>
            <li>Attempt to reverse engineer, decompile, or circumvent our tools</li>
            <li>Use our services to distribute malware or harmful code</li>
            <li>Impersonate FivFold or Fivex Labs</li>
            <li>Violate any applicable laws or regulations</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Disclaimer of Warranties
          </h2>
          <p className="leading-relaxed text-white/80">
            FivFold is provided &quot;as is&quot; without warranties of any
            kind, express or implied. We do not guarantee that our tools will be
            uninterrupted, error-free, or suitable for your use case. Use at your
            own risk.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Limitation of Liability
          </h2>
          <p className="leading-relaxed text-white/80">
            To the maximum extent permitted by law, Fivex Labs and contributors
            shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising from your use of FivFold.
            Our total liability shall not exceed the amount you paid to use our
            services (which is typically zero for our free, open-source tools).
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Changes to Terms
          </h2>
          <p className="leading-relaxed text-white/80">
            We may update these Terms from time to time. We will post the
            updated version on this page and update the &quot;Last updated&quot;
            date. Continued use of our services after changes constitutes
            acceptance of the new terms.
          </p>
        </section>

        <section className="rounded-2xl border border-brand-secondary/20 bg-brand-secondary/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Contact</h2>
          <p className="leading-relaxed text-white/80">
            For questions about these Terms of Service, contact us at{" "}
            <a
              href="mailto:hello@fivexlabs.com"
              className="text-brand-secondary underline decoration-brand-secondary/50 underline-offset-2 hover:decoration-brand-secondary"
            >
              hello@fivexlabs.com
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-16 flex justify-between border-t border-white/10 pt-8">
        <Link
          href="/privacy"
          className="text-sm text-brand-secondary transition-colors hover:text-brand-secondary/80"
        >
          ← Privacy Policy
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-brand-primary"
        >
          Back to home
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
