import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  //  TODO: Change this to your server URL
  baseURL: "http://localhost:3000",
});

export const { signOut, signUp } = authClient;

// TODO: Changing Error Handling
export const signInWithGoogle = async () => {
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
