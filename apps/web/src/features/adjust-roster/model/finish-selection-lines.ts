import { SELECTION_REJECTION } from "@roll-and-call/database/games/model";

type FinishBlock =
  | typeof SELECTION_REJECTION.noConfirmed
  | typeof SELECTION_REJECTION.minPlayersUnmet;

// 선발하기 카드의 안내 줄. 마치지 못하는 까닭이 있으면 그 줄이 따라붙는다(최소 인원 미달이면 그 줄만).
export function finishSelectionLines({
  applicantCount,
  isFull,
  block,
  minPlayers,
}: {
  applicantCount: number;
  isFull: boolean;
  block: FinishBlock | null;
  minPlayers: number | null;
}): string[] {
  if (block === SELECTION_REJECTION.minPlayersUnmet) {
    return [`최소 인원 ${minPlayers}명에 못 미쳐 지금 선발을 마칠 수 없습니다.`];
  }
  const guide = isFull
    ? "정원이 모두 찼습니다. 마치면 남은 신청자는 대기로 옮깁니다."
    : `신청한 ${applicantCount}명 중에서 골라 주세요.`;
  if (block === SELECTION_REJECTION.noConfirmed) {
    return [guide, "확정할 사람을 1명 이상 골라야 마칠 수 있습니다."];
  }
  return [guide];
}
