import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";

// Roll & Call 디자인 시스템 §A. 배지·칩은 body4에 weight·tight를 얹어 쓰고,
// body5는 달력 칸·히트맵처럼 12px이 넘치는 격자에만 쓴다.
const text = cva("", {
  variants: {
    typography: {
      heading1: "text-heading1 font-extrabold tracking-tight",
      heading2: "text-heading2 font-extrabold",
      heading3: "text-heading3 font-bold",
      subtitle1: "text-subtitle1 font-bold",
      subtitle2: "text-subtitle2 font-bold",
      body2: "text-body2 font-normal",
      body3: "text-body3 font-normal",
      body4: "text-body4 font-normal",
      body5: "text-body5 font-normal",
      code2: "font-mono text-body4 leading-[1.4] font-normal",
    },
    foreground: {
      normal: "text-gray-900",
      muted: "text-gray-600",
      hint: "text-hint",
      primary: "text-tinted-ink",
      success: "text-success-700",
      // 확정 시각처럼 같은 카드 안에서 한 단 더 세울 때. 램프는 이미 두 값을 갖고 있다.
      successStrong: "text-success-800",
      warning: "text-warning-600",
      danger: "text-danger-600",
      // 테마와 무관하게 흰 글씨. 주 색·어두운 딤처럼 늘 진한 면 위에 얹는다.
      onPrimary: "text-on-primary",
      // 반대 면(토스트 등) 위 글씨. 다크에서 어둡게 뒤집힌다.
      inverse: "text-inverse",
      // 부모가 색을 정하는 자리(탭·칩 안쪽 라벨).
      inherit: "text-current",
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

type TextState = Pick<VariantProps<typeof text>, "typography" | "foreground" | "weight">;

export interface TextProps
  extends StateComponentProps<"span", TextState>, VariantProps<typeof text> {}

export function Text({
  typography = "body2",
  foreground = "normal",
  weight,
  tight,
  numeric,
  truncate,
  className,
  style,
  render,
  ref,
  ...props
}: TextProps) {
  const state = { typography, foreground, weight };
  return useRender({
    ref,
    defaultTagName: "span",
    render,
    state,
    props: {
      "data-slot": "text",
      className: cn(
        text({ typography, foreground, weight, tight, numeric, truncate }),
        resolveStateProp(className, state),
      ),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
