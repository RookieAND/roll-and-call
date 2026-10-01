import { AlertDialog as BaseAlertDialog } from "@base-ui-components/react/alert-dialog";

import { DialogBody } from "../dialog/dialog-body";
import { DialogDescription } from "../dialog/dialog-description";
import { DialogFooter } from "../dialog/dialog-footer";
import { DialogHeader } from "../dialog/dialog-header";
import { DialogPopup } from "../dialog/dialog-popup";
import { DialogTitle } from "../dialog/dialog-title";

export const AlertDialog = {
  Root: BaseAlertDialog.Root,
  Trigger: BaseAlertDialog.Trigger,
  Popup: DialogPopup,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter,
  Close: BaseAlertDialog.Close,
};
