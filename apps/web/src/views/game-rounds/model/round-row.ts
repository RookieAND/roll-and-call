import type { RoundRowKind } from "./round-row-kind";

export type RoundRowView = {
  key: string;
  kind: RoundRowKind;
  label: string;
  note: string | null;
  // 출석 확인으로 가는 회차 번호. 시작하지 않은 회차는 없다.
  attendanceRoundNo: number | null;
  // 일정 잡기·바꾸기 화면으로 가는 회차 번호. 조율형이고 마치지 않은 구인에서만 있다.
  scheduleRoundNo: number | null;
};

export function roundRow({
  roundNo,
  kind,
  label,
}: {
  roundNo: number;
  kind: RoundRowKind;
  label: string;
}): RoundRowView {
  return {
    key: `${kind}-${roundNo}`,
    kind,
    label,
    note: null,
    attendanceRoundNo: null,
    scheduleRoundNo: null,
  };
}
