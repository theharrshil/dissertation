import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "redaxios";

export const network = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8787"
      : "https://sls.theharrshil.workers.dev",
  withCredentials: true,
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncate = (str: string, num: number, suffix: string = "..."): string => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num - suffix.length) + suffix;
};

export const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
