import { useRender } from "@base-ui-components/react/use-render";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";
import type { StateComponentProps } from "./state-props";

type TableState = { size: "sm" | "md" };

export interface TableRootProps extends StateComponentProps<"table", TableState> {
  // 행 높이. md 44px, sm 36px(관리 화면처럼 한 화면에 많이 보여야 할 때).
  size?: TableState["size"];
}

// 넘치면 표만 가로로 스크롤한다. 테두리·둥근 모서리는 바깥 상자가 맡는다.
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
