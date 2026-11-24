import { Badge, HStack, Text, VStack } from "@roll-and-call/ui";

import { GameThumbnail } from "@/entities/game";
import { ServerLink } from "@/shared/ui";

import type { UpcomingRow } from "../model/upcoming-row";
import { UpcomingTimeBox } from "./upcoming-time-box";

interface UpcomingItemLinkProps {
  row: UpcomingRow;
  withThumbnail?: boolean;
}

export function UpcomingItemLink({ row, withThumbnail = true }: UpcomingItemLinkProps) {
  const subtitle = row.roundCount > 1 ? `${row.rule} · ${row.roundCount}회차` : row.rule;
  const badgePalette = row.recruiting ? "success" : "gray";
  const badgeLabel = row.recruiting ? "모집 중" : "모집 마감";
  // 데스크톱은 줄이 넓어 제목을 한 단계 키운다(시안 05-5).
  const titleClass = withThumbnail ? "desktop:text-heading3" : undefined;

  return (
    <HStack
      align="center"
      render={<ServerLink path={`/games/${row.id}`} />}
      className="gap-175 p-150 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tinted-ink"
    >
      <UpcomingTimeBox startsAt={row.startsAt} endsAt={row.endsAt} />
      {withThumbnail && (
        <div
          aria-hidden
          className="hidden aspect-video w-28 flex-none overflow-hidden rounded-500 desktop:block"
        >
          {row.thumbnailSpoiler ? (
            <span className="block size-full bg-gray-100" />
          ) : (
            <GameThumbnail url={row.thumbnailUrl} sizes="112px" className="size-full" />
          )}
        </div>
      )}
      <VStack gap="050" className="min-w-0 flex-1">
        <Text typography="subtitle1" truncate className={titleClass}>
          {row.title}
        </Text>
        <Text typography="body4" foreground="muted" truncate>
          {subtitle}
        </Text>
      </VStack>
      <Badge colorPalette={badgePalette}>{badgeLabel}</Badge>
    </HStack>
  );
}
