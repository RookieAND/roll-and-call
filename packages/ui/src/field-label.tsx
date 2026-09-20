import type { ReactNode } from "react";

export function FieldLabel({
  label,
  counter,
  required,
  htmlFor,
}: {
  label?: string;
  counter?: ReactNode;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-100">
      <label htmlFor={htmlFor} className="text-body4 font-bold text-gray-700">
        {label}
        {required && <span className="text-danger-600"> *</span>}
      </label>
      {counter && <span className="shrink-0 text-xs tabular-nums text-gray-600">{counter}</span>}
    </div>
  );
}
