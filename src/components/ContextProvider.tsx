import React, { createContext, useContext, useState, ReactNode } from "react";
import { LatLngExpression } from "leaflet";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Object } from "@/lib/types";

// ---- Query Client Setup ----
export const queryClient = new QueryClient();
let browserQueryClient: QueryClient | undefined = undefined;

export function getBrowserQueryClient() {
  if (!browserQueryClient) {
    browserQueryClient = new QueryClient();
  }
  return browserQueryClient;
}

// ---- Data Context ----
export const DataContext = createContext<{
  objects: Object[] | undefined;
  loading: boolean;
}>({
  objects: undefined,
  loading: true,
});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: objects, isLoading: loading } = useQuery({
    queryKey: ["objects"],
    queryFn: async () => {
      const res = await fetch("/api/objects");
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json() as Promise<Object[]>;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <DataContext.Provider value={{ objects, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

// ---- Map Context ----
type MapContextType = {
  selectedLocation: LatLngExpression | null;
  setSelectedLocation: (location: LatLngExpression | null) => void;
};

export const MapContext = createContext<MapContextType | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocation] =
    useState<LatLngExpression | null>(null);

  return (
    <MapContext.Provider value={{ selectedLocation, setSelectedLocation }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMapContext() {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
}

// ---- Main Provider Component ----
export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <MapProvider>{children}</MapProvider>
      </DataProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
