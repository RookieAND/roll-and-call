import { isNil } from "es-toolkit";

type Moment = Date | string | null;

type TimedGame = {
  confirmedAt: Moment;
  playMinutes: number | null;
  endedAt: Moment;
};

const MINUTE_MS = 60_000;

// 길이를 모르면 흔한 길이(3시간)로 본다.
export const DEFAULT_PLAY_MINUTES = 180;

// 플레이타임이 비었거나 0이면 기본 길이를 쓴다.
export function effectivePlayMinutes(minutes: number | null): number {
  return minutes || DEFAULT_PLAY_MINUTES;
}

// 예정 종료(시작 + 플레이타임): 앞으로 열릴 세션의 길이·시간 겹침 계산.
export function plannedEndAt({
  confirmedAt,
  playMinutes,
}: Pick<TimedGame, "confirmedAt" | "playMinutes">): Date | null {
  if (isNil(confirmedAt)) return null;
  return new Date(new Date(confirmedAt).getTime() + effectivePlayMinutes(playMinutes) * MINUTE_MS);
}

// 실제 종료: GM이 세션을 마친 시각, 없으면 예정 종료.
export function sessionEndAt({ confirmedAt, playMinutes, endedAt }: TimedGame): Date | null {
  if (isNil(confirmedAt)) return null;
  return isNil(endedAt) ? plannedEndAt({ confirmedAt, playMinutes }) : new Date(endedAt);
}

// 신청 닫힘: 새 신청·확정자 자가 취소. 조율형은 일시를 확정한 순간, 일시 지정형은 시작 시각이 지나야 닫힌다.
export function isApplicationClosed(
  { scheduleMode, confirmedAt }: { scheduleMode: "fixed" | "coordinate"; confirmedAt: Moment },
  now: Date = new Date(),
): boolean {
  if (isNil(confirmedAt)) return false;
  if (scheduleMode === "coordinate") return true;
  return new Date(confirmedAt).getTime() <= now.getTime();
}

// 세션 시작: 대기로 이동 숨김·불참으로 내보내기·구인 수정과 취소 잠금.
export function isSessionStarted(
  { confirmedAt }: { confirmedAt: Moment },
  now: Date = new Date(),
): boolean {
  return !isNil(confirmedAt) && new Date(confirmedAt).getTime() <= now.getTime();
}

// 세션 종료: GM 명단 수정 끝·참여자 관리 닫힘·출석 확인 열림·출석 24시간 기한.
export function isSessionEnded(game: TimedGame, now: Date = new Date()): boolean {
  const endAt = sessionEndAt(game);
  return !isNil(endAt) && endAt.getTime() <= now.getTime();
}

// 진행 중: 시작했고 아직 끝나지 않은 세션.
export function isSessionInProgress(game: TimedGame, now: Date = new Date()): boolean {
  return isSessionStarted(game, now) && !isSessionEnded(game, now);
}
