import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";

// tinted는 같은 색을 한 단 옅게 칠한다(모집 중 = solid, 대기 = tinted).
const fill = cva("h-full rounded-100", {
  variants: {
    variant: { solid: "", tinted: "" },
    colorPalette: { primary: "", success: "", gray: "" },
  },
  compoundVariants: [
    { variant: "solid", colorPalette: "primary", className: "bg-primary-500" },
    { variant: "tinted", colorPalette: "primary", className: "bg-primary-300" },
    { variant: "solid", colorPalette: "success", className: "bg-success-600" },
    { variant: "tinted", colorPalette: "success", className: "bg-success-200" },
    { variant: "solid", colorPalette: "gray", className: "bg-gray-400" },
    { variant: "tinted", colorPalette: "gray", className: "bg-gray-300" },
  ],
  defaultVariants: { variant: "solid", colorPalette: "primary" },
});

type ProgressState = VariantProps<typeof fill> & { value: number; max: number };

export interface ProgressProps
  extends Omit<StateComponentProps<"div", ProgressState>, "children">, VariantProps<typeof fill> {
  value: number;
  max?: number;
}

export function Progress({
  value,
  max = 100,
  variant = "solid",
  colorPalette = "primary",
  className,
  style,
  render,
  ref,
  ...props
}: ProgressProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const state = { variant, colorPalette, value, max };
  return useRender({
    ref,
    defaultTagName: "div",
    render,
    state,
    stateAttributesMapping: {
      colorPalette: (palette) => ({ "data-color-palette": String(palette) }),
    },
    props: {
      "data-slot": "progress",
      className: cn(
        "h-1 w-full overflow-hidden rounded-100 bg-gray-100",
        resolveStateProp(className, state),
      ),
      style: resolveStateProp(style, state),
      ...props,
      children: (
        <div
          data-slot="progress-indicator"
          className={fill({ variant, colorPalette })}
          style={{ width: `${percent}%` }}
        />
      ),
    },
  });
}
