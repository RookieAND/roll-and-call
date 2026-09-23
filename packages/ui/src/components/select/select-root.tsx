"use client";

import { Select as BaseSelect } from "@base-ui-components/react/select";
import type { ReactNode } from "react";

import { SelectItemsContext, type SelectOption } from "./select-items-context";

export interface SelectRootProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  items?: SelectOption[];
  name?: string;
  disabled?: boolean;
  children: ReactNode;
}

// defaultValue가 첫 렌더 이후에 도착하면(비동기 데이터) base-ui가 무시한다.
// 비제어 모드일 때 defaultValue가 바뀌면 key를 갈아 끼워 다시 마운트시킨다.
export function SelectRoot({
  value,
  defaultValue,
  onValueChange,
  items = [],
  name,
  disabled,
  children,
}: SelectRootProps) {
  const isControlled = value !== undefined;
  return (
    <SelectItemsContext.Provider value={items}>
      <BaseSelect.Root
        key={isControlled ? undefined : defaultValue}
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
