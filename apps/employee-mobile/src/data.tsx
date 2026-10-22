import { createContext, useContext, useState, type ReactNode } from "react";
import { useRemote } from "./components/ui";
export const base = process.env.EXPO_PUBLIC_HR_URL ?? "http://127.0.0.1:5006";
export type Employee = {
  employee_id: string;
  display_name: string;
  work_email: string;
  department: string;
  employment_status?: string;
  manager_id?: string | null;
};
export type Leave = { annual_days_remaining: number; snapshot_date: string };
function useData() {
  const people = useRemote<Employee[]>(`${base}/v1/employees`);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return { people, selectedId, setSelectedId };
}
const Context = createContext<ReturnType<typeof useData> | null>(null);
export function DataProvider({ children }: { children: ReactNode }) {
  const value = useData();
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useDataContext() {
  const value = useContext(Context);
  if (!value) throw new Error("Missing people data provider");
  return value;
}
