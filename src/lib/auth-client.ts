import { createAuthClient } from "better-auth/react";
import { genericOAuthClient } from "better-auth/client/plugins";
import { toast } from "sonner";
import { trackUserSignIn, trackUserSignOut, resetUser } from "./analytics";

export const authClient = createAuthClient({
  // Use relative base URL (same origin) so signOut/signIn work in deployed environments
  baseURL: "",
  plugins: [genericOAuthClient()],
});

const { signOut: originalSignOut, signUp } = authClient;

// Wrap signOut with analytics tracking
async function signOut() {
  trackUserSignOut();
  resetUser();
  return originalSignOut();
}

// Sign in with ICSSC SSO via generic OAuth (OIDC)
async function signInWithIcssc() {
  try {
    const data = await authClient.signIn.oauth2({
      providerId: "icssc",
      scopes: ["openid", "email", "profile"],
    });
    trackUserSignIn();
    return data;
  } catch (error) {
    console.error("Error signing in with ICSSC SSO:", error);
    throw error;
  }
}

async function handleSignIn() {
  try {
    await signInWithIcssc();
    // successful redirect
  } catch (error) {
    // Handle redirect error
    toast.error("Unable to sign in. Please try again.");
  }
}

export { signUp, signOut, handleSignIn, signInWithIcssc };
