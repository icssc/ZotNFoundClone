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
import { identifyUser } from "@/lib/analytics";

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
  const [localUser, setLocalUser] = useState<User | undefined>(undefined);
  const [isUserHydrated, setIsUserHydrated] = useState<boolean>(false);

  // Resolve session on the client after hydration to keep root HTML cacheable.
  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const session = await authClient.getSession();
        if (!mounted) return;
        const nextUser = session.data?.user ?? undefined;
        setLocalUser(nextUser);
      } catch (error) {
        if (!mounted) return;
        console.error("Session load error:", error);
        setLocalUser(undefined);
      } finally {
        if (mounted) {
          setIsUserHydrated(true);
        }
      }
    };

    void loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  const user: User | undefined = localUser;

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
    const previousUser = localUser;
    setLocalUser(undefined);
    try {
      await clientSignOut();
    } catch (error) {
      console.error("Sign out error:", error);
      setLocalUser(previousUser);
      throw error;
    }
  };

  return (
    <SharedContext.Provider
      value={{
        selectedLocation,
        filter,
        user,
        isUserHydrated,
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
