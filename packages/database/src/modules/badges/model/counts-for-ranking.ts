import type { RecordGame } from "./record-session";

// 순위(이 달의 기록 GM·PL, 이달의 GM·PL 뱃지, 월간 발표, 도감 지금 k위)에서 뺄 세션을 판정하는 유일한 곳. C19가 미니룰·타이만(D306·D308)을 여기에 더한다. 세션 건수에는 쓰지 않는다.
export function countsForRanking(_game: RecordGame): boolean {
  return true;
}
