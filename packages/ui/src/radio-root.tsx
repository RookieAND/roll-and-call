"use client";

import { Radio as BaseRadio } from "@base-ui-components/react/radio";
import type { ComponentPropsWithRef } from "react";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";

export type RadioRootProps = ComponentPropsWithRef<typeof BaseRadio.Root>;

export function RadioRoot({ className, ...props }: RadioRootProps) {
  return (
    <BaseRadio.Root
      data-slot="radio"
      className={(state) =>
        cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus data-checked:border-primary-600 data-disabled:opacity-50",
          resolveStateProp(className, state),
        )
      }
      {...props}
    />
  );
}
