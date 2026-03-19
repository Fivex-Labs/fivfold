"use client"

import { useStack } from "../../../components/stack-context"
import { CodeBlock } from "../../../components/code-block"
import { DocCallout } from "../../../components/doc-blocks"
import { KitIntegrationDisclaimer } from "../../../components/kit-integration-disclaimer"
import { KitApiFeBePlaybook } from "../../../components/kit-api-fe-be-playbook"
import { KitUserModelIntegration } from "../../../components/kit-user-model-integration"
import { KitDocStepHeading } from "../../../components/kit-doc-step-heading"
import type { AuthProvider, Framework, Orm } from "../../../components/stack-context"

const PROVIDER_LABELS: Record<AuthProvider, string> = {
  firebase: "Firebase",
  cognito: "AWS Cognito",
  auth0: "Auth0",
  jwt: "JWT",
}

const FRAMEWORK_LABELS: Record<Framework, string> = {
  nestjs: "NestJS",
  express: "Express",
}

const ORM_LABELS: Record<Orm, string> = {
  typeorm: "TypeORM",
  prisma: "Prisma",
  mongoose: "Mongoose",
  "cosmos-sdk": "Cosmos SDK",
  "dynamodb-sdk": "DynamoDB SDK",
}

const ENDPOINTS = [
  { method: "POST", path: "/auth/register", desc: "Register new user (email, password, displayName?)", body: true },
  { method: "POST", path: "/auth/login", desc: "Login with email/password, returns access + refresh tokens", body: true },
  { method: "POST", path: "/auth/forgot-password", desc: "Request password reset email", body: true },
  { method: "POST", path: "/auth/reset-password", desc: "Reset password with token from email", body: true },
  { method: "GET", path: "/auth/verify-email", desc: "Verify email with token from link", body: false },
  { method: "POST", path: "/auth/refresh-token", desc: "Exchange refresh token for new access token", body: true },
  { method: "POST", path: "/auth/logout", desc: "Invalidate refresh token, clear session", body: true },
]

const ENV_BY_PROVIDER: Record<AuthProvider, { vars: string[]; description: string }> = {
  firebase: {
    vars: ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"],
    description: "Service account credentials from Firebase Console → Project Settings → Service Accounts. Used by Firebase Admin SDK to verify ID tokens.",
  },
  cognito: {
    vars: ["AWS_REGION", "COGNITO_USER_POOL_ID", "COGNITO_CLIENT_ID"],
    description: "Cognito User Pool configuration. Optional: COGNITO_CLIENT_SECRET for confidential clients.",
  },
  auth0: {
    vars: ["AUTH0_DOMAIN", "AUTH0_CLIENT_ID", "AUTH0_CLIENT_SECRET"],
    description: "Auth0 application credentials. Used to validate access tokens and call Auth0 Management API.",
  },
  jwt: {
    vars: ["JWT_SECRET", "JWT_REFRESH_SECRET", "JWT_EXPIRES_IN", "JWT_REFRESH_EXPIRES_IN"],
    description: "Secrets for signing access and refresh tokens. Use strong random strings (min 32 chars).",
  },
}

