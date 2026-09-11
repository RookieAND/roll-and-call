import { HStack, Text } from "@trpg/ui";
import type { Game } from "@/shared/server";
import type { GameStatus } from "../model/status";
import { GameRoundBadge } from "./game-round-badge";
import { GameStatusBadge } from "./game-status-badge";

// 순수 표시: 회차·제목·상태 뱃지 한 줄 + 부가정보 한 줄. 링크·상호작용 없음.
// subline 문구는 화면마다 다르므로 호출부(위젯)가 만들어 넘긴다.
export function GameSummary({
  game,
  status,
  subline,
}: {
  game: Pick<Game, "title" | "round">;
  status: GameStatus;
  subline: string;
}) {
  return (
    <>
      <HStack justify="between" align="center" gap={2}>
        <HStack align="center" gap={2} className="min-w-0">
          <GameRoundBadge round={game.round} />
          <Text typography="subtitle1" className="truncate">
            {game.title}
          </Text>
        </HStack>
        <GameStatusBadge status={status} />
      </HStack>
      <Text typography="body4" foreground="muted" className="mt-1 block truncate">
        {subline}
      </Text>
    </>
  );
}
