import React, { createContext, useContext, useState, ReactNode } from "react";
import { LatLngExpression } from "leaflet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// ---- Query Client Setup ----
export const queryClient = new QueryClient();
let browserQueryClient: QueryClient | undefined = undefined;

export function getBrowserQueryClient() {
  if (!browserQueryClient) {
    browserQueryClient = new QueryClient();
  }
  return browserQueryClient;
}

// ---- Map Context ----
type SharedContextType = {
  selectedLocation: LatLngExpression | null;
  filter: string;
  setSelectedLocation: (location: LatLngExpression | null) => void;
  setFilter: (filter: string) => void;
};

export const SharedContext = createContext<SharedContextType | undefined>(
  undefined
);

export function SharedProviders({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocation] =
    useState<LatLngExpression | null>(null);
  const [filter, setFilter] = useState<string>("");

  return (
    <SharedContext.Provider
      value={{ selectedLocation, setSelectedLocation, filter, setFilter }}
    >
      {children}
    </SharedContext.Provider>
  );
}

export function useSharedContext() {
  const context = useContext(SharedContext);
  if (context === undefined) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
}

// ---- Main Provider Component ----
export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SharedProviders>{children}</SharedProviders>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
