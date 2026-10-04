import { isNull } from "es-toolkit";

import { sessionEndAt } from "./session-timing";

const DAY_MS = 86_400_000;

// 세션이 끝나고 이 기간 안에 GM이 출석을 확정하지 않으면 확정 참여자 전원을 출석으로 본다.
export const ATTENDANCE_EDIT_DAYS = 7;

export function attendanceDeadline({
  confirmedAt,
  playMinutes,
  endedAt,
}: {
  confirmedAt: Date | string | null;
  playMinutes: number | null;
  endedAt: Date | string | null;
}): Date | null {
  const endAt = sessionEndAt({ confirmedAt, playMinutes, endedAt });
  if (isNull(endAt)) return null;
  return new Date(endAt.getTime() + ATTENDANCE_EDIT_DAYS * DAY_MS);
}

export function isAttendancePastDeadline({
  confirmedAt,
  playMinutes,
  endedAt,
  now,
}: {
  confirmedAt: Date | string | null;
  playMinutes: number | null;
  endedAt: Date | string | null;
  now: Date;
}): boolean {
  const deadline = attendanceDeadline({ confirmedAt, playMinutes, endedAt });
  return !isNull(deadline) && deadline.getTime() <= now.getTime();
}

// 자동 확정은 확정 시각을 기한 시각으로 남긴다. GM이 직접 확정한 시각은 언제나 기한 전이다.
export function isAutoConfirmedAttendance({
  attendanceConfirmedAt,
  confirmedAt,
  playMinutes,
  endedAt,
}: {
  attendanceConfirmedAt: Date | string | null;
  confirmedAt: Date | string | null;
  playMinutes: number | null;
  endedAt: Date | string | null;
}): boolean {
  const deadline = attendanceDeadline({ confirmedAt, playMinutes, endedAt });
  if (isNull(attendanceConfirmedAt) || isNull(deadline)) return false;
  return new Date(attendanceConfirmedAt).getTime() >= deadline.getTime();
}
