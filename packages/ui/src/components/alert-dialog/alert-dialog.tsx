import { AlertDialog as BaseAlertDialog } from "@base-ui-components/react/alert-dialog";

import { DialogBody } from "../dialog/dialog-body";
import { DialogDescription } from "../dialog/dialog-description";
import { DialogFooter } from "../dialog/dialog-footer";
import { DialogHeader } from "../dialog/dialog-header";
import { DialogPopup } from "../dialog/dialog-popup";
import { DialogTitle } from "../dialog/dialog-title";

// 되돌릴 수 없는 일을 확인받는 자리. 딤을 눌러 닫을 수 없고, 처음 포커스는 취소 버튼에 둔다.
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
