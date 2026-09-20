"use client";

import { Select as BaseSelect } from "@base-ui-components/react/select";
import type { ReactNode } from "react";

import { cn } from "./cn";

interface SelectPopupProps {
  children: ReactNode;
  className?: string;
}

export function SelectPopup({ children, className }: SelectPopupProps) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner
        sideOffset={6}
        alignItemWithTrigger={false}
        className="z-50 outline-none"
      >
        <BaseSelect.Popup
          className={cn(
            "max-h-60 min-w-[var(--anchor-width)] overflow-auto rounded-500 border border-gray-200 bg-surface p-050 shadow-[0_8px_28px_rgba(23,23,28,0.12)] outline-none",
            className,
          )}
        >
          {children}
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}
