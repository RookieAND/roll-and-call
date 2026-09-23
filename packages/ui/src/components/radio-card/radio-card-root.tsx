"use client";

import { Radio as BaseRadio } from "@base-ui-components/react/radio";
import type { ComponentPropsWithRef } from "react";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import { RadioCardContext, type RadioCardIndicator } from "./radio-card-context";

export interface RadioCardRootProps extends ComponentPropsWithRef<typeof BaseRadio.Root> {
  indicator?: RadioCardIndicator;
}

// 카드 전체가 라벨이자 히트 영역이다. 고른 것은 테두리·배경·표시가 함께 바뀐다(색 단독 의존 금지).
export function RadioCardRoot({ indicator = "radio", className, ...props }: RadioCardRootProps) {
  return (
    <RadioCardContext.Provider value={indicator}>
      <BaseRadio.Root
        data-slot="radio-card"
        className={(state) =>
          cn(
            "grid w-full grid-cols-[1fr_auto] items-start gap-x-125 gap-y-050 rounded-600 border border-gray-200 bg-surface p-200 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus data-checked:border-tinted-border data-checked:bg-tinted-bg data-disabled:opacity-50",
            resolveStateProp(className, state),
          )
        }
        {...props}
      />
    </RadioCardContext.Provider>
  );
}
