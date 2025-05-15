import { getAllItems } from "@/server/data/item/queries";
import { isError } from "@/lib/types";
import { queryOptions } from "@tanstack/react-query";

export const FETCH_ITEMS = queryOptions({
  queryKey: ["fetchItems"],
  queryFn: async () => {
    const data = await getAllItems();
    if (isError(data)) {
      throw new Error(data.error);
    }
    return data.data;
  },
});
