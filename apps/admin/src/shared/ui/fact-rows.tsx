import { Text, cn } from "@roll-and-call/ui";
import type { ReactNode } from "react";

export interface FactRow {
  label: string;
  value: ReactNode;
  // 날짜와 숫자+단위는 값 중간에서 줄을 바꾸지 않는다.
  nowrap?: boolean;
}

interface FactRowsProps {
  // 행 단위로 읽히는 순서다. 칸이 넓으면 2열, 좁으면 1열로 접힌다.
  items: FactRow[];
  // 사유·메모·정책처럼 라벨이 긴 섹션만 쓴다.
  wide?: boolean;
}

export function FactRows({ items, wide = false }: FactRowsProps) {
  return (
    <div className="overflow-hidden">
      <dl className="m-0 -mb-px grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-300">
        {items.map(({ label, value, nowrap }) => (
          <div
            key={label}
            className={cn(
              "grid min-h-9 items-center gap-x-150 border-b border-(--rc-color-border-subtle)",
              wide ? "grid-cols-[120px_minmax(0,1fr)]" : "grid-cols-[88px_minmax(0,1fr)]",
            )}
          >
            <Text typography="body4" foreground="hint" render={<dt />} className="break-keep">
              {label}
            </Text>
            <Text
              typography="body3"
              weight="medium"
              numeric
              render={<dd />}
              className={cn(
                "m-0 flex min-w-0 flex-wrap items-center gap-075 break-keep [overflow-wrap:anywhere]",
                nowrap && "whitespace-nowrap",
              )}
            >
              {value}
            </Text>
          </div>
        ))}
      </dl>
    </div>
  );
}
