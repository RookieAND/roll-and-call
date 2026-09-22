import { createContext } from "react";

export interface SegmentedControlContextValue {
  value: string;
  setValue: (value: string) => void;
  size: "sm" | "md";
  fullWidth: boolean;
  disabled: boolean;
  register: (value: string, element: HTMLButtonElement | null) => void;
}

export const SegmentedControlContext = createContext<SegmentedControlContextValue>({
  value: "",
  setValue: () => {},
  size: "md",
  fullWidth: true,
  disabled: false,
  register: () => {},
});
