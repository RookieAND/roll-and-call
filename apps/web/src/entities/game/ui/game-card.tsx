import { Card, HStack, Text, VStack, cn } from "@trpg/ui";
import { Check, Clock } from "lucide-react";

import type { Game } from "@/shared/server";

import { deriveGameStatus } from "../model/derive-game-status";
import { countConfirmed, type ParticipantStatus } from "../model/participant";
import { scheduleLine } from "../model/schedule-line";
import { GameCapacity } from "./game-capacity";
import { GameGmLabel } from "./game-gm-label";
import { GameStatusBadge } from "./game-status-badge";
import { GameThumbnail } from "./game-thumbnail";

type Props = {
  game: Game & {
    gm: { username: string; avatarUrl: string | null } | null;
    participants: { userId: string; status: ParticipantStatus }[];
  };
};

export function GameCard({ game }: Props) {
  const count = countConfirmed(game.participants);
  const status = deriveGameStatus({
    maxPlayers: game.maxPlayers,
    endDate: game.endDate,
    participantCount: count,
    waitlistEnabled: game.waitlistEnabled,
  });
  const line = scheduleLine(game);
  const expired = line.deadlinePassed;

  const meta = [game.rule, game.playTime].filter(Boolean).join(" · ");
  const scheduleText = line.text;
  const confirmed = line.confirmed && !expired;
  const ScheduleIcon = confirmed ? Check : Clock;
  const scheduleClass = cn("truncate", confirmed && "font-semibold text-success-700");
  // 아이콘은 확정이면 글자 색(success)을 따르고, 조율 중일 때만 primary로 눈에 띄게 한다.
  const scheduleIconClass = cn(
    "shrink-0",
    !confirmed && (expired ? "text-gray-500" : "text-primary-ink"),
  );
  const deadlineClass = cn(
    "shrink-0 font-semibold tabular-nums",
    line.deadlineWarn ? "text-warning-600" : "text-gray-600",
  );
  // 카드 전체 opacity는 본문 대비를 4.5:1 아래로 떨어뜨려서 제목 색과 썸네일만 내린다.
  const titleForeground = expired ? "muted" : "normal";
  const thumbnailClass = cn("aspect-video w-full", expired && "opacity-55");

  return (
    <Card interactive padding="none" className="h-full overflow-hidden rounded-[14px]">
      <GameThumbnail
        url={game.thumbnailUrl}
        sizes="(max-width: 412px) 100vw, 412px"
        spoilerLabel={game.thumbnailSpoiler ? "스포일러" : undefined}
        className={thumbnailClass}
      />
      <VStack className="gap-1.5 px-3.5 py-[13px]">
        <HStack justify="between" align="start" gap={2}>
          <Text typography="heading3" foreground={titleForeground} className="min-w-0 truncate">
            {game.title}
          </Text>
          <GameStatusBadge status={status} />
        </HStack>
        {meta && (
          <Text typography="body4" foreground="muted" className="truncate">
            {meta}
          </Text>
        )}
        <HStack justify="between" align="center" className="gap-1.5">
          <ScheduleIcon size={13} strokeWidth={2.2} aria-hidden className={scheduleIconClass} />
          <Text
            typography="body4"
            foreground={expired ? "muted" : "normal"}
            className={cn("min-w-0 flex-1", scheduleClass)}
          >
            {scheduleText}
          </Text>
          {line.deadlineShort && (
            <Text typography="body4" className={deadlineClass}>
              {line.deadlineShort}
            </Text>
          )}
        </HStack>
        <HStack justify="between" align="center" gap={2} className="mt-1">
          <GameGmLabel name={game.gm?.username} avatarUrl={game.gm?.avatarUrl} />
          <GameCapacity
            status={status}
            recruitMethod={game.recruitMethod}
            confirmed={count}
            waiting={game.participants.length - count}
            maxPlayers={game.maxPlayers}
          />
        </HStack>
      </VStack>
    </Card>
  );
}
