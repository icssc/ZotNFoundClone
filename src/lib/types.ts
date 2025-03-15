import { PointTuple } from "leaflet";

enum ObjectType {
  Lost = "lost",
  Found = "found",
}

export interface LostObject {
  type: ObjectType.Lost;
  itemId: string;
  itemName: string;
  itemDescription: string;
  location: PointTuple;
  date: string;
  isFound: boolean;
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

export interface FoundObject {
  type: ObjectType.Found;
  itemId: string;
  itemName: string;
  itemDescription: string;
  location: PointTuple;
  date: string;
  isReturned: boolean;
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

function checkReturned(item: Object) {
  if (isLostObject(item)) {
    return item.isFound;
  } else {
    return item.isReturned;
  }
}

export { isLostObject, isFoundObject, checkReturned };
