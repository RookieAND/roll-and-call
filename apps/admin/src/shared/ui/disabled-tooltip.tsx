import { Tooltip } from "@roll-and-call/ui";
import type { ReactElement } from "react";

interface DisabledTooltipProps {
  note: string;
  children: ReactElement<Record<string, unknown>>;
}

// 비활성 버튼은 호버를 받지 못해 span으로 감싸 이유를 툴팁으로 알린다.
export function DisabledTooltip({ note, children }: DisabledTooltipProps) {
  return (
    <Tooltip content={note}>
      <span className="inline-flex">{children}</span>
    </Tooltip>
  );
}
