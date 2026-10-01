"use client";

import { Checkbox as BaseCheckbox } from "@base-ui-components/react/checkbox";
import { Check, Minus } from "lucide-react";
import type { ComponentPropsWithRef } from "react";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";

export type CheckboxIndicatorProps = ComponentPropsWithRef<typeof BaseCheckbox.Indicator>;

export function CheckboxIndicator({ className, ...props }: CheckboxIndicatorProps) {
  return (
    <BaseCheckbox.Indicator
      data-slot="checkbox-indicator"
      className={(state) => cn("flex text-current", resolveStateProp(className, state))}
      {...props}
    >
      <Check size={14} strokeWidth={3} aria-hidden className="[[data-indeterminate]_&]:hidden" />
      <Minus
        size={14}
        strokeWidth={3}
        aria-hidden
        className="hidden [[data-indeterminate]_&]:block"
      />
    </BaseCheckbox.Indicator>
  );
}
