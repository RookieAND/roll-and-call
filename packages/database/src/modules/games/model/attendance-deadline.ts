import { isNull } from "es-toolkit";

import { sessionEndsAt } from "./session-ends-at";

const DAY_MS = 86_400_000;

// 세션이 끝나고 이 기간 안에 GM이 출석을 확정하지 않으면 확정 참여자 전원을 출석으로 본다.
export const ATTENDANCE_EDIT_DAYS = 7;

export function attendanceDeadline({
  confirmedAt,
  playMinutes,
}: {
  confirmedAt: Date | string | null;
  playMinutes: number | null;
}): Date | null {
  if (isNull(confirmedAt)) return null;
  const endsAt = sessionEndsAt({ startsAt: new Date(confirmedAt), playMinutes });
  return new Date(endsAt.getTime() + ATTENDANCE_EDIT_DAYS * DAY_MS);
}

export function isAttendancePastDeadline({
  confirmedAt,
  playMinutes,
  now,
}: {
  confirmedAt: Date | string | null;
  playMinutes: number | null;
  now: Date;
}): boolean {
  const deadline = attendanceDeadline({ confirmedAt, playMinutes });
  return !isNull(deadline) && deadline.getTime() <= now.getTime();
}

// 자동 확정은 확정 시각을 기한 시각으로 남긴다. GM이 직접 확정한 시각은 언제나 기한 전이다.
export function isAutoConfirmedAttendance({
  attendanceConfirmedAt,
  confirmedAt,
  playMinutes,
}: {
  attendanceConfirmedAt: Date | string | null;
  confirmedAt: Date | string | null;
  playMinutes: number | null;
}): boolean {
  const deadline = attendanceDeadline({ confirmedAt, playMinutes });
  if (isNull(attendanceConfirmedAt) || isNull(deadline)) return false;
  return new Date(attendanceConfirmedAt).getTime() >= deadline.getTime();
}
