import type { Game } from "@/shared/server";
import { SCHEDULE_MODE, type ScheduleMode } from "./schedule-mode";

// 세션 진행 상태. gameStatus(모집 3분류)보다 세분화된 생명주기. 카드 문구·탭 버킷은 widgets/session-list가 만든다.
export type SessionState =
  | "recruiting" // 모집 중: 정원 여유
  | "scheduling" // 조율 중: 정원 충족 + coordinate 모드, 시간 미확정
  | "pending_confirm" // 확정 대기: 정원 충족 + fixed 모드, GM 확정 대기
  | "confirmed" // 확정: 세션 시간 확정 + 아직 안 지남
  | "closed" // 종료: 모집 기한 경과 + 확정 없이 무산
  | "finished"; // 종료: 확정 세션이 지남

export type SessionRole = "host" | "player";

// confirmedAt(세션 시간)이 정원/기한보다 우선. 확정된 세션은 지났으면 finished.
// 일시 지정형은 등록 때부터 confirmedAt이 있으므로(isSessionLocked와 같은 이유) 그것만으로 확정이 아니다:
// 마감 전 + 정원 여유면 아직 모집 중, 마감까지 확정자가 0명이면 무산(closed).
// ponytail: 정원 충족 후 scheduling/pending_confirm 은 scheduleMode로 근사한다
// (조율 진행률 availabilities 를 조회하지 않는 휴리스틱). 세밀화가 필요하면 그때 쿼리 추가.
export function deriveSessionState(
  {
    confirmedAt,
    endDate,
    maxPlayers,
    confirmedCount,
    scheduleMode,
  }: {
    confirmedAt: Game["confirmedAt"];
    endDate: Game["endDate"];
    maxPlayers: number;
    confirmedCount: number;
    scheduleMode: ScheduleMode;
  },
  now: Date = new Date(),
): SessionState {
  const t = now.getTime();
  const deadlinePassed = new Date(endDate).getTime() < t;
  if (confirmedAt) {
    if (new Date(confirmedAt).getTime() < t) return "finished";
    if (scheduleMode === SCHEDULE_MODE.fixed) {
      if (!deadlinePassed && confirmedCount < maxPlayers) return "recruiting";
      if (deadlinePassed && confirmedCount === 0) return "closed";
    }
    return "confirmed";
  }
  if (deadlinePassed) return "closed";
  if (confirmedCount < maxPlayers) return "recruiting";
  return scheduleMode === SCHEDULE_MODE.coordinate ? "scheduling" : "pending_confirm";
}
