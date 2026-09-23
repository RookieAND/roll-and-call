"use client";

import { Dialog } from "@base-ui-components/react/dialog";
import type { ComponentPropsWithRef } from "react";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";

export function SheetOverlay({
  className,
  ...props
}: ComponentPropsWithRef<typeof Dialog.Backdrop>) {
  return (
    <Dialog.Backdrop
      data-slot="sheet-overlay"
      className={(state) =>
        cn("fixed inset-0 z-(--rc-z-overlay) bg-dim", resolveStateProp(className, state))
      }
      {...props}
    />
  );
}
