import { Card, HStack, Progress, Text, VStack, cn } from "@trpg/ui";
import { formatDate } from "@/shared/lib";
import type { Game } from "@/shared/server";
import { deriveGameStatus } from "../model/derive-game-status";
import { countConfirmed, type ParticipantStatus } from "../model/participant";
import { scheduleLine } from "../model/schedule-line";
import { GAME_STATUS } from "../model/status";
import { GameGmLabel } from "./game-gm-label";
import { GameRoundBadge } from "./game-round-badge";
import { GameStatusBadge } from "./game-status-badge";
import { GameThumbnail } from "./game-thumbnail";

type Props = {
  game: Game & {
    gm: { username: string; avatarUrl: string | null } | null;
    participants: { userId: string; status: ParticipantStatus }[];
  };
};

// 목록 카드 한 가지 모양: 16:9 썸네일(없으면 같은 비율 그라데이션) → 제목·모집 배지 → 룰·플레이타임
// → 일정 한 줄 + 마감 D-n → GM · 인원. 참여를 판단하는 "언제 하나 / 언제까지 신청하나"를 카드에 둔다.
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
  const scheduleText = expired ? `${formatDate(game.endDate)}에 모집 마감` : line.text;
  const scheduleClass = cn("truncate", line.confirmed && !expired && "font-semibold text-success-700");
  const deadlineClass = cn(
    "shrink-0 font-semibold tabular-nums",
    line.deadlineWarn ? "text-warning-600" : "text-gray-600",
  );
  // 꽉 찬 진행바는 "자리 없음"이라 좋은 상태 색을 주지 않는다. 초록은 배지 하나만.
  const barColor = status === GAME_STATUS.recruiting ? "recruiting" : "closed";
  // 마감 글은 제목 색과 썸네일만 내린다. 카드 전체 opacity는 본문 대비를 4.5:1 아래로 떨어뜨린다.
  const titleForeground = expired ? "muted" : "normal";
  const thumbnailClass = cn("aspect-video w-full", expired && "opacity-55");

  return (
    <Card interactive padding="none" className="h-full overflow-hidden rounded-[14px]">
      <GameThumbnail
        url={game.thumbnailUrl}
        sizes="(max-width: 412px) 100vw, 412px"
        className={thumbnailClass}
      />
      {/* 시안 05: 제목 16 · 룰/일정/GM 12 · 인원 12 bold. 제목만 크고 나머지는 한 단계 아래로 내려 위계를 만든다. */}
      <VStack className="gap-1.5 px-3.5 py-[13px]">
        <HStack justify="between" align="start" gap={2}>
          <HStack align="center" gap={2} className="min-w-0">
            <GameRoundBadge round={game.round} />
            <Text typography="heading3" foreground={titleForeground} className="truncate">
              {game.title}
            </Text>
          </HStack>
          <GameStatusBadge status={status} />
        </HStack>
        {meta && (
          <Text typography="body4" foreground="muted" className="truncate">
            {meta}
          </Text>
        )}
        <HStack justify="between" align="center" gap={2}>
          <Text typography="body4" className={scheduleClass}>
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
          <HStack gap={2} align="center" className="shrink-0">
            <Progress value={count} max={game.maxPlayers} color={barColor} className="w-[52px]" />
            <Text typography="subtitle2" className="tabular-nums">
              {count}/{game.maxPlayers}
            </Text>
          </HStack>
        </HStack>
      </VStack>
    </Card>
  );
}
