import type { Game } from "@roll-and-call/database";

// 최소 인원이 없거나 0이면 덧붙이지 않는다.
export function formatRecruitHeadcount({
  game,
  confirmedCount,
}: {
  game: Pick<Game, "maxPlayers" | "minPlayers">;
  confirmedCount: number;
}) {
  const headcount = `${confirmedCount}/${game.maxPlayers}명`;
  return game.minPlayers ? `${headcount} (최소 ${game.minPlayers}명)` : headcount;
}
