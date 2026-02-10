"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { LatLngExpression } from "leaflet";
import type { User } from "better-auth";
import { authClient, signOut as clientSignOut } from "@/lib/auth-client";
import { identifyUser } from "@/lib/analytics";

// ---- Shared Context ----
type SharedContextType = {
  selectedLocation: LatLngExpression | null;
  filter: string;
  user?: User;
  authHint: AuthHint;
  isAuthResolved: boolean;
  setSelectedLocation: (location: LatLngExpression | null) => void;
  setFilter: (filter: string) => void;
  signOut: () => Promise<void>;
};

const SharedContext = createContext<SharedContextType | undefined>(undefined);

type AuthHint = "signed-in" | "signed-out" | "unknown";

// ---- Shared Provider Component ----
function SharedProviders({
  children,
  initialUser,
  authHint,
}: {
  children: ReactNode;
  initialUser?: User;
  authHint?: AuthHint;
}) {
  const [selectedLocation, setSelectedLocation] =
    useState<LatLngExpression | null>(null);
  const [filter, setFilter] = useState<string>("");

  const [localUser, setLocalUser] = useState<User | undefined>(initialUser);
  const [localAuthHint, setLocalAuthHint] = useState<AuthHint>(
    authHint ?? "unknown"
  );

  // Client-side session hook
  const { data } = authClient.useSession();
  const isAuthResolved = data !== undefined;

  // Derive the effective user without calling setState inside an effect.
  // If the client session has been resolved (data is defined), prefer it
  // (including the signed-out case where data.user may be null).
  // Otherwise fall back to the local optimistic user state.
  const user: User | undefined = data?.user ?? localUser;
  const derivedAuthHint: AuthHint = isAuthResolved
    ? data?.user
      ? "signed-in"
      : "signed-out"
    : localAuthHint;

  useEffect(() => {
    if (isAuthResolved || localAuthHint !== "unknown") return;
    if (typeof document === "undefined") return;
    const hasAuthCookie =
      document.cookie.includes("better-auth.session_token") ||
      document.cookie.includes("better-auth.session_data");
    setLocalAuthHint(hasAuthCookie ? "signed-in" : "signed-out");
  }, [isAuthResolved, localAuthHint]);

  // Identify user in PostHog when they sign in
  useEffect(() => {
    if (user?.id) {
      identifyUser(user.id, {
        email: user.email,
        name: user.name,
        image: user.image,
      });
    }
  }, [user?.id, user?.email, user?.name, user?.image]);

  const signOut = async () => {
    const previousLocal = localUser;
    // Optimistically clear the local user so the UI can respond immediately
    // when there is no resolved client session yet. If a client session is
    // present, the session hook (data) will ultimately control the displayed user.
    setLocalUser(undefined);
    try {
      await clientSignOut();
    } catch (error) {
      console.error("Sign out error:", error);
      // Restore local optimistic state on error
      setLocalUser(previousLocal);
      throw error;
    }
  };

  return (
    <SharedContext.Provider
      value={{
        selectedLocation,
        filter,
        user,
        authHint: derivedAuthHint,
        isAuthResolved,
        setSelectedLocation,
        setFilter,
        signOut,
      }}
    >
      {children}
    </SharedContext.Provider>
  );
}

export function useSharedContext() {
  const context = useContext(SharedContext);
  if (context === undefined) {
    throw new Error("useSharedContext must be used within a SharedProvider");
  }
  return context;
}

// ---- Main Provider Component ----
export function Providers({
  children,
  initialUser,
  authHint,
}: {
  children: ReactNode;
  initialUser?: User;
  authHint?: AuthHint;
}) {
  return (
    <SharedProviders initialUser={initialUser} authHint={authHint}>
      {children}
    </SharedProviders>
  );
}
