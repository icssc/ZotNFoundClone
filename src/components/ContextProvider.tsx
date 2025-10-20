"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { LatLngExpression } from "leaflet";
import { authClient } from "@/lib/auth-client";

// ---- Shared Context ----
type SharedContextType = {
  selectedLocation: LatLngExpression | null;
  filter: string;
  user: string | null;
  setSelectedLocation: (location: LatLngExpression | null) => void;
  setFilter: (filter: string) => void;
};

const SharedContext = createContext<SharedContextType | undefined>(undefined);

// ---- Shared Provider Component ----
function SharedProviders({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: string | null;
}) {
  const [selectedLocation, setSelectedLocation] =
    useState<LatLngExpression | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [user, setUser] = useState<string | null>(initialUser);
  const { data: sessionAndUserData } = authClient.useSession();
  
  useEffect(() => {
    console.log("Session user changed:", sessionAndUserData);
    console.log("Current user email:", user);
    const newUser = sessionAndUserData?.user?.email || null;
    if (newUser !== user) {
      console.log("Updating user email to:", newUser);
      setUser(newUser);
    }
  }, [sessionAndUserData]);

  return (
    <SharedContext.Provider
      value={{
        selectedLocation,
        filter,
        user,
        setSelectedLocation,
        setFilter,
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
  initialUser: string | null;
}) {
  return (
    <SharedProviders initialUser={initialUser}>{children}</SharedProviders>
  );
}
