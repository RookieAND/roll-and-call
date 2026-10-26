const MINUTE_MS = 60_000;

// 1시간 전 알림은 시작 1시간 전부터, 시작 안내는 시작 시각부터 30분 안에서만 보낸다. 장애 복구 뒤 오래전 구인에는 보내지 않는다.
export const REMINDER_LEAD_MS = 60 * MINUTE_MS;
export const START_NOTICE_WINDOW_MS = 30 * MINUTE_MS;

// 구하는 구간은 모두 (from, to]다.
export function privateNoticeWindows(now: Date) {
  const time = now.getTime();
  return {
    reminder: { from: now, to: new Date(time + REMINDER_LEAD_MS) },
    start: { from: new Date(time - START_NOTICE_WINDOW_MS), to: now },
  };
}
