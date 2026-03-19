import type { Metadata } from "next";
import { DocPage } from "../../components/doc-page";

export const metadata: Metadata = {
  title: "Express + TypeORM",
  description:
    "Backend scaffolding for Express with TypeORM and PostgreSQL. Entities, DTOs, services, and route handlers.",
  openGraph: {
    title: "Express + TypeORM | FivFold",
    description:
      "Backend scaffolding for Express with TypeORM and PostgreSQL. Entities, DTOs, services, and route handlers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Express + TypeORM | FivFold",
    description:
      "Backend scaffolding for Express with TypeORM and PostgreSQL. Entities, DTOs, services, and route handlers.",
  },
  alternates: {
    canonical: "https://fivfold.fivexlabs.com/docs/api/express",
  },
};

const headings = [
  { id: "overview", text: "Overview", level: 2 },
  { id: "generated-files", text: "Generated files", level: 2 },
  { id: "integration", text: "Integration", level: 2 },
];

export default function ExpressApiPage() {
  return (
    <DocPage
      title="Express + TypeORM"
      description="Backend scaffolding for Express with TypeORM and PostgreSQL."
      headings={headings}
    >
      <h2 id="overview">Overview</h2>
      <p>
        The Express stack generates entities, DTOs (with class-validator), services, and route handlers.
        Each module includes a <code>README.md</code> with integration instructions.
      </p>

      <h2 id="generated-files">Generated files</h2>
      <ul>
        <li><code>entities/</code> — TypeORM entity definitions</li>
        <li><code>dto/</code> — Request/response DTOs with validation</li>
        <li><code>services/</code> — Business logic</li>
        <li><code>routes/</code> — Express router with API endpoints</li>
      </ul>

      <h2 id="integration">Integration</h2>
      <p>
        Mount the generated router in your Express app and register entities with TypeORM.
        See the <code>README.md</code> in each module for step-by-step integration.
      </p>
    </DocPage>
  );
}
