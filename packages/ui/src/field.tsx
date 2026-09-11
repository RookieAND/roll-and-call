import type { ReactNode } from "react";
import { cn } from "./cn";

export type FieldProps = {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
};

export function Field({
  label,
  description,
  error,
  required,
  htmlFor,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-[12.5px] font-bold text-gray-700">
          {label}
          {required && <span className="text-danger-600"> *</span>}
        </label>
      )}
      {children}
      {description && !error && <p className="text-xs text-gray-600">{description}</p>}
      {error && <p className="text-xs text-danger-600">{error}</p>}
    </div>
  );
}
