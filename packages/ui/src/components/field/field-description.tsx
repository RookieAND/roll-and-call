import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

export interface FieldDescriptionProps {
  text?: ReactNode;
  id?: string;
  className?: string;
  children?: ReactNode;
}

export function FieldDescription({ id, text, className, children }: FieldDescriptionProps) {
  return (
    <p id={id} data-slot="field-description" className={cn("text-xs text-gray-600", className)}>
      {children ?? text}
    </p>
  );
}
