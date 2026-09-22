import { Card, HStack, Text, VStack, cn } from "@trpg/ui";

import { ExpandableRows } from "@/shared/ui";

import type { DrawEntry } from "../model/draw-entry";
import { DrawRow } from "./draw-row";

interface DrawQueueProps {
  label: string;
  caption?: string;
  entries: DrawEntry[];
  // 들어올 때마다 모든 값을 한 번에 돌린다(확정 전 GM 롤 시트).
  spinAll?: boolean;
  emphasized: boolean;
  meUserId: string | null;
  previewCount: number;
  rollingOnceKey?: string;
}

// 확정선을 긋지 않고 목록을 두 통으로 나눈다. 어느 줄이든 지금 어느 통에 있는지 보이게 한다.
export function DrawQueue({
  label,
  caption,
  entries,
  spinAll = false,
  emphasized,
  meUserId,
  previewCount,
  rollingOnceKey,
}: DrawQueueProps) {
  return (
    <VStack gap="100" render={<section />}>
      <HStack align="baseline" gap="100">
        <Text typography="subtitle2" weight="extrabold" render={<h2 />}>
          {label}
        </Text>
        <Text numeric typography="subtitle2" foreground="muted" className="flex-1">
          {entries.length}명
        </Text>
        {caption && (
          <Text typography="body4" foreground="hint">
            {caption}
          </Text>
        )}
      </HStack>
      {entries.length > 0 && (
        <Card
          radius={500}
          background="none"
          padding="none"
          className={cn("overflow-hidden", emphasized && "border-tinted-border")}
        >
          <ExpandableRows previewCount={previewCount}>
            {entries.map((entry) => (
              <DrawRow
                key={entry.userId}
                entry={entry}
                roll={entry.roll}
                emphasized={emphasized}
                isMe={entry.userId === meUserId}
                spinAll={spinAll}
                rollingOnceKey={rollingOnceKey}
              />
            ))}
          </ExpandableRows>
        </Card>
      )}
    </VStack>
  );
}
