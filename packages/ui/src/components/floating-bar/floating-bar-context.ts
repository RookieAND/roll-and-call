import { createContext } from "react";

export interface FloatingBarContextValue {
  height: number;
  setHeight: (height: number) => void;
  elevated: boolean;
  safeArea: boolean;
  hidden: boolean;
}

export const FloatingBarContext = createContext<FloatingBarContextValue>({
  height: 0,
  setHeight: () => {},
  elevated: true,
  safeArea: true,
  hidden: false,
});
