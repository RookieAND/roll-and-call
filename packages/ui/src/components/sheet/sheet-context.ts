import type { Dialog } from "@base-ui-components/react/dialog";
import { createContext, type RefObject } from "react";

export const SHEET_SIDE = { bottom: "bottom", left: "left", right: "right" } as const;
export type SheetSide = (typeof SHEET_SIDE)[keyof typeof SHEET_SIDE];

export const SHEET_SIZE = { auto: "auto", half: "half", full: "full" } as const;
export type SheetSize = (typeof SHEET_SIZE)[keyof typeof SHEET_SIZE];

export interface SheetContextValue {
  side: SheetSide;
  size: SheetSize;
  dismissible: boolean;
  actionsRef: RefObject<Dialog.Root.Actions | null>;
}

export const SheetContext = createContext<SheetContextValue>({
  side: SHEET_SIDE.bottom,
  size: SHEET_SIZE.auto,
  dismissible: true,
  actionsRef: { current: null },
});
