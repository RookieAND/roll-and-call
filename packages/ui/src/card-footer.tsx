import { useRender } from "@base-ui-components/react/use-render";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";
import type { StateComponentProps } from "./state-props";

export type CardFooterProps = StateComponentProps<"div", Record<string, never>>;

export function CardFooter({ className, style, render, ref, ...props }: CardFooterProps) {
  const state = {};
  return useRender({
    ref,
    defaultTagName: "div",
    render,
    state,
    props: {
      "data-slot": "card-footer",
      className: cn("mt-150 flex gap-100", resolveStateProp(className, state)),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
