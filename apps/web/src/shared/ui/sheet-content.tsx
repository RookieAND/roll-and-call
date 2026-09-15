"use client";

import { Dialog } from "@base-ui-components/react/dialog";
import { cn } from "@trpg/ui";
import type { ReactNode } from "react";

export function SheetContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Dialog.Portal>
      <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/30" />
      <Dialog.Popup
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[412px] rounded-t-[20px] border-t border-gray-200 bg-surface p-5 shadow-[0_-8px_28px_rgba(23,23,28,0.1)] outline-none",
          className,
        )}
      >
        <div className="mx-auto mb-4 h-1 w-[38px] rounded-full bg-gray-300" />
        {children}
      </Dialog.Popup>
    </Dialog.Portal>
  );
}
