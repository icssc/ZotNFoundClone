"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { LatLngExpression } from "leaflet";
import { User } from "better-auth";
import { authClient, signOut as clientSignOut } from "@/lib/auth-client";
import { identifyUser } from "@/lib/analytics";

// ---- Shared Context ----
type SharedContextType = {
  selectedLocation: LatLngExpression | null;
  filter: string;
  user?: User;
  setSelectedLocation: (location: LatLngExpression | null) => void;
  setFilter: (filter: string) => void;
  signOut: () => Promise<void>;
};

const SharedContext = createContext<SharedContextType | undefined>(undefined);

// ---- Shared Provider Component ----
function SharedProviders({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: User;
}) {
  const [selectedLocation, setSelectedLocation] =
    useState<LatLngExpression | null>(null);
  const [filter, setFilter] = useState<string>("");

  const [localUser, setLocalUser] = useState<User | undefined>(initialUser);

  // Client-side session hook
  const { data } = authClient.useSession();

  // Derive the effective user without calling setState inside an effect.
  // If the client session has been resolved (data is defined), prefer it
  // (including the signed-out case where data.user may be null).
  // Otherwise fall back to the local optimistic user state.
  const user: User | undefined = data?.user ?? localUser;

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
}: {
  children: ReactNode;
  initialUser?: User;
}) {
  return (
    <SharedProviders initialUser={initialUser}>{children}</SharedProviders>
  );
}
