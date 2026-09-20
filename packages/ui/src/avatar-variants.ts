import { cva } from "class-variance-authority";

export const avatarVariants = cva(
  "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold",
  {
    variants: {
      size: {
        sm: "h-6 w-6 text-body5",
        md: "h-8 w-8 text-xs",
        stack: "h-[34px] w-[34px] text-subtitle2",
        lg: "h-12 w-12 text-sm",
        xl: "h-[52px] w-[52px] text-lg",
        "2xl": "h-[60px] w-[60px] text-xl",
        "3xl": "h-[84px] w-[84px] text-2xl",
      },
    },
    defaultVariants: { size: "md" },
  },
);
