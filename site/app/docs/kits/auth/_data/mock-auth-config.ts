export type AuthProviderId = "firebase" | "cognito" | "auth0" | "jwt"

export interface MockAuthProviderConfig {
  id: AuthProviderId
  name: string
  oauthProviders: ("google" | "github" | "apple")[]
}

export const MOCK_AUTH_PROVIDERS: MockAuthProviderConfig[] = [
  {
    id: "firebase",
    name: "Firebase",
    oauthProviders: ["google", "github", "apple"],
  },
  {
    id: "cognito",
    name: "AWS Cognito",
    oauthProviders: ["google", "github", "apple"],
  },
  {
    id: "auth0",
    name: "Auth0",
    oauthProviders: ["google", "github", "apple"],
  },
  {
    id: "jwt",
    name: "JWT",
    oauthProviders: ["google", "github", "apple"],
  },
]
