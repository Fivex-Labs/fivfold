import type { Metadata } from "next";
import { DocPage } from "../../components/doc-page";

export const metadata: Metadata = {
  title: "NestJS + TypeORM",
  description:
    "Backend scaffolding for NestJS with TypeORM and PostgreSQL. Entities, DTOs, services, controllers, and modules.",
  openGraph: {
    title: "NestJS + TypeORM | FivFold",
    description:
      "Backend scaffolding for NestJS with TypeORM and PostgreSQL. Entities, DTOs, services, controllers, and modules.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NestJS + TypeORM | FivFold",
    description:
      "Backend scaffolding for NestJS with TypeORM and PostgreSQL. Entities, DTOs, services, controllers, and modules.",
  },
  alternates: {
    canonical: "https://fivfold.fivexlabs.com/docs/api/nestjs",
  },
};

const headings = [
  { id: "overview", text: "Overview", level: 2 },
  { id: "generated-files", text: "Generated files", level: 2 },
  { id: "integration", text: "Integration", level: 2 },
];

export default function NestJSApiPage() {
  return (
    <DocPage
      title="NestJS + TypeORM"
      description="Backend scaffolding for NestJS with TypeORM and PostgreSQL."
      headings={headings}
    >
      <h2 id="overview">Overview</h2>
      <p>
        The NestJS stack generates entities, DTOs (with class-validator), services, controllers, and modules.
        Each module includes a <code>README.md</code> with integration instructions.
      </p>

      <h2 id="generated-files">Generated files</h2>
      <ul>
        <li><code>entities/</code> — TypeORM entity definitions</li>
        <li><code>dto/</code> — Request/response DTOs with validation</li>
        <li><code>services/</code> — Injectable services</li>
        <li><code>controllers/</code> — REST controllers</li>
        <li><code>modules/</code> — NestJS module wiring</li>
      </ul>

      <h2 id="integration">Integration</h2>
      <p>
        Import the generated module into your <code>AppModule</code> and configure TypeORM.
        See the <code>README.md</code> in each module for step-by-step integration.
      </p>
    </DocPage>
  );
}