const getBackendFileStructure = (
  framework: Framework,
  provider: AuthProvider,
  orm: Orm
): string => {
  const providerLabel = PROVIDER_LABELS[provider]
  const isJWT = provider === "jwt"

  if (framework === "nestjs") {
    if (orm === "typeorm") {
      const base = `src/modules/auth/
  domain/
    auth.port.ts              # IAuthService interface (register, login, forgotPassword, etc.)
    auth.types.ts             # DTOs, token payloads, UserPayload
  adapters/
    ${provider}-auth.adapter.ts   # Implements IAuthService using ${providerLabel} SDK
  dto/
    register.dto.ts           # class-validator DTOs
    login.dto.ts
    refresh-token.dto.ts
  auth.controller.ts         # POST /auth/register, /login, /refresh-token, etc.
  auth.module.ts             # TypeOrmModule.forFeature([User, RefreshToken]), provider wiring
  guards/
    jwt-auth.guard.ts         # Validates JWT or ID token on protected routes
  strategies/
    jwt.strategy.ts           # Passport JWT strategy`
      if (isJWT) {
        return base + `
  entities/
    user.entity.ts            # TypeORM User (email, passwordHash, displayName, etc.)
    refresh-token.entity.ts   # TypeORM RefreshToken
  repositories/
    user.repository.ts        # UserRepository for findByEmail, create, etc.`
      }
      return base
    }
    // NestJS + Prisma
    if (!isJWT) {
      return `src/modules/auth/
  domain/
    auth.port.ts
    auth.types.ts
  adapters/
    ${provider}-auth.adapter.ts
  auth.controller.ts         # Optional: /auth/verify-token, password reset proxy
  auth.module.ts
  guards/
    jwt-auth.guard.ts
  strategies/
    jwt.strategy.ts`
    }
    return `src/modules/auth/
  domain/
    auth.port.ts
    auth.types.ts
  adapters/
    ${provider}-auth.adapter.ts
  dto/
    register.dto.ts
    login.dto.ts
    refresh-token.dto.ts
  auth.controller.ts
  auth.module.ts             # PrismaModule, PrismaUserRepository
  guards/
    jwt-auth.guard.ts
  strategies/
    jwt.strategy.ts

prisma/
  schema.prisma              # User, RefreshToken models`
  }

  // Express
  if (orm === "typeorm") {
    if (!isJWT) {
      return `src/modules/auth/
  domain/
    auth.port.ts
    auth.types.ts
  adapters/
    ${provider}-auth.adapter.ts   # Uses ${providerLabel} Admin SDK for token verification
  routes/
    auth.routes.ts            # Optional: /auth/verify-token, password reset proxy
  middleware/
    jwt.middleware.ts         # Validates ${providerLabel} ID/access token`
    }
    return `src/modules/auth/
  domain/
    auth.port.ts
    auth.types.ts
  adapters/
    ${provider}-auth.adapter.ts
  dto/
    register.dto.ts
    login.dto.ts
  routes/
    auth.routes.ts            # POST /register, /login, /refresh-token, etc.
  middleware/
    jwt.middleware.ts
  entities/
    user.entity.ts            # TypeORM User
    refresh-token.entity.ts   # TypeORM RefreshToken
  repositories/
    user.repository.ts`
  }
  // Express + Prisma
  if (!isJWT) {
    return `src/modules/auth/
  domain/
    auth.port.ts
    auth.types.ts
  adapters/
    ${provider}-auth.adapter.ts
  routes/
    auth.routes.ts
  middleware/
    jwt.middleware.ts`
  }
  return `src/modules/auth/
  domain/
    auth.port.ts
    auth.types.ts
  adapters/
    ${provider}-auth.adapter.ts
  dto/
    register.dto.ts
    login.dto.ts
  routes/
    auth.routes.ts
  middleware/
    jwt.middleware.ts

prisma/
  schema.prisma              # User, RefreshToken models`
}

const REQUEST_RESPONSE_SCHEMAS = (provider: AuthProvider) => {
  if (provider === "jwt") {
    return `// POST /auth/register
Request:  { email: string, password: string, displayName?: string }
Response: { accessToken: string, refreshToken: string, user: { id, email, displayName } }

// POST /auth/login
Request:  { email: string, password: string }
Response: { accessToken: string, refreshToken: string, user: { id, email, displayName } }

// POST /auth/refresh-token
Request:  { refreshToken: string }  (or Cookie: refreshToken)
Response: { accessToken: string, refreshToken?: string }`
  }
  return `// With ${PROVIDER_LABELS[provider]}: Client handles auth via SDK; backend validates tokens
// POST /auth/verify-token (or middleware)
Request:  Authorization: Bearer <id_token_or_access_token>
Response: 200 + user payload, or 401 Unauthorized`
}

