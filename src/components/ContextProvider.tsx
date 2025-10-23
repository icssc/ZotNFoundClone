"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { LatLngExpression } from "leaflet";
import { User } from "@/lib/types";

// ---- Shared Context ----
type SharedContextType = {
  selectedLocation: LatLngExpression | null;
  filter: string;
  user: User | null;
  setUser: (user: User | null) => void;
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
  initialUser: User | null;
}) {
  const [selectedLocation, setSelectedLocation] =
    useState<LatLngExpression | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [user, setUser] = useState<User | null>(initialUser);

  return (
    <SharedContext.Provider
      value={{
        selectedLocation,
        filter,
        user,
        setUser,
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
  initialUser: User | null;
}) {
  return (
    <SharedProviders initialUser={initialUser}>{children}</SharedProviders>
  );
}
