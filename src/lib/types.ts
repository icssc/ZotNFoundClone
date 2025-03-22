import { PointTuple } from "leaflet";

export interface LostObject {
  type: "lost";
  itemId: string;
  itemName: string;
  itemDescription: string;
  location: PointTuple;
  date: string;
  personID: string;
  personEmail: string;
  personName: string;
}

export type User = {
  id: string;
  email: string;
  name: string;
  picture: string;
};

export interface ReturnedObject {
  type: "returned";
  itemId: string;
  itemName: string;
  itemDescription: string;
  location: PointTuple;
  date: string;
  personID: string;
  personEmail: string;
  personName: string;
}

export interface FoundObject {
  type: "found";
  itemId: string;
  itemName: string;
  itemDescription: string;
  location: PointTuple;
  date: string;
  personID: string;
  personEmail: string;
  personName: string;
}

export type Object = LostObject | FoundObject;

function isLostObject(object: Object): object is LostObject {
  return object.type === "lost";
}

function isFoundObject(object: Object): object is FoundObject {
  return object.type === "found";
}

export interface DisplayObjects {
  object_id: string;
  type: string;
  location: PointTuple;
}

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

export { isLostObject, isFoundObject };
