import {
  deriveGameStatus,
  formatPlayRange,
  isSessionEnded,
  sessionEndAt,
} from "@roll-and-call/database/games/model";
import { Badge, Card, HStack, Text, VStack, cn } from "@roll-and-call/ui";
import { compact } from "es-toolkit";

import type { Game } from "@/shared/server";

import { isLiveGame } from "../model/is-live-game";
import { countConfirmed, type ParticipantStatus } from "../model/participant";
import { pastScheduleLine } from "../model/past-schedule-line";
import { scheduleLine } from "../model/schedule-line";
import { GameCapacity } from "./game-capacity";
import { GameCardScheduleRow } from "./game-card-schedule-row";
import { GameDeadlineCount } from "./game-deadline-count";
import { GameGmLabel } from "./game-gm-label";
import { GameStatusBadge } from "./game-status-badge";
import { GameThumbnail } from "./game-thumbnail";

interface GameCardProps {
  game: Game & {
    gm: { username: string; avatarUrl: string | null } | null;
    participants: { userId: string; status: ParticipantStatus }[];
  };
}

export function GameCard({ game }: GameCardProps) {
  const count = countConfirmed(game.participants);
  const status = deriveGameStatus({
    maxPlayers: game.maxPlayers,
    endDate: game.endDate,
    participantCount: count,
    waitlistEnabled: game.waitlistEnabled,
    scheduleMode: game.scheduleMode,
    confirmedAt: game.confirmedAt,
    cancelledAt: game.cancelledAt,
  });
  const ended = isSessionEnded(game);
  const live = isLiveGame({ status, ended });
  const current = scheduleLine(game);
  const line =
    ended || (!live && !game.confirmedAt)
      ? pastScheduleLine({
          line: current,
          endsAt: ended ? sessionEndAt(game) : null,
          endDate: game.endDate,
        })
      : current;

  const meta = compact([game.rule, formatPlayRange(game.playMinutesMin, game.playMinutes)]).join(
    " · ",
  );

  return (
    <Card.Root
      interactive
      padding="none"
      className="h-full overflow-hidden rounded-600 desktop:flex desktop:flex-col"
    >
      <GameThumbnail
        url={game.thumbnailUrl}
        sizes="(max-width: 412px) 100vw, 412px"
        spoilerLabel={game.thumbnailSpoiler ? "스포일러" : undefined}
        className={cn("aspect-video w-full", !live && "grayscale")}
      />
      <VStack gap="125" className="px-175 pt-175 desktop:flex-1">
        <VStack gap="075" className="desktop:flex-1">
          {/* 데스크톱은 배지 줄이 제목 위로 올라간다: 줄바꿈 + order로 순서만 바꾼다. */}
          <HStack align="center" gap="100" className="desktop:flex-wrap desktop:gap-075">
            <Text
              typography="heading2"
              foreground={live ? "normal" : "muted"}
              className="line-clamp-2 min-w-0 flex-1 desktop:order-2 desktop:line-clamp-none desktop:basis-full desktop:text-heading3 desktop:font-bold desktop:text-pretty"
            >
              {game.title}
            </Text>
            {live && line.deadlineShort && (
              <span className="contents desktop:order-1 desktop:flex">
                <GameDeadlineCount label={line.deadlineShort} />
              </span>
            )}
            <span className="contents desktop:order-0 desktop:flex">
              {ended ? (
                <Badge colorPalette="gray">종료</Badge>
              ) : (
                <GameStatusBadge status={status} />
              )}
            </span>
          </HStack>
          {meta && (
            <Text
              truncate
              typography="body3"
              foreground="muted"
              className="desktop:overflow-visible desktop:text-clip desktop:whitespace-normal"
            >
              {meta}
            </Text>
          )}
        </VStack>
        <GameCardScheduleRow text={line.text} />
      </VStack>
      <HStack
        align="center"
        gap="100"
        className="mx-175 mt-150 border-t border-gray-200 pt-125 pb-150 desktop:border-t-0 desktop:pt-0 desktop:pb-175"
      >
        <GameGmLabel name={game.gm?.username} avatarUrl={game.gm?.avatarUrl} />
        <GameCapacity
          status={status}
          recruitMethod={game.recruitMethod}
          confirmed={count}
          waiting={game.participants.length - count}
          maxPlayers={game.maxPlayers}
          ended={ended}
        />
      </HStack>
    </Card.Root>
  );
}
