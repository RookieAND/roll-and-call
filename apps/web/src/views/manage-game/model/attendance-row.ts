import type { GameDetailData } from "@roll-and-call/database/games";

import { isAttendancePastDeadline, isSessionEnded, isSessionInProgress } from "@/entities/game";

import { attendanceRoster } from "./attendance-roster";
import { MANAGE_ROW_DETAIL, MANAGE_ROW_STATE, type ManageRow } from "./manage-row-state";

export function attendanceRow({
  game,
  confirmedCount,
  now,
}: {
  game: GameDetailData;
  confirmedCount: number;
  now: Date;
}): ManageRow {
  const base = { key: "attendance", icon: "clipboard", label: "출석 입력" } as const;
  const locked = { ...base, state: MANAGE_ROW_STATE.locked, href: null } as const;
  const done = {
    ...base,
    state: MANAGE_ROW_STATE.done,
    href: null,
    detail: "출석을 정리했습니다",
  } as const;
  const open = {
    ...base,
    state: MANAGE_ROW_STATE.open,
    href: `/games/${game.id}/attendance`,
    detail: "참석·불참을 표시합니다",
  } as const;

  if (isSessionInProgress(game, now)) {
    if (confirmedCount === 0) return { ...locked, detail: MANAGE_ROW_DETAIL.noConfirmed };
    if (game.attendanceConfirmedAt) return done;
    return open;
  }
  if (!isSessionEnded(game, now)) return { ...locked, detail: MANAGE_ROW_DETAIL.notEnded };

  if (game.attendanceConfirmedAt) return done;
  if (attendanceRoster(game.participants).length === 0) {
    return { ...locked, detail: MANAGE_ROW_DETAIL.noConfirmed };
  }
  // 자동 확정 크론이 돌기 전이어도 기한이 지났으면 정리된 것으로 본다.
  if (isAttendancePastDeadline({ ...game, now })) return done;
  return open;
}
