import { SheetBody } from "./sheet-body";
import { SheetClose } from "./sheet-close";
import { SheetFooter } from "./sheet-footer";
import { SheetHandle } from "./sheet-handle";
import { SheetHeader } from "./sheet-header";
import { SheetItem } from "./sheet-item";
import { SheetOverlay } from "./sheet-overlay";
import { SheetPopup } from "./sheet-popup";
import { SheetRoot } from "./sheet-root";
import { SheetTitle } from "./sheet-title";
import { SheetTrigger } from "./sheet-trigger";

export type { SheetRootProps } from "./sheet-root";
export type { SheetPopupProps } from "./sheet-popup";
export type { SheetSide, SheetSize } from "./sheet-context";

export const Sheet = {
  Root: SheetRoot,
  Trigger: SheetTrigger,
  Overlay: SheetOverlay,
  Popup: SheetPopup,
  Handle: SheetHandle,
  Header: SheetHeader,
  Title: SheetTitle,
  Body: SheetBody,
  Footer: SheetFooter,
  Close: SheetClose,
  Item: SheetItem,
};
