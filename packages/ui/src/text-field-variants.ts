import { cva } from "class-variance-authority";

export const textFieldVariants = cva(
  "w-full rounded-[10px] border bg-surface px-3 text-sm outline-none transition-colors placeholder:text-hint focus:ring-2 [color-scheme:light]",
  {
    variants: {
      invalid: {
        true: "border-[1.5px] border-danger-400 bg-danger-50 focus:border-danger-400 focus:ring-danger-200",
        false: "border-gray-200 focus:border-primary-500 focus:ring-primary-100",
      },
    },
    defaultVariants: { invalid: false },
  },
);
