import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef } from "react";
import { cn } from "./cn";

const field = cva(
  "w-full rounded-[10px] border bg-surface px-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:ring-2 [color-scheme:light]",
  {
    variants: {
      invalid: {
        true: "border-[1.5px] border-[#E5A0A0] bg-[#FEFAFA] focus:border-[#E5A0A0] focus:ring-[#F3D9D9]",
        false:
          "border-gray-200 focus:border-primary-500 focus:ring-primary-100",
      },
    },
    defaultVariants: { invalid: false },
  },
);

export type TextInputProps = ComponentPropsWithRef<"input"> &
  VariantProps<typeof field>;

export function TextInput({ invalid, className, ...props }: TextInputProps) {
  return <input className={cn(field({ invalid }), "h-11", className)} {...props} />;
}

export type TextareaProps = ComponentPropsWithRef<"textarea"> &
  VariantProps<typeof field>;

export function Textarea({ invalid, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(field({ invalid }), "min-h-24 py-2.5", className)}
      {...props}
    />
  );
}
