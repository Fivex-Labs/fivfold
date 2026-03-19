import type { Metadata } from "next";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for FivFold — Full-stack Kits. We do not collect any data.",
  openGraph: {
    title: "Privacy Policy | FivFold",
    description:
      "Privacy Policy for FivFold — Full-stack Kits. We do not collect any data.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | FivFold",
    description:
      "Privacy Policy for FivFold — Full-stack Kits. We do not collect any data.",
  },
  alternates: {
    canonical: "https://fivfold.fivexlabs.com/privacy",
  },
};

export default function PrivacyPage() {
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
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-brand-primary/10">
          <Shield className="h-7 w-7 text-brand-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Last updated: March 2026
          </p>
        </div>
      </div>

      <div className="prose prose-invert max-w-none space-y-8">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Introduction
          </h2>
          <p className="leading-relaxed text-white/80">
            FivFold (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is an
            open-source project maintained by Fivex Labs. We are committed to
            protecting your privacy. This Privacy Policy explains our practices
            when you use our CLI tools, documentation site, and related services.
          </p>
        </section>

        <section className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            No Data Collection
          </h2>
          <p className="mb-4 leading-relaxed text-white/80">
            <strong className="text-white">FivFold does not collect any data.</strong>{" "}
            Our CLI tools run entirely on your machine. They do not transmit
            data to our servers, and we have no analytics, tracking, or telemetry.
          </p>
          <ul className="list-disc space-y-2 pl-6 text-white/80">
            <li>
              <strong className="text-white">CLI tools:</strong> Run locally.
              No data is sent to us.
            </li>
            <li>
              <strong className="text-white">Documentation site:</strong> We do
              not use analytics, tracking, or advertising.
            </li>
            <li>
              <strong className="text-white">GitHub:</strong> If you interact
              with our GitHub repository, GitHub&apos;s privacy policy applies
              to that interaction.
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Cookies</h2>
          <p className="leading-relaxed text-white/80">
            Our documentation site uses only essential cookies required for
            functionality (e.g., search preferences). We do not use tracking,
            analytics, or advertising cookies.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Third-Party Services
          </h2>
          <p className="leading-relaxed text-white/80">
            Our site may link to third-party services (e.g., GitHub, npm). Their
            privacy policies govern your interaction with those services. We
            encourage you to review them.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Your Rights
          </h2>
          <p className="leading-relaxed text-white/80">
            Because we do not collect personal data, there is no data to access,
            correct, or delete. If you have privacy-related questions, contact
            us at{" "}
            <a
              href="mailto:hello@fivexlabs.com"
              className="text-brand-primary underline decoration-brand-primary/50 underline-offset-2 hover:decoration-brand-primary"
            >
              hello@fivexlabs.com
            </a>
            .
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Changes to This Policy
          </h2>
          <p className="leading-relaxed text-white/80">
            We may update this Privacy Policy from time to time. We will post the
            updated version on this page and update the &quot;Last updated&quot;
            date. Continued use of our services after changes constitutes
            acceptance.
          </p>
        </section>

        <section className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">Contact Us</h2>
          <p className="leading-relaxed text-white/80">
            For questions about this Privacy Policy or our practices, contact us
            at{" "}
            <a
              href="mailto:hello@fivexlabs.com"
              className="text-brand-primary underline decoration-brand-primary/50 underline-offset-2 hover:decoration-brand-primary"
            >
              hello@fivexlabs.com
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-16 flex justify-between border-t border-white/10 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-brand-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        <Link
          href="/terms"
          className="text-sm text-brand-primary transition-colors hover:text-brand-primary/80"
        >
          Terms of Service →
        </Link>
      </div>
    </article>
  );
}
