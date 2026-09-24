import { useRender } from "@base-ui-components/react/use-render";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";

export type DialogBodyProps = StateComponentProps<"div", Record<string, never>>;

export function DialogBody({ className, style, render, ref, ...props }: DialogBodyProps) {
  const state = {};
  return useRender({
    ref,
    defaultTagName: "div",
    render,
    state,
    props: {
      "data-slot": "dialog-body",
      className: cn("min-h-0 flex-1 overflow-y-auto", resolveStateProp(className, state)),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
