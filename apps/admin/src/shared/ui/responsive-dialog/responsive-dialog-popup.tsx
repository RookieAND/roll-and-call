"use client";

import { Dialog, Sheet, type DialogPopupProps } from "@roll-and-call/ui";
import { useContext } from "react";

import { ResponsiveDialogContext } from "./responsive-dialog-context";

// 모바일 시트에는 손잡이를 두고 X 버튼은 두지 않는다. 데스크톱 폭(className·size)은 시트에 쓰지 않는다.
export function ResponsiveDialogPopup({ size, className, children, ...props }: DialogPopupProps) {
  const desktop = useContext(ResponsiveDialogContext);
  if (desktop) {
    return (
      <Dialog.Popup size={size} className={className} {...props}>
        {children}
      </Dialog.Popup>
    );
  }
  return (
    <Sheet.Popup className="px-200 pt-100" {...props}>
      <Sheet.Handle />
      {children}
    </Sheet.Popup>
  );
}
