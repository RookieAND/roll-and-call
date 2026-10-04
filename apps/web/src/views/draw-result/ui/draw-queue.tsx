import { Card, HStack, Text, VStack } from "@roll-and-call/ui";

import type { DrawEntry } from "../model/draw-entry";
import { DrawQueueMore } from "./draw-queue-more";
import { DrawRow } from "./draw-row";

interface DrawQueueProps {
  label: string;
  caption?: string;
  entries: DrawEntry[];
  meUserId: string | null;
  // 없으면 모두 편다.
  previewCount?: number;
}

const UNFOLDED_MAX = 3;

export function DrawQueue({ label, caption, entries, meUserId, previewCount }: DrawQueueProps) {
  const rows = entries.map((entry) => (
    <DrawRow key={entry.userId} entry={entry} isMe={entry.userId === meUserId} />
  ));
  const folds = entries.length > UNFOLDED_MAX && previewCount !== undefined;
  const shownCount = folds ? previewCount : entries.length;
  const hiddenRows = rows.slice(shownCount);

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
      <Card.Root radius={500} padding="none" className="overflow-hidden">
        {rows.slice(0, shownCount)}
        {hiddenRows.length > 0 && (
          <DrawQueueMore noun={label} count={hiddenRows.length}>
            {hiddenRows}
          </DrawQueueMore>
        )}
      </Card.Root>
    </VStack>
  );
}
