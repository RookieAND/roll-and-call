"use client";

import { Dialog } from "@base-ui-components/react/dialog";
import { cn } from "@roll-and-call/ui";
import type { ReactNode } from "react";

interface SheetTitleProps {
  children: ReactNode;
  className?: string;
}

export function SheetTitle({ children, className }: SheetTitleProps) {
  return (
    <Dialog.Title className={cn("mb-150 text-sm font-bold text-gray-600", className)}>
      {children}
    </Dialog.Title>
  );
}
