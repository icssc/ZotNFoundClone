import { PointTuple } from "leaflet";

export interface LostObject {
  type: "lost";
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
  type: "found";
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

export { isLostObject, isFoundObject };
