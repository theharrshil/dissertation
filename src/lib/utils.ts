import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export const network = () => {
  return axios.create({
    baseURL: "http://localhost:8787",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

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
