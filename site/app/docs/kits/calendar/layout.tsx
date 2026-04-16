import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar Kit",
  description:
    "Full-featured calendar with month, week, day, and agenda views. Event creation, editing, attendees, color categories, and all-day support. Includes both UI and backend scaffolding.",
  openGraph: {
    title: "Calendar Kit | FivFold",
    description:
      "Full-featured calendar with month, week, day, and agenda views. Event creation, editing, attendees, color categories, and all-day support. Includes both UI and backend scaffolding.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calendar Kit | FivFold",
    description:
      "Full-featured calendar with month, week, day, and agenda views. Event creation, editing, attendees, color categories, and all-day support. Includes both UI and backend scaffolding.",
  },
  alternates: {
    canonical: "https://fivfold.fivexlabs.com/docs/kits/calendar",
  },
};

export default function CalendarKitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
