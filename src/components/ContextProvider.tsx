import React, { createContext, useContext, useEffect, useState } from "react";
import { Object } from "@/lib/types";
export const DataContext = createContext<{
  objects: Object[] | null;
  loading: boolean;
}>({
  objects: null,
  loading: true,
});

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [objects, setObjects] = useState<Object[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/objects"); // Adjust API path as needed
        const data: Object[] = await res.json();
        setObjects(data);
      } catch (error) {
        console.error("Error fetching objects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ objects, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
