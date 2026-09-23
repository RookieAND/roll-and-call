import { useRender } from "@base-ui-components/react/use-render";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";

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
