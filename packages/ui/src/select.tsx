"use client";

import { Select as BaseSelect } from "@base-ui-components/react/select";
import { createContext, useContext, type ReactNode } from "react";
import { cn } from "./cn";

export type SelectOption = { label: string; value: string };

// Shares the option list down to Trigger so it can resolve the selected label.
const ItemsContext = createContext<SelectOption[]>([]);

export type SelectRootProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  items?: SelectOption[];
  name?: string;
  disabled?: boolean;
  children: ReactNode;
};

function Root({
  value,
  defaultValue,
  onValueChange,
  items = [],
  name,
  disabled,
  children,
}: SelectRootProps) {
  return (
    <ItemsContext.Provider value={items}>
      <BaseSelect.Root
        items={items}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(v) => onValueChange?.(v as string)}
        name={name}
        disabled={disabled}
      >
        {children}
      </BaseSelect.Root>
    </ItemsContext.Provider>
  );
}

export type SelectTriggerProps = {
  placeholder?: string;
  invalid?: boolean;
  id?: string;
  className?: string;
  /** Custom trigger content; defaults to selected value + chevron. */
  children?: ReactNode;
};

function Trigger({
  placeholder = "선택",
  invalid = false,
  id,
  className,
  children,
}: SelectTriggerProps) {
  const items = useContext(ItemsContext);
  return (
    <BaseSelect.Trigger
      id={id}
      className={cn(
        "flex h-11 w-full items-center justify-between gap-2 rounded-[10px] border bg-surface px-3 text-left text-sm outline-none transition-colors focus:ring-2 disabled:opacity-50",
        invalid
          ? "border-[1.5px] border-danger-400 bg-danger-50 focus:ring-danger-200"
          : "border-gray-200 focus:border-primary-500 focus:ring-primary-100",
        className,
      )}
    >
      {children ?? (
        <>
          <BaseSelect.Value>
            {(v: string) =>
              items.find((o) => o.value === v)?.label ?? (
                <span className="text-hint">{placeholder}</span>
              )
            }
          </BaseSelect.Value>
          <BaseSelect.Icon className="text-gray-500">▾</BaseSelect.Icon>
        </>
      )}
    </BaseSelect.Trigger>
  );
}

function Popup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner
        sideOffset={6}
        alignItemWithTrigger={false}
        className="z-50 outline-none"
      >
        <BaseSelect.Popup
          className={cn(
            "max-h-60 min-w-[var(--anchor-width)] overflow-auto rounded-xl border border-gray-200 bg-surface p-1 shadow-[0_8px_28px_rgba(23,23,28,0.12)] outline-none",
            className,
          )}
        >
          {children}
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

function Item({
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
        "flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none select-none data-[disabled]:opacity-40 data-[highlighted]:bg-primary-50 data-[highlighted]:text-primary-700",
        className,
      )}
    >
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className="text-primary-600">✓</BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
}

// Compound API (vapor-ui style dot-notation): Select.Root / Trigger / Popup / Item.
// Base UI primitives (Value, Icon, Group, …) stay reachable for custom triggers.
export const Select = {
  Root,
  Trigger,
  Popup,
  Item,
  Value: BaseSelect.Value,
  Icon: BaseSelect.Icon,
  Group: BaseSelect.Group,
  GroupLabel: BaseSelect.GroupLabel,
  Separator: BaseSelect.Separator,
};
