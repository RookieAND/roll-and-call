import { isNil } from "es-toolkit";

import { PARTICIPANT_STATUS, type ParticipantStatus } from "./participant-status";

type Moment = Date | string | null;

export type AttendanceRosterRow = {
  userId: string;
  status: ParticipantStatus;
  absent: boolean;
  absenceCancelledAt: Moment;
  absenceAddedAt: Moment;
};

export type AttendanceAbsence = { userId: string; reason: string | null };

export type AttendanceUpdate = {
  userId: string;
  status: ParticipantStatus;
  absent: boolean;
  absenceReason: string | null;
};

export type AttendanceChanges = {
  newlyAbsent: string[];
  newlyPresent: string[];
  restored: string[];
};

// 불참은 사유와 함께, 나머지는 참석으로 쓰고 내보낸 사람은 확정으로 돌린다(D302, 정원 검사 없음).
// 운영진이 추가한 불참은 GM 입력과 상관없이 그대로 두고, 운영진 취소 흔적은 어느 경우에도 건드리지 않는다(R20).
export function planAttendance({
  rows,
  absences,
}: {
  rows: readonly AttendanceRosterRow[];
  absences: readonly AttendanceAbsence[];
}): { updates: AttendanceUpdate[]; changes: AttendanceChanges } {
  const reasons = new Map(absences.map((absence) => [absence.userId, absence.reason]));
  const updates: AttendanceUpdate[] = [];
  const changes: AttendanceChanges = { newlyAbsent: [], newlyPresent: [], restored: [] };

  for (const row of rows) {
    if (!isNil(row.absenceAddedAt)) continue;
    const absent = reasons.has(row.userId);
    const restored = !absent && row.status === PARTICIPANT_STATUS.removed;
    updates.push({
      userId: row.userId,
      status: restored ? PARTICIPANT_STATUS.confirmed : row.status,
      absent,
      absenceReason: absent ? reasons.get(row.userId)?.trim() || null : null,
    });
    if (absent && !row.absent) changes.newlyAbsent.push(row.userId);
    if (!absent && row.absent) changes.newlyPresent.push(row.userId);
    if (restored) changes.restored.push(row.userId);
  }
  return { updates, changes };
}
