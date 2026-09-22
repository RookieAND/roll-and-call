import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";
import type { StateComponentProps } from "./state-props";

const badge = cva(
  "inline-flex items-center rounded-300 px-125 py-075 text-body4 font-bold leading-none",
  {
    variants: {
      colorPalette: {
        gray: "bg-gray-100 text-gray-600",
        // primary-700은 다크에서 뒤집히지 않아 남색 위 남색이 된다. 틴트 배경 글씨는 tinted-ink가 맡는다.
        primary: "bg-primary-50 text-tinted-ink",
        success: "bg-success-100 text-success-700",
        warning: "bg-warning-50 text-warning-600",
        danger: "bg-danger-100 text-danger-600",
        discord: "bg-discord text-white",
      },
    },
    defaultVariants: { colorPalette: "gray" },
  },
);

type BadgeState = VariantProps<typeof badge>;

export interface BadgeProps extends StateComponentProps<"span", BadgeState>, BadgeState {}

export function Badge({
  colorPalette = "gray",
  className,
  style,
  render,
  ref,
  ...props
}: BadgeProps) {
  const state = { colorPalette };
  return useRender({
    ref,
    defaultTagName: "span",
    render,
    state,
    stateAttributesMapping: { colorPalette: (value) => ({ "data-color-palette": String(value) }) },
    props: {
      "data-slot": "badge",
      className: cn(badge({ colorPalette }), resolveStateProp(className, state)),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
