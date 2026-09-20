import type { CSSProperties } from "react";

import { cn } from "./cn";

// 뼈대는 실제 글자·버튼 높이를 흉내 내는 것이라 간격 스케일에 맞지 않는 값(21 · 17 · 34)이 나온다.
// 숫자는 px로, 문자열은 CSS 길이로 그대로 쓴다.
type Size = number | string;

const ROUNDED = {
  none: "rounded-none",
  100: "rounded-100",
  200: "rounded-200",
  300: "rounded-300",
  400: "rounded-400",
  500: "rounded-500",
  600: "rounded-600",
  700: "rounded-700",
  full: "rounded-full",
} as const;

export type SkeletonProps = {
  width?: Size;
  height?: Size;
  rounded?: keyof typeof ROUNDED;
  className?: string;
  style?: CSSProperties;
};

const length = (value: Size | undefined) => (typeof value === "number" ? `${value}px` : value);

export function Skeleton({ width, height, rounded = 200, className, style }: SkeletonProps) {
  return (
    <div
      aria-hidden
      style={{ width: length(width), height: length(height), ...style }}
      className={cn(
        "animate-[shimmer_1.3s_ease-in-out_infinite] bg-gray-100",
        ROUNDED[rounded],
        className,
      )}
    />
  );
}
