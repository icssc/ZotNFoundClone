import { Item } from "@/db/schema";
import { isError } from "@/lib/types";
import { getAllItems } from "@/server/data/item/queries";
import { useQuery } from "@tanstack/react-query";

export function useItems() {
  console.log("useItems, tick");
  const { data, error, isLoading } = useQuery<Item[], Error>({
    queryKey: ["items"],
    queryFn: async () => {
      const data = await getAllItems();
      if (isError(data)) {
        throw new Error(data.error);
      }
      return data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  return { data, error, isLoading };
}
