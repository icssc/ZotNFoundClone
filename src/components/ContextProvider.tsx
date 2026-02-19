"use client";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import type { LatLngExpression } from "leaflet";
import type { User } from "better-auth";
import { authClient, signOut as clientSignOut } from "@/lib/auth-client";
import { identifyUser, trackError } from "@/lib/analytics";

// ---- Shared Context ----
type SharedContextType = {
  selectedLocation: LatLngExpression | null;
  filter: string;
  user?: User;
  isUserHydrated: boolean;
  setSelectedLocation: (location: LatLngExpression | null) => void;
  setFilter: (filter: string) => void;
  signOut: () => Promise<void>;
};

const SharedContext = createContext<SharedContextType | undefined>(undefined);

// ---- Main Provider Component ----
export function Providers({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocation] =
    useState<LatLngExpression | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [sessionState, setSessionState] = useState<{
    user?: User;
    isHydrated: boolean;
  }>({ user: undefined, isHydrated: false });

  // Resolve session on the client after hydration to keep root HTML cacheable.
  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      let session: Awaited<ReturnType<typeof authClient.getSession>> | null =
        null;

      try {
        session = await authClient.getSession();
      } catch (error) {
        trackError({
          error: error instanceof Error ? error.message : "Unknown error",
          context: "Session load error",
          severity: "medium",
        });
      }

      const nextUser = session?.data?.user ?? undefined;

      if (!mounted) return;
      setSessionState({ user: nextUser, isHydrated: true });
    };

    void loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  const user: User | undefined = sessionState.user;

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
    const previousUser = sessionState.user;
    setSessionState({ user: undefined, isHydrated: true });
    try {
      await clientSignOut();
    } catch (error) {
      trackError({
        error: error instanceof Error ? error.message : "Unknown error",
        context: "Sign out error",
        severity: "medium",
      });
      setSessionState({ user: previousUser, isHydrated: true });
      throw error;
    }
  };

  return (
    <SharedContext.Provider
      value={{
        selectedLocation,
        filter,
        user,
        isUserHydrated: sessionState.isHydrated,
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
