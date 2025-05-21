import { Item } from "@/db/schema";
import { LatLngExpression, PointTuple } from "leaflet";

// User type definition
export type User = {
  id: string;
  email: string;
  name: string;
  picture: string;
};

export type ItemPostParams = {
  image: string;
  isLost: boolean;
  itemName: string;
  itemDescription: string;
  itemDate: string;
};

// Display object interface
export interface DisplayObjects {
  object_id: number;
  type: string;
  location: PointTuple;
}

export interface ItemUpdateParams {
  itemId: number;
  isHelped: boolean;
  isResolved: boolean;
}

export interface ItemDeleteParams {
  itemId: number;
}

// Type guards
export function isLostObject(object: Item) {
  return object.isLost;
}

export function isFoundObject(object: Item) {
  return !object.isLost;
}

export function stringArrayToLatLng(location: string[]): LatLngExpression {
  const [lat, lng] = location.map(Number);
  return [lat, lng];
}

export interface KeywordSubscription {
  keyword: string;
  email: string;
}

export type ActionResult<T> = { data: T } | { error: string };

export function isError<T>(
  result: ActionResult<T>
): result is { error: string } {
  return "error" in result;
}
