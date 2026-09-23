"use client";

import { Radio as BaseRadio } from "@base-ui-components/react/radio";
import { Check } from "lucide-react";
import { useContext } from "react";

import { cn } from "../../lib/cn";
import { RadioCardContext } from "./radio-card-context";

export interface RadioCardIndicatorProps {
  className?: string;
}

export function RadioCardIndicator({ className }: RadioCardIndicatorProps) {
  const indicator = useContext(RadioCardContext);
  if (indicator === "none") return null;
  if (indicator === "check") {
    return (
      <BaseRadio.Indicator
        data-slot="radio-card-indicator"
        className={cn("col-start-2 row-start-1 text-tinted-ink", className)}
      >
        <Check size={18} strokeWidth={2.4} aria-hidden />
      </BaseRadio.Indicator>
    );
  }
  return (
    <span
      aria-hidden
      data-slot="radio-card-indicator"
      className={cn(
        "col-start-2 row-start-1 flex size-5 items-center justify-center rounded-full border border-gray-300 [[data-checked]_&]:border-primary-600",
        className,
      )}
    >
      <BaseRadio.Indicator className="size-2.5 rounded-full bg-primary-600" />
    </span>
  );
}
