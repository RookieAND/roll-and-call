import { Avatar, Text } from "@trpg/ui";
import type { Game } from "@/shared/api/db";
import { GameSeatCount } from "./game-seat-count";

type GameRowData = Game & {
  gm: { username: string; avatarUrl: string | null } | null;
  participants: { userId: string }[];
};

// 순수 표시: 아바타 좌측 가로형 요약 행(홈 "지금 모집 중" 등). 링크·동작 없음.
export function GameRow({ game }: { game: GameRowData }) {
  return (
    <div className="flex items-center gap-3 rounded-[14px] border border-gray-200 p-3">
      <Avatar src={game.gm?.avatarUrl} name={game.gm?.username} size="stack" />
      <div className="min-w-0 flex-1">
        <Text weight="bold" size="sm" className="block truncate">
          {game.title}
        </Text>
        <Text size="xs" color="muted" className="block truncate">
          {game.rule} · GM {game.gm?.username ?? "?"}
        </Text>
      </div>
      <GameSeatCount current={game.participants.length} max={game.maxPlayers} />
    </div>
  );
}
