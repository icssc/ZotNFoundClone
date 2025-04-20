"use client";

import { getAllItems, getItem, getItemEmail } from "@/server/data/item/queries";
import { useEffect, useState } from "react";
import { db } from "@/db";
import { items } from "@/db/schema";

export default function ItemsReadTest() {
  const [item, setItem] = useState<string>("");
  const [itemId, setItemId] = useState<string>("");

  const [email, setEmail] = useState<string>("");

  const handleItemSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = parseInt(itemId);
    if (!isNaN(id)) {
      try {
        const itemResponse = await getItem(id);
        const emailResponse = await getItemEmail(id);
        setEmail(emailResponse);
        setItem(itemResponse);
      } catch (err) {
        console.error("Failed to fetch email:", err);
      }
    }
  };


  return (
    <div className="flex min-h-screen items-center bg-gray-900 px-4 space-x-8">
      <div className="ml-[400px] w-[600px]">
        <div className="flex flex-col space-y-4">
          <p className="text-white text-xl">Item Id Lookup</p>
          <form onSubmit={handleItemSubmit}>
            <input
              className="px-3 py-2 rounded border border-gray-300 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              placeholder="Enter item ID"
            />
          </form>
          {email && <p className="text-green-400"><strong>Email: </strong>{email}</p>}
          
          {item && (
            <div className="text-green-400">
              <p>Item:</p>
              <ul className="list-disc list-inside">
                {Object.entries(item).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {String(value)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {item === undefined && itemId && (
            <p className="text-red-400">No item found for that ID.</p>
          )}
          {email === undefined && itemId && (
            <p className="text-red-400">No email found for that ID.</p>
          )}
        </div>
      
      </div>
    </div>
  );
}
