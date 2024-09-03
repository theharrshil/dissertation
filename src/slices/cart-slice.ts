import { atom } from "jotai";

export const CartPlotId = atom("");

export interface CartItem {
  type: "choice" | "extra";
  id: string;
  name: string;
  developerId: string;
  price?: string;
  bhk: string;
  image: string | null;
  stripe_product_id: string | null;
  stripe_price_id: string | null;
}

export const CartAtom = atom<CartItem[]>([]);
