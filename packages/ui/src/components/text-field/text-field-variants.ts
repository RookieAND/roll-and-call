import { cva } from "class-variance-authority";

export const textFieldVariants = cva(
  "w-full rounded-[10px] border bg-surface px-150 text-sm outline-none transition-colors placeholder:text-hint focus:ring-2 disabled:bg-gray-50 disabled:opacity-50 scheme-light",
  {
    variants: {
      invalid: {
        true: "border-danger-400 bg-danger-50 focus:ring-danger-600",
        false: "border-input focus:ring-focus",
      },
    },
    defaultVariants: { invalid: false },
  },
);
