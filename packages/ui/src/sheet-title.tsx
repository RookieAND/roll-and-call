"use client";

import { Dialog } from "@base-ui-components/react/dialog";
import type { ComponentPropsWithRef } from "react";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";

export function SheetTitle({ className, ...props }: ComponentPropsWithRef<typeof Dialog.Title>) {
  return (
    <Dialog.Title
      data-slot="sheet-title"
      className={(state) =>
        cn("mb-150 text-sm font-bold text-gray-600", resolveStateProp(className, state))
      }
      {...props}
    />
  );
}
