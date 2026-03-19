import type { Metadata } from "next";
import { DocPage } from "../../components/doc-page";
import { CodeBlock } from "../../components/code-block";

export const metadata: Metadata = {
  title: "Backend Setup",
  description:
    "Configure and scaffold backend modules for your Kits. Express and NestJS with TypeORM and PostgreSQL.",
  openGraph: {
    title: "Backend Setup | FivFold",
    description:
      "Configure and scaffold backend modules for your Kits. Express and NestJS with TypeORM and PostgreSQL.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Backend Setup | FivFold",
    description:
      "Configure and scaffold backend modules for your Kits. Express and NestJS with TypeORM and PostgreSQL.",
  },
  alternates: {
    canonical: "https://fivfold.fivexlabs.com/docs/api/setup",
  },
};

const headings = [
  { id: "overview", text: "Overview", level: 2 },
  { id: "supported-stacks", text: "Supported stacks", level: 2 },
  { id: "initialization", text: "Initialization", level: 2 },
];

export default function ApiSetupPage() {
  return (
    <DocPage
      title="Backend Setup"
      description="Configure and scaffold backend modules for your Kits."
      headings={headings}
    >
      <h2 id="overview">Overview</h2>
      <p>
        The FivFold API CLI scaffolds backend code for Kits: entities, DTOs, services, and controllers.
        It supports Express and NestJS with TypeORM and PostgreSQL.
      </p>

      <h2 id="supported-stacks">Supported stacks</h2>
      <ul>
        <li>Express + TypeORM + PostgreSQL</li>
        <li>NestJS + TypeORM + PostgreSQL</li>
      </ul>

      <h2 id="initialization">Initialization</h2>
      <p>
        Run <code>npx @fivfold/api init</code> to configure your stack. You will be prompted for:
      </p>
      <ul>
        <li>Framework (Express or NestJS)</li>
        <li>ORM (TypeORM)</li>
        <li>Database (PostgreSQL)</li>
        <li>Output directory for generated files</li>
      </ul>
      <p>
        Configuration is saved to <code>fivfold.json</code>. Then add API modules:
      </p>
      <CodeBlock
        code={`npx @fivfold/api add email
npx @fivfold/api add kanban`}
        language="bash"
        showTerminalIcon
      />
    </DocPage>
  );
}
