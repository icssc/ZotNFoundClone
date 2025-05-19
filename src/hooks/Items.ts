import { Item, NewItem } from "@/db/schema";
import { isError, ItemDeleteParams, ItemUpdateParams } from "@/lib/types";
import { createItem } from "@/server/actions/item/create/action";
import deleteItem from "@/server/actions/item/delete/action";
import updateItem from "@/server/actions/item/update/action";
import { getAllItems } from "@/server/data/item/queries";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/components/ContextProvider";

export function useItems() {
  const { data, error, isLoading } = useQuery<Item[], Error>({
    queryKey: ["items"],
    queryFn: async () => {
      const data = await getAllItems();
      if (isError(data)) {
        throw new Error(data.error);
      }
      data.data.sort((a, b) => {
        const dateA = new Date(a.date!);
        const dateB = new Date(b.date!);
        return dateB.getTime() - dateA.getTime();
      });
      return data.data;
    },
  });
  return { data, error, isLoading };
}

export function useCreateItem() {
  return useMutation<NewItem, Error, NewItem>({
    mutationKey: ["items"],
    mutationFn: async (item: NewItem) => {
      const mutation = await createItem(item);
      if (isError(mutation)) {
        console.log(mutation.error);
        throw new Error(mutation.error);
      }
      return mutation.data;
    },
    onSuccess: (item: NewItem) =>
      queryClient.setQueryData(["items"], (oldData: Item[] | undefined) =>
        oldData ? [item, ...oldData] : [item]
      ),
  });
}

export function useUpdateItem(
  itemId: number,
  is_resolved: boolean,
  is_helped: boolean
) {
  const { data, error } = useMutation<Item, Error>({
    mutationKey: ["items"],
    mutationFn: async () => {
      const item: ItemUpdateParams = {
        itemId,
        isHelped: is_helped,
        isResolved: is_resolved,
      };
      const mutation = await updateItem(item);
      if (isError(mutation)) {
        throw new Error(mutation.error);
      }
      return mutation.data;
    },
    onSuccess: () =>
      queryClient.setQueryData(["items"], (oldData: Item[] | undefined) =>
        oldData
          ? oldData.map((item) =>
              item.id === itemId ? { ...item, is_resolved } : item
            )
          : []
      ),
  });
  return { data, error };
}

export function useDeleteItem(itemId: number) {
  const { data, error } = useMutation<Item, Error>({
    mutationKey: ["items"],
    mutationFn: async () => {
      const item: ItemDeleteParams = {
        itemId,
      };
      const mutation = await deleteItem(item);
      if (isError(mutation)) {
        throw new Error(mutation.error);
      }
      return mutation.data;
    },
    onSuccess: () =>
      queryClient.setQueryData(["items"], (oldData: Item[] | undefined) =>
        oldData ? oldData.filter((item) => item.id !== itemId) : []
      ),
  });
  return { data, error };
}
