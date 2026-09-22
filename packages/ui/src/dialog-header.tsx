import { useRender } from "@base-ui-components/react/use-render";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";
import type { StateComponentProps } from "./state-props";

export type DialogHeaderProps = StateComponentProps<"div", Record<string, never>>;

export function DialogHeader({ className, style, render, ref, ...props }: DialogHeaderProps) {
  const state = {};
  return useRender({
    ref,
    defaultTagName: "div",
    render,
    state,
    props: {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-075", resolveStateProp(className, state)),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
