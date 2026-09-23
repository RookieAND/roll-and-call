"use client";

import { Dialog } from "@base-ui-components/react/dialog";
import type { ComponentPropsWithRef } from "react";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";

export function DialogDescription({
  className,
  ...props
}: ComponentPropsWithRef<typeof Dialog.Description>) {
  return (
    <Dialog.Description
      data-slot="dialog-description"
      className={(state) =>
        cn("text-sm whitespace-pre-line text-gray-600", resolveStateProp(className, state))
      }
      {...props}
    />
  );
}
