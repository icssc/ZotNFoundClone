import { Item } from "@/db/schema";
import type { LatLngExpression, PointTuple } from "leaflet";

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

export function formatLocationDisplay(
  location: string[] | string | null
): string {
  if (!location) return "No location provided";

  if (typeof location === "string") return location;

  if (Array.isArray(location) && location.length === 2) {
    const [lat, lng] = location.map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  }

  return "Invalid location";
}

export interface KeywordSubscription {
  keyword: string;
  email: string;
}

export type ActionState<T = void> = {
  success?: boolean;
  error?: string;
  errors?: Record<string, string[]>;
  data?: T;
};

export interface LocationFormData {
  name: string;
  description: string;
  type: string;
  date: Date;
  file: File | null;
  isLost: boolean;
  location: [number, number] | null;
}

export interface StepProps {
  formData: LocationFormData;
  setFormData: React.Dispatch<React.SetStateAction<LocationFormData>>;
}

export type ConfirmationStepProps = Pick<StepProps, "formData">;
