import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";
export const authClient = createAuthClient({
  // Use relative base URL (same origin) so signOut/signIn work in deployed environments
  baseURL: "",
});

export const { signOut, signUp } = authClient;

// TODO: Changing Error Handling
const signInWithGoogle = async () => {
  try {
    const data = await authClient.signIn.social({
      provider: "google",
    });
    return data;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export async function handleSignIn() {
  try {
    await signInWithGoogle();
    // successful redirect
  } catch (error) {
    // Handle redirect error
    toast.error("Unable to sign in. Please try again.");
  }
}
