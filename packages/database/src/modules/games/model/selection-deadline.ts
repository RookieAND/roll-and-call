import type { ScheduleMode } from "./schedule-mode";

type Moment = Date | string;

const DAY_MS = 24 * 60 * 60 * 1000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

export const SELECTION_GRACE_DAYS = 7;

// 선발 기한: 모집 마감 뒤 7일. 일시 지정형은 세션 시작, 조율형은 조율 기간 종료일의 하루 끝(그 날짜 24시, Asia/Seoul)이 더 이르면 그때까지다.
// 크론과 운영 관리 화면의 기한 줄이 함께 쓴다.
export function selectionDeadline({
  endDate,
  scheduleMode,
  confirmedAt,
  rangeEnd,
}: {
  endDate: Moment;
  scheduleMode: ScheduleMode;
  confirmedAt: Moment | null;
  rangeEnd: string | null;
}): Date {
  const grace = new Date(new Date(endDate).getTime() + SELECTION_GRACE_DAYS * DAY_MS);
  const limit = scheduleLimit({ scheduleMode, confirmedAt, rangeEnd });
  return limit && limit.getTime() < grace.getTime() ? limit : grace;
}

function scheduleLimit({
  scheduleMode,
  confirmedAt,
  rangeEnd,
}: {
  scheduleMode: ScheduleMode;
  confirmedAt: Moment | null;
  rangeEnd: string | null;
}): Date | null {
  if (scheduleMode === "fixed") return confirmedAt ? new Date(confirmedAt) : null;
  if (!rangeEnd) return null;
  return new Date(Date.parse(`${rangeEnd}T00:00:00Z`) + DAY_MS - KST_OFFSET_MS);
}
