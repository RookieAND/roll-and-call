import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

export interface FieldDescriptionProps {
  text?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function FieldDescription({ text, className, children }: FieldDescriptionProps) {
  return (
    <p data-slot="field-description" className={cn("text-xs text-gray-600", className)}>
      {children ?? text}
    </p>
  );
}
