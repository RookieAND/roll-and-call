"use client";

import { Select as BaseSelect } from "@base-ui-components/react/select";
import { useContext, type ReactNode } from "react";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateClassName } from "../../lib/state-props";
import { useFieldControlAria } from "../field/use-field-control-aria";
import { SelectItemsContext } from "./select-items-context";

export interface SelectTriggerProps {
  placeholder?: string;
  invalid?: boolean;
  id?: string;
  "aria-label"?: string;
  className?: StateClassName<BaseSelect.Trigger.State>;
  children?: ReactNode;
}

export function SelectTrigger({
  placeholder = "선택",
  invalid = false,
  id,
  "aria-label": ariaLabel,
  className,
  children,
}: SelectTriggerProps) {
  const items = useContext(SelectItemsContext);
  const fieldAria = useFieldControlAria(invalid);
  return (
    <BaseSelect.Trigger
      id={id}
      aria-label={ariaLabel}
      {...fieldAria}
      data-slot="select-trigger"
      data-invalid={invalid ? "" : undefined}
      className={(state) =>
        cn(
          "flex h-11 w-full items-center justify-between gap-100 rounded-400 border bg-surface px-150 text-left text-sm outline-none transition-colors focus:ring-2 disabled:opacity-50",
          invalid
            ? "border-[1.5px] border-danger-400 bg-danger-50 focus:ring-danger-600"
            : "border-gray-500 focus:border-primary-500 focus:ring-focus",
          resolveStateProp(className, state),
        )
      }
    >
      {children ?? (
        <>
          <BaseSelect.Value>
            {(selectedValue: string) =>
              items.find((option) => option.value === selectedValue)?.label ?? (
                <span className="text-hint">{placeholder}</span>
              )
            }
          </BaseSelect.Value>
          <BaseSelect.Icon data-slot="select-icon" className="text-gray-500">
            ▾
          </BaseSelect.Icon>
        </>
      )}
    </BaseSelect.Trigger>
  );
}
