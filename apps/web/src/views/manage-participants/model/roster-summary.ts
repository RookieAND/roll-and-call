import { isDeadlinePassed } from "@/entities/game";
import { ddayKst, formatDateTime } from "@/shared/lib";
import type { ManagedMember } from "./managed-member";

// 마감 D-n이 이 안쪽이면 warning 색(목록·상세와 같은 기준).
const DEADLINE_WARN_DAYS = 3;

// 상단 한 문장(확정 n/정원 · 대기 · 마감)과 명단 파생값. 서버에서 계산해 날짜 경계에서 값이 갈리지 않게 한다.
export function summarizeRoster({
  confirmed,
  maxPlayers,
  endDate,
  isCoordinate,
  now = new Date(),
}: {
  confirmed: ManagedMember[];
  maxPlayers: number;
  endDate: Date;
  isCoordinate: boolean;
  now?: Date;
}) {
  const passed = isDeadlinePassed(endDate, now);
  const days = ddayKst(endDate, now);

  return {
    // 정원이 차면 대기자를 바로 올릴 수 없다 → 대기 행에 "교체"를 둔다.
    isFull: confirmed.length >= maxPlayers,
    deadlineAt: formatDateTime(endDate),
    deadlineLabel: passed ? "기한 지남" : days === 0 ? "오늘" : `D-${days}`,
    deadlineWarn: !passed && days <= DEADLINE_WARN_DAYS,
    // 가능 시간은 조율형에만 있다.
    unsubmittedCount: isCoordinate ? confirmed.filter((m) => !m.hasAvailability).length : 0,
  };
}

export type RosterSummary = ReturnType<typeof summarizeRoster>;
