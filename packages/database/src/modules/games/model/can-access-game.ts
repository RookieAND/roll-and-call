import { isNil } from "es-toolkit";

import { GAME_VISIBILITY, type GameVisibility } from "./game-visibility";
import { isSessionEnded } from "./session-timing";

// 세션이 끝나기 전의 비공개 구인은 GM·확정 참여자·운영진만 열 수 있다. 끝난 뒤의 노출은 호출한 쪽이 따로 정한다.
export function canAccessGame({
  game,
  viewerId,
  isStaff = false,
  now = new Date(),
}: {
  game: {
    visibility: GameVisibility;
    gmId: string;
    confirmedAt: Date | string | null;
    playMinutes: number | null;
    endedAt: Date | string | null;
    participants: readonly { userId: string; status: string }[];
  };
  viewerId: string | null;
  isStaff?: boolean;
  now?: Date;
}): boolean {
  if (game.visibility === GAME_VISIBILITY.public) return true;
  if (isSessionEnded(game, now)) return true;
  if (isNil(viewerId)) return false;
  if (isStaff || game.gmId === viewerId) return true;
  return game.participants.some(
    (participant) => participant.userId === viewerId && participant.status === "confirmed",
  );
}
