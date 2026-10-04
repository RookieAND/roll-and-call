import { isNil } from "es-toolkit";

// 참석: 불참이 아니거나, 불참이어도 운영진이 취소했다.
export function isAttendingRow(row: { absent: boolean; absenceCancelledAt: Date | string | null }) {
  return !row.absent || !isNil(row.absenceCancelledAt);
}
