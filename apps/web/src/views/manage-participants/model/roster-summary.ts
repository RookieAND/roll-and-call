import { isDeadlinePassed, isDeadlineUrgent } from "@/entities/game";
import { dday } from "@/shared/lib";

// 상단 지표 3개(신청·정원·마감)와 승격 가능 여부의 파생값.
// dday는 사용자 타임존 기준이라 클라이언트에서 호출한다.
export function summarizeRoster({
  confirmedCount,
  waitingCount,
  maxPlayers,
  endDate,
}: {
  confirmedCount: number;
  waitingCount: number;
  maxPlayers: number;
  endDate: Date;
}) {
  return {
    total: confirmedCount + waitingCount,
    // 정원이 차면 대기자를 바로 승격할 수 없다(먼저 자리를 비워야 한다).
    isFull: confirmedCount >= maxPlayers,
    urgent: isDeadlineUrgent(endDate),
    deadlineLabel: isDeadlinePassed(endDate) ? "마감" : `D-${dday(endDate)}`,
  };
}
