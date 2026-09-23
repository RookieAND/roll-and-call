import { useRender } from "@base-ui-components/react/use-render";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";

export type TableBodyProps = StateComponentProps<"tbody", Record<string, never>>;

export function TableBody({ className, style, render, ref, ...props }: TableBodyProps) {
  const state = {};
  return useRender({
    ref,
    defaultTagName: "tbody",
    render,
    state,
    props: {
      "data-slot": "table-body",
      className: cn("[&>tr:last-child>td]:border-b-0", resolveStateProp(className, state)),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
