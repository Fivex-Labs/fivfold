import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Push Notifications Kit",
  description:
    "Backend push notifications with device registration, sending, logging, and pluggable providers (FCM, OneSignal, AWS SNS, Pushy, Pusher Beams).",
  openGraph: {
    title: "Push Notifications Kit | FivFold",
    description:
      "Backend push notifications with device registration, sending, logging, and pluggable providers (FCM, OneSignal, AWS SNS, Pushy, Pusher Beams).",
  },
  twitter: {
    card: "summary_large_image",
    title: "Push Notifications Kit | FivFold",
    description:
      "Backend push notifications with device registration, sending, logging, and pluggable providers (FCM, OneSignal, AWS SNS, Pushy, Pusher Beams).",
  },
  alternates: {
    canonical: "https://fivfold.fivexlabs.com/docs/kits/push",
  },
};

export default function PushKitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
