import { getAllItems } from "@/server/data/item/queries";
import { isError } from "@/lib/types";
import { queryOptions } from "@tanstack/react-query";

export const FETCH_ITEMS = queryOptions({
  queryKey: ["fetchItems"],
  queryFn: async () => {
    const data = await getAllItems();
    if (isError(data)) {
      console.error("Error fetching items:", data.error);
      return [];
    }
    return data.data;
  },
});
