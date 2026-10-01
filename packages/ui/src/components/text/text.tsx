import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";

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
      successStrong: "text-success-800",
      warning: "text-warning-600",
      danger: "text-danger-600",
      onPrimary: "text-on-primary",
      inverse: "text-inverse",
      inherit: "text-current",
    },
    // 디자인 토큰 이름을 따른다. medium은 600이라 Tailwind로는 font-semibold다.
    weight: {
      regular: "font-normal",
      medium: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
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
        resolveStateProp({ prop: className, state }),
      ),
      style: resolveStateProp({ prop: style, state }),
      ...props,
    },
  });
}
