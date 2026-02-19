import { Item } from "@/db/schema";
import type { LatLngExpression } from "leaflet";
import { phoneIntents } from "@/lib/sms/constants";

// Type guards
export function isLostObject(object: Item) {
  return object.isLost;
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

export type PhoneIntent = (typeof phoneIntents)[keyof typeof phoneIntents];
