import { Badge, Card, HStack, Text, VStack } from "@roll-and-call/ui";

import { deriveGameStatus, formatDate } from "@/shared/lib";
import type { Game } from "@/shared/server";

import { isSessionEnded } from "../model/is-session-ended";
import { countConfirmed, type ParticipantStatus } from "../model/participant";
import { GameStatusBadge } from "./game-status-badge";
import { GameThumbnail } from "./game-thumbnail";

interface PastGameCardProps {
  game: Game & {
    participants: { userId: string; status: ParticipantStatus }[];
  };
}

// 지난 구인은 다시 신청할 일이 없어 한 줄로 줄인다. 스포일러 썸네일은 작게라도 드러내지 않는다.
export function PastGameCard({ game }: PastGameCardProps) {
  const count = countConfirmed(game.participants);
  const ended = isSessionEnded(game);
  const status = deriveGameStatus({
    maxPlayers: game.maxPlayers,
    endDate: game.endDate,
    participantCount: count,
    waitlistEnabled: game.waitlistEnabled,
    scheduleMode: game.scheduleMode,
    confirmedAt: game.confirmedAt,
  });
  // 달 머리글과 같은 날짜를 말한다. 세션 시간이 정해졌으면 세션 날, 아니면 마감일.
  const when = game.confirmedAt
    ? `${formatDate(game.confirmedAt)} 세션 · ${count}명`
    : `${formatDate(game.endDate)} 마감`;
  const meta = [game.rule, when].filter(Boolean).join(" · ");
  const thumbnailUrl = game.thumbnailSpoiler ? null : game.thumbnailUrl;

  return (
    <Card.Root interactive padding="sm">
      <HStack align="center" gap="150" className="opacity-72">
        {thumbnailUrl ? (
          <GameThumbnail
            url={thumbnailUrl}
            sizes="56px"
            className="size-14 flex-none rounded-400"
          />
        ) : (
          <span className="size-14 flex-none rounded-400 bg-gray-100" />
        )}
        <VStack gap="050" className="min-w-0 flex-1">
          <HStack align="center" gap="075">
            <Text truncate typography="subtitle1" foreground="muted" className="min-w-0 flex-1">
              {game.title}
            </Text>
            {ended ? <Badge colorPalette="gray">종료</Badge> : <GameStatusBadge status={status} />}
          </HStack>
          <Text truncate typography="body4" foreground="muted">
            {meta}
          </Text>
        </VStack>
      </HStack>
    </Card.Root>
  );
}
