"use client"

import { useStack } from "../../../components/stack-context"
import { CodeBlock } from "../../../components/code-block"
import { DocCallout } from "../../../components/doc-blocks"
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
        The Auth Kit is built exclusively with shadcn/ui primitives. Follow the steps
        below to install, integrate, and customize the UI for <strong className="text-white">{label}</strong>.
      </p>

      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-7 h-7 items-center justify-center rounded-lg bg-brand-primary/20 text-brand-primary text-sm font-bold">
            1
          </span>
          Install the Auth Kit
        </h3>
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
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-7 h-7 items-center justify-center rounded-lg bg-brand-primary/20 text-brand-primary text-sm font-bold">
            2
          </span>
          {label} client setup
        </h3>
        <p className="text-white/80 text-sm mb-4">
          {content.intro}
        </p>
        <div className="space-y-4 mb-4">
          {content.setupSteps.map((step, i) => (
            <div key={i}>
              <h4 className="font-medium text-white text-sm mb-1">{step.title}</h4>
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

      <div>
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-7 h-7 items-center justify-center rounded-lg bg-brand-primary/20 text-brand-primary text-sm font-bold">
            3
          </span>
          Import and use in your app
        </h3>
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
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <span className="flex w-7 h-7 items-center justify-center rounded-lg bg-brand-primary/20 text-brand-primary text-sm font-bold">
            4
          </span>
          Generated file structure
        </h3>
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
    </div>
  )
}
