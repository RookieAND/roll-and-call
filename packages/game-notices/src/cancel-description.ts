import type { Game } from "@roll-and-call/database";
import { GAME_CANCEL_KIND } from "@roll-and-call/database/games/model";
import type { MessageTextKey } from "@roll-and-call/database/servers";
import type { DiscordEmbedField } from "@roll-and-call/discord";

// 취소 종류에 맞는 설명 문장 키. 문장은 서버가 정한다.
export function cancelTextKey(kind: Game["cancelKind"]): MessageTextKey {
  if (kind === GAME_CANCEL_KIND.staff) return "cancel_staff";
  if (kind === GAME_CANCEL_KIND.auto) return "cancel_auto";
  if (kind === GAME_CANCEL_KIND.minPlayersUnmet) return "cancel_min_players";
  if (kind === GAME_CANCEL_KIND.selectionExpired) return "cancel_selection_expired";
  return "cancel_gm";
}

// GM이 적은 취소 사유는 서버가 바꾸지 못하는 고정 필드로 임베드에 단다. 설명 문장과 섞이지 않는다.
// 필드 값은 1024자까지다(사유 입력은 200자까지라 보통 넘지 않는다).
export function cancelReasonField({
  kind,
  reason,
}: {
  kind: Game["cancelKind"];
  reason: string | null;
}): DiscordEmbedField | undefined {
  const text = reason?.trim();
  if (kind !== GAME_CANCEL_KIND.gm || !text) return undefined;
  return { name: "📝 사유", value: text.slice(0, 1024), inline: false };
}
