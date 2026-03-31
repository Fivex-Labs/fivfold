import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stripe Kit",
  description:
    "Backend Stripe integration: customers, PaymentIntents (server-side totals), signed webhooks, optional Connect, Checkout, and Billing.",
  openGraph: {
    title: "Stripe Kit | FivFold",
    description:
      "Backend Stripe integration: customers, PaymentIntents, webhooks, Connect, Checkout, and Billing scaffolding.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stripe Kit | FivFold",
    description:
      "Backend Stripe integration: customers, PaymentIntents, webhooks, Connect, Checkout, and Billing scaffolding.",
  },
  alternates: {
    canonical: "https://fivfold.fivexlabs.com/docs/kits/stripe",
  },
};

export default function StripeKitLayout({ children }: { children: React.ReactNode }) {
  return children;
}
