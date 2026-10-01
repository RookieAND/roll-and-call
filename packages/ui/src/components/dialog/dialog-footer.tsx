import { useRender } from "@base-ui-components/react/use-render";
import { cva } from "class-variance-authority";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";

const footer = cva("mt-250 flex gap-100", {
  variants: { layout: { row: "flex-row", stack: "flex-col-reverse" } },
  defaultVariants: { layout: "stack" },
});

type DialogFooterState = { layout: "row" | "stack" };

export interface DialogFooterProps extends StateComponentProps<"div", DialogFooterState> {
  layout?: DialogFooterState["layout"];
}

export function DialogFooter({
  layout = "stack",
  className,
  style,
  render,
  ref,
  ...props
}: DialogFooterProps) {
  const state = { layout };
  return useRender({
    ref,
    defaultTagName: "div",
    render,
    state,
    props: {
      "data-slot": "dialog-footer",
      className: cn(footer({ layout }), resolveStateProp({ prop: className, state })),
      style: resolveStateProp({ prop: style, state }),
      ...props,
    },
  });
}
