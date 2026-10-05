import type { Game } from "@roll-and-call/database";
import { GAME_CANCEL_KIND } from "@roll-and-call/database/games/model";
import type { MessageTextKey } from "@roll-and-call/database/servers";

// 취소 종류에 맞는 설명 문장 키. 문장은 서버가 정한다.
export function cancelTextKey(kind: Game["cancelKind"]): MessageTextKey {
  if (kind === GAME_CANCEL_KIND.staff) return "cancel_staff";
  if (kind === GAME_CANCEL_KIND.auto) return "cancel_auto";
  return "cancel_gm";
}

// GM이 적은 취소 사유는 서버가 바꾸지 못하는 고정 줄로 뒤에 붙인다.
export function cancelReasonLine({
  kind,
  reason,
}: {
  kind: Game["cancelKind"];
  reason: string | null;
}): string {
  const byGm = kind !== GAME_CANCEL_KIND.staff && kind !== GAME_CANCEL_KIND.auto;
  return byGm && reason ? `\n사유: ${reason}` : "";
}
