import { HStack, Text } from "@trpg/ui";
import type { Game } from "@/shared/api/db";
import { formatDateTime } from "@/shared/lib/format";
import { deriveGameStatus } from "../model/derive-game-status";
import { GAME_STATUS } from "../model/status";
import { GameStatusBadge } from "./game-status-badge";

export const GAME_LIST_CONTEXT = {
  mine: "mine",
  joined: "joined",
} as const;
export type GameListContext =
  (typeof GAME_LIST_CONTEXT)[keyof typeof GAME_LIST_CONTEXT];

type GameSummaryData = Game & {
  gm: { username: string } | null;
  participants: { userId: string }[];
};

// 순수 표시: 제목·상태 뱃지·부가정보 한 줄. 링크·상호작용 없음.
// "mine" → rule · seats ; "joined" → GM · datetime/조율중 (matches 시안 6a)
export function GameSummary({
  game,
  context = GAME_LIST_CONTEXT.joined,
}: {
  game: GameSummaryData;
  context?: GameListContext;
}) {
  const count = game.participants.length;
  const status = deriveGameStatus({
    maxPlayers: game.maxPlayers,
    endDate: game.endDate,
    participantCount: count,
  });
  const gm = game.gm?.username ?? "?";
  const sub =
    context === GAME_LIST_CONTEXT.mine
      ? `${game.rule} · ${count}/${game.maxPlayers}`
      : game.confirmedAt
        ? `GM ${gm} · ${formatDateTime(game.confirmedAt)}`
        : status === GAME_STATUS.closed
          ? `GM ${gm} · 마감`
          : `GM ${gm} · 조율 중`;

  return (
    <>
      <HStack justify="between" align="center" gap={2}>
        <Text weight="bold" size="sm" className="truncate">
          {game.title}
        </Text>
        <GameStatusBadge status={status} />
      </HStack>
      <Text size="xs" color="muted" className="mt-1 block truncate">
        {sub}
      </Text>
    </>
  );
}
