"use client";

import { Select as BaseSelect } from "@base-ui-components/react/select";
import type { ReactNode } from "react";

import { SelectItemsContext, type SelectOption } from "./select-items-context";

export type SelectRootProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  items?: SelectOption[];
  name?: string;
  disabled?: boolean;
  children: ReactNode;
};

export function SelectRoot({
  value,
  defaultValue,
  onValueChange,
  items = [],
  name,
  disabled,
  children,
}: SelectRootProps) {
  return (
    <SelectItemsContext.Provider value={items}>
      <BaseSelect.Root
        items={items}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(nextValue) => onValueChange?.(nextValue as string)}
        name={name}
        disabled={disabled}
      >
        {children}
      </BaseSelect.Root>
    </SelectItemsContext.Provider>
  );
}
