import { Text, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

export interface FactRow {
  label: string;
  value: ReactNode;
}

interface FactRowsProps {
  items: FactRow[];
  labelWidth?: number;
}

// 상세 화면의 정보는 '라벨 고정 폭 + 값' 한 줄로 보여 준다. 긴 날짜가 좁은 칸에서 줄바꿈되지 않는다.
export function FactRows({ items, labelWidth = 88 }: FactRowsProps) {
  return (
    <VStack render={<dl />} className="divide-y divide-(--rc-color-border-subtle)">
      {items.map(({ label, value }) => (
        <div
          key={label}
          style={{ gridTemplateColumns: `${labelWidth}px minmax(0,1fr)` }}
          className="grid min-h-[36px] items-center gap-x-150"
        >
          <Text typography="body4" foreground="hint" render={<dt />}>
            {label}
          </Text>
          <Text
            typography="body3"
            weight="medium"
            numeric
            render={<dd />}
            className="flex min-w-0 flex-wrap items-center gap-075"
          >
            {value}
          </Text>
        </div>
      ))}
    </VStack>
  );
}
