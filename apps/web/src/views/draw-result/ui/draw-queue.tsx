import { Card, HStack, Text, VStack, cn } from "@roll-and-call/ui";

import type { DrawEntry } from "../model/draw-entry";
import { DRAW_ROW_VARIANT, type DrawRowVariant } from "../model/draw-row-variant";
import { DrawQueueMore } from "./draw-queue-more";
import { DrawRow } from "./draw-row";

interface DrawQueueProps {
  label: string;
  caption?: string;
  entries: DrawEntry[];
  variant: DrawRowVariant;
  meUserId: string | null;
  previewCount: number;
}

// 이만큼까지는 접을 만큼 길지 않아 다 보여준다.
const UNFOLDED_MAX = 3;

// 확정선을 긋지 않고 목록을 두 통으로 나눈다. 어느 줄이든 지금 어느 통에 있는지 보이게 한다.
export function DrawQueue({
  label,
  caption,
  entries,
  variant,
  meUserId,
  previewCount,
}: DrawQueueProps) {
  const rows = entries.map((entry) => (
    <DrawRow key={entry.userId} entry={entry} variant={variant} isMe={entry.userId === meUserId} />
  ));
  const shownCount = entries.length > UNFOLDED_MAX ? previewCount : entries.length;
  const hiddenRows = rows.slice(shownCount);
  const cardClass = cn(
    "overflow-hidden",
    variant === DRAW_ROW_VARIANT.highlight && "border-tinted-border",
  );

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
        <Card.Root radius={500} padding="none" className={cardClass}>
          {rows.slice(0, shownCount)}
          {hiddenRows.length > 0 && (
            <DrawQueueMore noun={label} count={hiddenRows.length}>
              {hiddenRows}
            </DrawQueueMore>
          )}
        </Card.Root>
      )}
    </VStack>
  );
}
