import { Grid, Text, VStack, cn } from "@roll-and-call/ui";
import type { ReactNode } from "react";

export interface KeyValueItem {
  label: string;
  value: ReactNode;
}

interface KeyValueListProps {
  items: KeyValueItem[];
  // 2열은 상세 요약(굵은 값), 1열은 라벨 위·값 아래로 쌓아 긴 값도 줄바꿈한다.
  columns?: 1 | 2;
}

export function KeyValueList({ items, columns = 1 }: KeyValueListProps) {
  if (columns === 2) {
    return (
      <Grid cols={2} render={<dl />} className="m-0 gap-x-200 gap-y-150">
        {items.map((item) => (
          <VStack key={item.label} gap="025" className="min-w-0">
            <Text typography="body4" foreground="hint" render={<dt />}>
              {item.label}
            </Text>
            <Text typography="body2" weight="bold" render={<dd />} className="m-0">
              {item.value}
            </Text>
          </VStack>
        ))}
      </Grid>
    );
  }
  return (
    <VStack render={<dl />} className="m-0">
      {items.map((item, index) => (
        <VStack
          key={item.label}
          gap="025"
          className={cn("py-125", index > 0 && "border-t border-(--rc-color-border-subtle)")}
        >
          <Text typography="body4" foreground="hint" render={<dt />} className="leading-[1.4]">
            {item.label}
          </Text>
          <Text
            typography="body3"
            render={<dd />}
            className="m-0 leading-[1.6] font-medium break-keep [overflow-wrap:anywhere]"
          >
            {item.value}
          </Text>
        </VStack>
      ))}
    </VStack>
  );
}
