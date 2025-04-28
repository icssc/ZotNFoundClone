"use client";

import { KeyRound, NotebookPen } from "lucide-react";
import { useState } from "react";
import { createItem } from "@/server/actions/item/create/action";
import { Input } from '@/components/ui/input';
import { NewItem } from "@/db/schema";

export default function ItemsPost() {

  const initialNewItem: NewItem = {
    name: "",
    description: "",
    date: "",
    image: "",
    islost: false,
  };

  const [newItem, setNewItem] = useState<NewItem>(initialNewItem);

  const addItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createItem(newItem);
    setNewItem(initialNewItem);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name as keyof NewItem]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <form className="w-full max-w-lg justify-center" onSubmit={addItem}>
        <div className="flex flex-wrap mb-6">
          <KeyRound />
          <label htmlFor="name" className="block text-sm font-medium">
            Item Name
          </label>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="Ex: AirPods Pro, ..."
            value={newItem.name ?? ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-wrap mb-6">
          <NotebookPen />
          <label
            htmlFor="description"
            className="block text-sm font-medium text-white"
          >
            Description
          </label>
          <Input
            id="description"
            name="description"
            placeholder="Ex: Lost in DBH 1600, ..."
            value={newItem.description ?? ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex items-center mb-6">
          <label
            htmlFor="status-toggle"
            className="mr-4 text-sm font-medium text-white flex items-center"
          >
            Status
          </label>
          <div className="w-10">
            <Input
              type="checkbox"
              name="islost"
              id="status-toggle"
              checked={newItem.islost ?? false}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  islost: e.target.checked,
                })
              }
              className="sr-only"
            />
            <label
              htmlFor="status-toggle"
              className={`relative w-16 block overflow-hidden h-8 rounded-full cursor-pointer ${
                newItem.islost === false ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <span
                className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${
                  newItem.islost === true ? "translate-x-full" : ""
                }`}
              ></span>
            </label>
            <span className="text-xs text-white mt-1 block text-center">
              {newItem.islost ? "Lost" : "Found"}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-white"
          >
            Date
          </label>
          <Input
            type="date"
            name="date"
            id="date"
            value={newItem.date ?? ''}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                date: e.target.value,
              })
            }
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
