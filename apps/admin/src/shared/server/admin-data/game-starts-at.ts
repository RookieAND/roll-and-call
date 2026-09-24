import type { Game } from "@roll-and-call/database";

// 세션 일시가 아직 없는 구인은 조율 범위의 끝, 그것도 없으면 모집 마감일로 줄 세운다.
export function gameStartsAt(game: Game) {
  if (game.confirmedAt) return game.confirmedAt;
  if (game.rangeEnd) return new Date(`${game.rangeEnd}T00:00:00+09:00`);
  return game.endDate;
}
