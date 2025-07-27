"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { LatLngExpression } from "leaflet";

// ---- Shared Context ----
type SharedContextType = {
  selectedLocation: LatLngExpression | null;
  filter: string;
  setSelectedLocation: (location: LatLngExpression | null) => void;
  setFilter: (filter: string) => void;
};

const SharedContext = createContext<SharedContextType | undefined>(undefined);

// ---- Shared Provider Component ----
function SharedProviders({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocation] = useState<LatLngExpression | null>(null);
  const [filter, setFilter] = useState<string>("");

  return (
    <SharedContext.Provider
      value={{
        selectedLocation,
        filter,
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
