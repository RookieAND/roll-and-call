"use client";

import { Checkbox as BaseCheckbox } from "@base-ui-components/react/checkbox";
import type { ComponentPropsWithRef } from "react";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";

export type CheckboxRootProps = ComponentPropsWithRef<typeof BaseCheckbox.Root>;

// checked에 "indeterminate" 대신 indeterminate prop을 준다(부분 선택 1급 지원).
export function CheckboxRoot({ className, ...props }: CheckboxRootProps) {
  return (
    <BaseCheckbox.Root
      data-slot="checkbox"
      className={(state) =>
        cn(
          "flex size-5 shrink-0 items-center justify-center rounded-200 border border-gray-300 bg-surface text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus data-checked:border-primary-600 data-checked:bg-primary-600 data-indeterminate:border-primary-600 data-indeterminate:bg-primary-600 data-disabled:opacity-50",
          resolveStateProp(className, state),
        )
      }
      {...props}
    />
  );
}
