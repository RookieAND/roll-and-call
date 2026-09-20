import type { ReactNode } from "react";

import { cn } from "./cn";
import { FieldDescription } from "./field-description";
import { FieldError } from "./field-error";
import { FieldLabel } from "./field-label";

export interface FieldProps {
  label?: string;
  counter?: ReactNode;
  description?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}

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
        <FieldLabel label={label} counter={counter} required={required} htmlFor={htmlFor} />
      )}
      {children}
      {error ? (
        <FieldError message={error} />
      ) : (
        description && <FieldDescription text={description} />
      )}
    </div>
  );
}
