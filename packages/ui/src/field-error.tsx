import type { ReactNode } from "react";

import { cn } from "./cn";

export interface FieldErrorProps {
  message?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function FieldError({ message, className, children }: FieldErrorProps) {
  return (
    <p data-slot="field-error" className={cn("text-xs text-danger-600", className)}>
      {children ?? message}
    </p>
  );
}
