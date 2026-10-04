import { isNil } from "es-toolkit";

// 운영진이 숨긴 구인은 GM과 참여 행(확정·대기·불참)이 있는 사람만 본다(R7). 비로그인은 보지 못한다.
export function canViewHiddenGame({
  game,
  viewerId,
}: {
  game: { hiddenAt: Date | null; gmId: string; participants: readonly { userId: string }[] };
  viewerId: string | null;
}): boolean {
  if (isNil(game.hiddenAt)) return true;
  if (isNil(viewerId)) return false;
  if (game.gmId === viewerId) return true;
  return game.participants.some((participant) => participant.userId === viewerId);
}
