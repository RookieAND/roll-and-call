import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";
import { gapMap, type GapToken } from "../../tokens/gap";

const grid = cva("grid", {
  variants: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      12: "grid-cols-12",
    },
  },
});

type GridState = VariantProps<typeof grid>;

export interface GridProps extends StateComponentProps<"div", GridState>, GridState {
  gap?: GapToken;
}

export function Grid({ className, style, cols, gap, render, ref, ...props }: GridProps) {
  const state = { cols };
  return useRender({
    ref,
    defaultTagName: "div",
    render,
    state,
    props: {
      "data-slot": "grid",
      className: cn(
        grid({ cols }),
        gap !== undefined && gapMap[gap],
        resolveStateProp(className, state),
      ),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
