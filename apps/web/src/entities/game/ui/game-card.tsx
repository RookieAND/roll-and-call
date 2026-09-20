import { Card, HStack, Text, VStack, cn } from "@trpg/ui";

import type { Game } from "@/shared/server";

import { deriveGameStatus } from "../model/derive-game-status";
import { countConfirmed, type ParticipantStatus } from "../model/participant";
import { scheduleLine } from "../model/schedule-line";
import { GameCapacity } from "./game-capacity";
import { GameGmLabel } from "./game-gm-label";
import { GameScheduleRow } from "./game-schedule-row";
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
  // 카드 전체 opacity는 본문 대비를 4.5:1 아래로 떨어뜨려서 제목 색과 썸네일만 내린다.
  const titleForeground = expired ? "muted" : "normal";
  const thumbnailClass = cn("aspect-video w-full", expired && "opacity-55");

  return (
    <Card interactive padding="none" className="h-full overflow-hidden rounded-600">
      <GameThumbnail
        url={game.thumbnailUrl}
        sizes="(max-width: 412px) 100vw, 412px"
        spoilerLabel={game.thumbnailSpoiler ? "스포일러" : undefined}
        className={thumbnailClass}
      />
      <VStack className="gap-1.5 px-3.5 py-3.5">
        <HStack justify="between" align="start" gap={2}>
          <Text truncate typography="heading3" foreground={titleForeground} className="min-w-0">
            {game.title}
          </Text>
          <GameStatusBadge status={status} />
        </HStack>
        {meta && (
          <Text truncate typography="body4" foreground="muted">
            {meta}
          </Text>
        )}
        <GameScheduleRow line={line} />
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
