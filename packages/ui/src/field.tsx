import type { ReactNode } from "react";

import { cn } from "./cn";

export type FieldProps = {
  label?: string;
  counter?: ReactNode;
  description?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
};

export function Field({
  label,
  counter,
  description,
  error,
  required,
  htmlFor,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-075", className)}>
      {(label || counter) && (
        <div className="flex items-baseline justify-between gap-100">
          <label htmlFor={htmlFor} className="text-body4 font-bold text-gray-700">
            {label}
            {required && <span className="text-danger-600"> *</span>}
          </label>
          {counter && (
            <span className="shrink-0 text-xs tabular-nums text-gray-600">{counter}</span>
          )}
        </div>
      )}
      {children}
      {description && !error && <p className="text-xs text-gray-600">{description}</p>}
      {error && <p className="text-xs text-danger-600">{error}</p>}
    </div>
  );
}
