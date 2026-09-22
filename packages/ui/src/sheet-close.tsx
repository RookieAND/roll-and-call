"use client";

import { Dialog } from "@base-ui-components/react/dialog";
import type { ComponentPropsWithRef } from "react";

export function SheetClose(props: ComponentPropsWithRef<typeof Dialog.Close>) {
  return <Dialog.Close data-slot="sheet-close" {...props} />;
}
