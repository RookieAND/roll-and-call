import { useRender } from "@base-ui-components/react/use-render";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";
import type { StateComponentProps } from "./state-props";

export type CardBodyProps = StateComponentProps<"div", Record<string, never>>;

export function CardBody({ className, style, render, ref, ...props }: CardBodyProps) {
  const state = {};
  return useRender({
    ref,
    defaultTagName: "div",
    render,
    state,
    props: {
      "data-slot": "card-body",
      className: cn("", resolveStateProp(className, state)),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