export function AuthBackendContent() {
  const { stack } = useStack()
  const provider = (stack.authProvider ?? "firebase") as AuthProvider
  const framework = stack.framework as Framework
  const orm = stack.orm as Orm

  const providerLabel = PROVIDER_LABELS[provider]
  const frameworkLabel = FRAMEWORK_LABELS[framework]
  const ormLabel = ORM_LABELS[orm]
  const isNestJS = framework === "nestjs"
  const isJWT = provider === "jwt"

  const envConfig = ENV_BY_PROVIDER[provider]

  return (
    <div className="space-y-12">
      {/* Intro */}
      <div>
        <p className="text-white/80 text-sm leading-relaxed">
          The Auth API module provides hexagonal auth services, adapters for {providerLabel}, and HTTP transport.
          Your stack: <strong className="text-white">{frameworkLabel}</strong> + <strong className="text-white">{providerLabel}</strong>
          {isJWT && <> + <strong className="text-white">{ormLabel}</strong></>}.
          Content below is tailored to this selection.
        </p>
      </div>

      <div>
        <KitDocStepHeading step={1}>Install / scaffold the module</KitDocStepHeading>
        <p className="text-white/80 text-sm mb-3">
          Run <code className="rounded bg-white/10 px-1.5 py-0.5">npx @fivfold/api init</code> first if you haven&apos;t. The CLI reads <code className="rounded bg-white/10 px-1.5 py-0.5">fivfold.json</code> for framework and ORM; pass <code className="rounded bg-white/10 px-1.5 py-0.5">--provider</code> to scaffold auth.
        </p>
        <CodeBlock
          code={`npx @fivfold/api add auth --provider ${provider}`}
          language="bash"
          showTerminalIcon
        />
      </div>

      <div>
        <KitDocStepHeading step={2}>Generated file structure</KitDocStepHeading>
        <p className="text-white/80 text-sm mb-3">
          The scaffold creates a modular auth layer. Structure for <strong className="text-white">{frameworkLabel}</strong> + <strong className="text-white">{providerLabel}</strong>
          {isJWT && <> + <strong className="text-white">{ormLabel}</strong></>}:
        </p>
        <CodeBlock
          code={getBackendFileStructure(framework, provider, orm)}
          language="text"
          label="File tree"
        />
      </div>

      <div className="space-y-10">
        <KitDocStepHeading step={3}>Wire into the app</KitDocStepHeading>
        <p className="text-white/65 text-sm -mt-1 mb-2">
          Architecture, persistence, and bootstrap on <strong className="text-white/85">{frameworkLabel}</strong> (see <code className="rounded bg-white/10 px-1">AGENTS.md</code> API tab §3).
        </p>

      <div>
        <h4 className="font-semibold text-white mb-3">Hexagonal architecture</h4>
        <p className="text-white/80 text-sm mb-4">
          The Auth module follows hexagonal (ports & adapters) architecture. The <code className="rounded bg-white/10 px-1.5 py-0.5">IAuthService</code> port defines
          framework-agnostic operations; the <code className="rounded bg-white/10 px-1.5 py-0.5">{providerLabel}AuthAdapter</code> implements them using the {providerLabel} SDK or custom logic.
        </p>
        <CodeBlock
          code={`// domain/auth.port.ts
export interface IAuthService {
  register(email: string, password: string, displayName?: string): Promise<AuthResult>
  login(email: string, password: string): Promise<AuthResult>
  forgotPassword(email: string): Promise<void>
  resetPassword(token: string, newPassword: string): Promise<void>
  verifyEmail(token: string): Promise<void>
  refreshToken(refreshToken: string): Promise<AuthResult>
  logout(refreshToken: string): Promise<void>
  verifyToken(token: string): Promise<UserPayload>  // For Firebase/Cognito/Auth0
}`}
          language="typescript"
          filename="domain/auth.port.ts"
        />
      </div>

      {/* Database & entities (wire) */}
      {(isJWT || provider === "firebase" || provider === "cognito" || provider === "auth0") && (
        <div>
          <h4 className="font-semibold text-white mb-3">Database & entities</h4>
          {isJWT ? (
            <>
              <p className="text-white/80 text-sm mb-4">
                With JWT, users and refresh tokens are stored in your database. The scaffold generates a <code className="rounded bg-white/10 px-1.5 py-0.5">User</code> entity and a <code className="rounded bg-white/10 px-1.5 py-0.5">RefreshToken</code> entity, configured for {ormLabel}.
              </p>
              {orm === "typeorm" ? (
                <>
                  <h4 className="font-medium text-white mb-2 text-sm">User entity (TypeORM)</h4>
                  <CodeBlock
                    code={`// auth/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from "typeorm"
import { RefreshToken } from "./refresh-token.entity"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  email: string

  @Column({ select: false })  // Never include in queries by default
  passwordHash: string

  @Column({ nullable: true })
  displayName: string | null

  @Column({ default: false })
  emailVerified: boolean

  @Column({ nullable: true })
  emailVerifyToken: string | null

  @Column({ nullable: true })
  passwordResetToken: string | null

  @Column({ nullable: true })
  passwordResetExpiresAt: Date | null

  @CreateDateColumn()
  createdAt: Date

  @OneToMany(() => RefreshToken, (rt) => rt.user)
  refreshTokens: RefreshToken[]
}`}
                    language="typescript"
                    filename="auth/entities/user.entity.ts"
                  />
                  <h4 className="font-medium text-white mb-2 text-sm mt-4">RefreshToken entity (TypeORM)</h4>
                  <CodeBlock
                    code={`// auth/entities/refresh-token.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./user.entity"

@Entity("refresh_tokens")
export class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  tokenHash: string

  @Column()
  expiresAt: Date

  @Column({ type: "uuid" })
  userId: string

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User

  @CreateDateColumn()
  createdAt: Date
}`}
                    language="typescript"
                    filename="auth/entities/refresh-token.entity.ts"
                  />
                  <h4 className="font-medium text-white mb-2 text-sm mt-4">TypeORM configuration</h4>
                  <p className="text-white/80 text-sm mb-2">
                    Register entities in your TypeORM config (e.g. <code className="rounded bg-white/10 px-1.5 py-0.5">ormconfig.ts</code> or <code className="rounded bg-white/10 px-1.5 py-0.5">data-source.ts</code>):
                  </p>
                  <CodeBlock
                    code={`// data-source.ts or app.module.ts
entities: [
  __dirname + "/auth/entities/**/*.entity{.ts,.js}",
  // ... other entities
]`}
                    language="typescript"
                  />
                  <p className="text-white/80 text-sm mt-4">
                    Run migrations to create the <code className="rounded bg-white/10 px-1.5 py-0.5">users</code> and <code className="rounded bg-white/10 px-1.5 py-0.5">refresh_tokens</code> tables. Use <code className="rounded bg-white/10 px-1.5 py-0.5">{`@Column({ select: false })`}</code> on <code className="rounded bg-white/10 px-1.5 py-0.5">passwordHash</code> so it is never loaded unless explicitly requested.
                  </p>
                </>
              ) : (
                <>
                  <h4 className="font-medium text-white mb-2 text-sm">Prisma schema</h4>
                  <CodeBlock
                    code={`// prisma/schema.prisma (auth-related models)

model User {
  id                String   @id @default(uuid())
  email             String   @unique
  passwordHash      String   @map("password_hash")
  displayName       String?  @map("display_name")
  emailVerified     Boolean  @default(false) @map("email_verified")
  emailVerifyToken  String?  @map("email_verify_token")
  passwordResetToken String? @map("password_reset_token")
  passwordResetExpiresAt DateTime? @map("password_reset_expires_at")
  createdAt         DateTime @default(now()) @map("created_at")

  refreshTokens     RefreshToken[]

  @@map("users")
}

model RefreshToken {
  id        String   @id @default(uuid())
  tokenHash String   @map("token_hash")
  expiresAt DateTime @map("expires_at")
  userId    String   @map("user_id")
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("refresh_tokens")
}`}
                    language="prisma"
                    filename="prisma/schema.prisma"
                  />
                  <h4 className="font-medium text-white mb-2 text-sm mt-4">Prisma commands</h4>
                  <p className="text-white/80 text-sm mb-2">
                    Generate the client and run migrations:
                  </p>
                  <CodeBlock
                    code={`npx prisma generate
npx prisma migrate dev --name add_auth`}
                    language="bash"
                    showTerminalIcon
                  />
                  <DocCallout title="Password hash" variant="tip" className="mt-4">
                    <p>When querying users for login, use <code>select</code> to include <code>passwordHash</code> only when needed: <code>{`prisma.user.findUnique({ where: { email }, select: { id: true, passwordHash: true } })`}</code>.</p>
                  </DocCallout>
                </>
              )}
            </>
          ) : (
            <div className="space-y-4 text-sm text-white/80">
              <p>
                With {providerLabel}, user identity is managed by the provider. You typically do not store passwords in your DB.
                However, you may want to mirror user data for app-specific fields (e.g. preferences, roles, relations).
              </p>
              <p>
                <strong className="text-white">Optional User sync entity:</strong> Create a <code className="rounded bg-white/10 px-1.5 py-0.5">User</code> or <code className="rounded bg-white/10 px-1.5 py-0.5">AppUser</code> table that stores <code className="rounded bg-white/10 px-1.5 py-0.5">providerId</code> (Firebase UID, Cognito sub, Auth0 sub), <code className="rounded bg-white/10 px-1.5 py-0.5">email</code>, <code className="rounded bg-white/10 px-1.5 py-0.5">displayName</code>, and sync on first login or via webhooks.
              </p>
              <CodeBlock
                code={orm === "typeorm"
                  ? `// Optional: sync entity for app-specific data
@Entity("app_users")
export class AppUser {
  @PrimaryGeneratedColumn("uuid")
  id: string
  @Column({ unique: true })
  providerId: string  // Firebase UID, Cognito sub, Auth0 sub
  @Column()
  email: string
  @Column({ nullable: true })
  displayName: string | null
  @Column({ default: "user" })
  role: string
}`
                  : `// Optional: schema.prisma
model AppUser {
  id          String   @id @default(uuid())
  providerId  String   @unique @map("provider_id")
  email       String
  displayName String?  @map("display_name")
  role        String   @default("user")
  @@map("app_users")
}`}
                language={orm === "typeorm" ? "typescript" : "prisma"}
                filename={orm === "typeorm" ? "entities/app-user.entity.ts" : "prisma/schema.prisma"}
              />
            </div>
          )}
        </div>
      )}

      {/* Mount module (wire) */}
      <div>
        <h4 className="font-semibold text-white mb-3">Mount module, routes, and guards</h4>
        {isNestJS ? (
          <>
            <p className="text-white/80 text-sm mb-3">
              Import <code className="rounded bg-white/10 px-1.5 py-0.5">AuthModule</code> into <code className="rounded bg-white/10 px-1.5 py-0.5">AppModule</code>:
            </p>
            <CodeBlock
              code={`// app.module.ts
import { AuthModule } from "./auth/auth.module"

@Module({
  imports: [
    AuthModule,
    // ... other modules
  ],
})
export class AppModule {}`}
              language="typescript"
              filename="app.module.ts"
            />
            <p className="text-white/80 text-sm mt-4 mb-2">
              Protect routes with <code className="rounded bg-white/10 px-1.5 py-0.5">JwtAuthGuard</code>:
            </p>
            <CodeBlock
              code={`@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  @Get("me")
  getMe(@Request() req: { user: UserPayload }) {
    return req.user
  }
}`}
              language="typescript"
            />
          </>
        ) : (
          <>
            <p className="text-white/80 text-sm mb-3">
              Mount the auth router and JWT middleware:
            </p>
            <CodeBlock
              code={`// app.ts or server.ts
import { authRouter } from "./auth/routes/auth.routes"
import { jwtMiddleware } from "./auth/middleware/jwt.middleware"

app.use("/auth", authRouter)
app.use("/api", jwtMiddleware, apiRouter)  // Protected routes`}
              language="typescript"
            />
          </>
        )}
      </div>
      </div>

      <div>
        <KitDocStepHeading step={4}>API reference</KitDocStepHeading>
        <p className="text-white/80 text-sm mb-4">
          {isJWT
            ? "With JWT, the backend owns all auth logic. These endpoints are implemented by the scaffolded module."
            : `With ${providerLabel}, the client uses the SDK for sign-in. The backend validates ID/access tokens and may proxy operations (e.g. password reset) to ${providerLabel}.`}
        </p>
        <div className="overflow-x-auto rounded-xl border border-white/10 mb-4">
          <table className="w-full text-sm text-white/80 border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 font-medium">Method</th>
                <th className="text-left py-3 px-4 font-medium">Path</th>
                <th className="text-left py-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((e, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="py-2 px-4 font-mono text-brand-secondary">{e.method}</td>
                  <td className="py-2 px-4 font-mono">{e.path}</td>
                  <td className="py-2">{e.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h4 className="font-medium text-white mb-2 text-sm">Request / Response schemas</h4>
        <CodeBlock
          code={REQUEST_RESPONSE_SCHEMAS(provider)}
          language="typescript"
          label="Schemas"
        />
      </div>

      <div className="space-y-8">
        <KitDocStepHeading step={5}>Integration with frontend</KitDocStepHeading>
        <KitIntegrationDisclaimer />
        <KitApiFeBePlaybook withDisclaimer={false} kitTitle="Auth" apiControllerPath="auth" />
        <KitUserModelIntegration
          kitTitle="Auth"
          summary={
            isJWT
              ? "The JWT variant persists users and refresh tokens in your database. Those rows must align with any existing profile or membership tables you already have."
              : `With ${providerLabel}, verified tokens carry a subject (e.g. sub claim) or equivalent. Decide whether that string is your canonical user id or whether you maintain a separate User row and map provider ids to it.`
          }
          bullets={
            isJWT
              ? [
                  "Compare generated User entity fields (email, passwordHash, displayName) with your existing user model—merge columns or replace the entity carefully.",
                  "If you already store OAuth identities elsewhere, consider a single users table and link provider ids in a separate column or table.",
                  "Refresh tokens must be revocable; wire logout and rotation to your session policy.",
                ]
              : [
                  "In guards or middleware, map the verified token’s subject to req.user.id consistently across all kits (Email, Kanban, Chat, Push).",
                  "If you need local profile rows, upsert on first login and store the provider uid alongside your internal id.",
                  "Keep JWT/IdP secrets and JWKS URLs in environment variables you control—examples in this doc are placeholders.",
                ]
          }
        />
        <div>
          <h4 className="font-semibold text-white mb-3">Environment variables</h4>
          <p className="text-white/55 text-xs mb-2">
            Names below are a checklist only—set real values per environment after reading the disclaimer above.
          </p>
          <p className="text-white/80 text-sm mb-3">
            {envConfig.description}
          </p>
          <CodeBlock
            code={envConfig.vars.map((v) => `${v}=`).join("\n")}
            language="env"
            label=".env"
          />
          {provider === "firebase" && (
            <DocCallout title="Firebase private key" variant="warning" className="mt-4">
              <p>For <code>FIREBASE_PRIVATE_KEY</code>, use the full key including <code>-----BEGIN PRIVATE KEY-----</code>. Escape newlines as <code>\n</code> in .env or use quotes.</p>
            </DocCallout>
          )}
        </div>

        <div>
        <h4 className="font-semibold text-white mb-3">Connecting the Auth Kit UI with your API</h4>
        <p className="text-white/80 text-sm mb-4">
          The Auth Kit UI uses <code className="rounded bg-white/10 px-1.5 py-0.5">AuthProvider</code> and form components (LoginForm, RegisterForm, etc.) that call <code className="rounded bg-white/10 px-1.5 py-0.5">useAuth()</code>.
          The provider wiring in <code className="rounded bg-white/10 px-1.5 py-0.5">auth-provider.tsx</code> and <code className="rounded bg-white/10 px-1.5 py-0.5">providers/{provider}-client.ts</code> connects to your backend.
        </p>
        {isJWT ? (
          <>
            <p className="text-white/80 text-sm mb-3 font-medium">1. Configure API base URL</p>
            <CodeBlock
              code={`// .env.local (frontend)
NEXT_PUBLIC_API_URL=http://localhost:4000`}
              language="env"
              label=".env.local"
            />
            <p className="text-white/80 text-sm mt-4 mb-3 font-medium">2. JWT client calls your auth endpoints</p>
            <CodeBlock
              code={`// providers/jwt-client.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function jwtLogin(email: string, password: string) {
  const res = await fetch(\`\${API_URL}/auth/login\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  })
  if (!res.ok) throw new Error(await res.text())
  const data = await res.json()
  return { accessToken: data.accessToken, refreshToken: data.refreshToken, user: data.user }
}

export async function jwtRefresh(refreshToken: string) {
  const res = await fetch(\`\${API_URL}/auth/refresh-token\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    credentials: "include",
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}`}
              language="typescript"
              filename="providers/jwt-client.ts"
            />
            <p className="text-white/80 text-sm mt-4 mb-3 font-medium">3. Wire AuthProvider to JWT client</p>
            <CodeBlock
              code={`// auth-provider.tsx
import { jwtLogin, jwtRefresh, jwtRegister, jwtLogout } from "./providers/jwt-client"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [tokens, setTokens] = useState({ accessToken: null, refreshToken: null })

  const login = async (email: string, password: string) => {
    const data = await jwtLogin(email, password)
    setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken })
    setUser(data.user)
  }

  const register = async (email: string, password: string, displayName?: string) => {
    const data = await jwtRegister(email, password, displayName)
    setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken })
    setUser(data.user)
  }

  // ... wire forgotPassword, resetPassword, logout to jwt-client
  return <AuthContext.Provider value={{ user, login, register, ... }}>{children}</AuthContext.Provider>
}`}
              language="tsx"
              filename="auth-provider.tsx"
            />
          </>
        ) : (
          <>
            <p className="text-white/80 text-sm mb-3 font-medium">1. Client uses {providerLabel} SDK directly</p>
            <p className="text-white/80 text-sm mb-3">
              With {providerLabel}, the Auth Kit&apos;s <code className="rounded bg-white/10 px-1.5 py-0.5">providers/{provider}-client.ts</code> uses the {providerLabel} SDK for sign-in (email/password, OAuth).
              No direct API calls to your backend for login—the client gets an ID token from {providerLabel}.
            </p>
            <p className="text-white/80 text-sm mb-3 font-medium">2. Backend validates tokens on protected routes</p>
            <CodeBlock
              code={`// Your backend (NestJS guard or Express middleware) validates the token:
// - Firebase: auth().verifyIdToken(token)
// - Cognito: verify JWT against User Pool JWKS
// - Auth0: verify JWT against Auth0 JWKS

// Frontend sends token in every API request:
fetch("/api/protected", {
  headers: { Authorization: \`Bearer \${idToken}\` },
})`}
              language="typescript"
            />
            <p className="text-white/80 text-sm mt-4 mb-3 font-medium">3. Wire AuthProvider to {providerLabel} SDK</p>
            <p className="text-white/70 text-sm">
              The scaffolded <code className="rounded bg-white/10 px-1.5 py-0.5">auth-provider.tsx</code> imports from <code className="rounded bg-white/10 px-1.5 py-0.5">providers/{provider}-client.ts</code> and delegates <code className="rounded bg-white/10 px-1.5 py-0.5">login</code>, <code className="rounded bg-white/10 px-1.5 py-0.5">signInWithOAuth</code>, etc. to the SDK. Ensure env vars (e.g. <code className="rounded bg-white/10 px-1.5 py-0.5">NEXT_PUBLIC_FIREBASE_*</code>) are set.
            </p>
          </>
        )}
        <p className="text-white/70 text-sm mt-4">
          For protected routes, wrap your app with <code className="rounded bg-white/10 px-1.5 py-0.5">AuthGuard</code> and pass the token in API fetch headers.
        </p>
        </div>
      </div>

      <div>
        <KitDocStepHeading step={6}>Third-party integrations ({providerLabel})</KitDocStepHeading>
        {provider === "firebase" && (
          <div className="space-y-4 text-sm text-white/80">
            <p>
              <strong className="text-white">Token verification:</strong> Use Firebase Admin SDK <code className="rounded bg-white/10 px-1.5 py-0.5">auth().verifyIdToken(token)</code>.
              The client sends the Firebase ID token in <code className="rounded bg-white/10 px-1.5 py-0.5">Authorization: Bearer</code>.
            </p>
            <p>
              <strong className="text-white">Custom claims:</strong> Set claims via Admin SDK for role-based access. The decoded token includes <code className="rounded bg-white/10 px-1.5 py-0.5">claims</code>.
            </p>
            <p>
              <strong className="text-white">Password reset:</strong> Use <code className="rounded bg-white/10 px-1.5 py-0.5">auth().generatePasswordResetLink(email)</code> and send the link via your email service.
            </p>
          </div>
        )}
        {provider === "cognito" && (
          <div className="space-y-4 text-sm text-white/80">
            <p>
              <strong className="text-white">Admin APIs:</strong> Use <code className="rounded bg-white/10 px-1.5 py-0.5">@aws-sdk/client-cognito-identity-provider</code> for AdminInitiateAuth, AdminCreateUser, etc.
            </p>
            <p>
              <strong className="text-white">Token verification:</strong> Cognito returns JWT access and ID tokens. Verify the JWT signature using the User Pool&apos;s JWKS endpoint.
            </p>
            <p>
              <strong className="text-white">Hosted UI:</strong> For OAuth, redirect users to Cognito Hosted UI. The callback includes authorization code; exchange for tokens server-side.
            </p>
          </div>
        )}
        {provider === "auth0" && (
          <div className="space-y-4 text-sm text-white/80">
            <p>
              <strong className="text-white">Token verification:</strong> Use <code className="rounded bg-white/10 px-1.5 py-0.5">jwks-rsa</code> + <code className="rounded bg-white/10 px-1.5 py-0.5">jsonwebtoken</code> to verify the JWT against Auth0&apos;s JWKS.
            </p>
            <p>
              <strong className="text-white">Management API:</strong> For user CRUD, use Auth0 Management API with a Machine-to-Machine token.
            </p>
            <p>
              <strong className="text-white">Rules & Hooks:</strong> Use Auth0 Rules (legacy) or Actions for custom logic (e.g. add claims, block login).
            </p>
          </div>
        )}
        {provider === "jwt" && (
          <div className="space-y-4 text-sm text-white/80">
            <p>
              <strong className="text-white">User storage:</strong> With {ormLabel}, the adapter stores users in your database. The scaffold generates a User entity and repository.
            </p>
            <p>
              <strong className="text-white">Password hashing:</strong> Use <code className="rounded bg-white/10 px-1.5 py-0.5">bcrypt</code> or <code className="rounded bg-white/10 px-1.5 py-0.5">argon2</code> for passwords. Never store plain text.
            </p>
            <p>
              <strong className="text-white">Refresh tokens:</strong> Store refresh tokens in DB (or Redis) with user ID and expiry. Rotate on use; revoke on logout.
            </p>
            <p>
              <strong className="text-white">OAuth with JWT:</strong> To support Google/GitHub/Apple, add OAuth routes that exchange the provider&apos;s code for tokens, create/find user, and issue your JWTs.
            </p>
          </div>
        )}
      </div>

      <div>
        <KitDocStepHeading step={8}>Additional notes</KitDocStepHeading>
        <h4 className="font-semibold text-white mb-2 text-sm">Security</h4>
        <ul className="text-sm text-white/80 space-y-2 list-disc list-inside mb-6">
          <li><strong className="text-white">CORS:</strong> Restrict origins to your frontend domain(s).</li>
          <li><strong className="text-white">Rate limiting:</strong> Apply to login, register, forgot-password to prevent brute force.</li>
          <li><strong className="text-white">Token storage:</strong> Access token in memory or short-lived cookie; refresh token in httpOnly cookie when possible.</li>
          <li><strong className="text-white">HTTPS:</strong> Always use HTTPS in production.</li>
          {isJWT && <li><strong className="text-white">Secrets:</strong> Rotate JWT secrets periodically; use different secrets per environment.</li>}
        </ul>
        <h4 className="font-semibold text-white mb-2 text-sm">HTTP errors (typical)</h4>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-4 font-medium text-white/80">Status</th>
                <th className="text-left py-2 px-4 font-medium text-white/80">Scenario</th>
              </tr>
            </thead>
            <tbody className="text-white/70">
              <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono">400</td><td className="py-2 px-4">Invalid request body, validation errors</td></tr>
              <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono">401</td><td className="py-2 px-4">Invalid or expired token, wrong credentials</td></tr>
              <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono">403</td><td className="py-2 px-4">Forbidden (e.g. email not verified)</td></tr>
              <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono">409</td><td className="py-2 px-4">Email already registered</td></tr>
              <tr className="border-b border-white/5"><td className="py-2 px-4 font-mono">429</td><td className="py-2 px-4">Rate limit exceeded</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
