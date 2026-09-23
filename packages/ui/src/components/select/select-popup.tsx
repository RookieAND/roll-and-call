"use client";

import { Select as BaseSelect } from "@base-ui-components/react/select";
import type { ReactNode } from "react";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateClassName } from "../../lib/state-props";

interface SelectPopupProps {
  children: ReactNode;
  className?: StateClassName<BaseSelect.Popup.State>;
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
          data-slot="select-popup"
          className={(state) =>
            cn(
              "max-h-60 min-w-[var(--anchor-width)] overflow-auto rounded-500 border border-gray-200 bg-surface p-050 shadow-[0_8px_28px_rgba(23,23,28,0.12)] outline-none",
              resolveStateProp(className, state),
            )
          }
        >
          {children}
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}
