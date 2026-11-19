import { isNil } from "es-toolkit";

// 조율형에서 GM이 일정을 정할 수 있는 회차는 일정 없는 가장 앞 회차 하나뿐이다.
export function schedulableRoundNo(
  rounds: readonly { roundNo: number; startAt: Date | string | null }[],
): number | null {
  const undated = rounds.filter((round) => isNil(round.startAt));
  if (undated.length === 0) return null;
  return Math.min(...undated.map((round) => round.roundNo));
}
