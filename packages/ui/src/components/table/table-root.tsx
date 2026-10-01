import { useRender } from "@base-ui-components/react/use-render";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";

type TableState = { size: "sm" | "md" };

export interface TableRootProps extends StateComponentProps<"table", TableState> {
  size?: TableState["size"];
}

export function TableRoot({
  size = "md",
  className,
  style,
  render,
  ref,
  ...props
}: TableRootProps) {
  const state = { size };
  const table = useRender({
    ref,
    defaultTagName: "table",
    render,
    state,
    props: {
      "data-slot": "table",
      className: cn(
        "w-full border-collapse text-left text-body3 text-gray-900",
        resolveStateProp(className, state),
      ),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
  return (
    <div
      data-slot="table-container"
      data-size={size}
      className="group/table w-full overflow-x-auto rounded-600 border border-gray-200 bg-surface"
    >
      {table}
    </div>
  );
}
