/**
 * AWS Amplify / Cognito Identity client SDK initialization.
 * Generated when --provider=cognito is used.
 * Replace with actual Amplify Auth implementation.
 */

export async function loginWithEmail(_email: string, _password: string) {
  // Stub: implement with Amplify Auth.signIn
  throw new Error("Cognito client not configured. Run with --provider=cognito and configure Amplify.")
}

export async function registerWithEmail(_email: string, _password: string, _displayName?: string) {
  // Stub: implement with Amplify Auth.signUp
  throw new Error("Cognito client not configured.")
}

export async function signInWithOAuth(_provider: "google" | "github" | "apple") {
  // Stub: implement with Amplify Auth.federatedSignIn
  throw new Error("Cognito client not configured.")
}
