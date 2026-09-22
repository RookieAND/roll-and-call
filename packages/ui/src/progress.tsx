import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";
import type { StateComponentProps } from "./state-props";

const fill = cva("h-full rounded-100", {
  variants: {
    color: {
      recruiting: "bg-primary-500",
      waiting: "bg-primary-300",
      confirmed: "bg-success-600",
      closed: "bg-gray-400",
    },
  },
  defaultVariants: { color: "recruiting" },
});

type ProgressState = VariantProps<typeof fill> & { value: number; max: number };

export interface ProgressProps
  extends
    Omit<StateComponentProps<"div", ProgressState>, "color" | "children">,
    VariantProps<typeof fill> {
  value: number;
  max?: number;
}

export function Progress({
  value,
  max = 100,
  color = "recruiting",
  className,
  style,
  render,
  ref,
  ...props
}: ProgressProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const state = { color, value, max };
  return useRender({
    ref,
    defaultTagName: "div",
    render,
    state,
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
          className={fill({ color })}
          style={{ width: `${percent}%` }}
        />
      ),
    },
  });
}
