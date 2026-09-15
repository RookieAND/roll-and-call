import type { VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";

import { cn } from "./cn";
import { textFieldVariants } from "./text-field-variants";

export type TextInputProps = ComponentPropsWithRef<"input"> &
  VariantProps<typeof textFieldVariants>;

export function TextInput({ invalid, className, ...props }: TextInputProps) {
  return <input className={cn(textFieldVariants({ invalid }), "h-11", className)} {...props} />;
}
