import type { KickImpact } from "@/shared/server";

export function kickImpactLines(impact: KickImpact) {
  return [
    `진행 중인 참가 신청 ${impact.appliedCount}건과 대기 ${impact.waitingCount}건, 확정된 참여 ${impact.confirmedCount}건에서 빠집니다`,
    `GM으로 연 구인 중 시작 전인 ${impact.cancelledGameCount}건은 취소됨으로 바뀌고, 참여자에게 알림이 갑니다`,
    "지난 세션 기록과 불참 기록은 그대로 보존됩니다",
  ];
}
