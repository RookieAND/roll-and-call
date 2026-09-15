"use client";

import { Dialog } from "@base-ui-components/react/dialog";
import { cn } from "@trpg/ui";
import type { ReactNode } from "react";

export function SheetTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Dialog.Title className={cn("mb-3 text-sm font-bold text-gray-600", className)}>
      {children}
    </Dialog.Title>
  );
}
