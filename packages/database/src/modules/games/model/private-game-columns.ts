import { RECRUIT_METHOD } from "./recruit-method";

// 지정 모집은 모집 방식·최소 인원·신청글·대기 접수를 쓰지 않아 이 값으로 덮는다.
export const PRIVATE_GAME_COLUMNS = {
  recruitMethod: RECRUIT_METHOD.firstCome,
  minPlayers: null,
  applicationNoteEnabled: false,
  applicationQuestion: null,
  waitlistEnabled: false,
} as const;

// 지정 모집의 모집 마감은 세션 시작과 같다. 일시를 정하기 전의 조율형은 마감을 쓰는 곳(최소 인원·추첨·선발)이 모두
// 지정 모집을 건너뛰어, 임시로 조율 시작일 0시(KST)를 둔다. 둘 다 없으면 지금 값을 둔다.
export function privateEndDate({
  confirmedAt,
  rangeStart,
  endDate,
}: {
  confirmedAt?: Date | null;
  rangeStart?: string | null;
  endDate: Date;
}): Date {
  if (confirmedAt) return confirmedAt;
  if (rangeStart) return new Date(`${rangeStart}T00:00:00+09:00`);
  return endDate;
}
