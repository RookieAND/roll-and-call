import { GAME_STATUS, type GameStatus, type SessionRole } from "@/entities/game";
import type { Game } from "@/shared/server";
import { formatDateTime } from "@/shared/lib";

type SublineGame = Pick<Game, "rule" | "maxPlayers" | "confirmedAt"> & {
  gm: { username: string } | null;
};

// 목록 행의 부가정보 한 줄. GM 시점은 룰·정원을, 참여자 시점은 GM·일정을 보여준다.
export function gameSubline({
  game,
  role,
  status,
  confirmedCount,
}: {
  game: SublineGame;
  role: SessionRole;
  status: GameStatus;
  confirmedCount: number;
}): string {
  if (role === "host") return `${game.rule} · ${confirmedCount}/${game.maxPlayers}`;

  const gm = `GM ${game.gm?.username ?? "?"}`;
  if (game.confirmedAt) return `${gm} · ${formatDateTime(game.confirmedAt)}`;
  // 기한 경과, 또는 대기 신청을 끈 게임의 정원 충족(full) 모두 신청이 막힌 상태.
  if (status === GAME_STATUS.closed || status === GAME_STATUS.full) return `${gm} · 마감`;
  return `${gm} · 조율 중`;
}
