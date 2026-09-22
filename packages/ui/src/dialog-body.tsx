import { useRender } from "@base-ui-components/react/use-render";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";
import type { StateComponentProps } from "./state-props";

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
      className: cn("min-h-0 flex-1", resolveStateProp(className, state)),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
