import { isNull } from "es-toolkit";

import { endSessionBlock, type EndSessionGame } from "./end-session-block";

// 운영 관리 「출석 확인」 줄과 세션 마치기 확인 창이 같은 판단을 쓴다.
export function canEndSession({
  game,
  isGm,
  confirmedCount,
  now,
}: {
  game: EndSessionGame;
  isGm: boolean;
  confirmedCount: number;
  now: Date;
}): boolean {
  return isGm && isNull(endSessionBlock({ game, actorId: game.gmId, confirmedCount, now }));
}
