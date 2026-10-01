import "server-only";
import { loadSnapshot } from "./snapshot";

export async function getAuditEntry(id: string) {
  const db = await loadSnapshot();
  const entry = db.auditLog.find((candidate) => candidate.id === id);
  if (!entry) return null;
  const [targetName = entry.target, targetDetail] = entry.target.split(" · ");
  return {
    ...entry,
    targetName,
    targetDetail,
    targetUserId: entry.targetUserId ?? db.users.find((user) => user.nickname === targetName)?.id,
    actorRole: db.staff.find((staff) => staff.nickname === entry.actor)?.role,
  };
}

export type AuditEntryDetail = NonNullable<Awaited<ReturnType<typeof getAuditEntry>>>;
