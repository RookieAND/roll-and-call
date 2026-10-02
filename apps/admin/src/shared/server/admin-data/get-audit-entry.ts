import "server-only";
import { listStaff } from "./list-staff";
import { loadSnapshot } from "./snapshot";

export async function getAuditEntry(id: string) {
  const [db, staff] = await Promise.all([loadSnapshot(), listStaff()]);
  const entry = db.auditLog.find((candidate) => candidate.id === id);
  if (!entry) return null;
  const [targetName = entry.target, targetDetail] = entry.target.split(" · ");
  return {
    ...entry,
    targetName,
    targetDetail,
    targetUserId: entry.targetUserId ?? db.users.find((user) => user.nickname === targetName)?.id,
    actorRole: staff.find((member) => member.userId === entry.actorId)?.role,
  };
}

export type AuditEntryDetail = NonNullable<Awaited<ReturnType<typeof getAuditEntry>>>;
