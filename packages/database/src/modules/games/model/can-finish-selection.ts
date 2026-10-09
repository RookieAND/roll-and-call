import { countMinPlayersPool } from "./count-min-players-pool";
import { SELECTION_REJECTION } from "./selection-rejection";

type FinishSelectionBlock =
  | typeof SELECTION_REJECTION.noConfirmed
  | typeof SELECTION_REJECTION.minPlayersUnmet;

// [선발 마치기]를 허용하지 않는 까닭. 허용하면 null이다. 화면의 버튼 비활성과 명령이 같은 함수를 쓴다.
// 최소 인원 미달을 먼저 본다. 신청자 수는 확정자(직접 확정 포함)에 선발 대기 신청자를 더한다.
export function finishSelectionBlock({
  minPlayers,
  confirmedCount,
  applicantCount,
}: {
  minPlayers: number | null;
  confirmedCount: number;
  applicantCount: number;
}): FinishSelectionBlock | null {
  if (minPlayers !== null && countMinPlayersPool({ confirmedCount, applicantCount }) < minPlayers) {
    return SELECTION_REJECTION.minPlayersUnmet;
  }
  return confirmedCount === 0 ? SELECTION_REJECTION.noConfirmed : null;
}
