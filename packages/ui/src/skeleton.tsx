import { cva, type VariantProps } from "class-variance-authority";
import type { CSSProperties } from "react";

import { cn } from "./cn";

const skeleton = cva("animate-[shimmer_1.3s_ease-in-out_infinite] bg-gray-100", {
  variants: {
    rounded: {
      none: "rounded-none",
      100: "rounded-100",
      200: "rounded-200",
      300: "rounded-300",
      400: "rounded-400",
      500: "rounded-500",
      600: "rounded-600",
      700: "rounded-700",
      full: "rounded-full",
    },
  },
  defaultVariants: { rounded: 200 },
});

// 뼈대는 실제 글자·버튼 높이를 흉내 내는 것이라 21 · 17 · 34처럼 스케일에 없는 값이 나온다.
// 연속값이라 레시피로 못 묶으므로 숫자는 px, 문자열은 CSS 길이로 그대로 쓴다.
type Size = number | string;

export type SkeletonProps = VariantProps<typeof skeleton> & {
  width?: Size;
  height?: Size;
  className?: string;
  style?: CSSProperties;
};

const length = (value: Size | undefined) => (typeof value === "number" ? `${value}px` : value);

export function Skeleton({ width, height, rounded, className, style }: SkeletonProps) {
  return (
    <div
      aria-hidden
      style={{ width: length(width), height: length(height), ...style }}
      className={cn(skeleton({ rounded }), className)}
    />
  );
}
