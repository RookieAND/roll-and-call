import "server-only";
import { STAFF_CHANNEL_RELATED } from "@roll-and-call/database/moderation/model";

import { auditSubject } from "./audit-subject";
import { listStaff } from "./list-staff";
import { loadSnapshot } from "./snapshot";

const STAFF_CHANNEL_LINES: readonly string[] = Object.values(STAFF_CHANNEL_RELATED);

export async function getAuditEntry(id: string) {
  const [db, staff] = await Promise.all([loadSnapshot(), listStaff()]);
  const entry = db.auditLog.find((candidate) => candidate.id === id);
  if (!entry) return null;
  const [targetName = entry.target, targetDetail] = entry.target.split(" · ");
  const related = entry.related ?? [];
  return {
    ...entry,
    targetName,
    targetDetail,
    subject: auditSubject(entry),
    staffChannelLine: related.find((line) => STAFF_CHANNEL_LINES.includes(line)),
    related: related.filter((line) => !STAFF_CHANNEL_LINES.includes(line)),
    actorRole: staff.find((member) => member.userId === entry.actorId)?.role,
  };
}

export type AuditEntryDetail = NonNullable<Awaited<ReturnType<typeof getAuditEntry>>>;
