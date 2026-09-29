import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

export interface FieldErrorProps {
  message?: ReactNode;
  id?: string;
  className?: string;
  children?: ReactNode;
}

export function FieldError({ id, message, className, children }: FieldErrorProps) {
  return (
    <p
      id={id}
      role="alert"
      data-slot="field-error"
      className={cn("text-xs text-danger-600", className)}
    >
      {children ?? message}
    </p>
  );
}
