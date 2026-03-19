import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kanban Kit",
  description:
    "Drag-and-drop kanban board with columns, tasks, priorities, assignees, and labels. Includes both UI and backend scaffolding.",
  openGraph: {
    title: "Kanban Kit | FivFold",
    description:
      "Drag-and-drop kanban board with columns, tasks, priorities, assignees, and labels. Includes both UI and backend scaffolding.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kanban Kit | FivFold",
    description:
      "Drag-and-drop kanban board with columns, tasks, priorities, assignees, and labels. Includes both UI and backend scaffolding.",
  },
  alternates: {
    canonical: "https://fivfold.fivexlabs.com/docs/kits/kanban",
  },
};

export default function KanbanKitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
