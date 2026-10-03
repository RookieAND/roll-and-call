const DAY_MS = 86_400_000;

// 불참 기록은 세션 시작 시각부터 30×24시간 동안만 센다. 값은 지우지 않고 볼 때마다 계산한다.
export const ABSENCE_WINDOW_DAYS = 30;

export function absenceExpiresAt(sessionStartsAt: Date | string): Date {
  return new Date(new Date(sessionStartsAt).getTime() + ABSENCE_WINDOW_DAYS * DAY_MS);
}

export function isAbsenceActive({
  sessionStartsAt,
  now,
}: {
  sessionStartsAt: Date | string;
  now: Date | number;
}): boolean {
  return absenceExpiresAt(sessionStartsAt).getTime() > new Date(now).getTime();
}
