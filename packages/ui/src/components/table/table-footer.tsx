import { useRender } from "@base-ui-components/react/use-render";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";

export type TableFooterProps = StateComponentProps<"tfoot", Record<string, never>>;

export function TableFooter({ className, style, render, ref, ...props }: TableFooterProps) {
  const state = {};
  return useRender({
    ref,
    defaultTagName: "tfoot",
    render,
    state,
    props: {
      "data-slot": "table-footer",
      className: cn(
        "border-t border-gray-200 bg-gray-50 font-semibold",
        resolveStateProp(className, state),
      ),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
