import { Dialog } from "@roll-and-call/ui";

import { ResponsiveDialogFooter } from "./responsive-dialog-footer";
import { ResponsiveDialogPopup } from "./responsive-dialog-popup";
import { ResponsiveDialogRoot } from "./responsive-dialog-root";

// 확인 모달을 한곳에서 데스크톱 Dialog / 모바일 Sheet로 가른다. 머리·제목·설명·본문·닫기는 둘이 같은 부품이다.
export const ResponsiveDialog = {
  Root: ResponsiveDialogRoot,
  Trigger: Dialog.Trigger,
  Popup: ResponsiveDialogPopup,
  Header: Dialog.Header,
  Title: Dialog.Title,
  Description: Dialog.Description,
  Body: Dialog.Body,
  Footer: ResponsiveDialogFooter,
  Close: Dialog.Close,
};
