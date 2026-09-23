import { useRender } from "@base-ui-components/react/use-render";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";

type TableRowState = { selected: boolean; interactive: boolean };

export interface TableRowProps extends StateComponentProps<"tr", TableRowState> {
  selected?: boolean;
  // 행 전체를 눌러 상세로 가는 표. 호버 배경만 준다. 이동은 행 안의 링크가 맡는다.
  interactive?: boolean;
}

export function TableRow({
  selected = false,
  interactive = false,
  className,
  style,
  render,
  ref,
  ...props
}: TableRowProps) {
  const state = { selected, interactive };
  return useRender({
    ref,
    defaultTagName: "tr",
    render,
    state,
    props: {
      "data-slot": "table-row",
      "aria-selected": selected || undefined,
      className: cn(
        "transition-colors",
        interactive && "hover:bg-gray-50",
        selected && "bg-tinted-bg hover:bg-tinted-bg",
        resolveStateProp(className, state),
      ),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
