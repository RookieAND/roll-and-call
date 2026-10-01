"use client";

import { Dialog } from "@base-ui-components/react/dialog";
import { useRef, type ComponentProps, type RefObject } from "react";

import { SheetContext, type SheetSide, type SheetSize } from "./sheet-context";

export interface SheetRootProps extends Omit<
  ComponentProps<typeof Dialog.Root>,
  "disablePointerDismissal"
> {
  side?: SheetSide;
  size?: SheetSize;
  dismissible?: boolean;
}

export function SheetRoot({
  side = "bottom",
  size = "auto",
  dismissible = true,
  actionsRef,
  onOpenChange,
  ...props
}: SheetRootProps) {
  const localActionsRef = useRef<Dialog.Root.Actions>(null);
  const actions = (actionsRef ?? localActionsRef) as RefObject<Dialog.Root.Actions>;
  return (
    <SheetContext.Provider value={{ side, size, dismissible, actionsRef: actions }}>
      <Dialog.Root
        {...props}
        actionsRef={actions}
        disablePointerDismissal={!dismissible}
        onOpenChange={(open, eventDetails) => {
          if (!open && !dismissible && eventDetails.reason === "escape-key") {
            eventDetails.cancel();
            return;
          }
          onOpenChange?.(open, eventDetails);
        }}
      />
    </SheetContext.Provider>
  );
}
