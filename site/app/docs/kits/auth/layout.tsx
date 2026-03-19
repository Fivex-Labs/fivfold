import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth Kit",
  description:
    "Provider-agnostic authentication screens: Login, Register, Forgot Password, Reset Password, Email Verification. Supports Firebase, Cognito, Auth0, and JWT.",
  openGraph: {
    title: "Auth Kit | FivFold",
    description:
      "Provider-agnostic authentication screens: Login, Register, Forgot Password, Reset Password, Email Verification. Supports Firebase, Cognito, Auth0, and JWT.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Auth Kit | FivFold",
    description:
      "Provider-agnostic authentication screens: Login, Register, Forgot Password, Reset Password, Email Verification. Supports Firebase, Cognito, Auth0, and JWT.",
  },
  alternates: {
    canonical: "https://fivfold.fivexlabs.com/docs/kits/auth",
  },
};

export default function AuthKitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
