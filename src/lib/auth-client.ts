import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";
import { trackUserSignIn, trackUserSignOut, resetUser } from "./analytics";

export const authClient = createAuthClient({
  // Use relative base URL (same origin) so signOut/signIn work in deployed environments
  baseURL: "",
});

const { signOut: originalSignOut, signUp } = authClient;

// Wrap signOut with analytics tracking
async function signOut() {
  trackUserSignOut();
  resetUser();
  return originalSignOut();
}

// Sign in with Google using the master branch style
async function signInWithGoogle() {
  try {
    const data = await authClient.signIn.social({
      provider: "google",
    });
    trackUserSignIn();
    return data;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

async function handleSignIn() {
  try {
    await signInWithGoogle();
    // successful redirect
  } catch (error) {
    // Handle redirect error
    toast.error("Unable to sign in. Please try again.");
  }
}

export { signUp, signOut, handleSignIn, signInWithGoogle };
