import { cva } from "class-variance-authority";

// 제목과 아이콘은 톤 색을 받고, 본문은 제목이 있을 때 회색으로 한 단 내려간다.
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
