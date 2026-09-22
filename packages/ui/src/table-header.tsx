import { useRender } from "@base-ui-components/react/use-render";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";
import type { StateComponentProps } from "./state-props";

export type TableHeaderProps = StateComponentProps<"thead", Record<string, never>>;

export function TableHeader({ className, style, render, ref, ...props }: TableHeaderProps) {
  const state = {};
  return useRender({
    ref,
    defaultTagName: "thead",
    render,
    state,
    props: {
      "data-slot": "table-header",
      className: cn("bg-gray-50", resolveStateProp(className, state)),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
