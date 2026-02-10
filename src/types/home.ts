import type { Item } from "@/db/schema";

export type HomeItem = Pick<
  Item,
  | "id"
  | "name"
  | "description"
  | "type"
  | "location"
  | "itemDate"
  | "image"
  | "isLost"
  | "isHelped"
  | "isResolved"
>;
