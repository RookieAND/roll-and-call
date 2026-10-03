import { GAME_CANCEL_KIND, type GameCancelKind } from "./game-cancel-kind";

// GM이 쓴 사유만 구인에 남긴다. 운영진 사유는 활동 기록에만 있다.
export function storedCancelReason({
  kind,
  reason,
}: {
  kind: GameCancelKind;
  reason: string | null;
}): string | null {
  return kind === GAME_CANCEL_KIND.gm ? reason || null : null;
}
