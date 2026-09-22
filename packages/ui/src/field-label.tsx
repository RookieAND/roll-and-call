import type { ReactNode } from "react";

interface FieldLabelProps {
  label?: string;
  counter?: ReactNode;
  required?: boolean;
  htmlFor?: string;
}

export function FieldLabel({ label, counter, required, htmlFor }: FieldLabelProps) {
  return (
    <div data-slot="field-header" className="flex items-baseline justify-between gap-100">
      <label
        data-slot="field-label"
        htmlFor={htmlFor}
        className="text-body4 font-bold text-gray-700"
      >
        {label}
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
