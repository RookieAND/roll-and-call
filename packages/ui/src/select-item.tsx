"use client";

import { Select as BaseSelect } from "@base-ui-components/react/select";
import type { ReactNode } from "react";

import { cn } from "./cn";

export function SelectItem({
  value,
  disabled,
  className,
  children,
}: {
  value: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <BaseSelect.Item
      value={value}
      disabled={disabled}
      className={cn(
        "flex cursor-pointer items-center justify-between gap-2 rounded-300 px-3 py-2 text-sm text-gray-700 outline-none select-none data-[disabled]:opacity-40 data-[highlighted]:bg-primary-50 data-[highlighted]:text-primary-700",
        className,
      )}
    >
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className="text-primary-600">✓</BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
}
