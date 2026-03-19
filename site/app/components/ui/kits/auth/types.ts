export interface FivFoldUser {
  id: string
  email: string
  displayName?: string
  photoURL?: string
  emailVerified?: boolean
}

export type AuthState = "idle" | "loading" | "authenticated" | "unauthenticated" | "error"

export interface AuthContextValue {
  user: FivFoldUser | null
  state: AuthState
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName?: string) => Promise<void>
  logout: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  resendVerificationEmail: () => Promise<void>
  signInWithOAuth: (provider: "google" | "github" | "apple") => Promise<void>
}

export interface AuthKitProps {
  children: React.ReactNode
  onAuthStateChange?: (user: FivFoldUser | null) => void
}

export interface AuthLayoutFormProps {
  /** Logo image src for branding area */
  logoSrc?: string
  /** App name (e.g. "Acme Inc") for subheading */
  appName?: string
  /** Terms of Service URL for footer */
  termsHref?: string
  /** Privacy Policy URL for footer */
  privacyHref?: string
  /** Force layout for device preview: "mobile" hides branding pane */
  forceLayout?: "mobile" | "desktop"
}

export interface LoginFormProps extends AuthLayoutFormProps {
  onSubmit?: (email: string, password: string) => void
  onForgotPassword?: () => void
  oauthProviders?: ("google" | "github" | "apple")[]
  /** Footer content (e.g. "Don't have an account? Sign up" link) */
  footerContent?: React.ReactNode
  className?: string
}

export interface RegisterFormProps extends AuthLayoutFormProps {
  onSubmit?: (email: string, password: string, displayName?: string) => void
  oauthProviders?: ("google" | "github" | "apple")[]
  /** Footer content (e.g. "Already have an account? Sign in" link) */
  footerContent?: React.ReactNode
  className?: string
}

export interface ForgotPasswordFormProps extends AuthLayoutFormProps {
  onSubmit?: (email: string) => void
  onBackToLogin?: () => void
  className?: string
}

export interface ResetPasswordFormProps extends AuthLayoutFormProps {
  token: string
  onSubmit?: (token: string, newPassword: string) => void
  onBackToLogin?: () => void
  className?: string
}

export interface EmailVerificationProps extends AuthLayoutFormProps {
  onResend?: () => void
  onBackToLogin?: () => void
  className?: string
}

export interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}
