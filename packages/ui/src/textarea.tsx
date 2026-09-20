import type { VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";

import { cn } from "./cn";
import { textFieldVariants } from "./text-field-variants";

export interface TextareaProps
  extends ComponentPropsWithRef<"textarea">, VariantProps<typeof textFieldVariants> {}

export function Textarea({ invalid, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(textFieldVariants({ invalid }), "min-h-24 py-125", className)}
      {...props}
    />
  );
}
