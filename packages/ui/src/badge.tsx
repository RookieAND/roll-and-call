import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";
import type { StateComponentProps } from "./state-props";

const badge = cva(
  "inline-flex items-center rounded-300 px-125 py-075 text-body4 font-bold leading-none",
  {
    variants: {
      color: {
        gray: "bg-gray-100 text-gray-600",
        // primary-700은 다크에서 뒤집히지 않아 남색 위 남색이 된다. 틴트 배경 글씨는 tinted-ink가 맡는다.
        primary: "bg-primary-50 text-tinted-ink",
        success: "bg-success-100 text-success-700",
        warning: "bg-warning-50 text-warning-600",
        danger: "bg-danger-100 text-danger-600",
        discord: "bg-discord text-white",
      },
    },
    defaultVariants: { color: "gray" },
  },
);

type BadgeState = VariantProps<typeof badge>;

// color는 span의 옛 HTML 속성과 이름이 겹친다. 뱃지에서 색은 variant 쪽이 맡는다.
export interface BadgeProps
  extends Omit<StateComponentProps<"span", BadgeState>, "color">, BadgeState {}

export function Badge({ color = "gray", className, style, render, ref, ...props }: BadgeProps) {
  const state = { color };
  return useRender({
    ref,
    defaultTagName: "span",
    render,
    state,
    props: {
      "data-slot": "badge",
      className: cn(badge({ color }), resolveStateProp(className, state)),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
