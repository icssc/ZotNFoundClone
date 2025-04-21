"use client";

import { useState, useEffect } from "react";
import { fetchKeywords } from "@/server/data/search/keywords";
import { debugShowSearches } from "@/server/data/search/keywords";

export default function SearchReadTestPage() {
  const [email, setEmail] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    debugShowSearches();
  }, []);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchKeywords(email);
      setKeywords(result);
    } catch (err: any) {
      console.error("Failed to fetch keywords:", err);
      setError("Something went wrong while fetching keywords.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-4 text-white">Search Keyword Test</h1>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full mb-4 rounded bg-transparent text-white placeholder-gray-400"
        />
      <button
        onClick={handleFetch}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch Keywords"}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {keywords.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Keywords:</h2>
          <ul className="list-disc list-inside">
            {keywords.map((keyword, index) => (
              <li key={index}>{keyword}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
