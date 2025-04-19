"use client";

import { KeyRound, NotebookPen } from "lucide-react";
import { useState } from "react";
import { createItem } from "@/server/actions/item/create/action";

export default function ItemsPost() {
  const [newItem, setNewItem] = useState({
    image: "",
    islost: true,
    itemName: "",
    itemDescription: "",
    itemDate: "",
  });

  const addItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await createItem(newItem);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
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
          <input
            type="text"
            id="name"
            name="itemName"
            placeholder="Ex: AirPods Pro, ..."
            value={newItem.itemName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 text-white rounded-md p-2"
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
          <textarea
            id="description"
            name="itemDescription"
            placeholder="Ex: Lost in DBH 1600, ..."
            value={newItem.itemDescription}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 text-white rounded-md p-2"
            rows={4}
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
            <input
              type="checkbox"
              name="islost"
              id="status-toggle"
              checked={newItem.islost}
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
          <input
            type="date"
            name="itemDate"
            id="date"
            value={newItem.itemDate}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                itemDate: e.target.value,
              })
            }
            className="mt-1 block w-full p-2  border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
