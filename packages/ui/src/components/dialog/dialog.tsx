import { Dialog as BaseDialog } from "@base-ui-components/react/dialog";

import { DialogBody } from "./dialog-body";
import { DialogDescription } from "./dialog-description";
import { DialogFooter } from "./dialog-footer";
import { DialogHeader } from "./dialog-header";
import { DialogPopup } from "./dialog-popup";
import { DialogTitle } from "./dialog-title";

export type { DialogPopupProps } from "./dialog-popup";
export type { DialogFooterProps } from "./dialog-footer";

export const Dialog = {
  Root: BaseDialog.Root,
  Trigger: BaseDialog.Trigger,
  Popup: DialogPopup,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter,
  Close: BaseDialog.Close,
};
