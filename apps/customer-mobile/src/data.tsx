import { createContext, useContext, type ReactNode } from "react";
import { useRemote } from "./components/ui";
export const base =
  process.env.EXPO_PUBLIC_GATEWAY_URL ?? "http://127.0.0.1:5001";
export const customer = "cus-001";
export type Product = {
  sku: string;
  name: string;
  price_minor: number;
  stock_on_hand: number;
};
export type Order = {
  id: string;
  status: string;
  total_minor: number;
  charge_id?: string | null;
  customer_id?: string;
  items?: { sku: string; quantity: number }[];
};
function useData() {
  const products = useRemote<Product[]>(`${base}/v1/products`);
  const orders = useRemote<Order[]>(`${base}/v1/orders`, customer);
  return { products, orders };
}
const Context = createContext<ReturnType<typeof useData> | null>(null);
export function DataProvider({ children }: { children: ReactNode }) {
  const value = useData();
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useDataContext() {
  const value = useContext(Context);
  if (!value) throw new Error("Missing equipment data provider");
  return value;
}
