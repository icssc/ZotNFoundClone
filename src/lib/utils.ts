import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isErrorResponse(obj: any): obj is { error: string } {
  return typeof obj === "object" && obj !== null && "error" in obj;
}
