"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { LatLngExpression } from "leaflet";
import { User } from "better-auth";
import { authClient, signOut as clientSignOut } from "@/lib/auth-client";

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

  // Start with server-provided user
  const [user, setUser] = useState<User | undefined>(initialUser);

  // Client-side session hook
  const { data } = authClient.useSession();

  // Hydrate with client session once available
  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    } else if (data?.user === null) {
      // User signed out on client
      setUser(undefined);
    }
  }, [data?.user]);

  const signOut = async () => {
    const previousUser = user;
    // Optimistically clear the user immediately so the UI responds without waiting
    setUser(undefined);
    try {
      await clientSignOut();
    } catch (error) {
      console.error("Sign out error:", error);
      setUser(previousUser);
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
