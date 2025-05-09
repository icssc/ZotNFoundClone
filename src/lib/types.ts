import { PointTuple } from "leaflet";

// Base interface for common properties
interface BaseObject {
  itemId: string;
  itemName: string;
  itemDescription: string;
  location: PointTuple;
  date: string;
  personID: string;
  personEmail: string;
  personName: string;
  bounty?: number;
}

// Object type definitions
export interface LostObject extends BaseObject {
  type: "lost";
}

export interface FoundObject extends BaseObject {
  type: "found";
}

export interface ReturnedObject extends BaseObject {
  type: "returned";
}

export type Object = LostObject | FoundObject;

// User type definition
export type User = {
  id: string;
  email: string;
  name: string;
  picture: string;
};

export type ItemPostParams = {
  image: string;
  islost: boolean;
  itemName: string;
  itemDescription: string;
  itemDate: string;
};

// Display object interface
export interface DisplayObjects {
  object_id: string;
  type: string;
  location: PointTuple;
}

// Type guards
export function isLostObject(object: Object): object is LostObject {
  return object.type === "lost";
}

export function isFoundObject(object: Object): object is FoundObject {
  return object.type === "found";
}

// Mapping functions
export function mapObjectToDisplayObject(item: Object): DisplayObjects {
  return {
    object_id: item.itemId,
    type: item.type,
    location: item.location,
  };
}

export function mapObjectsToDisplayObjects(
  objects: Object[]
): DisplayObjects[] {
  return objects.map(mapObjectToDisplayObject);
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
