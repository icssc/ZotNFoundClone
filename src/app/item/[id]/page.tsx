import { notFound } from "next/navigation";
import { db } from "@/db";
import { items } from "@/db/schema";
import { eq } from "drizzle-orm";
import ItemDetailPage from "./ItemDetailPage";

interface ItemPageProps {
  params: {
    id: string;
  };
}

export default async function ItemPage({ params }: ItemPageProps) {
  const itemId = parseInt(params.id);

  if (isNaN(itemId)) {
    notFound();
  }

  const [item] = await db
    .select()
    .from(items)
    .where(eq(items.id, itemId))
    .limit(1);

  if (!item) {
    notFound();
  }

  return <ItemDetailPage item={item} />;
}
