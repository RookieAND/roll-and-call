import { cva } from "class-variance-authority";

export const calloutInk = cva("", {
  variants: {
    colorPalette: {
      gray: "text-gray-900",
      primary: "text-tinted-ink",
      success: "text-success-700",
      warning: "text-warning-600",
      notice: "text-notice-ink",
      danger: "text-danger-600",
    },
  },
  defaultVariants: { colorPalette: "gray" },
});
