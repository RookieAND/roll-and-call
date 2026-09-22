"use client";

import { Radio as BaseRadio } from "@base-ui-components/react/radio";
import type { ComponentPropsWithRef } from "react";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";

export type RadioIndicatorProps = ComponentPropsWithRef<typeof BaseRadio.Indicator>;

export function RadioIndicator({ className, ...props }: RadioIndicatorProps) {
  return (
    <BaseRadio.Indicator
      data-slot="radio-indicator"
      className={(state) =>
        cn("size-2.5 rounded-full bg-primary-600", resolveStateProp(className, state))
      }
      {...props}
    />
  );
}
