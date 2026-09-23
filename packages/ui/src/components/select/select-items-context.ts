import { createContext } from "react";

export type SelectOption = { label: string; value: string };

export const SelectItemsContext = createContext<SelectOption[]>([]);
