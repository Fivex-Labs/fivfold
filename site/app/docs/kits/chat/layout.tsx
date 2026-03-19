import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat Kit",
  description:
    "Full-featured iMessage/WhatsApp-inspired chat with 1-1 and group conversations, attachments, polls, GIFs, location sharing, reactions, and Socket.IO real-time transport.",
  openGraph: {
    title: "Chat Kit | FivFold",
    description:
      "Full-featured iMessage/WhatsApp-inspired chat with 1-1 and group conversations, attachments, polls, GIFs, location sharing, reactions, and Socket.IO real-time transport.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chat Kit | FivFold",
    description:
      "Full-featured iMessage/WhatsApp-inspired chat with 1-1 and group conversations, attachments, polls, GIFs, location sharing, reactions, and Socket.IO real-time transport.",
  },
  alternates: {
    canonical: "https://fivfold.fivexlabs.com/docs/kits/chat",
  },
};

export default function ChatKitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
