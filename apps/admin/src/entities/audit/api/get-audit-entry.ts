import "server-only";
import { STAFF_CHANNEL_RELATED } from "@roll-and-call/database/audit/model";
import { cache } from "react";

import { listStaff, loadAuditEntries } from "@/shared/server";

import { auditSubject } from "../model/audit-subject";
import { auditTargetParts } from "../model/audit-target-parts";

const STAFF_CHANNEL_LINES: readonly string[] = Object.values(STAFF_CHANNEL_RELATED);

// 메타데이터와 화면이 같은 요청에서 두 번 부른다.
export const getAuditEntry = cache(async (id: string) => {
  const [[entry], staff] = await Promise.all([loadAuditEntries({ id }), listStaff()]);
  if (!entry) return null;
  const { name: targetName, detail: targetDetail } = auditTargetParts(entry);
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
});

export type AuditEntryDetail = NonNullable<Awaited<ReturnType<typeof getAuditEntry>>>;
