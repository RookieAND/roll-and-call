"use client";

import { Dialog } from "@base-ui-components/react/dialog";
import type { ComponentPropsWithRef } from "react";

export function SheetTrigger(props: ComponentPropsWithRef<typeof Dialog.Trigger>) {
  return <Dialog.Trigger data-slot="sheet-trigger" {...props} />;
}
