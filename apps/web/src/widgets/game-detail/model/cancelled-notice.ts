import { GAME_CANCEL_KIND, type GameCancelKind } from "@/entities/game";

const SELECTION_TITLE = "구인이 취소되었습니다";
const SIMILAR_LINE = "비슷한 조건의 다른 구인글을 찾아보세요.";

const TITLE: Record<GameCancelKind, string> = {
  [GAME_CANCEL_KIND.gm]: "GM이 구인을 취소했습니다",
  [GAME_CANCEL_KIND.staff]: "운영진이 구인을 취소했습니다",
  [GAME_CANCEL_KIND.auto]: "GM이 서버를 나가 구인이 취소되었습니다",
  [GAME_CANCEL_KIND.minPlayersUnmet]: "최소 인원이 모이지 않아 취소되었습니다",
  [GAME_CANCEL_KIND.selectionExpired]: SELECTION_TITLE,
};

// 선발 구인의 취소는 제목 하나에 사유 한 줄을 붙인다. 사유는 GM 취소만 보인다(D267).
export function cancelledNotice({
  cancelKind,
  selection,
  reason,
}: {
  cancelKind: GameCancelKind;
  selection: boolean;
  reason: string | null;
}): { title: string; line: string } {
  if (cancelKind === GAME_CANCEL_KIND.selectionExpired) {
    return { title: SELECTION_TITLE, line: "기한 안에 선발을 마치지 않아 취소되었습니다." };
  }
  if (cancelKind === GAME_CANCEL_KIND.minPlayersUnmet && selection) {
    return {
      title: SELECTION_TITLE,
      line: "선발된 인원이 최소 인원에 미치지 못해 취소되었습니다.",
    };
  }
  const showReason = cancelKind === GAME_CANCEL_KIND.gm && reason;
  return { title: TITLE[cancelKind], line: showReason ? `사유: ${reason}` : SIMILAR_LINE };
}
