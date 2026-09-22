import { createContext } from "react";

export interface SwitchContextValue {
  size: "sm" | "md";
  controlProps: Record<string, unknown>;
}

export const SwitchContext = createContext<SwitchContextValue>({ size: "md", controlProps: {} });
