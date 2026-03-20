/**
 * Auth0 SPA SDK initialization and hooks wrapper.
 * Generated when --provider=auth0 is used.
 * Replace with actual Auth0 implementation:
 *
 * import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
 */

export async function loginWithEmail(_email: string, _password: string) {
  // Stub: implement with Auth0 Resource Owner Password grant or Universal Login
  throw new Error("Auth0 client not configured. Run with --provider=auth0 and configure Auth0.")
}

export async function registerWithEmail(_email: string, _password: string, _displayName?: string) {
  // Stub: Auth0 typically uses Universal Login for registration
  throw new Error("Auth0 client not configured.")
}

export async function signInWithOAuth(_provider: "google" | "github" | "apple") {
  // Stub: implement with Auth0 loginWithRedirect
  throw new Error("Auth0 client not configured.")
}
