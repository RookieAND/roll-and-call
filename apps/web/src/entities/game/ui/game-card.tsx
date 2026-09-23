import { Badge, Card, HStack, Text, VStack, cn } from "@roll-and-call/ui";

import { deriveGameStatus } from "@/shared/lib";
import type { Game } from "@/shared/server";

import { isLiveGame } from "../model/is-live-game";
import { isSessionEnded } from "../model/is-session-ended";
import { countConfirmed, type ParticipantStatus } from "../model/participant";
import { pastScheduleLine } from "../model/past-schedule-line";
import { scheduleLine } from "../model/schedule-line";
import { sessionEndsAt } from "../model/session-end";
import { GameCapacity } from "./game-capacity";
import { GameDeadlineCount } from "./game-deadline-count";
import { GameGmLabel } from "./game-gm-label";
import { GameScheduleRow } from "./game-schedule-row";
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
  });
  const ended = isSessionEnded(game);
  const live = isLiveGame({ status, ended });
  const current = scheduleLine(game);
  const line =
    ended || (!live && !game.confirmedAt)
      ? pastScheduleLine({
          line: current,
          endsAt: ended ? sessionEndsAt(game) : null,
          endDate: game.endDate,
        })
      : current;

  const meta = [game.rule, game.playTime].filter(Boolean).join(" · ");

  return (
    <Card.Root
      interactive
      padding="none"
      className={cn("h-full overflow-hidden rounded-600", !live && "opacity-72")}
    >
      <GameThumbnail
        url={game.thumbnailUrl}
        sizes="(max-width: 412px) 100vw, 412px"
        spoilerLabel={game.thumbnailSpoiler ? "스포일러" : undefined}
        className="aspect-video w-full"
      />
      <VStack className="gap-075 px-175 py-175">
        <HStack align="center" gap="100">
          <Text
            truncate
            typography="heading3"
            foreground={live ? "normal" : "muted"}
            className="min-w-0 flex-1"
          >
            {game.title}
          </Text>
          {ended ? <Badge colorPalette="gray">종료</Badge> : <GameStatusBadge status={status} />}
          {live && line.deadlineShort && <GameDeadlineCount label={line.deadlineShort} />}
        </HStack>
        {meta && (
          <Text truncate typography="body4" foreground="muted">
            {meta}
          </Text>
        )}
        <GameScheduleRow line={line} />
        <HStack justify="between" align="center" gap="100" className="mt-050">
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
      </VStack>
    </Card.Root>
  );
}
