"use client";

import { AlertDialog, Dialog, Sheet } from "@roll-and-call/ui";
import type { ComponentProps } from "react";

import { useDesktop } from "../mobile/use-desktop";
import { ResponsiveDialogContext } from "./responsive-dialog-context";

interface ResponsiveDialogRootProps extends Omit<
  ComponentProps<typeof Dialog.Root>,
  "disablePointerDismissal"
> {
  // 되돌릴 수 없는 확인이면 데스크톱은 AlertDialog, 모바일은 바깥을 눌러도 닫히지 않는 시트다.
  alert?: boolean;
}

export function ResponsiveDialogRoot({ alert, ...props }: ResponsiveDialogRootProps) {
  const desktop = useDesktop();
  return (
    <ResponsiveDialogContext.Provider value={desktop}>
      {!desktop ? <Sheet.Root dismissible={!alert} {...props} /> : null}
      {desktop && alert ? <AlertDialog.Root {...props} /> : null}
      {desktop && !alert ? <Dialog.Root {...props} /> : null}
    </ResponsiveDialogContext.Provider>
  );
}
