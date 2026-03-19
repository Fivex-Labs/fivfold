import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Kit",
  description:
    "Full-featured email client with folders, threads, compose dialog, labels, and responsive layout. Includes both UI and backend scaffolding.",
  openGraph: {
    title: "Email Kit | FivFold",
    description:
      "Full-featured email client with folders, threads, compose dialog, labels, and responsive layout. Includes both UI and backend scaffolding.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Email Kit | FivFold",
    description:
      "Full-featured email client with folders, threads, compose dialog, labels, and responsive layout. Includes both UI and backend scaffolding.",
  },
  alternates: {
    canonical: "https://fivfold.fivexlabs.com/docs/kits/email",
  },
};

export default function EmailKitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
