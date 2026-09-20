import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef, ReactElement } from "react";

import { cn } from "./cn";

// 리디자인 12 타입 스케일. 11.5px을 12px으로 합쳐 크기 6종 · 변형 10개이고,
// 굵기는 변형의 기본값을 weight로 덮는다.
const text = cva("", {
  variants: {
    typography: {
      heading1: "text-[22px] leading-[1.3] font-extrabold tracking-tight",
      heading2: "text-[18px] leading-[1.35] font-extrabold",
      heading3: "text-[16px] leading-[1.4] font-bold",
      subtitle1: "text-[14px] leading-[1.45] font-bold",
      subtitle2: "text-[13px] leading-[1.45] font-bold",
      subtitle3: "text-[12px] leading-[1.3] font-bold",
      body2: "text-[14px] leading-[1.65] font-normal",
      body3: "text-[13px] leading-[1.6] font-normal",
      body4: "text-[12px] leading-[1.55] font-normal",
      code2: "font-mono text-[12px] leading-[1.4] font-normal",
    },
    foreground: {
      normal: "text-gray-900",
      muted: "text-gray-600",
      hint: "text-hint",
      primary: "text-tinted-ink",
      success: "text-success-700",
      warning: "text-warning-600",
      danger: "text-danger-600",
      white: "text-white",
    },
    // 디자인 토큰 이름을 따른다. medium은 600이라 Tailwind로는 font-semibold다.
    weight: {
      regular: "font-normal",
      medium: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
    // 배지·칩처럼 상자 높이가 고정된 자리는 행간을 1로 내린다.
    tight: { true: "leading-none" },
    numeric: { true: "tabular-nums" },
    truncate: { true: "block truncate" },
  },
  defaultVariants: { typography: "body2", foreground: "normal" },
});

export type TextProps = ComponentPropsWithRef<"span"> &
  VariantProps<typeof text> & {
    render?: ReactElement<Record<string, unknown>>;
  };

export function Text({
  typography,
  foreground,
  weight,
  tight,
  numeric,
  truncate,
  className,
  render,
  ...props
}: TextProps) {
  return useRender({
    defaultTagName: "span",
    render,
    props: {
      className: cn(text({ typography, foreground, weight, tight, numeric, truncate }), className),
      ...props,
    },
  });
}
