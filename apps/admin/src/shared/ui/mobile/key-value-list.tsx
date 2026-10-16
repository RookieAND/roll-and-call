import { Grid, Text, VStack, cn } from "@roll-and-call/ui";
import { isString } from "es-toolkit";
import type { ReactNode } from "react";

export interface KeyValueItem {
  label: string;
  value: ReactNode;
  // 긴 값이 아니어도 라벨 아래로 쌓는다.
  stack?: boolean;
}

const STACK_LENGTH = 26;

interface KeyValueListProps {
  items: KeyValueItem[];
  // 2열은 상세 요약(굵은 값), 1열은 라벨 왼쪽·값 오른쪽, 긴 값(26자 초과)만 라벨 아래로 쌓는다.
  columns?: 1 | 2;
  // 이름을 굵게, 설명을 오른쪽에 둔다(시트 안 목록).
  lead?: boolean;
}

export function KeyValueList({ items, columns = 1, lead }: KeyValueListProps) {
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
      {items.map((item, index) => {
        const stacked = item.stack || (isString(item.value) && item.value.length > STACK_LENGTH);
        return (
          <div
            key={item.label}
            className={cn(
              "flex gap-150 py-100",
              stacked ? "flex-col gap-025" : "items-baseline",
              index > 0 && "border-t border-(--rc-color-border-subtle)",
            )}
          >
            <Text
              typography={lead ? "body3" : "body4"}
              weight={lead ? "bold" : undefined}
              foreground={lead ? undefined : "hint"}
              render={<dt />}
              className={cn("shrink-0 leading-normal", !stacked && "max-w-[46%]")}
            >
              {item.label}
            </Text>
            <Text
              typography={lead ? "body4" : "body3"}
              foreground={lead ? "muted" : undefined}
              render={<dd />}
              className={cn(
                "m-0 min-w-0 flex-1 leading-[1.6] break-keep [overflow-wrap:anywhere]",
                lead ? "font-normal" : "font-medium",
                stacked ? "text-left" : "text-right",
              )}
            >
              {item.value}
            </Text>
          </div>
        );
      })}
    </VStack>
  );
}
