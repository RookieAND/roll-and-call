import { Card, HStack, Text, VStack, cn } from "@trpg/ui";

import { ExpandableRows } from "@/shared/ui";

import type { DrawEntry } from "../model/draw-entry";
import { DrawRow } from "./draw-row";

interface DrawQueueProps {
  label: string;
  caption?: string;
  entries: DrawEntry[];
  // 굴리는 중이면 행마다 지금 보여 줄 숫자. 없으면 굴린 값 그대로.
  rolls?: number[];
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
  rolls,
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
            {entries.map((entry, index) => (
              <DrawRow
                key={entry.userId}
                entry={entry}
                roll={entry.roll === null ? null : (rolls?.[index] ?? entry.roll)}
                emphasized={emphasized}
                isMe={entry.userId === meUserId}
                rollingOnceKey={rollingOnceKey}
              />
            ))}
          </ExpandableRows>
        </Card>
      )}
    </VStack>
  );
}
