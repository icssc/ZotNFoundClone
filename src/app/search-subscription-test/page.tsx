"use client";

import { createKeywordSubscription } from "@/server/actions/search/create/action";
import { useState } from "react";
import { KeywordSubscription } from "@/lib/types";
import { removeKeywordSubscription } from "@/server/actions/search/remove/action";

export default function SearchSubscriptionTest() {
  const [subscriptionAdded, setSubscriptionAdded] = useState(false);
  const [subscriptionRemoved, setSubscriptionRemoved] = useState(false);

  const handleAddSubscription = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData(e.currentTarget);
    const keyword = formData.get("keyword") as string;
    const email = formData.get("email") as string;
    const subscription: KeywordSubscription = {
      keyword,
      email,
    };

    try {
      const result = await createKeywordSubscription(subscription);
      if (result.success) {
        setSubscriptionAdded(true);
      } else {
        setSubscriptionAdded(false);
      }
    } catch (err) {
      console.error(err);
      setSubscriptionAdded(false);
    }
  };

  const handleRemoveSubscription = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData(e.currentTarget);
    const keyword = formData.get("keyword") as string;
    const email = formData.get("email") as string;
    const subscription: KeywordSubscription = {
      keyword,
      email,
    };

    try {
      const result = await removeKeywordSubscription(subscription);
      if (result.success) {
        setSubscriptionRemoved(true);
      } else {
        setSubscriptionRemoved(false);
      }
    } catch (err) {
      console.error(err);
      setSubscriptionRemoved(false);
    }
  };

  return (
    <div>
      <h1 className="flex justify-center text-2xl font-bold text-white">
        Create Subscription Test
      </h1>
      <form
        onSubmit={handleAddSubscription}
        className="flex flex-col gap-4 items-center bg-white rounded-xl border-2 border-gray-200 p-4 w-1/2 mx-auto mt-4"
      >
        <input
          name="keyword"
          type="text"
          className="p-2 rounded-md border border-gray-300 focus:border-blue-500"
          placeholder="keyword"
          required
        />
        <input
          name="email"
          type="email"
          className="p-2 rounded-md border border-gray-300 focus:border-blue-500"
          placeholder="email"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md border-2 border-blue-600 hover:border-blue-700"
        >
          Add
        </button>
        {subscriptionAdded && (
          <p className="text-green-500">Subscription created successfully!</p>
        )}
      </form>

      <h1 className="flex justify-center text-2xl font-bold text-white">
        Remove Subscription Test
      </h1>
      <form
        onSubmit={handleRemoveSubscription}
        className="flex flex-col gap-4 items-center bg-white rounded-xl border-2 border-gray-200 p-4 w-1/2 mx-auto mt-4"
      >
        <input
          name="keyword"
          type="text"
          className="p-2 rounded-md border border-gray-300 focus:border-blue-500"
          placeholder="keyword"
          required
        />
        <input
          name="email"
          type="email"
          className="p-2 rounded-md border border-gray-300 focus:border-blue-500"
          placeholder="email"
          required
        />
        <button
          type="submit"
          className="bg-red-500 text-white p-2 rounded-md border-2 border-red-600 hover:border-red-700"
        >
          Remove
        </button>
        {subscriptionRemoved && (
          <p className="text-red-500">Subscription removed successfully!</p>
        )}
      </form>
    </div>
  );
}
