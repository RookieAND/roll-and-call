import { useRender } from "@base-ui-components/react/use-render";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";

export type TableCaptionProps = StateComponentProps<"caption", Record<string, never>>;

export function TableCaption({ className, style, render, ref, ...props }: TableCaptionProps) {
  const state = {};
  return useRender({
    ref,
    defaultTagName: "caption",
    render,
    state,
    props: {
      "data-slot": "table-caption",
      className: cn(
        "caption-bottom px-150 py-100 text-left text-body4 text-hint",
        resolveStateProp(className, state),
      ),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
