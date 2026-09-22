"use client";

import { Dialog } from "@base-ui-components/react/dialog";
import type { ComponentPropsWithRef } from "react";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";

export function DialogTitle({ className, ...props }: ComponentPropsWithRef<typeof Dialog.Title>) {
  return (
    <Dialog.Title
      data-slot="dialog-title"
      className={(state) =>
        cn("text-heading3 font-bold text-gray-900", resolveStateProp(className, state))
      }
      {...props}
    />
  );
}
