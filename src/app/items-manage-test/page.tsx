"use client";
import { useState } from "react";

import { ItemDeleteParams, ItemUpdateParams } from "@/lib/types";
import updateItem from "@/server/actions/item/update/action";
import deleteItem from "@/server/actions/item/delete/action";
import { Providers } from "@/components/ContextProvider";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ItemsManagement() {
  const [failedAction, setFailedAction] = useState(false);
  const handleUpdate = async (updateParams: ItemUpdateParams) => {
    const result = await updateItem(updateParams);
    if (result === null) {
      setFailedAction(true);
      return;
    }
    console.log(result);
  };

  const handleDelete = async (deleteParams: ItemDeleteParams) => {
    const result = await deleteItem(deleteParams);
    if (result === null) {
      setFailedAction(true);
      return;
    }
    console.log(result);
  };

  return (
    <Providers>
      <div className="text-white h-full w-full flex justify-center">
        <div className="flex gap-2 h-full flex-col">
          <Button
            onClick={() => {
              setFailedAction((prev) => !prev);
            }}
          >
            Test Dialog
          </Button>

          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const itemId = parseInt(
                (form.elements.namedItem("itemId") as HTMLInputElement).value
              );
              const isHelped = (
                form.elements.namedItem("isHelped") as HTMLInputElement
              ).checked;
              const isResolved = (
                form.elements.namedItem("isResolved") as HTMLInputElement
              ).checked;
              handleUpdate({ itemId, isHelped, isResolved });
            }}
          >
            <h2>Update Item</h2>
            <input type="number" name="itemId" placeholder="Item ID" required />
            <input type="checkbox" name="isHelped" /> Helped
            <input type="checkbox" name="isResolved" /> Resolved
            <Button variant="destructive" type="submit">
              Update
            </Button>
          </form>
          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const itemId = parseInt(form.itemId.value);
              handleDelete({ itemId });
            }}
          >
            <h2>Delete Item</h2>
            <input type="number" name="itemId" placeholder="Item ID" required />
            <Button variant="destructive" type="submit">
              Delete
            </Button>
          </form>
          <Dialog open={failedAction} onOpenChange={setFailedAction}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Database Error</DialogTitle>
              </DialogHeader>
              <p>The database is currently down</p>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Providers>
  );
}
