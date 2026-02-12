import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function extractFieldErrors(
   errors: Record<string, string[]>,
): Record<string, string> {
   return Object.fromEntries(
      Object.entries(errors).map(([key, msgs]) => [key, msgs[0]]),
   );
}
