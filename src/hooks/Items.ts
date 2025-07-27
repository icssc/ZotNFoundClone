"use client";
// ! Experimental and untested
import { Item, NewItem } from "@/db/schema";
import { isError, ItemDeleteParams, ItemUpdateParams } from "@/lib/types";
import { createItem } from "@/server/actions/item/create/action";
import deleteItem from "@/server/actions/item/delete/action";
import updateItem from "@/server/actions/item/update/action";
import { useOptimistic, useTransition } from "react";

export function useCreateItem() {
  const [isPending, startTransition] = useTransition();

  const createItemOptimistic = (item: NewItem) => {
    startTransition(async () => {
      const result = await createItem(item);
      if (isError(result)) {
        console.error("Error creating item:", result.error);
      }
    });
  };

  return { createItemOptimistic, isPending };
}

export function useUpdateItem() {
  const [isPending, startTransition] = useTransition();

  const updateItemOptimistic = (
    itemId: number,
    is_resolved: boolean,
    is_helped: boolean
  ) => {
    startTransition(async () => {
      const item: ItemUpdateParams = {
        itemId,
        isHelped: is_helped,
        isResolved: is_resolved,
      };
      const result = await updateItem(item);
      if (isError(result)) {
        console.error("Error updating item:", result.error);
      }
    });
  };

  return { updateItemOptimistic, isPending };
}

export function useDeleteItem() {
  const [isPending, startTransition] = useTransition();

  const deleteItemOptimistic = (itemId: number) => {
    startTransition(async () => {
      const item: ItemDeleteParams = {
        itemId,
      };
      const result = await deleteItem(item);
      if (isError(result)) {
        console.error("Error deleting item:", result.error);
      }
    });
  };

  return { deleteItemOptimistic, isPending };
}

export function useOptimisticItems(items: Item[]) {
  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items,
    (state, newItem: NewItem) => {
      // Create a temporary item with a placeholder ID for optimistic updates
      const tempItem: Item = {
        ...newItem,
        id: -1, // Temporary ID for optimistic updates
        isResolved: false,
        isHelped: null,
        is_deleted: null,
        foundBy: null,
      };
      return [...state, tempItem];
    }
  );

  const [optimisticItemsUpdate, updateOptimisticItem] = useOptimistic(
    items,
    (state, { itemId, is_resolved, is_helped }: { itemId: number; is_resolved: boolean; is_helped: boolean }) =>
      state.map((item) =>
        item.id === itemId ? { ...item, is_resolved, is_helped } : item
      )
  );

  const [optimisticItemsDelete, deleteOptimisticItem] = useOptimistic(
    items,
    (state, itemId: number) => state.filter((item) => item.id !== itemId)
  );

  return {
    optimisticItems,
    addOptimisticItem,
    optimisticItemsUpdate,
    updateOptimisticItem,
    optimisticItemsDelete,
    deleteOptimisticItem,
  };
}
