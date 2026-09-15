"use client";

import { Dialog } from "@base-ui-components/react/dialog";

import { SheetContent } from "./sheet-content";
import { SheetItem } from "./sheet-item";
import { SheetTitle } from "./sheet-title";

export const Sheet = {
  Root: Dialog.Root,
  Trigger: Dialog.Trigger,
  Close: Dialog.Close,
  Content: SheetContent,
  Title: SheetTitle,
  Item: SheetItem,
};
