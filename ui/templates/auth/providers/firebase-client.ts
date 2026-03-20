/**
 * Firebase Auth client SDK initialization and auth functions.
 * Generated when --provider=firebase is used.
 * Replace with actual Firebase implementation:
 *
 * import { initializeApp } from 'firebase/app';
 * import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, ... } from 'firebase/auth';
 *
 * const app = initializeApp(firebaseConfig);
 * const auth = getAuth(app);
 */

export async function loginWithEmail(_email: string, _password: string) {
  // Stub: implement with Firebase signInWithEmailAndPassword
  throw new Error("Firebase client not configured. Run with --provider=firebase and configure Firebase.")
}

export async function registerWithEmail(_email: string, _password: string, _displayName?: string) {
  // Stub: implement with Firebase createUserWithEmailAndPassword + updateProfile
  throw new Error("Firebase client not configured.")
}

export async function signInWithOAuth(_provider: "google" | "github" | "apple") {
  // Stub: implement with signInWithPopup / signInWithRedirect
  throw new Error("Firebase client not configured.")
}
