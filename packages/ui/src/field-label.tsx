import type { ReactNode } from "react";

import { cn } from "./cn";

export interface FieldLabelProps {
  label?: ReactNode;
  counter?: ReactNode;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children?: ReactNode;
}

export function FieldLabel({
  label,
  counter,
  required,
  htmlFor,
  className,
  children,
}: FieldLabelProps) {
  return (
    <div
      data-slot="field-header"
      className={cn("flex items-baseline justify-between gap-100", className)}
    >
      <label
        data-slot="field-label"
        htmlFor={htmlFor}
        className="text-body4 font-bold text-gray-700"
      >
        {children ?? label}
        {required && <span className="text-danger-600"> *</span>}
      </label>
      {counter && (
        <span data-slot="field-counter" className="shrink-0 text-xs tabular-nums text-gray-600">
          {counter}
        </span>
      )}
    </div>
  );
}
