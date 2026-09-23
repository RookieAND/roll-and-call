import { createContext } from "react";

export const CALLOUT_PALETTE = {
  gray: "gray",
  primary: "primary",
  success: "success",
  warning: "warning",
  notice: "notice",
  danger: "danger",
} as const;

export type CalloutPalette = (typeof CALLOUT_PALETTE)[keyof typeof CALLOUT_PALETTE];

export interface CalloutContextValue {
  colorPalette: CalloutPalette;
  size: "sm" | "md";
  hasTitle: boolean;
  setHasTitle: (hasTitle: boolean) => void;
}

export const CalloutContext = createContext<CalloutContextValue>({
  colorPalette: CALLOUT_PALETTE.gray,
  size: "md",
  hasTitle: false,
  setHasTitle: () => {},
});
