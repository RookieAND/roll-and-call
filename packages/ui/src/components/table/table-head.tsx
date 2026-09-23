import { useRender } from "@base-ui-components/react/use-render";
import type { VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";
import { tableCellVariants } from "./table-cell-variants";

type TableHeadState = Pick<VariantProps<typeof tableCellVariants>, "align" | "numeric">;

export interface TableHeadProps
  extends Omit<StateComponentProps<"th", TableHeadState>, "align">, TableHeadState {}

export function TableHead({
  align = "start",
  numeric = false,
  className,
  style,
  render,
  ref,
  ...props
}: TableHeadProps) {
  const state = { align, numeric };
  return useRender({
    ref,
    defaultTagName: "th",
    render,
    state,
    props: {
      "data-slot": "table-head",
      scope: "col",
      className: cn(
        tableCellVariants({ header: true, align, numeric }),
        resolveStateProp(className, state),
      ),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
