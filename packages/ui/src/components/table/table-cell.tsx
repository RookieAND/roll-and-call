import { useRender } from "@base-ui-components/react/use-render";
import type { VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";
import { tableCellVariants } from "./table-cell-variants";

type TableCellState = Pick<VariantProps<typeof tableCellVariants>, "align" | "numeric">;

export interface TableCellProps
  extends Omit<StateComponentProps<"td", TableCellState>, "align">, TableCellState {}

export function TableCell({
  align = "start",
  numeric = false,
  className,
  style,
  render,
  ref,
  ...props
}: TableCellProps) {
  const state = { align, numeric };
  return useRender({
    ref,
    defaultTagName: "td",
    render,
    state,
    props: {
      "data-slot": "table-cell",
      className: cn(
        tableCellVariants({ header: false, align, numeric }),
        resolveStateProp(className, state),
      ),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
