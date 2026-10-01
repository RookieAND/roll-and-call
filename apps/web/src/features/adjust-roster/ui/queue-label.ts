import { isNull } from "es-toolkit";
export function queueLabel({
  waitlistRank,
  beforeDraw,
}: {
  waitlistRank: number | null;
  beforeDraw: boolean;
}) {
  if (isNull(waitlistRank)) return "확정";
  if (beforeDraw) return "신청자";
  return `대기 ${waitlistRank}번`;
}
