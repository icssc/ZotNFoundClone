import HomeClient from "@/components/HomeClient";
import { getAllItems } from "@/server/data/item/queries";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZotNFound",
  description: "Browse, report, and reunite lost and found items at UCI.",
};

export default async function Home() {
  const itemsResult = await getAllItems();

  if (itemsResult.error || !itemsResult.data) {
    return (
      <div className="flex h-full items-center justify-center text-red-400">
        <p>Error loading items: {itemsResult.error}</p>
      </div>
    );
  }

  return <HomeClient initialItems={itemsResult.data} />;
}
