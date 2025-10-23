"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { LatLngExpression } from "leaflet";
import { User } from "better-auth";
import { authClient } from "@/lib/auth-client";

// ---- Shared Context ----
type SharedContextType = {
  selectedLocation: LatLngExpression | null;
  filter: string;
  user?: User;
  setSelectedLocation: (location: LatLngExpression | null) => void;
  setFilter: (filter: string) => void;
};

const SharedContext = createContext<SharedContextType | undefined>(undefined);

// ---- Shared Provider Component ----
function SharedProviders({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocation] =
    useState<LatLngExpression | null>(null);
  const [filter, setFilter] = useState<string>("");
  const { data } = authClient.useSession();
  const user = data?.user;
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
export function Providers({ children }: { children: ReactNode }) {
  return <SharedProviders>{children}</SharedProviders>;
}
