import { isAttendancePastDeadline, isSessionEnded, isSessionInProgress } from "@/entities/game";
import type { GameDetailData } from "@/shared/server";

import { attendanceRoster } from "./attendance-roster";
import { MANAGE_ROW_ACTION, MANAGE_ROW_STATE, type ManageRow } from "./manage-row-state";

const NOT_ENDED = "세션이 끝난 뒤에 쓸 수 있습니다";

export function attendanceRow({
  game,
  confirmedCount,
  now,
}: {
  game: GameDetailData;
  confirmedCount: number;
  now: Date;
}): ManageRow {
  const base = { key: "attendance", icon: "clipboard", label: "출석 확인" } as const;
  const locked = { ...base, state: MANAGE_ROW_STATE.locked, href: null } as const;

  if (isSessionInProgress(game, now)) {
    if (confirmedCount === 0) return { ...locked, detail: NOT_ENDED };
    return {
      ...base,
      state: MANAGE_ROW_STATE.open,
      href: null,
      action: MANAGE_ROW_ACTION.endSession,
      detail: "세션이 진행 중입니다 · 끝나면 여기서 세션을 마쳐 주세요",
      note: "세션을 마치지 않으면 예정된 종료 시각에 출석 확인이 시작됩니다.",
    };
  }
  if (!isSessionEnded(game, now)) return { ...locked, detail: NOT_ENDED };

  const done = {
    ...base,
    state: MANAGE_ROW_STATE.done,
    href: null,
    detail: "출석을 정리했습니다",
  } as const;
  if (game.attendanceConfirmedAt) return done;
  if (attendanceRoster(game.participants).length === 0) {
    return { ...locked, detail: "확정 참여자가 없습니다" };
  }
  // 자동 확정 크론이 돌기 전이어도 기한이 지났으면 정리된 것으로 본다.
  if (isAttendancePastDeadline({ ...game, now })) return done;
  return {
    ...base,
    state: MANAGE_ROW_STATE.open,
    href: `/games/${game.id}/attendance`,
    detail: "세션이 끝났습니다 · 참석·불참을 표시해 주세요",
  };
}
