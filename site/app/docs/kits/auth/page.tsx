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
      stackConfig={{ showAuthProvider: true, showDatabaseFields: true }}
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
        Step-by-step guides for the frontend UI and backend API integration.
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

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="flex w-7 h-7 items-center justify-center rounded-lg bg-brand-primary/20 text-brand-primary text-sm font-bold">
                      5
                    </span>
                    Component reference
                  </h3>
                  <p className="text-white/80 text-sm mb-4">
                    The Auth Kit exposes form components and <code>AuthProvider</code>. Props vary by screen.
                  </p>

                  <div className="space-y-6">
                    <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                      <h4 className="font-medium text-white p-4 pb-2">LoginForm</h4>
                      <p className="text-white/70 text-sm px-4 mb-3">
                        Email/password + OAuth buttons with branded logos. Uses AuthLayout, Input, Label, Button, Separator.
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-y border-white/10">
                              <th className="text-left py-2 px-4 font-medium text-white/80">Prop</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Type</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Purpose</th>
                            </tr>
                          </thead>
                          <tbody className="text-white/70">
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onSubmit</td><td className="py-2 px-4 font-mono text-white/50">(email, password) =&gt; Promise</td><td className="py-2 px-4">Called with credentials. Wire to useAuth().login().</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onForgotPassword</td><td className="py-2 px-4 font-mono text-white/50">() =&gt; void</td><td className="py-2 px-4">Navigate to forgot-password screen.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">oauthProviders</td><td className="py-2 px-4 font-mono text-white/50">(&quot;google&quot; | &quot;github&quot; | &quot;apple&quot;)[]</td><td className="py-2 px-4">OAuth buttons to show. Varies per AuthProvider.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">logoSrc</td><td className="py-2 px-4 font-mono text-white/50">string</td><td className="py-2 px-4">Logo image URL for branding area.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">appName</td><td className="py-2 px-4 font-mono text-white/50">string</td><td className="py-2 px-4">App name for subheading (e.g. &quot;Login to your Acme Inc account&quot;).</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">termsHref</td><td className="py-2 px-4 font-mono text-white/50">string</td><td className="py-2 px-4">Terms of Service URL for footer.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">privacyHref</td><td className="py-2 px-4 font-mono text-white/50">string</td><td className="py-2 px-4">Privacy Policy URL for footer.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">footerContent</td><td className="py-2 px-4 font-mono text-white/50">ReactNode</td><td className="py-2 px-4">Footer (e.g. &quot;Don&apos;t have an account? Sign up&quot; link).</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                      <h4 className="font-medium text-white p-4 pb-2">RegisterForm</h4>
                      <p className="text-white/70 text-sm px-4 mb-3">
                        Registration with display name. Uses AuthLayout, Input, Label, Button, Separator. Inherits logoSrc, appName, termsHref, privacyHref from AuthLayoutFormProps.
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-y border-white/10">
                              <th className="text-left py-2 px-4 font-medium text-white/80">Prop</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Type</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Purpose</th>
                            </tr>
                          </thead>
                          <tbody className="text-white/70">
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">onSubmit</td><td className="py-2 px-4 font-mono text-white/50">(email, password, displayName?) =&gt; Promise</td><td className="py-2 px-4">Wire to useAuth().register().</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">oauthProviders</td><td className="py-2 px-4 font-mono text-white/50">(&quot;google&quot; | &quot;github&quot; | &quot;apple&quot;)[]</td><td className="py-2 px-4">OAuth buttons to show.</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                      <h4 className="font-medium text-white p-4 pb-2">ForgotPasswordForm, ResetPasswordForm, EmailVerification</h4>
                      <p className="text-white/70 text-sm px-4 mb-3">
                        ForgotPasswordForm: request reset link. ResetPasswordForm: new password (token from URL). EmailVerification: status + resend.
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-y border-white/10">
                              <th className="text-left py-2 px-4 font-medium text-white/80">Component</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Key props</th>
                            </tr>
                          </thead>
                          <tbody className="text-white/70">
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">ForgotPasswordForm</td><td className="py-2 px-4">onSubmit(email), onBackToLogin</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">ResetPasswordForm</td><td className="py-2 px-4">token, onSubmit(token, newPassword), onBackToLogin</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">EmailVerification</td><td className="py-2 px-4">onResend, onBackToLogin</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                      <h4 className="font-medium text-white p-4 pb-2">AuthLayout</h4>
                      <p className="text-white/70 text-sm px-4 mb-3">
                        Shared wrapper: responsive split-pane (form left, branding right on desktop), logo slot, Terms &amp; Privacy footer. All form components use it internally.
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-y border-white/10">
                              <th className="text-left py-2 px-4 font-medium text-white/80">Prop</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Type</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Purpose</th>
                            </tr>
                          </thead>
                          <tbody className="text-white/70">
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">logoSrc</td><td className="py-2 px-4 font-mono text-white/50">string</td><td className="py-2 px-4">Logo image URL. Shown in branding pane (desktop) or above form (mobile).</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">appName</td><td className="py-2 px-4 font-mono text-white/50">string</td><td className="py-2 px-4">App name for subheading.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">heading</td><td className="py-2 px-4 font-mono text-white/50">string</td><td className="py-2 px-4">Main heading (e.g. &quot;Welcome back&quot;).</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">subheading</td><td className="py-2 px-4 font-mono text-white/50">string</td><td className="py-2 px-4">Secondary text below heading.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">termsHref</td><td className="py-2 px-4 font-mono text-white/50">string</td><td className="py-2 px-4">Terms of Service URL for footer link.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">privacyHref</td><td className="py-2 px-4 font-mono text-white/50">string</td><td className="py-2 px-4">Privacy Policy URL for footer link.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">footer</td><td className="py-2 px-4 font-mono text-white/50">ReactNode</td><td className="py-2 px-4">Optional footer content (e.g. sign up link).</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                      <h4 className="font-medium text-white p-4 pb-2">AuthProvider & AuthGuard</h4>
                      <p className="text-white/70 text-sm px-4 mb-3">
                        AuthProvider wraps the app and exposes useAuth(). AuthGuard protects routes.
                      </p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-y border-white/10">
                              <th className="text-left py-2 px-4 font-medium text-white/80">Prop</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Type</th>
                              <th className="text-left py-2 px-4 font-medium text-white/80">Purpose</th>
                            </tr>
                          </thead>
                          <tbody className="text-white/70">
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">AuthProvider children</td><td className="py-2 px-4 font-mono text-white/50">ReactNode</td><td className="py-2 px-4">App tree. useAuth() available in descendants.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">AuthGuard children</td><td className="py-2 px-4 font-mono text-white/50">ReactNode</td><td className="py-2 px-4">Protected content. Redirects if unauthenticated.</td></tr>
                            <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">AuthGuard redirectTo</td><td className="py-2 px-4 font-mono text-white/50">string</td><td className="py-2 px-4">Redirect path when unauthenticated.</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">shadcn dependencies</h3>
                  <p className="text-white/80 text-sm mb-3">
                    Adding the Auth Kit installs these shadcn/ui primitives if not already present:
                  </p>
                  <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 px-4 font-medium text-white/80">Component</th>
                          <th className="text-left py-2 px-4 font-medium text-white/80">Used in</th>
                        </tr>
                      </thead>
                        <tbody className="text-white/70">
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">button</td><td className="py-2 px-4">Submit, OAuth (with logos), actions</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">input</td><td className="py-2 px-4">Email, password fields</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">label</td><td className="py-2 px-4">Form labels</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">separator</td><td className="py-2 px-4">OAuth divider</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">@icons-pack/react-simple-icons</td><td className="py-2 px-4">Apple, Google, GitHub logos in OAuthButtons</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono text-brand-secondary">next/image</td><td className="py-2 px-4">Logo in AuthLayout (Next.js)</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ),
          },
          {
            id: "api",
            label: "API",
            icon: "server",
            content: (
              <div className="space-y-6">
                <p className="text-white/80 text-sm leading-relaxed">
                  The Auth API module provides hexagonal auth services, adapters for Firebase/Cognito/Auth0/JWT,
                  and HTTP transport. Select your stack in the sidebar (Framework + Auth Provider) for stack-specific
                  integration steps. Platform icons indicate your current selection.
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
