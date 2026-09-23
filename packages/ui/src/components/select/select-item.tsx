"use client";

import { Select as BaseSelect } from "@base-ui-components/react/select";
import type { ReactNode } from "react";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateClassName } from "../../lib/state-props";

interface SelectItemProps {
  value: string;
  disabled?: boolean;
  className?: StateClassName<BaseSelect.Item.State>;
  children: ReactNode;
}

export function SelectItem({ value, disabled, className, children }: SelectItemProps) {
  return (
    <BaseSelect.Item
      value={value}
      disabled={disabled}
      data-slot="select-item"
      className={(state) =>
        cn(
          "flex cursor-pointer items-center justify-between gap-100 rounded-300 px-150 py-100 text-sm text-gray-700 outline-none select-none data-[disabled]:opacity-40 data-[highlighted]:bg-primary-50 data-[highlighted]:text-primary-700",
          resolveStateProp(className, state),
        )
      }
    >
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator data-slot="select-item-indicator" className="text-primary-600">
        ✓
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
}
