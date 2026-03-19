"use client"

import { useStack } from "../../../components/stack-context"
import { CodeBlock } from "../../../components/code-block"
import { DocCallout } from "../../../components/doc-blocks"
import { KitDocStepHeading } from "../../../components/kit-doc-step-heading"
import { KitFeBeConnectionGuide } from "../../../components/kit-fe-be-connection"
import { KitIntegrationDisclaimer } from "../../../components/kit-integration-disclaimer"
import { KitUserModelIntegration } from "../../../components/kit-user-model-integration"
import type { AuthProvider } from "../../../components/stack-context"

const PROVIDER_LABELS: Record<AuthProvider, string> = {
  firebase: "Firebase",
  cognito: "AWS Cognito",
  auth0: "Auth0",
  jwt: "JWT",
}

const PROVIDER_UI_CONTENT: Record<
  AuthProvider,
  {
    installCmd: string
    intro: string
    envVars: string[]
    setupSteps: { title: string; content: React.ReactNode }[]
    authProviderSnippet: string
    oauthNote?: string
  }
> = {
  firebase: {
    installCmd: "npx @fivfold/ui add auth --provider firebase",
    intro:
      "Firebase Authentication provides email/password, OAuth (Google, GitHub, Apple), and email verification out of the box. The Auth Kit wires Firebase Auth SDK to the shared UI components.",
    envVars: [
      "NEXT_PUBLIC_FIREBASE_API_KEY",
      "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
      "NEXT_PUBLIC_FIREBASE_APP_ID",
    ],
    setupSteps: [
      {
        title: "Create a Firebase project",
        content: (
          <p className="text-white/80 text-sm mb-2">
            Go to <a href="https://console.firebase.google.com" className="text-brand-primary underline" target="_blank" rel="noopener noreferrer">Firebase Console</a>, create a project, and enable Authentication. Enable Email/Password and the OAuth providers (Google, GitHub, Apple) you need.
          </p>
        ),
      },
      {
        title: "Add Firebase config",
        content: (
          <p className="text-white/80 text-sm mb-2">
            Copy your Firebase config from Project Settings → General → Your apps. Add the variables to <code className="rounded bg-white/10 px-1.5 py-0.5">.env.local</code>.
          </p>
        ),
      },
      {
        title: "Configure OAuth redirect domains",
        content: (
          <p className="text-white/80 text-sm mb-2">
            In Firebase Console → Authentication → Settings → Authorized domains, add your app domain (e.g. <code className="rounded bg-white/10 px-1.5 py-0.5">localhost</code> for dev). For Google/GitHub/Apple, add the redirect URLs in each provider&apos;s console.
          </p>
        ),
      },
    ],
    authProviderSnippet: `// providers/firebase-client.ts
import { initializeApp } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

export async function signInWithGoogle() {
  const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth")
  return signInWithPopup(auth, new GoogleAuthProvider())
}`,
    oauthNote: "Firebase Auth handles OAuth popups internally. Ensure signInWithPopup is allowed in your browser (no third-party cookies blocked).",
  },
  cognito: {
    installCmd: "npx @fivfold/ui add auth --provider cognito",
    intro:
      "AWS Cognito provides User Pools for email/password and federated identity (Google, GitHub, Apple via Cognito Identity Pools). The Auth Kit wires Amplify Auth to the shared UI.",
    envVars: [
      "NEXT_PUBLIC_AWS_REGION",
      "NEXT_PUBLIC_COGNITO_USER_POOL_ID",
      "NEXT_PUBLIC_COGNITO_CLIENT_ID",
    ],
    setupSteps: [
      {
        title: "Create a Cognito User Pool",
        content: (
          <p className="text-white/80 text-sm mb-2">
            In <a href="https://console.aws.amazon.com/cognito" className="text-brand-primary underline" target="_blank" rel="noopener noreferrer">AWS Cognito Console</a>, create a User Pool. Enable email/password sign-in. Add an App client (no client secret for public apps). Note the User Pool ID and Client ID.
          </p>
        ),
      },
      {
        title: "Configure OAuth / Hosted UI (optional)",
        content: (
          <p className="text-white/80 text-sm mb-2">
            For Google/GitHub/Apple, configure Cognito as an Identity Provider. Add your OAuth app credentials in Cognito → User Pool → Sign-in experience → Federated identity provider sign-in. Set the callback URL to your app (e.g. <code className="rounded bg-white/10 px-1.5 py-0.5">https://yourapp.com/auth/callback</code>).
          </p>
        ),
      },
      {
        title: "Add Amplify config",
        content: (
          <p className="text-white/80 text-sm mb-2">
            Install <code className="rounded bg-white/10 px-1.5 py-0.5">aws-amplify</code> and configure. The Auth Kit&apos;s <code className="rounded bg-white/10 px-1.5 py-0.5">providers/cognito-client.ts</code> wraps Amplify Auth methods.
          </p>
        ),
      },
    ],
    authProviderSnippet: `// providers/cognito-client.ts
import { Amplify } from "aws-amplify"
import { signIn, signUp, signOut } from "aws-amplify/auth"

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
    },
  },
})

export async function cognitoSignIn(email: string, password: string) {
  return signIn({ username: email, password })
}`,
    oauthNote: "For OAuth, use Cognito Hosted UI or Amplify's federated sign-in. The Auth Kit can redirect to Hosted UI for social providers.",
  },
  auth0: {
    installCmd: "npx @fivfold/ui add auth --provider auth0",
    intro:
      "Auth0 provides a unified auth platform with email/password, social logins, and MFA. The Auth Kit wires the Auth0 React SDK to the shared UI.",
    envVars: [
      "NEXT_PUBLIC_AUTH0_DOMAIN",
      "NEXT_PUBLIC_AUTH0_CLIENT_ID",
    ],
    setupSteps: [
      {
        title: "Create an Auth0 application",
        content: (
          <p className="text-white/80 text-sm mb-2">
            In <a href="https://manage.auth0.com" className="text-brand-primary underline" target="_blank" rel="noopener noreferrer">Auth0 Dashboard</a>, create a Single Page Application. Add <code className="rounded bg-white/10 px-1.5 py-0.5">http://localhost:3000</code> (and your production URL) to Allowed Callback URLs, Logout URLs, and Allowed Web Origins.
          </p>
        ),
      },
      {
        title: "Enable connections",
        content: (
          <p className="text-white/80 text-sm mb-2">
            In Auth0 → Authentication → Social, enable Google, GitHub, Apple with your OAuth app credentials. Configure the redirect URI to <code className="rounded bg-white/10 px-1.5 py-0.5">https://YOUR_TENANT.auth0.com/login/callback</code>.
          </p>
        ),
      },
      {
        title: "Configure Auth0Provider",
        content: (
          <p className="text-white/80 text-sm mb-2">
            Wrap your app with <code className="rounded bg-white/10 px-1.5 py-0.5">Auth0Provider</code> from <code className="rounded bg-white/10 px-1.5 py-0.5">@auth0/auth0-react</code>. The Auth Kit&apos;s <code className="rounded bg-white/10 px-1.5 py-0.5">auth-provider.tsx</code> delegates to Auth0&apos;s <code className="rounded bg-white/10 px-1.5 py-0.5">useAuth0</code> hook.
          </p>
        ),
      },
    ],
    authProviderSnippet: `// providers/auth0-client.ts
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react"

export function Auth0Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: typeof window !== "undefined" ? window.location.origin : "",
      }}
    >
      {children}
    </Auth0Provider>
  )
}

export function useAuth0Client() {
  return useAuth0()
}`,
    oauthNote: "Auth0 handles OAuth via redirect. Users are sent to Auth0's hosted login page; after sign-in they return to your app.",
  },
  jwt: {
    installCmd: "npx @fivfold/ui add auth --provider jwt",
    intro:
      "JWT mode uses your own backend. The Auth Kit wires the UI to call your API endpoints (register, login, refresh-token, etc.) and stores tokens in httpOnly cookies or secure storage.",
    envVars: ["NEXT_PUBLIC_API_URL"],
    setupSteps: [
      {
        title: "Backend must be running",
        content: (
          <p className="text-white/80 text-sm mb-2">
            Scaffold the Auth API with <code className="rounded bg-white/10 px-1.5 py-0.5">npx @fivfold/api add auth --provider jwt</code>. Ensure your backend exposes <code className="rounded bg-white/10 px-1.5 py-0.5">/auth/register</code>, <code className="rounded bg-white/10 px-1.5 py-0.5">/auth/login</code>, <code className="rounded bg-white/10 px-1.5 py-0.5">/auth/refresh-token</code>, etc.
          </p>
        ),
      },
      {
        title: "Configure API base URL",
        content: (
          <p className="text-white/80 text-sm mb-2">
            Set <code className="rounded bg-white/10 px-1.5 py-0.5">NEXT_PUBLIC_API_URL</code> to your backend URL (e.g. <code className="rounded bg-white/10 px-1.5 py-0.5">http://localhost:4000</code>). The Auth Kit&apos;s JWT client will POST to <code className="rounded bg-white/10 px-1.5 py-0.5">${"${API_URL}/auth"}</code>.
          </p>
        ),
      },
      {
        title: "Token handling",
        content: (
          <p className="text-white/80 text-sm mb-2">
            The backend typically returns <code className="rounded bg-white/10 px-1.5 py-0.5">accessToken</code> and <code className="rounded bg-white/10 px-1.5 py-0.5">refreshToken</code>. The JWT client stores them (e.g. in memory + httpOnly cookie for refresh). For OAuth with JWT backend, you configure your backend to accept OAuth callbacks and issue tokens.
          </p>
        ),
      },
    ],
    authProviderSnippet: `// providers/jwt-client.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function jwtLogin(email: string, password: string) {
  const res = await fetch(\`\${API_URL}/auth/login\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}`,
    oauthNote: "With JWT backend, OAuth is typically handled by the backend redirecting to Google/GitHub/Apple and then exchanging the code for tokens. The UI may need to open a popup or redirect to a backend OAuth endpoint.",
  },
}

export function AuthUIContent() {
  const { stack } = useStack()
  const provider = (stack.authProvider ?? "firebase") as AuthProvider
  const content = PROVIDER_UI_CONTENT[provider]
  const label = PROVIDER_LABELS[provider]

  return (
    <div className="space-y-10">
      <p className="text-white/80 text-sm leading-relaxed">
        The Auth Kit is built on shadcn/ui. The steps below follow the standard kit doc order (see{" "}
        <code className="rounded bg-white/10 px-1.5 py-0.5">AGENTS.md</code>
        ). Stack sidebar: <strong className="text-white">{label}</strong> drives install command and integration notes.
      </p>

      <div>
        <KitDocStepHeading step={1}>Install the Auth Kit</KitDocStepHeading>
        <p className="text-white/80 text-sm mb-3">
          Run the FivFold UI CLI to add the Auth Kit. Pass <code className="rounded bg-white/10 px-1.5 py-0.5">--provider {provider}</code> to match your backend.
        </p>
        <CodeBlock
          code={content.installCmd}
          language="bash"
          showTerminalIcon
          className="mb-4"
        />
        <p className="text-white/80 text-sm">
          The Kit is copied to{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-brand-secondary">
            @/components/ui/kits/auth/
          </code>{" "}
          (or your configured kits alias in <code className="rounded bg-white/10 px-1.5 py-0.5">fivfold.json</code>).
        </p>
      </div>

      <div>
        <KitDocStepHeading step={2}>Generated file structure</KitDocStepHeading>
        <p className="text-white/80 text-sm mb-3">
          The command creates a folder with screen components and {label}-specific wiring:
        </p>
        <CodeBlock
          code={`kits/auth/
  types.ts             # AuthContextValue, LoginFormProps, etc.
  auth-layout.tsx      # Shared layout: split-pane (form + branding)
  auth-provider.tsx    # AuthProvider context + useAuth() (wired to ${label})
  login.tsx            # LoginForm
  register.tsx         # RegisterForm
  forgot-password.tsx  # ForgotPasswordForm
  reset-password.tsx   # ResetPasswordForm
  email-verification.tsx # EmailVerification
  oauth-buttons.tsx    # OAuthButtons (Google, GitHub, Apple icons)
  auth-guard.tsx       # AuthGuard for protected routes
  providers/           # Provider-specific client SDK wiring
    ${provider}-client.ts
  index.tsx            # Re-exports`}
          language="text"
          label="File tree"
        />
      </div>

      <div>
        <KitDocStepHeading step={3}>Import and use in your app</KitDocStepHeading>
        <p className="text-white/80 text-sm mb-3">
          Wrap your app with <code className="rounded bg-white/10 px-1.5 py-0.5">AuthProvider</code> and use the screens in your routes:
        </p>
        <CodeBlock
          code={`import { AuthProvider, LoginForm, RegisterForm } from "@/components/ui/kits/auth";

export function AuthLayout() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={
          <LoginForm
            onForgotPassword={() => navigate("/forgot")}
            oauthProviders={["google", "github", "apple"]}
            logoSrc="/logo.png"
            appName="Acme Inc"
            footerContent={<SignUpLink />}
          />
        } />
        <Route path="/register" element={<RegisterForm oauthProviders={["google", "github", "apple"]} logoSrc="/logo.png" appName="Acme Inc" />} />
      </Routes>
    </AuthProvider>
  );
}`}
          language="tsx"
          filename="app/auth/layout.tsx"
        />
      </div>

      <div>
        <KitDocStepHeading step={4}>Props reference</KitDocStepHeading>
        <p className="text-white/80 text-sm mb-4">
          The Auth Kit exposes form components and <code className="rounded bg-white/10 px-1">AuthProvider</code>. Props vary by screen.
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
            <h4 className="font-medium text-white p-4 pb-2">AuthProvider &amp; AuthGuard</h4>
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

      <div className="space-y-6">
        <KitDocStepHeading step={5}>Integration with backend</KitDocStepHeading>
        <KitIntegrationDisclaimer />
        <KitFeBeConnectionGuide
          withDisclaimer={false}
          kitTitle="Auth"
          apiControllerPath="auth"
          realtimeNote="Session refresh and OAuth callbacks often need absolute URLs aligned with your deployed web origin and API base."
        />
        <KitUserModelIntegration
          kitTitle="Auth (UI layer)"
          summary="Screens call your chosen provider SDK or your JWT API. The user id the rest of your app uses must match what the backend puts in tokens or session."
          bullets={[
            "After login, persist or expose the same user identifier your Email, Kanban, Chat, or Push APIs expect in guards.",
            "For JWT mode, point the Auth Kit’s client helpers at the real base URL of your auth module.",
            "OAuth redirect URIs and authorized domains must include every environment where you test (localhost, preview, prod).",
          ]}
        />

        <div>
          <h4 className="text-base font-semibold text-white mb-2">{label} client, env, and proxy</h4>
          <p className="text-white/80 text-sm mb-4">
            {content.intro}
          </p>
          <div className="space-y-4 mb-4">
            {content.setupSteps.map((step, i) => (
              <div key={i}>
                <h5 className="font-medium text-white text-sm mb-1">{step.title}</h5>
                {step.content}
              </div>
            ))}
          </div>
          <p className="text-white/80 text-sm mb-2">
            Environment variables required in <code className="rounded bg-white/10 px-1.5 py-0.5">.env.local</code>:
          </p>
          <CodeBlock
            code={content.envVars.join("\n")}
            language="text"
            label=".env.local"
            className="mb-4"
          />
          <p className="text-white/80 text-sm mb-2">
            Example provider wiring in <code className="rounded bg-white/10 px-1.5 py-0.5">providers/{provider}-client.ts</code>:
          </p>
          <CodeBlock
            code={content.authProviderSnippet}
            language="typescript"
            filename={`providers/${provider}-client.ts`}
          />
          {content.oauthNote && (
            <DocCallout title="OAuth" variant="tip" className="mt-4">
              <p>{content.oauthNote}</p>
            </DocCallout>
          )}
        </div>
      </div>

      <div>
        <KitDocStepHeading step={6}>Third-party integrations</KitDocStepHeading>
        {provider === "jwt" ? (
          <p className="text-white/80 text-sm">
            JWT mode does not bundle a hosted identity vendor. Your Auth API (e.g. from{" "}
            <code className="rounded bg-white/10 px-1">npx @fivfold/api add auth --provider jwt</code>
            ) is the integration surface; add OAuth at the server if needed.
          </p>
        ) : (
          <ul className="list-disc list-inside text-white/80 text-sm space-y-2">
            {provider === "firebase" && (
              <li>
                <a href="https://firebase.google.com/docs/auth" target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline">
                  Firebase Authentication
                </a>{" "}
                — client SDK used by the generated <code className="rounded bg-white/10 px-1">providers/firebase-client.ts</code>.
              </li>
            )}
            {provider === "cognito" && (
              <>
                <li>
                  <a href="https://docs.aws.amazon.com/cognito/latest/developerguide/" target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline">
                    Amazon Cognito User Pools
                  </a>
                </li>
                <li>
                  <a href="https://docs.amplify.aws/react/build-a-backend/auth/" target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline">
                    Amplify Auth (v6)
                  </a>{" "}
                  — typical client for the generated Cognito wiring.
                </li>
              </>
            )}
            {provider === "auth0" && (
              <li>
                <a href="https://auth0.com/docs/libraries/auth0-react" target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline">
                  Auth0 React SDK
                </a>{" "}
                — wrap with <code className="rounded bg-white/10 px-1">Auth0Provider</code> as shown in integration above.
              </li>
            )}
          </ul>
        )}
      </div>

      <div>
        <KitDocStepHeading step={7}>Shadcn primitives dependencies</KitDocStepHeading>
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
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <KitDocStepHeading step={8}>Additional dependencies</KitDocStepHeading>
        <p className="text-white/80 text-sm mb-3">
          Non-shadcn packages used by the kit:
        </p>
        <ul className="list-disc list-inside text-white/75 text-sm space-y-2">
          <li>
            <code className="rounded bg-white/10 px-1 font-mono text-brand-secondary">@icons-pack/react-simple-icons</code> — Apple, Google, GitHub logos in{" "}
            <code className="rounded bg-white/10 px-1">oauth-buttons.tsx</code>.
          </li>
          <li>
            <code className="rounded bg-white/10 px-1 font-mono text-brand-secondary">next/image</code> — logo in AuthLayout when you use Next.js (Vite projects swap for a regular{" "}
            <code className="rounded bg-white/10 px-1">&lt;img&gt;</code>
            ).
          </li>
        </ul>
      </div>
    </div>
  )
}
