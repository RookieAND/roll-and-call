import type { AttendanceAbsence } from "@roll-and-call/database/games/model";
import { isNull, uniq } from "es-toolkit";

export const ABSENCE_REASON_MAX_LENGTH = 200;

// 불참은 명단 안의 사람만, 한 번씩, 사유는 앞뒤 공백을 뺀 200자까지.
export function absencesError({
  absences,
  rosterUserIds,
}: {
  absences: readonly AttendanceAbsence[];
  rosterUserIds: readonly string[];
}): string | null {
  const userIds = absences.map((absence) => absence.userId);
  const outsider = userIds.some((userId) => !rosterUserIds.includes(userId));
  if (outsider || uniq(userIds).length !== userIds.length) return "명단에 없는 참여자입니다.";
  const tooLong = absences.some(
    (absence) =>
      !isNull(absence.reason) && absence.reason.trim().length > ABSENCE_REASON_MAX_LENGTH,
  );
  if (tooLong) return `불참 사유는 ${ABSENCE_REASON_MAX_LENGTH}자까지 쓸 수 있습니다.`;
  return null;
}
