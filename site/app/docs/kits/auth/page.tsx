"use client"

import { DocPage } from "../../components/doc-page"
import { DocTabs } from "../../components/doc-tabs"
import { DocCallout } from "../../components/doc-blocks"
import { CodeBlock } from "../../components/code-block"
import { AuthDemo } from "./_components/auth-demo"
import { AuthUIContent } from "./_components/auth-ui-content"
import { AuthBackendContent } from "./_components/auth-backend-content"

const headings = [
  { id: "quick-reference", text: "Quick reference", level: 2 },
  { id: "overview", text: "Overview", level: 2 },
  { id: "demo", text: "Demo", level: 2 },
  { id: "guide", text: "Guide", level: 2 },
]

export default function AuthKitPage() {
  return (
    <DocPage
      title="Auth Kit"
      description="Provider-agnostic authentication screens: Login, Register, Forgot Password, Reset Password, Email Verification. Supports Firebase, Cognito, Auth0, and JWT."
      headings={headings}
      stackConfig={{
        showAuthProvider: true,
        showDatabaseFields: true,
        showFrontendBundler: true,
      }}
    >
      <h2 id="quick-reference" className="scroll-mt-24 font-semibold text-2xl pt-2">
        Quick reference
      </h2>
      <div className="rounded-xl border border-white/10 bg-black/20 p-4 mb-12 mt-4 max-w-2xl">
        <h4 className="font-medium text-white mb-3">CLI commands</h4>
        <CodeBlock
          code={`# Add UI components (Login, Register, Forgot Password, etc.)
npx @fivfold/ui add auth

# Add backend scaffolding (Express/NestJS + Firebase/Cognito/Auth0/JWT)
npx @fivfold/api add auth --framework=nestjs --provider=firebase

# Dry run to preview files
npx @fivfold/ui add auth --dry-run
npx @fivfold/api add auth --dry-run`}
          language="bash"
          className="text-xs"
        />
      </div>

      <h2 id="overview" className="scroll-mt-24 font-semibold text-2xl pt-2">
        Overview
      </h2>
      <p className="text-white/80 leading-relaxed mb-4 mt-4">
        The Auth Kit provides ready-to-use authentication screens that call{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5">useAuth().login()</code>
        , <code className="rounded bg-white/10 px-1.5 py-0.5">register()</code>,{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5">forgotPassword()</code>, and more.
        Provider-specific wiring lives in <code className="rounded bg-white/10 px-1.5 py-0.5">auth-provider.tsx</code>.
        Choose Firebase, AWS Cognito, Auth0, or JWT when scaffolding.
      </p>
      <DocCallout title="Provider Flexibility" variant="info">
        <p>
          All screens use the same <code>useAuth()</code> hook. Swap the AuthProvider implementation
          to switch between Firebase, Cognito, Auth0, or custom JWT—no changes to the UI components.
        </p>
      </DocCallout>

      <h2 id="demo" className="scroll-mt-24 font-semibold text-2xl mt-4 pt-4">
        Demo
      </h2>
      <p className="text-white/60 text-sm mt-1 italic pb-8">
        This demo is presented with Mock Data
      </p>
      <AuthDemo />

      <h2 id="guide" className="scroll-mt-24 font-semibold text-2xl mt-12 pt-4">
        Guide
      </h2>
      <p className="text-white/80 leading-relaxed mb-6 mt-4 text-sm">
        Step-by-step guides for the frontend UI and backend API integration. Select{" "}
        <strong className="text-white/90">Frontend</strong> first in the sidebar, then Auth provider and the rest of your stack.
      </p>
      <DocTabs
        tabs={[
          {
            id: "ui",
            label: "UI",
            icon: "layout",
            content: (
              <div className="space-y-10">
                <AuthUIContent />
              </div>
            ),
          },
          {
            id: "api",
            label: "API",
            icon: "server",
            content: (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Step-by-step: API integration</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  The Auth API module provides hexagonal auth services, adapters for Firebase/Cognito/Auth0/JWT,
                  and HTTP transport. Choose <strong className="text-white/90">Frontend</strong> first for browser/CORS alignment,
                  then Framework, Auth provider, database, and ORM in the sidebar. Platform icons indicate your current selection.
                </p>
                <AuthBackendContent />
              </div>
            ),
          },
        ]}
        defaultTab="ui"
      />
    </DocPage>
  )
}
