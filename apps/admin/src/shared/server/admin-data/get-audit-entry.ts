import "server-only";
import { db } from "./mock-db";

// 조치 상세. 대상 문자열의 첫 조각이 유저 닉네임이면 유저 상세로 이어 준다.
export async function getAuditEntry(id: string) {
  const entry = db.auditLog.find((candidate) => candidate.id === id);
  if (!entry) return null;
  const [targetName = entry.target, targetDetail] = entry.target.split(" · ");
  return {
    ...entry,
    targetName,
    targetDetail,
    targetUserId: db.users.find((user) => user.nickname === targetName)?.id,
    actorRole: db.staff.find((staff) => staff.nickname === entry.actor)?.role,
  };
}

export type AuditEntryDetail = NonNullable<Awaited<ReturnType<typeof getAuditEntry>>>;
