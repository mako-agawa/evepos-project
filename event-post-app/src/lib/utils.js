import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getURL = () => {
  const url = process.env.VERCEL_PROJECT_PRODUCTION_URL;

  return url
    ? `https://${url}`
    : `http://localhost:${process.env.PORT || 3001}`;
}